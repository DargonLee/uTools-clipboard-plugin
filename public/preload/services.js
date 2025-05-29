const fs = require('node:fs')
const path = require('node:path')
const crypto = require('crypto')
const { clipboard, nativeImage } = require('electron')

const DOWNLOADS_PATH = window.utools.getPath('downloads')
const CLIPBOARD_DB_PREFIX = 'clipboard/'
const POLL_INTERVAL_MS = 500

const nowTs = () => Date.now()

const fileService = {
  /**
   * 读取文件内容
   * @param {string} file 文件路径
   * @returns {Promise<string>} 文件内容
   */
  async readFile(file) {
    return await fs.promises.readFile(file, { encoding: 'utf-8' })
  },

  /**
   * 将文本写入到下载目录
   * @param {string} text 文本内容
   * @returns {string} 文件保存路径
   */
  writeTextFile(text) {
    const fileName = `clipboard_${nowTs()}.txt`
    const filePath = path.join(DOWNLOADS_PATH, fileName)
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
    return filePath
  },

  /**
   * 将图片（base64）写入到下载目录
   * @param {string} base64Url base64图片字符串
   * @returns {string|null} 文件保存路径或null
   */
  writeImageFile(base64Url) {
    const match = /^data:image\/([a-z0-9+]+);base64,/i.exec(base64Url)
    if (!match) return null
    const ext = match[1]
    const fileName = `clipboard_${nowTs()}.${ext}`
    const filePath = path.join(DOWNLOADS_PATH, fileName)
    const base64Data = base64Url.substring(match[0].length)
    fs.writeFileSync(filePath, base64Data, { encoding: 'base64' })
    return filePath
  },

  /**
   * 写入文本到系统剪贴板
   * @param {string} text 文本内容
   */
  writeClipboardText(text) {
    clipboard.writeText(text)
  },

  /**
   * 写入图片到系统剪贴板（base64格式）
   * @param {string} base64Url base64图片字符串
   */
  writeClipboardImage(base64Url) {
    const image = nativeImage.createFromDataURL(base64Url)
    clipboard.writeImage(image)
  }
}

const clipboardService = {
  _clipboardListeners: [],
  _lastClipboardDataStr: '',
  _pollingTimer: null,

  /**
   * 获取所有剪贴板历史记录，按时间倒序
   * @returns {Promise<Array>} 剪贴板历史数组
   */
  async getAllHistory() {
    if (!window.utools) return []
    const docs = await window.utools.db.promises.allDocs(CLIPBOARD_DB_PREFIX)
    return docs.sort((a, b) => b.time - a.time)
  },

  /**
   * 获取当前剪贴板内容（支持文本、图片、RTF）
   * @returns {Object} 剪贴板内容对象，如{text, image, rtf}
   */
  getClipboardData() {
    const formats = clipboard.availableFormats()
    const data = {}
    if (formats.includes('text/plain')) data.text = clipboard.readText()
    // if (formats.includes('text/html')) data.html = clipboard.readHTML()
    if (formats.includes('text/rtf')) data.rtf = clipboard.readRTF()

    const hasImage = formats.some(f => f.startsWith('image/'))
    if (hasImage) {
      const image = clipboard.readImage()
      if (!image.isEmpty()) {
        data.image = image.toDataURL()
      }
    }
    return data
  },

  /**
   * 注册剪贴板内容变化监听回调
   * @param {function} callback 回调函数，参数为最新剪贴板内容对象
   */
  onChange(callback) {
    if (typeof callback === 'function') {
      this._clipboardListeners.push(callback)
    }
  },

  /**
   * 自动保存文本或图片到uTools本地数据库（如内容重复则不存储）
   * @param {Object} data 剪贴板内容对象
   * @returns {Promise<void|Object>} 数据库写入结果
   */
  async _autoSaveToDB(data) {
    if (!window.utools) return

    let content = ''
    let type = ''
    if (data.text) {
      content = data.text
      type = 'text'
    } else if (data.image) {
      content = data.image
      type = 'image'
    } else {
      return
    }

    const hash = crypto.createHash('md5').update(content).digest('hex')
    const docId = `${CLIPBOARD_DB_PREFIX}${nowTs()}_${hash}`
    const docs = await window.utools.db.promises.allDocs(CLIPBOARD_DB_PREFIX)
    if (!docs.length || docs[0].content !== content) {
      return await window.utools.db.promises.put({
        _id: docId,
        content,
        type,
        time: nowTs(),
      })
    }
  },

  /**
   * 启动剪贴板内容轮询监听，内容变化时自动存储并通知监听者
   */
  _startPolling() {
    if (this._pollingTimer) return
    this._pollingTimer = setInterval(async () => {
      const currentData = this.getClipboardData()
      const currentDataStr = JSON.stringify(currentData)
      if (currentDataStr !== this._lastClipboardDataStr) {
        this._lastClipboardDataStr = currentDataStr

        await this._autoSaveToDB(currentData)
        this._clipboardListeners.forEach(fn => fn(currentData))
      }
    }, POLL_INTERVAL_MS)
  },

  /**
   * 停止剪贴板内容轮询监听
   */
  stopPolling() {
    clearInterval(this._pollingTimer)
    this._pollingTimer = null
  },

  /**
   * 根据_id删除数据库中的剪贴板历史项
   * @param {string} id 剪贴板历史项的_id
   * @returns {Promise<void>}
   */
  async deleteHistoryItem(id) {
    if (!window.utools) return
    const doc = await window.utools.db.promises.get(id)
    if (doc) {
      await window.utools.db.promises.remove(doc)
    }
  },
}

window.AppClipboard = {
  fileService,
  clipboardService,
}

window.AppClipboard.clipboardService._startPolling()


