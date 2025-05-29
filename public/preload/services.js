const fs = require('node:fs')
const path = require('node:path')
const { clipboard, nativeImage } = require('electron')

// 文件与剪贴板写入相关服务
window.services = {
  /** 读取文件内容 */
  readFile(file) {
    return fs.readFileSync(file, { encoding: 'utf-8' })
  },
  /** 文本写入到下载目录 */
  writeTextFile(text) {
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.txt')
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
    return filePath
  },
  /** 图片写入到下载目录 */
  writeImageFile(base64Url) {
    const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url)
    if (!matchs) return
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.' + matchs[1])
    fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), { encoding: 'base64' })
    return filePath
  },
  /** 写入文本到剪贴板 */
  writeClipboardText(text) {
    clipboard.writeText(text)
  },
  /** 写入图片到剪贴板（base64 格式） */
  writeClipboardImage(base64Url) {
    const image = nativeImage.createFromDataURL(base64Url)
    clipboard.writeImage(image)
  }
}

// 剪贴板监听与数据获取服务
window.clipboardService = {
  /** 获取所有历史剪贴板内容（按时间倒序） */
  getAllHistory() {
    if (window.utools) {
      const docs = window.utools.db.allDocs('clipboard/')
      return docs.sort((a, b) => b.time - a.time)
    }
    return []
  },
  /** 获取当前剪贴板所有主流数据类型 */
  getClipboardData() {
    const formats = clipboard.availableFormats()
    const data = {}
    if (formats.includes('text/plain')) {
      data.text = clipboard.readText()
    }
    if (formats.includes('text/html')) {
      data.html = clipboard.readHTML()
    }
    if (formats.includes('text/rtf')) {
      data.rtf = clipboard.readRTF()
    }
    if (formats.some(f => f.startsWith('image/'))) {
      const image = clipboard.readImage()
      if (!image.isEmpty()) {
        data.image = image.toDataURL()
      }
    }
    return data
  },
  /** 注册剪贴板变化监听回调 */
  onChange(cb) {
    if (typeof cb === 'function') this._clipboardListeners.push(cb)
  },
  /** 内部：自动保存文本或图片到 uTools 本地数据库 */
  _autoSaveToDB(data) {
    if (window.utools) {
      let content = ''
      let type = ''
      if (data.text) {
        content = data.text
        type = 'text'
      } else if (data.image) {
        content = data.image // base64
        type = 'image'
      } else {
        return // 其他类型暂不存储
      }
      const hash = require('crypto').createHash('md5').update(content).digest('hex')
      const docId = `clipboard/${Date.now()}_${hash}`
      const docs = window.utools.db.allDocs('clipboard/')
      if (!docs.length || docs[0].content !== content) {
        return window.utools.db.put({
          _id: docId,
          content,
          type,
          time: Date.now()
        })
      }
    }
  },
  /** 内部：开始轮询监听剪贴板变化 */
  _startPolling() {
    this._lastClipboardData = {}
    this._clipboardListeners = []
    setInterval(() => {
      const currentData = this.getClipboardData()
      const currentDataStr = JSON.stringify(currentData)
      const lastDataStr = JSON.stringify(this._lastClipboardData)
      if (currentDataStr !== lastDataStr) {
        this._lastClipboardData = currentData
        // 先写入数据库，再回调 UI，兼容异步
        const saveResult = this._autoSaveToDB(currentData)
        if (saveResult && typeof saveResult.then === 'function') {
          saveResult.then(() => {
            this._clipboardListeners.forEach(fn => fn(currentData))
          })
        } else {
          this._clipboardListeners.forEach(fn => fn(currentData))
        }
      }
    }, 500)
  }
}
window.clipboardService._startPolling()

