const fs = require("node:fs");
const path = require("node:path");
// const crypto = require("crypto");
const { clipboard, nativeImage } = require("electron");

function simpleHash(str) {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * 判断文本是否为URL
 * @param {string} text 
 * @returns {boolean}
 */
function isUrl(text) {
  try {
    const url = new URL(text);
    return ['http:', 'https:', 'ftp:', 'file:'].includes(url.protocol);
  } catch {
    return false;
  }
}

const DOWNLOADS_PATH = window.utools.getPath("downloads");
const CLIPBOARD_DB_PREFIX = "easy_clipboard/";
const POLL_INTERVAL_MS = 500;

const nowTs = () => Date.now();

const fileService = {
  /**
   * 读取文件内容
   * @param {string} file 文件路径
   * @returns {Promise<string>} 文件内容
   */
  async readFile(file) {
    return await fs.promises.readFile(file, { encoding: "utf-8" });
  },

  /**
   * 将文本写入到下载目录
   * @param {string} text 文本内容
   * @returns {string} 文件保存路径
   */
  writeTextFile(text) {
    const fileName = `clipboard_${nowTs()}.txt`;
    const filePath = path.join(DOWNLOADS_PATH, fileName);
    fs.writeFileSync(filePath, text, { encoding: "utf-8" });
    return filePath;
  },

  /**
   * 将图片（base64）写入到下载目录
   * @param {string} base64Url base64图片字符串
   * @returns {string|null} 文件保存路径或null
   */
  writeImageFile(base64Url) {
    const match = /^data:image\/([a-z0-9+]+);base64,/i.exec(base64Url);
    if (!match) return null;
    const ext = match[1];
    const fileName = `clipboard_${nowTs()}.${ext}`;
    const filePath = path.join(DOWNLOADS_PATH, fileName);
    const base64Data = base64Url.substring(match[0].length);
    fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    return filePath;
  },

  /**
   * 写入文本到系统剪贴板
   * @param {string} text 文本内容
   */
  writeClipboardText(text) {
    clipboard.writeText(text);
  },

  /**
   * 写入图片到系统剪贴板（base64格式）
   * @param {string} base64Url base64图片字符串
   */
  writeClipboardImage(base64Url) {
    const image = nativeImage.createFromDataURL(base64Url);
    clipboard.writeImage(image);
  }
};

const clipboardService = {
  _clipboardListeners: [],
  _lastHash: "",
  _pollingTimer: null,

  /**
   * 获取所有剪贴板历史记录，按时间倒序
   * @returns {Promise<Array>} 剪贴板历史数组
   */
  async getAllHistory() {
    if (!window.utools) return [];
    const docs = await window.utools.db.promises.allDocs(CLIPBOARD_DB_PREFIX);
    return docs.sort((a, b) => b.time - a.time);
  },

  /**
   * 获取当前剪贴板内容（支持文本、图片、RTF、文件）
   * @returns {Object} 剪贴板内容对象，如{text, image, rtf, files}
   */
  getClipboardData() {
    const formats = clipboard.availableFormats();
    const data = {};
    
    console.log("Available formats:", formats);

    // 检测文本内容
    if (formats.includes("text/plain")) {
      data.text = clipboard.readText();
    }
    
    // 检测RTF内容
    if (formats.includes("text/rtf")) {
      data.rtf = clipboard.readRTF();
    }

    // 检测图片内容
    const hasImage = formats.some((f) => f.startsWith("image/"));
    if (hasImage) {
      const image = clipboard.readImage();
      if (!image.isEmpty()) {
        data.image = image.toDataURL();
      }
    }

    // 检测文件和文件夹
    // 注意：不同操作系统的文件格式可能不同
    const hasFiles = formats.some((f) => 
      f.includes("Files") || 
      f.includes("file") || 
      f.includes("text/uri-list") ||
      f === "application/x-file-name"
    );
    
    if (hasFiles) {
      data.files = clipboard.readText();
    }
    
    return data;
  },

  /**
   * 注册剪贴板内容变化监听回调
   * @param {function} callback 回调函数，参数为最新剪贴板内容对象
   */
  onChange(callback) {
    if (typeof callback === "function") {
      this._clipboardListeners.push(callback);
    }
  },

  /**
   * 自动保存文本或图片到uTools本地数据库（如内容重复则不存储）
   * @param {Object} data 剪贴板内容对象
   * @returns {Promise<void|Object>} 数据库写入结果
   */
  async _autoSaveToDB(data, hash) {
    if (!window.utools) return;

    let content = "";
    let type = "";
    
    // 优先级：文件/文件夹 > 图片 > 链接 > 文本
    if (data.files && data.files.length > 0) {
      content = data.files;
      type = "files"; 
    } else if (data.image) {
      content = data.image;
      type = "image";
    } else if (data.text && isUrl(data.text)) {
      content = data.text;
      type = "link";
    } else if (data.text) {
      content = data.text;
      type = "text";
    }

    const hashValue = simpleHash(content);
    const docId = `${CLIPBOARD_DB_PREFIX}${nowTs()}_${hashValue}`;
    const docs = await window.utools.db.promises.allDocs(CLIPBOARD_DB_PREFIX);
    if (!docs.length || docs[0].content !== content) {
      return await window.utools.db.promises.put({
        _id: docId,
        content,
        type,
        time: nowTs(),
        favorite: false,
        hash: hashValue,
      });
    }
  },

  /**
   * 启动剪贴板内容轮询监听，内容变化时自动存储并通知监听者
   */
  _startPolling() {
    if (this._pollingTimer) return;
    this._pollingTimer = setInterval(async () => {
      const currentData = this.getClipboardData();
      console.log("currentData", currentData);
      
      // 优先使用文件路径，然后是图片，最后是文本
      const currentContent = currentData.files || currentData.image || currentData.text || '';
      const currentHash = simpleHash(currentContent);
      
      if (this._lastHash && this._lastHash === currentHash) {
        return;
      }
      this._lastHash = currentHash;
      await this._autoSaveToDB(currentData, currentHash);
      this._clipboardListeners.forEach((fn) => fn(currentData));
    }, POLL_INTERVAL_MS);
  },

  /**
   * 停止剪贴板内容轮询监听
   */
  stopPolling() {
    clearInterval(this._pollingTimer);
    this._pollingTimer = null;
  },

  /**
   * 根据_id删除数据库中的剪贴板历史项
   * @param {string} id 剪贴板历史项的_id
   * @returns {Promise<void>}
   */
  async deleteHistoryItem(id) {
    if (!window.utools) return;
    const doc = await window.utools.db.promises.get(id);
    if (doc) {
      await window.utools.db.promises.remove(doc);
    }
  },

  /**
   * 更新指定_id的剪贴板历史项的favorite字段
   * @param {string} id 剪贴板历史项的_id
   * @param {boolean} favorite 是否收藏
   * @returns {Promise<void>}
   */
  async updateFavorite(id, favorite) {
    if (!window.utools) return;
    const doc = await window.utools.db.promises.get(id);
    if (doc) {
      doc.favorite = favorite;
      const result = await window.utools.db.promises.put(doc);
      if (result.ok) {
        doc._rev = result.rev;
      } else if (result.error) {
        console.log(result.message);
      }
    }
  },

  /**
   * 删除所有剪贴板历史文档
   * @returns {Promise<void>}
   */
  async deleteAllHistory() {
    if (!window.utools) return;
    const docs = await window.utools.db.promises.allDocs(CLIPBOARD_DB_PREFIX);
    for (const doc of docs) {
      const result = await window.utools.db.promises.remove(doc._id);
      if (!result.ok && result.error) {
        console.log(result.message);
      }
    }
  },
};

window.AppClipboard = {
  fileService,
  clipboardService,
};

window.AppClipboard.clipboardService._startPolling();
