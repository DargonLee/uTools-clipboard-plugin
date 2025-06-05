// 剪贴板主页面（设计图主界面）
// {JSON.stringify(enterAction, undefined, 2)}
// {"code": "paste", "type": "text", "payload": "Easy剪贴板","from": "main"}
import React, { useEffect } from 'react';
import { FaFileAlt, FaLink, FaFile, FaImage, FaCog } from 'react-icons/fa';
import {
  TextCard,
  LinkCard,
  ImageCard,
  FileCard,
  SearchBar,
  FilterBar,
  ContentState,
  ImagePreview,
  TextPreview
} from '../components';
import Setting from './Setting';
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
    ignoreTimer: null, // 忽略定时器
    showSetting: false, // 是否显示设置页面
    // 新增预览相关状态
    hoveredCard: null,        // 当前悬停的卡片
    hoveredCardType: null,    // 悬停卡片的类型
    showImagePreview: false,  // 是否显示图片预览
    previewImageData: null,   // 预览的图片数据
    showTextPreview: false,   // 是否显示文本预览
    previewTextData: null,    // 预览的文本数据
    // 键盘导航相关状态
    selectedCardIndex: -1,    // 当前选中的card索引，-1表示未选中
  }

  async componentDidMount() {
    // 加载保存的设置
    this.loadSettings();
    
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

    // 添加键盘事件监听
    document.addEventListener('keydown', this.handleGlobalKeyDown);
    document.addEventListener('keyup', this.handleGlobalKeyUp);
  }

  componentWillUnmount() {
    // 移除滚动监听器
    window.removeEventListener('scroll', this.handleScroll);
    
    // 清理防重复定时器
    if (this.state.ignoreTimer) {
      clearTimeout(this.state.ignoreTimer);
    }

    // 清理键盘事件监听
    document.removeEventListener('keydown', this.handleGlobalKeyDown);
    document.removeEventListener('keyup', this.handleGlobalKeyUp);
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

    this.setState({ 
      history: filtered,
      selectedCardIndex: -1 // 重置选中状态
    });
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
      history: this.state.originalHistory,
      selectedCardIndex: -1 // 重置选中状态
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
          originalHistory: newHistory,
          selectedCardIndex: -1 // 重置选中状态
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
          selectedType: 'all',
          selectedCardIndex: -1 // 重置选中状态
        });
      } catch (error) {
        console.error('清空历史记录失败:', error);
      }
    }
  }

  // 显示设置页面
  handleShowSetting = () => {
    this.setState({ showSetting: true });
  }

  // 返回主页面
  handleBackToHome = () => {
    this.setState({ showSetting: false });
  }

  // 处理悬停设置变化
  handleStickyHeaderChange = (enabled) => {
    this.setState({ 
      enableStickyHeader: enabled,
      // 如果禁用悬停功能，同时取消当前的悬停状态
      isHeaderSticky: enabled ? this.state.isHeaderSticky : false
    }, () => {
      // 更新 settingsService 中的设置
      try {
        const success = window.AppClipboard?.settingsService?.updateSetting('enableStickyHeader', enabled);
        if (success) {
          console.log('头部悬停设置已更新:', enabled);
        } else {
          console.warn('头部悬停设置更新失败');
        }
      } catch (error) {
        console.error('更新头部悬停设置失败:', error);
      }
    });
  }

  // 从 settingsService 加载设置
  loadSettings = () => {
    try {
      const savedSettings = window.AppClipboard?.settingsService?.loadSettings();
      if (savedSettings) {
        // 只加载与 ClipboardHome 相关的设置
        this.setState({
          enableStickyHeader: savedSettings.enableStickyHeader !== undefined 
            ? savedSettings.enableStickyHeader 
            : true
        });
        console.log('ClipboardHome 已加载设置:', { 
          enableStickyHeader: savedSettings.enableStickyHeader 
        });
      }
    } catch (error) {
      console.error('ClipboardHome 加载设置失败:', error);
    }
  }

  // 全局键盘事件处理
  handleGlobalKeyDown = (e) => {
    // 如果设置页面已打开，不处理键盘导航
    if (this.state.showSetting) {
      return;
    }

    // 如果当前有悬停的卡片，按空格键预览
    if (e.code === 'Space' && this.state.hoveredCard && this.state.hoveredCardType) {
      e.preventDefault();
      if (this.state.hoveredCardType === 'image') {
        this.showImagePreview(this.state.hoveredCard);
      } else if (this.state.hoveredCardType === 'text') {
        this.showTextPreview(this.state.hoveredCard);
      }
    }

    // 键盘导航功能
    const { selectedCardIndex, history } = this.state;
    
    // 向下箭头键 - 选中下一个card
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = selectedCardIndex + 1;
      if (nextIndex < history.length) {
        this.setState({ selectedCardIndex: nextIndex });
        this.scrollToCard(nextIndex);
      }
    }
    
    // 向上箭头键 - 选中上一个card
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = selectedCardIndex - 1;
      if (prevIndex >= 0) {
        this.setState({ selectedCardIndex: prevIndex });
        this.scrollToCard(prevIndex);
      } else if (selectedCardIndex === -1 && history.length > 0) {
        // 如果当前没有选中任何card，选中最后一个
        this.setState({ selectedCardIndex: history.length - 1 });
        this.scrollToCard(history.length - 1);
      }
    }
    
    // Enter键 - 复制当前选中的card
    else if (e.key === 'Enter' && selectedCardIndex >= 0 && selectedCardIndex < history.length) {
      e.preventDefault();
      const selectedItem = history[selectedCardIndex];
      this.handleCopy(selectedItem);
    }
    
    // Escape键 - 取消选中
    else if (e.key === 'Escape') {
      e.preventDefault();
      this.setState({ selectedCardIndex: -1 });
    }
  }

  handleGlobalKeyUp = (e) => {
    // 处理按键释放事件
  }

  // 处理卡片悬停
  handleCardHover = (item, cardType) => {
    this.setState({
      hoveredCard: item,
      hoveredCardType: cardType
    });
  }

  // 处理卡片离开悬停
  handleCardLeave = () => {
    this.setState({
      hoveredCard: null,
      hoveredCardType: null
    });
  }

  // 显示图片预览
  showImagePreview = (imageItem) => {
    this.setState({
      showImagePreview: true,
      previewImageData: imageItem
    });
  }

  // 关闭图片预览
  closeImagePreview = () => {
    this.setState({
      showImagePreview: false,
      previewImageData: null
    });
  }

  // 显示文本预览
  showTextPreview = (textItem) => {
    this.setState({
      showTextPreview: true,
      previewTextData: textItem
    });
  }

  // 关闭文本预览
  closeTextPreview = () => {
    this.setState({
      showTextPreview: false,
      previewTextData: null
    });
  }

  // 滚动到指定的card
  scrollToCard = (index) => {
    // 使用setTimeout确保DOM已更新
    setTimeout(() => {
      const cardElements = document.querySelectorAll('.text-card, .image-card, .file-card, .link-card');
      if (cardElements[index]) {
        cardElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 10);
  }

  // 修改渲染单个历史记录项的方法
  renderHistoryItem = (item, index) => {
    const { selectedCardIndex } = this.state;
    const isSelected = selectedCardIndex === index;
    
    const commonProps = {
      selected: isSelected,
      onCopy: this.handleCopy,
      onToggleFavorite: this.handleToggleFavorite,
      onDelete: this.handleDelete,
      onHover: () => this.handleCardHover(item, item.type),
      onLeave: this.handleCardLeave
    };

    // 如果是文本类型，使用 TextCard 组件
    if (item.type === 'text') {
      return (
        <TextCard
          key={item._id}
          item={item}
          {...commonProps}
        />
      );
    }

    // 如果是链接类型，使用 LinkCard 组件
    if (item.type === 'link') {
      return (
        <LinkCard
          key={item._id}
          item={item}
          {...commonProps}
        />
      );
    }

    // 如果是图片类型，使用 ImageCard 组件
    if (item.type === 'image') {
      return (
        <ImageCard
          key={item._id}
          item={item}
          {...commonProps}
        />
      );
    }

    // 如果是文件类型，使用 FileCard 组件
    if (item.type === 'files') {
      return (
        <FileCard
          key={item._id}
          item={item}
          {...commonProps}
        />
      );
    }

    return null;
  }

  render() {
    const { enterAction } = this.props;
    const { 
      history, 
      searchKeyword, 
      selectedType, 
      isLoading, 
      enableStickyHeader, 
      isHeaderSticky, 
      showSetting, 
      showImagePreview, 
      previewImageData,
      showTextPreview,
      previewTextData
    } = this.state;
    
    // 如果显示设置页面，直接返回设置组件
    if (showSetting) {
      return (
        <Setting 
          onGoBack={this.handleBackToHome} 
          onStickyHeaderChange={this.handleStickyHeaderChange}
          enableStickyHeader={enableStickyHeader}
        />
      );
    }
    
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
            {/* 搜索栏组件 */}
            <SearchBar
              searchKeyword={searchKeyword}
              onSearch={this.handleSearch}
              onSettingClick={this.handleShowSetting}
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

        {/* 图片预览组件 */}
        <ImagePreview
          isVisible={showImagePreview}
          imageData={previewImageData}
          onClose={this.closeImagePreview}
          onCopy={this.handleCopy}
        />

        {/* 文本预览组件 */}
        <TextPreview
          isVisible={showTextPreview}
          textData={previewTextData}
          onClose={this.closeTextPreview}
          onCopy={this.handleCopy}
        />
      </div>
    );
  }
}

export default ClipboardHome;
