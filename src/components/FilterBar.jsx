import React from 'react';
import { FaFileAlt, FaLink, FaFile, FaImage, FaStar, FaClock } from 'react-icons/fa';

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

    return (
      <>
        {/* 类型过滤和快捷操作 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onTypeFilter('all')}
          >
            全部 ({stats.total})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'text' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onTypeFilter('text')}
          >
            <FaFileAlt className="inline mr-1" />
            文本 ({stats.text})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'image' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onTypeFilter('image')}
          >
            <FaImage className="inline mr-1" />
            图片 ({stats.image})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'files' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onTypeFilter('files')}
          >
            <FaFile className="inline mr-1" />
            文件 ({stats.files})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'link' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onTypeFilter('link')}
          >
            <FaLink className="inline mr-1" />
            链接 ({stats.link})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'favorite' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onTypeFilter('favorite')}
          >
            <FaStar className="inline mr-1" />
            收藏 ({stats.favorite})
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'today' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={onShowToday}
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
                className="px-3 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded text-sm hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                onClick={onResetFilters}
              >
                重置筛选
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                window.AppClipboard.fileService.writeTextFile('测试文本')
              }} 
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              测试按钮
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
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