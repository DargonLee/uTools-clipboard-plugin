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
    hash = hash | 0;
  }
  return (hash >>> 0).toString(36);
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

const windowService = {
  hideMainWindow() {
    window.utools.hideMainWindow();
  },
  showMainWindow() {
    window.utools.showMainWindow();
  }
}

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
  }
};

const clipboardService = {
  _clipboardListeners: [],
  _lastHash: "",
  _pollingTimer: null,

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
  },
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
   * @param {string} hash 当前内容的hash值
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

    // 如果没有有效内容，不保存
    if (!content) return;

    const hashValue = simpleHash(content);
    
    // 获取数据库中最新的记录进行内容对比
    try {
      const docs = await window.utools.db.promises.allDocs(CLIPBOARD_DB_PREFIX);
      
      // 检查是否与最新记录内容相同
      if (docs.length > 0) {
        const latestDoc = docs[0]; // 数据库返回的是按时间倒序排列的
        
        // 比较内容是否相同（优先比较hash，再比较原始内容）
        if (latestDoc.hash === hashValue || latestDoc.content === content) {
          console.log('内容与最新记录相同，跳过存储');
          return;
        }
      }
      
      // 内容不同或数据库为空，保存新记录
      const docId = `${CLIPBOARD_DB_PREFIX}${nowTs()}_${hashValue}`;
      const result = await window.utools.db.promises.put({
        _id: docId,
        content,
        type,
        time: nowTs(),
        favorite: false,
        hash: hashValue,
      });
      
      console.log('新剪贴板内容已保存:', { type, contentLength: content.length });
      // 新增：保存后自动检查并限制历史数量
      try {
        const settings = window.AppClipboard?.settingsService?.loadSettings?.();
        const limit = settings?.historyLimit || 100;
        await window.AppClipboard.clipboardService.enforceHistoryLimit(parseInt(limit, 10));
      } catch (e) {
        console.warn('自动清理历史数量失败', e);
      }
      return result;
      
    } catch (error) {
      console.error('保存剪贴板内容失败:', error);
      return;
    }
  },

  /**
   * 启动剪贴板内容轮询监听，内容变化时自动存储并通知监听者
   */
  async _startPolling() {
    if (this._pollingTimer) return;
    
    // 初始化时设置当前剪贴板内容的hash，避免重启后立即重复存储
    try {
      const currentData = this.getClipboardData();
      const currentContent = currentData.files || currentData.image || currentData.text || '';
      this._lastHash = simpleHash(currentContent);
      console.log('初始化剪贴板hash:', this._lastHash);
    } catch (error) {
      console.error('初始化剪贴板hash失败:', error);
      this._lastHash = "";
    }
    
    this._pollingTimer = setInterval(async () => {
      const currentData = this.getClipboardData();
      console.log("currentData", currentData);
      
      // 优先使用文件路径，然后是图片，最后是文本
      const currentContent = currentData.files || currentData.image || currentData.text || '';
      const currentHash = simpleHash(currentContent);
      
      if (this._lastHash && this._lastHash === currentHash) {
        console.log("内容未变化，跳过存储");
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
    try {
      const docs = await window.utools.db.promises.allDocs(CLIPBOARD_DB_PREFIX);
      if (docs.length === 0) return;

      const docsToDelete = docs.map(doc => ({
        _id: doc._id,
        _rev: doc._rev,
        _deleted: true
      }));

      await window.utools.db.promises.bulkDocs(docsToDelete);
      console.log(`已通过批量操作删除所有 ${docs.length} 条历史记录`);
    } catch (error) {
      console.error('批量删除所有历史记录失败:', error);
    }
  },

  /**
   * 搜索剪贴板历史记录
   * @param {string} keyword 搜索关键词
   * @param {string|null} type 类型过滤 ('text', 'image', 'files', 'link')
   * @param {Object} options 搜索选项
   * @returns {Promise<Array>} 搜索结果
   */
  async searchHistory(keyword = '', type = null, options = {}) {
    if (!window.utools) return [];
    
    const { 
      caseSensitive = false,     // 是否区分大小写
      exactMatch = false,        // 是否精确匹配
      maxResults = 100,          // 最大结果数
      sortBy = 'time'            // 排序方式: 'time' | 'relevance'
    } = options;
    
    try {
      const allHistory = await this.getAllHistory();
      
      let results = allHistory.filter(item => {
        // 类型过滤
        if (type && item.type !== type) {
          return false;
        }
        
        // 关键词搜索
        if (keyword) {
          const searchText = caseSensitive ? item.content : item.content.toLowerCase();
          const searchKeyword = caseSensitive ? keyword : keyword.toLowerCase();
          
          if (exactMatch) {
            return searchText === searchKeyword;
          } else {
            return searchText.includes(searchKeyword);
          }
        }
        
        return true;
      });
      
      // 限制结果数量
      if (maxResults > 0) {
        results = results.slice(0, maxResults);
      }
      
      return results;
    } catch (error) {
      console.error('搜索历史记录失败:', error);
      return [];
    }
  },

  /**
   * 按类型获取历史记录
   * @param {string} type 类型 ('text', 'image', 'files', 'link')
   * @param {number} limit 限制数量，0为不限制
   * @returns {Promise<Array>} 过滤后的历史记录
   */
  async getHistoryByType(type, limit = 0) {
    if (!window.utools) return [];
    
    try {
      const allHistory = await this.getAllHistory();
      let filtered = allHistory.filter(item => item.type === type);
      
      if (limit > 0) {
        filtered = filtered.slice(0, limit);
      }
      
      return filtered;
    } catch (error) {
      console.error(`获取${type}类型历史记录失败:`, error);
      return [];
    }
  },

  /**
   * 获取收藏的历史记录
   * @param {string|null} type 可选的类型过滤
   * @returns {Promise<Array>} 收藏的历史记录
   */
  async getFavoriteHistory(type = null) {
    if (!window.utools) return [];
    
    try {
      const allHistory = await this.getAllHistory();
      let favorites = allHistory.filter(item => item.favorite === true);
      
      if (type) {
        favorites = favorites.filter(item => item.type === type);
      }
      
      return favorites;
    } catch (error) {
      console.error('获取收藏记录失败:', error);
      return [];
    }
  },

  /**
   * 按时间范围获取历史记录
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string|null} type 可选的类型过滤
   * @returns {Promise<Array>} 时间范围内的历史记录
   */
  async getHistoryByTimeRange(startTime, endTime, type = null) {
    if (!window.utools) return [];
    
    try {
      const allHistory = await this.getAllHistory();
      let filtered = allHistory.filter(item => {
        const itemTime = item.time;
        const inTimeRange = itemTime >= startTime && itemTime <= endTime;
        const matchesType = type ? item.type === type : true;
        return inTimeRange && matchesType;
      });
      
      return filtered;
    } catch (error) {
      console.error('按时间范围获取历史记录失败:', error);
      return [];
    }
  },

  /**
   * 获取今天的历史记录
   * @param {string|null} type 可选的类型过滤
   * @returns {Promise<Array>} 今天的历史记录
   */
  async getTodayHistory(type = null) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
    
    return await this.getHistoryByTimeRange(startOfDay, endOfDay, type);
  },

  /**
   * 高级搜索 - 支持多条件组合
   * @param {Object} criteria 搜索条件
   * @returns {Promise<Array>} 搜索结果
   */
  async advancedSearch(criteria) {
    if (!window.utools) return [];
    
    const {
      keyword = '',
      type = null,
      favorite = null,         // null | true | false
      startTime = null,
      endTime = null,
      minLength = 0,           // 最小内容长度
      maxLength = Infinity,    // 最大内容长度
      sortBy = 'time',         // 'time' | 'length' | 'type'
      sortOrder = 'desc'       // 'asc' | 'desc'
    } = criteria;
    
    try {
      const allHistory = await this.getAllHistory();
      
      let results = allHistory.filter(item => {
        // 关键词过滤
        if (keyword && !item.content.toLowerCase().includes(keyword.toLowerCase())) {
          return false;
        }
        
        // 类型过滤
        if (type && item.type !== type) {
          return false;
        }
        
        // 收藏状态过滤
        if (favorite !== null && item.favorite !== favorite) {
          return false;
        }
        
        // 时间范围过滤
        if (startTime && item.time < startTime) {
          return false;
        }
        if (endTime && item.time > endTime) {
          return false;
        }
        
        // 内容长度过滤
        const contentLength = item.content ? item.content.length : 0;
        if (contentLength < minLength || contentLength > maxLength) {
          return false;
        }
        
        return true;
      });
      
      // 排序
      results.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'time':
            comparison = a.time - b.time;
            break;
          case 'length':
            comparison = (a.content?.length || 0) - (b.content?.length || 0);
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
          default:
            comparison = a.time - b.time;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
      
      return results;
    } catch (error) {
      console.error('高级搜索失败:', error);
      return [];
    }
  },

  /**
   * 确保历史记录数量不超过限制，删除多余的旧记录
   * @param {number} limit 历史记录数量上限
   * @returns {Promise<void>}
   */
  async enforceHistoryLimit(limit) {
    if (!window.utools || limit <= 0) return;

    try {
      const allHistory = await this.getAllHistory(); // Sorted newest to oldest
      if (allHistory.length > limit) {
        const itemsToDeleteCount = allHistory.length - limit;
        // The oldest items are at the end of the array
        const itemsToDelete = allHistory.slice(itemsToDeleteCount * -1);
        
        const docsToDelete = itemsToDelete.map(item => ({
          _id: item._id,
          _rev: item._rev,
          _deleted: true
        }));

        if (docsToDelete.length > 0) {
          await window.utools.db.promises.bulkDocs(docsToDelete);
          console.log(`已通过批量操作删除 ${docsToDelete.length} 条最旧的历史记录以满足数量限制 ${limit}`);
        }
      }
    } catch (error) {
      console.error('执行历史记录数量限制失败:', error);
    }
  },
};

const settingsService = {
  SETTINGS_KEY: 'clipboardSettings',

  /**
   * 获取默认设置
   * @returns {Object} 默认设置对象
   */
  getDefaultSettings() {
    return {
      // 基本设置
      autoListen: true,
      showOnStartup: false,
      historyLimit: 500,
      
      // 内容过滤
      recordText: true,
      recordImages: true,
      recordFiles: true,
      filterSensitive: true,
      minTextLength: 3,
      
      // 外观设置
      themeMode: 'light', // light, dark, auto
      compactMode: false,
      showPreview: true,
      enableStickyHeader: true,
      
      // 数据管理
      maxSaveTime: 30, // 天数
    };
  },

  /**
   * 从 uTools dbStorage 加载设置
   * @returns {Object} 设置对象，如果没有保存的设置则返回默认设置
   */
  loadSettings() {
    try {
      if (!window.utools?.dbStorage) {
        console.warn('utools.dbStorage 不可用，使用默认设置');
        return this.getDefaultSettings();
      }

      const savedSettings = window.utools.dbStorage.getItem(this.SETTINGS_KEY);
      if (savedSettings) {
        // 合并默认设置和保存的设置，确保新增的设置项有默认值
        const defaultSettings = this.getDefaultSettings();
        const mergedSettings = { ...defaultSettings, ...savedSettings };
        console.log('已加载保存的设置:', mergedSettings);
        return mergedSettings;
      } else {
        console.log('没有找到保存的设置，使用默认设置');
        return this.getDefaultSettings();
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      return this.getDefaultSettings();
    }
  },

  /**
   * 保存设置到 uTools dbStorage
   * @param {Object} settings 要保存的设置对象
   * @returns {boolean} 保存是否成功
   */
  saveSettings(settings) {
    try {
      if (!window.utools?.dbStorage) {
        console.warn('utools.dbStorage 不可用，无法保存设置');
        return false;
      }

      // 获取旧设置以供比较
      const oldSettings = this.loadSettings();

      window.utools.dbStorage.setItem(this.SETTINGS_KEY, settings);
      console.log('设置已保存:', settings);

      // 检查 historyLimit 是否发生变化，如果变化则执行清理
      if (oldSettings.historyLimit !== settings.historyLimit) {
        console.log(`History limit changed from ${oldSettings.historyLimit} to ${settings.historyLimit}. Enforcing...`);
        window.AppClipboard.clipboardService.enforceHistoryLimit(parseInt(settings.historyLimit, 10));
      }

      return true;
    } catch (error) {
      console.error('保存设置失败:', error);
      return false;
    }
  },

  /**
   * 更新单个设置项
   * @param {string} key 设置项键名
   * @param {any} value 设置项值
   * @returns {boolean} 更新是否成功
   */
  updateSetting(key, value) {
    console.log("updateSetting", key, value);
    try {
      const currentSettings = this.loadSettings();
      const updatedSettings = { ...currentSettings, [key]: value };
      // 现在 saveSettings 会处理 historyLimit 的副作用
      return this.saveSettings(updatedSettings);
    } catch (error) {
      console.error(`更新设置 ${key} 失败:`, error);
      return false;
    }
  },

  /**
   * 重置设置为默认值
   * @returns {boolean} 重置是否成功
   */
  resetSettings() {
    try {
      const defaultSettings = this.getDefaultSettings();
      const success = this.saveSettings(defaultSettings);
      if (success) {
        console.log('设置已重置为默认值');
      }
      return success;
    } catch (error) {
      console.error('重置设置失败:', error);
      return false;
    }
  },

  /**
   * 清除所有设置数据
   * @returns {boolean} 清除是否成功
   */
  clearAllSettings() {
    try {
      if (!window.utools?.dbStorage) {
        console.warn('utools.dbStorage 不可用，无法清除设置');
        return false;
      }

      window.utools.dbStorage.removeItem(this.SETTINGS_KEY);
      console.log('所有设置数据已清除');
      return true;
    } catch (error) {
      console.error('清除设置数据失败:', error);
      return false;
    }
  },
  /**
   * 检查 uTools dbStorage 是否可用
   * @returns {boolean} 是否可用
   */
  isStorageAvailable() {
    return !!(window.utools?.dbStorage);
  }
};

window.AppClipboard = {
  fileService,
  clipboardService,
  settingsService,
  windowService,
};

window.AppClipboard.clipboardService._startPolling();
