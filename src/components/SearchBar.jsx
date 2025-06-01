import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

/**
 * 搜索栏组件
 * 提供搜索输入和清除功能
 * Props:
 *   - searchKeyword: 当前搜索关键词
 *   - onSearch: 搜索回调函数，参数为搜索关键词
 *   - placeholder: 输入框占位符，默认为"搜索剪贴板内容..."
 *   - className: 可选的额外样式类名
 */
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  // 获取当前主题状态
  getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark');
  }

  // 处理输入变化
  handleInputChange = (e) => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(e.target.value);
    }
  }

  // 清除搜索内容
  handleClearSearch = () => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch('');
    }
    // 清除后重新聚焦输入框
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  // 处理键盘快捷键
  handleKeyDown = (e) => {
    // Escape 键清除搜索
    if (e.key === 'Escape') {
      this.handleClearSearch();
    }
  }

  // 聚焦输入框
  focus = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  render() {
    const { 
      searchKeyword, 
      placeholder = "搜索剪贴板内容...", 
      className = "" 
    } = this.props;

    const isDark = this.getCurrentTheme();

    return (
      <div className={`search-bar ${className}`}>
        <div className="search-input-container">
          {/* 搜索图标 */}
          <FaSearch className={`search-icon ${isDark ? 'dark' : ''}`} />
          
          {/* 搜索输入框 */}
          <input
            ref={this.inputRef}
            type="text"
            placeholder={placeholder}
            className={`search-input ${isDark ? 'dark' : ''}`}
            value={searchKeyword}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
          
          {/* 清除按钮 */}
          {searchKeyword && (
            <button
              className={`clear-button ${isDark ? 'dark' : ''}`}
              onClick={this.handleClearSearch}
              title="清除搜索 (Esc)"
            >
              <span className="clear-button-text">✕</span>
            </button>
          )}
        </div>
        
        {/* 搜索提示信息 */}
        {searchKeyword && (
          <div className={`search-hint ${isDark ? 'dark' : ''}`}>
            搜索关键词: "{searchKeyword}" | 按 Esc 键清除搜索
          </div>
        )}
      </div>
    );
  }
}

export default SearchBar; 