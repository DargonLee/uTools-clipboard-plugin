import React from 'react';
import { FaTimes, FaCopy, FaDownload, FaSearch, FaFont } from 'react-icons/fa';
import { countCharacters, countLines, countWords } from '../utils/TextUtils';
import './TextPreview.css';

/**
 * 文本预览组件
 * 全屏显示文本内容，支持键盘控制
 * Props:
 *   - isVisible: 是否显示预览
 *   - textData: 文本数据对象
 *   - onClose: 关闭回调函数
 *   - onCopy: 复制回调函数
 */
class TextPreview extends React.Component {
  state = {
    fontSize: 16,
    searchKeyword: '',
    isSearchMode: false,
    searchResults: [],
    currentSearchIndex: 0
  };

  componentDidMount() {
    // 监听键盘事件
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    // 清理事件监听器
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible && !prevProps.isVisible) {
      // 显示预览时重置状态
      this.setState({
        fontSize: 16,
        searchKeyword: '',
        isSearchMode: false,
        searchResults: [],
        currentSearchIndex: 0
      });
    }
  }

  // 键盘事件处理
  handleKeyDown = (e) => {
    if (!this.props.isVisible) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        if (this.state.isSearchMode) {
          this.setState({ isSearchMode: false, searchKeyword: '', searchResults: [] });
        } else {
          this.props.onClose();
        }
        break;
      case ' ':
        e.preventDefault();
        this.props.onClose();
        break;
      case '+':
      case '=':
        e.preventDefault();
        this.increaseFontSize();
        break;
      case '-':
        e.preventDefault();
        this.decreaseFontSize();
        break;
      case '0':
        e.preventDefault();
        this.resetFontSize();
        break;
      case 'f':
      case 'F':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.toggleSearchMode();
        }
        break;
      case 'Enter':
        if (this.state.isSearchMode && this.state.searchResults.length > 0) {
          e.preventDefault();
          this.nextSearchResult();
        }
        break;
      default:
        break;
    }
  }

  // 字体大小控制
  increaseFontSize = () => {
    this.setState(prevState => ({
      fontSize: Math.min(prevState.fontSize + 2, 32)
    }));
  }

  decreaseFontSize = () => {
    this.setState(prevState => ({
      fontSize: Math.max(prevState.fontSize - 2, 10)
    }));
  }

  resetFontSize = () => {
    this.setState({ fontSize: 16 });
  }

  // 搜索功能
  toggleSearchMode = () => {
    this.setState(prevState => ({
      isSearchMode: !prevState.isSearchMode,
      searchKeyword: prevState.isSearchMode ? '' : prevState.searchKeyword,
      searchResults: prevState.isSearchMode ? [] : prevState.searchResults
    }));
  }

  handleSearchChange = (e) => {
    const keyword = e.target.value;
    this.setState({ 
      searchKeyword: keyword,
      currentSearchIndex: 0
    });
    
    if (keyword.trim()) {
      this.performSearch(keyword);
    } else {
      this.setState({ searchResults: [] });
    }
  }

  performSearch = (keyword) => {
    const { textData } = this.props;
    if (!textData?.content) return;

    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = [];
    let match;
    
    while ((match = regex.exec(textData.content)) !== null) {
      matches.push({
        index: match.index,
        text: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    this.setState({ searchResults: matches });
  }

  // 下一个搜索结果
  nextSearchResult = () => {
    this.setState(prevState => {
      const newIndex = (prevState.currentSearchIndex + 1) % Math.max(1, prevState.searchResults.length);
      return { currentSearchIndex: newIndex };
    }, () => {
      // 滚动到当前搜索结果
      this.scrollToCurrentMatch();
    });
  }

  // 上一个搜索结果
  prevSearchResult = () => {
    this.setState(prevState => {
      const newIndex = prevState.currentSearchIndex > 0 
        ? prevState.currentSearchIndex - 1 
        : prevState.searchResults.length - 1;
      return { currentSearchIndex: newIndex };
    }, () => {
      // 滚动到当前搜索结果
      this.scrollToCurrentMatch();
    });
  }

  // 滚动到当前匹配项
  scrollToCurrentMatch = () => {
    setTimeout(() => {
      const currentMatch = document.querySelector('.search-highlight.current');
      if (currentMatch) {
        currentMatch.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 50);
  }

  // 高亮搜索关键词
  highlightText = (text, keyword, results, currentIndex) => {
    if (!keyword.trim() || results.length === 0) return text;

    const parts = [];
    let lastIndex = 0;

    results.forEach((result, index) => {
      // 添加匹配前的文本
      if (result.start > lastIndex) {
        parts.push(text.substring(lastIndex, result.start));
      }
      
      // 添加高亮的匹配文本
      const isCurrentMatch = index === currentIndex;
      parts.push(
        <mark 
          key={`match-${index}`} 
          className={`search-highlight ${isCurrentMatch ? 'current' : ''}`}
        >
          {result.text}
        </mark>
      );
      
      lastIndex = result.end;
    });

    // 添加最后的文本
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  }

  // 保存文本
  handleSaveText = () => {
    if (this.props.textData?.content) {
      try {
        const filePath = window.AppClipboard?.fileService?.writeTextFile(this.props.textData.content);
        if (filePath) {
          console.log('文本已保存到:', filePath);
          alert(`文本已保存到: ${filePath}`);
        } else {
          alert('保存失败，请重试');
        }
      } catch (error) {
        console.error('保存文本失败:', error);
        alert('保存失败，请重试');
      }
    }
  }

  // 复制文本
  handleCopyText = () => {
    if (this.props.onCopy && this.props.textData) {
      this.props.onCopy(this.props.textData);
    }
  }

  // 阻止事件冒泡
  handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  }

  render() {
    const { isVisible, textData } = this.props;
    const { fontSize, isSearchMode, searchKeyword, searchResults, currentSearchIndex } = this.state;

    if (!isVisible || !textData) {
      return null;
    }

    const textStyle = {
      fontSize: `${fontSize}px`,
      lineHeight: 1.6
    };

    const displayText = this.highlightText(textData.content, searchKeyword, searchResults, currentSearchIndex);

    return (
      <div className="text-preview-overlay" onClick={this.handleBackdropClick}>
        <div className="text-preview-container">
          
          {/* 工具栏 */}
          <div className="preview-toolbar">
            <div className="toolbar-left">
              <span className="preview-title">文本预览</span>
              <div className="preview-stats">
                <span>{countCharacters(textData.content)} 字符</span>
                <span>{countLines(textData.content)} 行</span>
                <span>{countWords(textData.content)} 单词</span>
                {searchResults.length > 0 && (
                  <span className="search-info">
                    {currentSearchIndex + 1} / {searchResults.length} 个匹配
                  </span>
                )}
              </div>
            </div>
            
            <div className="toolbar-right">
              <button 
                className="toolbar-btn" 
                onClick={this.handleCopyText}
                title="复制文本 (Ctrl+C)"
              >
                <FaCopy />
              </button>
              
              <button 
                className="toolbar-btn" 
                onClick={this.handleSaveText}
                title="保存文本"
              >
                <FaDownload />
              </button>
              
              <button 
                className={`toolbar-btn ${isSearchMode ? 'active' : ''}`}
                onClick={this.toggleSearchMode}
                title="搜索文本 (Ctrl+F)"
              >
                <FaSearch />
              </button>
              
              <button 
                className="toolbar-btn" 
                onClick={this.decreaseFontSize}
                title="减小字体 (-)"
              >
                A⁻
              </button>
              
              <button 
                className="toolbar-btn" 
                onClick={this.increaseFontSize}
                title="增大字体 (+)"
              >
                A⁺
              </button>
              
              <button 
                className="toolbar-btn close-btn" 
                onClick={this.props.onClose}
                title="关闭 (ESC)"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* 搜索栏 */}
          {isSearchMode && (
            <div className="text-preview-search-bar">
              <input
                type="text"
                placeholder="搜索文本内容..."
                value={searchKeyword}
                onChange={this.handleSearchChange}
                className="text-preview-search-input"
                autoFocus
              />
              <div className="text-preview-search-controls">
                {searchResults.length > 0 && (
                  <>
                    <button 
                      className="text-preview-search-nav-btn"
                      onClick={this.prevSearchResult}
                      title="上一个"
                    >
                      ↑
                    </button>
                    <button 
                      className="text-preview-search-nav-btn"
                      onClick={this.nextSearchResult}
                      title="下一个"
                    >
                      ↓
                    </button>
                  </>
                )}
                <button 
                  className="text-preview-search-close"
                  onClick={() => this.setState({ isSearchMode: false, searchKeyword: '', searchResults: [] })}
                  title="关闭搜索"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          {/* 文本容器 */}
          <div className="preview-text-container">
            <div 
              className="preview-text-content"
              style={textStyle}
            >
              {typeof displayText === 'string' ? displayText : displayText}
            </div>
          </div>

          {/* 快捷键提示 */}
          <div className="preview-shortcuts">
            <span>ESC / 空格: 关闭</span>
            <span>+/-: 字体大小</span>
            <span>Ctrl+F: 搜索</span>
            <span>0: 重置字体</span>
            {isSearchMode && <span>Enter: 下一个结果</span>}
          </div>
        </div>
      </div>
    );
  }
}

export default TextPreview; 