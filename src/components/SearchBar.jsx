import React from 'react';
import { FaSearch } from 'react-icons/fa';

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

    return (
      <div className={`mb-4 ${className}`}>
        <div className="relative">
          {/* 搜索图标 */}
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          
          {/* 搜索输入框 */}
          <input
            ref={this.inputRef}
            type="text"
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                     rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-colors duration-200
                     placeholder-gray-400 dark:placeholder-gray-500"
            value={searchKeyword}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
          
          {/* 清除按钮 */}
          {searchKeyword && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
                       text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                       w-6 h-6 flex items-center justify-center rounded-full
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={this.handleClearSearch}
              title="清除搜索 (Esc)"
            >
              <span className="text-sm font-medium">✕</span>
            </button>
          )}
        </div>
        
        {/* 搜索提示信息 */}
        {searchKeyword && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            搜索关键词: "{searchKeyword}" | 按 Esc 键清除搜索
          </div>
        )}
      </div>
    );
  }
}

export default SearchBar; 