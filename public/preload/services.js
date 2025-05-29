const fs = require('node:fs')
const path = require('node:path')
const { clipboard } = require('electron')

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
  // 读文件
  readFile (file) {
    return fs.readFileSync(file, { encoding: 'utf-8' })
  },
  // 文本写入到下载目录
  writeTextFile (text) {
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.txt')
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
    return filePath
  },
  // 图片写入到下载目录
  writeImageFile (base64Url) {
    const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url)
    if (!matchs) return
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.' + matchs[1])
    fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), { encoding: 'base64' })
    return filePath
  },
  initClipboardListener: () => {
    clipboardListener.on('change', (event) => {
      console.log('change', event)
    })
  },
  copyImage: (imageFilePath) => {
    console.log('copyImage', imageFilePath)
  },
  copyText: (text) => {
    console.log('copyText', text)
  },
  copyFile: (filePath) => {
    console.log('copyFile', filePath)
  }
}


// 注册监听回调
window.clipboardService = {
  onChange: function (cb) {
    if (typeof cb === 'function') clipboardListeners.push(cb)
  },
  getCurrent: function () {
    return clipboard.readText()
  },
  getClipboardData: function () {
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
  }
}

let lastClipboardData = {}
let clipboardListeners = []
setInterval(() => {
  const data = window.clipboardService.getClipboardData()
  const dataStr = JSON.stringify(data)
  const lastDataStr = JSON.stringify(lastClipboardData)
  if (dataStr !== lastDataStr) {
    lastClipboardData = data
    clipboardListeners.forEach(fn => fn(data))
    // 可选：此处可扩展存储到 uTools 本地数据库等逻辑
  }
}, 500) // 每500ms检测一次

