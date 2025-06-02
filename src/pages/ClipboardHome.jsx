// 剪贴板主页面（设计图主界面）
// {JSON.stringify(enterAction, undefined, 2)}
// {"code": "paste", "type": "text", "payload": "Easy剪贴板","from": "main"}
import React, { useEffect } from 'react';
import { FaFileAlt, FaLink, FaFile, FaImage } from 'react-icons/fa';
import TextCard from '../components/TextCard';
import LinkCard from '../components/LinkCard';
import ImageCard from '../components/ImageCard';
import FileCard from '../components/FileCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ContentState from '../components/ContentState';
import './ClipboardHome.css';

class ClipboardHome extends React.Component {
  state = {
    history: [],
    originalHistory: [], // 保存完整历史，用于重置搜索
    searchKeyword: '',
    selectedType: 'all',
    isLoading: false,
    enableStickyHeader: true, // 控制悬停功能的开关
    isHeaderSticky: false,
    lastScrollY: 0,
    scrollDirection: 'down',
    // 防重复复制相关状态
    isIgnoringClipboard: false, // 是否忽略剪贴板变化
    lastCopiedContent: null, // 最后一次复制的内容
    lastCopiedType: null, // 最后一次复制的类型
    ignoreTimer: null // 忽略定时器
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
      // 防重复检查：如果正在忽略剪贴板变化，则跳过
      if (this.state.isIgnoringClipboard) {
        console.log('正在忽略剪贴板变化，跳过此次更新');
        return;
      }

      // 防重复检查：如果内容与最近复制的内容相同，则跳过
      if (data && this.state.lastCopiedContent && this.state.lastCopiedType) {
        const isSameContent = data.content === this.state.lastCopiedContent;
        const isSameType = data.type === this.state.lastCopiedType;
        if (isSameContent && isSameType) {
          console.log('检测到重复内容，跳过此次更新');
          // 清除最后复制的记录，避免影响后续正常操作
          this.setState({
            lastCopiedContent: null,
            lastCopiedType: null
          });
          return;
        }
      }

      // 正常更新历史记录
      const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
      this.setState({ 
        history: newHistory, 
        originalHistory: newHistory 
      });
      // 如果当前有搜索或过滤，重新应用
      this.applyCurrentFilters(newHistory);
    });

    // 添加滚动监听器
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    // 移除滚动监听器
    window.removeEventListener('scroll', this.handleScroll);
    
    // 清理防重复定时器
    if (this.state.ignoreTimer) {
      clearTimeout(this.state.ignoreTimer);
    }
  }

  // 滚动处理函数
  handleScroll = () => {
    // 如果禁用悬停功能，直接返回
    if (!this.state.enableStickyHeader) {
      return;
    }

    const currentScrollY = window.scrollY;
    const { lastScrollY } = this.state;
    
    // 判断滚动方向
    const scrollDirection = currentScrollY > lastScrollY ? 'up' : 'down';
    
    // 设置悬停阈值，滚动超过100px时开始判断是否悬停
    const scrollThreshold = 100;
    
    // 向上滚动且滚动距离超过阈值时悬停
    const shouldStick = scrollDirection === 'up' && currentScrollY > scrollThreshold;
    
    // 向下滚动到顶部附近时取消悬停
    const shouldUnstick = currentScrollY <= scrollThreshold;
    
    this.setState({
      lastScrollY: currentScrollY,
      scrollDirection,
      isHeaderSticky: shouldUnstick ? false : shouldStick || this.state.isHeaderSticky
    });
  }

  // 切换悬停功能的开关
  toggleStickyHeader = () => {
    this.setState(prevState => ({
      enableStickyHeader: !prevState.enableStickyHeader,
      // 如果禁用悬停功能，同时取消当前的悬停状态
      isHeaderSticky: !prevState.enableStickyHeader ? false : prevState.isHeaderSticky
    }));
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
        return <FaFileAlt className="text-gray-500 dark:text-gray-400" />;
      case 'image':
        return <FaImage className="text-purple-500 dark:text-purple-400" />;
      case 'files':
        return <FaFile className="text-green-500 dark:text-green-400" />;
      case 'link':
        return <FaLink className="text-blue-500 dark:text-blue-400" />;
      default:
        return <FaFileAlt className="text-gray-500 dark:text-gray-400" />;
    }
  }

  // 复制操作处理
  handleCopy = async (item) => {
    console.log('复制', item.type, item.content);
    
    try {
      // 清理之前的定时器
      if (this.state.ignoreTimer) {
        clearTimeout(this.state.ignoreTimer);
      }

      // 设置防重复标志和记录即将复制的内容
      this.setState({
        isIgnoringClipboard: true,
        lastCopiedContent: item.content,
        lastCopiedType: item.type
      });

      // 执行复制操作
      if (item.type === 'image') {
        await window.AppClipboard.clipboardService.writeClipboardImage(item.content);
      } else {
        await window.AppClipboard.clipboardService.writeClipboardText(item.content);
      }

      // 设置定时器，一段时间后取消忽略标志
      const timer = setTimeout(() => {
        this.setState({
          isIgnoringClipboard: false,
          ignoreTimer: null
        });
        console.log('恢复剪贴板监听');
      }, 1000); // 1秒后恢复监听

      this.setState({ ignoreTimer: timer });
      
      console.log('复制成功，暂时忽略剪贴板变化 1 秒');
      
    } catch (error) {
      console.error('复制失败:', error);
      // 复制失败时也要恢复监听
      this.setState({
        isIgnoringClipboard: false,
        lastCopiedContent: null,
        lastCopiedType: null
      });
    }
  }

  // 收藏/取消收藏操作处理
  handleToggleFavorite = async (item) => {
    try {
      await window.AppClipboard.clipboardService.updateFavorite(item._id, !item.favorite);
      const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
      this.setState({ 
        originalHistory: newHistory 
      });
      this.applyCurrentFilters(newHistory);
    } catch (error) {
      console.error('更新收藏状态失败:', error);
    }
  }

  // 删除操作处理
  handleDelete = async (item) => {
    if (confirm('确定要删除这条记录吗？')) {
      try {
        await window.AppClipboard.clipboardService.deleteHistoryItem(item._id);
        const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
        this.setState({ 
          originalHistory: newHistory 
        });
        this.applyCurrentFilters(newHistory);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  }

  // 清空全部历史记录
  handleClearAll = async () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      try {
        await window.AppClipboard.clipboardService.deleteAllHistory();
        const newHistory = await window.AppClipboard.clipboardService.getAllHistory();
        this.setState({ 
          history: newHistory, 
          originalHistory: newHistory,
          searchKeyword: '',
          selectedType: 'all'
        });
      } catch (error) {
        console.error('清空历史记录失败:', error);
      }
    }
  }

  // 渲染单个历史记录项
  renderHistoryItem = (item) => {
    // 如果是文本类型，使用 TextCard 组件
    if (item.type === 'text') {
      return (
        <TextCard
          key={item._id}
          item={item}
          onCopy={this.handleCopy}
          onToggleFavorite={this.handleToggleFavorite}
          onDelete={this.handleDelete}
        />
      );
    }

    // 如果是链接类型，使用 LinkCard 组件
    if (item.type === 'link') {
      return (
        <LinkCard
          key={item._id}
          item={item}
          onCopy={this.handleCopy}
          onToggleFavorite={this.handleToggleFavorite}
          onDelete={this.handleDelete}
        />
      );
    }

    // 如果是图片类型，使用 ImageCard 组件
    if (item.type === 'image') {
      return (
        <ImageCard
          key={item._id}
          item={item}
          onCopy={this.handleCopy}
          onToggleFavorite={this.handleToggleFavorite}
          onDelete={this.handleDelete}
        />
      );
    }

    // 如果是文件类型，使用 FileCard 组件
    if (item.type === 'files') {
      return (
        <FileCard
          key={item._id}
          item={item}
          onCopy={this.handleCopy}
          onToggleFavorite={this.handleToggleFavorite}
          onDelete={this.handleDelete}
        />
      );
    }

    // 未知类型返回 null，不渲染
    return null;
  }

  render() {
    const { enterAction } = this.props;
    const { history, searchKeyword, selectedType, isLoading, enableStickyHeader, isHeaderSticky } = this.state;
    
    // 统计数据
    const stats = {
      total: this.state.originalHistory.length,
      text: this.state.originalHistory.filter(item => item.type === 'text').length,
      image: this.state.originalHistory.filter(item => item.type === 'image').length,
      files: this.state.originalHistory.filter(item => item.type === 'files').length,
      link: this.state.originalHistory.filter(item => item.type === 'link').length,
      favorite: this.state.originalHistory.filter(item => item.favorite).length,
    };

    // 计算是否应该显示悬停效果
    const shouldShowSticky = enableStickyHeader && isHeaderSticky;

    return (
      <div className="min-h-screen bg-gray-50 transition-colors">
        <div className="max-w-4xl mx-auto p-4">
          {/* 悬停头部容器 */}
          <div className={`header-container ${shouldShowSticky ? 'sticky-header' : ''}`}>
            {/* 开发调试：悬停功能切换按钮 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-2 flex justify-end">
                <button
                  onClick={this.toggleStickyHeader}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    enableStickyHeader 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                  title={`${enableStickyHeader ? '禁用' : '启用'}头部悬停`}
                >
                  悬停: {enableStickyHeader ? 'ON' : 'OFF'}
                </button>
              </div>
            )}
            
            {/* 搜索栏组件 */}
            <SearchBar
              searchKeyword={searchKeyword}
              onSearch={this.handleSearch}
            />

            {/* 类型过滤和快捷操作组件 */}
            <FilterBar
              stats={stats}
              selectedType={selectedType}
              searchKeyword={searchKeyword}
              onTypeFilter={this.handleTypeFilter}
              onShowToday={this.showTodayHistory}
              onResetFilters={this.resetFilters}
              onClearAll={this.handleClearAll}
            />
          </div>

          {/* 内容状态组件 - 包含加载状态、空状态、历史记录列表和调试信息 */}
          <div className={shouldShowSticky ? 'content-offset' : ''}>
            <ContentState
              isLoading={isLoading}
              history={history}
              searchKeyword={searchKeyword}
              selectedType={selectedType}
              renderHistoryItem={this.renderHistoryItem}
              enterAction={enterAction}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ClipboardHome;
