const fs = require('node:fs')
const path = require('node:path')
const crypto = require('crypto')
const { clipboard, nativeImage } = require('electron')

const DOWNLOADS_PATH = window.utools.getPath('downloads')
const CLIPBOARD_DB_PREFIX = 'clipboard/'
const POLL_INTERVAL_MS = 500

const nowTs = () => Date.now()

const fileService = {
  async readFile(file) {
    return await fs.promises.readFile(file, { encoding: 'utf-8' })
  },

  writeTextFile(text) {
    const fileName = `clipboard_${nowTs()}.txt`
    const filePath = path.join(DOWNLOADS_PATH, fileName)
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
    return filePath
  },

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

  writeClipboardText(text) {
    clipboard.writeText(text)
  },

  writeClipboardImage(base64Url) {
    const image = nativeImage.createFromDataURL(base64Url)
    clipboard.writeImage(image)
  }
}

const clipboardService = {
  _clipboardListeners: [],
  _lastClipboardDataStr: '',
  _pollingTimer: null,

  getAllHistory() {
    if (!window.utools) return []
    const docs = window.utools.db.allDocs(CLIPBOARD_DB_PREFIX)
    return docs.sort((a, b) => b.time - a.time)
  },

  getClipboardData() {
    const formats = clipboard.availableFormats()
    const data = {}
    if (formats.includes('text/plain')) data.text = clipboard.readText()
    if (formats.includes('text/html')) data.html = clipboard.readHTML()
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

  onChange(callback) {
    if (typeof callback === 'function') {
      this._clipboardListeners.push(callback)
    }
  },

  _autoSaveToDB(data) {
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
    const docs = window.utools.db.allDocs(CLIPBOARD_DB_PREFIX)
    if (!docs.length || docs[0].content !== content) {
      return window.utools.db.put({
        _id: docId,
        content,
        type,
        time: nowTs(),
      })
    }
  },

  _startPolling() {
    if (this._pollingTimer) return
    this._pollingTimer = setInterval(() => {
      const currentData = this.getClipboardData()
      const currentDataStr = JSON.stringify(currentData)
      if (currentDataStr !== this._lastClipboardDataStr) {
        this._lastClipboardDataStr = currentDataStr

        const saveResult = this._autoSaveToDB(currentData)
        const notifyListeners = () => {
          this._clipboardListeners.forEach(fn => fn(currentData))
        }

        if (saveResult && typeof saveResult.then === 'function') {
          saveResult.then(notifyListeners)
        } else {
          notifyListeners()
        }
      }
    }, POLL_INTERVAL_MS)
  },

  stopPolling() {
    clearInterval(this._pollingTimer)
    this._pollingTimer = null
  },
}

window.AppClipboard = {
  fileService,
  clipboardService,
}

window.AppClipboard.clipboardService._startPolling()


