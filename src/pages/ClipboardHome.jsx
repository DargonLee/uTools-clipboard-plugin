// 剪贴板主页面（设计图主界面）
// {JSON.stringify(enterAction, undefined, 2)}
// {"code": "paste", "type": "text", "payload": "Easy剪贴板","from": "main"}
import React, { useEffect } from 'react';
import { FaFileAlt, FaLink, FaFile, FaSearch, FaImage, FaStar, FaClock } from 'react-icons/fa';

class ClipboardHome extends React.Component {
  state = {
    history: [],
    originalHistory: [], // 保存完整历史，用于重置搜索
    searchKeyword: '',
    selectedType: 'all',
    isLoading: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const history = await window.AppClipboard.clipboardService.getAllHistory();
    this.setState({ 
      history, 
      originalHistory: history,
      isLoading: false 
    });

    window.AppClipboard.clipboardService.onChange(async (data) => {
      const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
      this.setState({ 
        history: newHistory, 
        originalHistory: newHistory 
      });
      // 如果当前有搜索或过滤，重新应用
      this.applyCurrentFilters(newHistory);
    });
  }

  // 应用当前的过滤器和搜索
  applyCurrentFilters = (baseHistory = null) => {
    const { searchKeyword, selectedType } = this.state;
    const historyToFilter = baseHistory || this.state.originalHistory;
    
    let filtered = [...historyToFilter];

    // 应用类型过滤
    if (selectedType !== 'all') {
      if (selectedType === 'favorite') {
        filtered = filtered.filter(item => item.favorite === true);
      } else {
        filtered = filtered.filter(item => item.type === selectedType);
      }
    }

    // 应用搜索过滤
    if (searchKeyword.trim() !== '') {
      filtered = filtered.filter(item => 
        item.content.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    this.setState({ history: filtered });
  }

  // 搜索功能
  handleSearch = (keyword) => {
    this.setState({ searchKeyword: keyword }, () => {
      this.applyCurrentFilters();
    });
  }

  // 类型过滤
  handleTypeFilter = (type) => {
    this.setState({ selectedType: type }, () => {
      this.applyCurrentFilters();
    });
  }

  // 清空搜索和过滤
  resetFilters = () => {
    this.setState({
      searchKeyword: '',
      selectedType: 'all',
      history: this.state.originalHistory
    });
  }

  // 快捷功能：获取今日记录
  showTodayHistory = async () => {
    const todayHistory = await window.AppClipboard.clipboardService.getTodayHistory();
    this.setState({ 
      history: todayHistory,
      selectedType: 'today',
      searchKeyword: '' 
    });
  }

  // 快捷功能：获取收藏记录
  showFavoriteHistory = async () => {
    const favoriteHistory = await window.AppClipboard.clipboardService.getFavoriteHistory();
    this.setState({ 
      history: favoriteHistory,
      selectedType: 'favorite',
      searchKeyword: '' 
    });
  }

  // 获取类型对应的图标
  getTypeIcon = (type) => {
    switch (type) {
      case 'text':
        return <FaFileAlt className="text-gray-500" />;
      case 'image':
        return <FaImage className="text-purple-500" />;
      case 'files':
        return <FaFile className="text-green-500" />;
      case 'link':
        return <FaLink className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  }

  // 格式化时间显示
  formatTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    return new Date(timestamp).toLocaleDateString();
  }

  // 截断长文本
  truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  render() {
    const { enterAction } = this.props;
    const { history, searchKeyword, selectedType, isLoading } = this.state;
    
    // 统计数据
    const stats = {
      total: this.state.originalHistory.length,
      text: this.state.originalHistory.filter(item => item.type === 'text').length,
      image: this.state.originalHistory.filter(item => item.type === 'image').length,
      files: this.state.originalHistory.filter(item => item.type === 'files').length,
      link: this.state.originalHistory.filter(item => item.type === 'link').length,
      favorite: this.state.originalHistory.filter(item => item.favorite).length,
    };

    return (
      <div className="max-w-4xl mx-auto p-4">
        {/* 标题栏 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">剪贴板管理器</h1>
          <p className="text-gray-600 text-sm">共 {stats.total} 条记录</p>
        </div>

        {/* 搜索栏 */}
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索剪贴板内容..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchKeyword}
              onChange={(e) => this.handleSearch(e.target.value)}
            />
            {searchKeyword && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => this.handleSearch('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 类型过滤和快捷操作 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => this.handleTypeFilter('all')}
          >
            全部 ({stats.total})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'text' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => this.handleTypeFilter('text')}
          >
            <FaFileAlt className="inline mr-1" />
            文本 ({stats.text})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'image' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => this.handleTypeFilter('image')}
          >
            <FaImage className="inline mr-1" />
            图片 ({stats.image})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'files' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => this.handleTypeFilter('files')}
          >
            <FaFile className="inline mr-1" />
            文件 ({stats.files})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'link' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => this.handleTypeFilter('link')}
          >
            <FaLink className="inline mr-1" />
            链接 ({stats.link})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'favorite' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => this.handleTypeFilter('favorite')}
          >
            <FaStar className="inline mr-1" />
            收藏 ({stats.favorite})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'today' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={this.showTodayHistory}
          >
            <FaClock className="inline mr-1" />
            今日
          </button>
        </div>

        {/* 操作按钮 */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {(searchKeyword || selectedType !== 'all') && (
              <button
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                onClick={this.resetFilters}
              >
                重置筛选
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button onClick={() => {
              window.AppClipboard.fileService.writeTextFile('测试文本')
            }} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
              测试按钮
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              onClick={async () => {
                if (confirm('确定要清空所有历史记录吗？')) {
                  await window.AppClipboard.clipboardService.deleteAllHistory();
                  const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
                  this.setState({ 
                    history: newHistory, 
                    originalHistory: newHistory,
                    searchKeyword: '',
                    selectedType: 'all'
                  });
                }
              }}
            >
              清空全部
            </button>
          </div>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">加载中...</div>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && history.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {searchKeyword || selectedType !== 'all' ? '没有找到匹配的记录' : '暂无剪贴板历史'}
            </div>
            <div className="text-gray-500 text-sm">
              {searchKeyword || selectedType !== 'all' ? '尝试调整搜索条件' : '复制一些内容开始使用吧'}
            </div>
          </div>
        )}

        {/* 历史记录列表 */}
        <div className="space-y-3">
          {history.map(item => (
            <div key={item._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between">
                {/* 左侧内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    {this.getTypeIcon(item.type)}
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                      {item.type === 'files' ? '文件' : 
                       item.type === 'image' ? '图片' : 
                       item.type === 'link' ? '链接' : '文本'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {this.formatTime(item.time)}
                    </span>
                    {item.favorite && (
                      <FaStar className="text-yellow-500 text-xs" title="已收藏" />
                    )}
                  </div>
                  
                  {/* 内容显示 */}
                  <div className="mb-2">
                    {item.type === 'image' ? (
                      <img
                        src={item.content}
                        alt="剪贴板图片"
                        className="max-w-xs max-h-32 rounded border object-cover"
                      />
                    ) : (
                      <div className="text-gray-800 text-sm leading-relaxed">
                        {this.truncateText(item.content, 200)}
                      </div>
                    )}
                  </div>
                  
                  {/* 元信息 */}
                  <div className="text-xs text-gray-400">
                    {item.content?.length > 0 && `${item.content.length} 字符`}
                  </div>
                </div>

                {/* 右侧操作按钮 */}
                <div className="flex flex-col space-y-1 ml-4">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                    onClick={async () => {
                      console.log('复制', item.type, item.content);
                      if (item.type === 'image') {
                        await window.AppClipboard.clipboardService.writeClipboardImage(item.content);
                      } else {
                        await window.AppClipboard.clipboardService.writeClipboardText(item.content);
                      }
                    }}
                  >
                    复制
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      item.favorite 
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                    onClick={async () => {
                      await window.AppClipboard.clipboardService.updateFavorite(item._id, !item.favorite);
                      const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
                      this.setState({ 
                        originalHistory: newHistory 
                      });
                      this.applyCurrentFilters(newHistory);
                    }}
                  >
                    {item.favorite ? '取消收藏' : '收藏'}
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                    onClick={async () => {
                      if (confirm('确定要删除这条记录吗？')) {
                        await window.AppClipboard.clipboardService.deleteHistoryItem(item._id);
                        const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
                        this.setState({ 
                          originalHistory: newHistory 
                        });
                        this.applyCurrentFilters(newHistory);
                      }
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 调试信息 */}
        {enterAction && (
          <details className="mt-8 p-4 bg-gray-50 rounded-lg">
            <summary className="cursor-pointer text-sm text-gray-600 mb-2">调试信息</summary>
            <pre className="text-xs text-gray-500 overflow-auto">
              {JSON.stringify(enterAction, undefined, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }
}

export default ClipboardHome;
