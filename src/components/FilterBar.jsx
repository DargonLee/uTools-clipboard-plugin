import React from 'react';
import { FaFileAlt, FaLink, FaFile, FaImage, FaStar, FaClock } from 'react-icons/fa';
import './FilterBar.css';

/**
 * 过滤按钮组件
 * 提供类型过滤和快捷操作功能
 * Props:
 *   - stats: 统计数据对象 { total, text, image, files, link, favorite }
 *   - selectedType: 当前选中的类型
 *   - searchKeyword: 当前搜索关键词
 *   - onTypeFilter: 类型过滤回调函数
 *   - onShowToday: 显示今日记录回调函数
 *   - onResetFilters: 重置筛选回调函数
 *   - onClearAll: 清空全部回调函数
 */
class FilterBar extends React.Component {
  // 获取当前主题状态
  getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark');
  }

  render() {
    const { 
      stats, 
      selectedType, 
      searchKeyword, 
      onTypeFilter, 
      onShowToday, 
      onResetFilters, 
      onClearAll 
    } = this.props;

    const isDark = this.getCurrentTheme();

    return (
      <>
        {/* 类型过滤和快捷操作 */}
        <div className="filter-buttons-container">
          <button
            className={`filter-btn ${
              selectedType === 'all' 
                ? 'active all' 
                : `inactive ${isDark ? 'dark' : ''}`
            }`}
            onClick={() => onTypeFilter('all')}
          >
            全部 ({stats.total})
          </button>
          <button
            className={`filter-btn ${
              selectedType === 'text' 
                ? 'active text' 
                : `inactive ${isDark ? 'dark' : ''}`
            }`}
            onClick={() => onTypeFilter('text')}
          >
            <FaFileAlt className="filter-btn-icon" />
            文本 ({stats.text})
          </button>
          <button
            className={`filter-btn ${
              selectedType === 'image' 
                ? 'active image' 
                : `inactive ${isDark ? 'dark' : ''}`
            }`}
            onClick={() => onTypeFilter('image')}
          >
            <FaImage className="filter-btn-icon" />
            图片 ({stats.image})
          </button>
          <button
            className={`filter-btn ${
              selectedType === 'files' 
                ? 'active files' 
                : `inactive ${isDark ? 'dark' : ''}`
            }`}
            onClick={() => onTypeFilter('files')}
          >
            <FaFile className="filter-btn-icon" />
            文件 ({stats.files})
          </button>
          <button
            className={`filter-btn ${
              selectedType === 'link' 
                ? 'active link' 
                : `inactive ${isDark ? 'dark' : ''}`
            }`}
            onClick={() => onTypeFilter('link')}
          >
            <FaLink className="filter-btn-icon" />
            链接 ({stats.link})
          </button>
          <button
            className={`filter-btn ${
              selectedType === 'favorite' 
                ? 'active favorite' 
                : `inactive ${isDark ? 'dark' : ''}`
            }`}
            onClick={() => onTypeFilter('favorite')}
          >
            <FaStar className="filter-btn-icon" />
            收藏 ({stats.favorite})
          </button>
          <button
            className={`filter-btn ${
              selectedType === 'today' 
                ? 'active today' 
                : `inactive ${isDark ? 'dark' : ''}`
            }`}
            onClick={onShowToday}
          >
            <FaClock className="filter-btn-icon" />
            今日
          </button>
        </div>

        {/* 操作按钮 */}
        <div className="action-buttons-container">
          <div className="left-actions">
            {(searchKeyword || selectedType !== 'all') && (
              <button
                className={`action-btn reset-btn ${isDark ? 'dark' : ''}`}
                onClick={onResetFilters}
              >
                重置筛选
              </button>
            )}
          </div>
          <div className="right-actions">
            <button 
              onClick={() => {
                window.AppClipboard.fileService.writeTextFile('测试文本')
              }} 
              className="action-btn test-btn"
            >
              测试按钮
            </button>
            <button
              className="action-btn clear-btn"
              onClick={onClearAll}
            >
              清空全部
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default FilterBar; 