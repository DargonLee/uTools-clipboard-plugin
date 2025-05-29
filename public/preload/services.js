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

let lastClipboardText = ''
let clipboardListeners = []

// 轮询监听剪贴板内容变化
setInterval(() => {
  const text = clipboard.readText()
  const image = clipboard.readImage()
  const file = clipboard.readFile()
  console.log('text', text)
  if (text !== lastClipboardText) {
    lastClipboardText = text
    clipboardListeners.forEach(fn => fn(text))
    // 存储到 uTools 本地数据库（仅内容变更时）
    if (window.utools && text) {
      // 以内容hash+时间戳作为_id，避免重复
      const hash = require('crypto').createHash('md5').update(text).digest('hex')
      const docId = `clipboard/${Date.now()}_${hash}`
      // 查询最近一条记录，若内容一致则不存储
      const docs = window.utools.db.allDocs('clipboard/')
      if (!docs.length || docs[0].content !== text) {
        window.utools.db.put({
          _id: docId,
          content: text,
          type: 'text',
          time: Date.now()
        })
      }
    }
  }
}, 500) // 每500ms检测一次

// 注册监听回调
window.clipboardService = {
  onChange: function (cb) {
    if (typeof cb === 'function') clipboardListeners.push(cb)
  },
  getCurrent: function () {
    return clipboard.readText()
  }
}
