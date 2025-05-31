import React from 'react';
import { FaFileAlt, FaCopy, FaStar, FaRegStar, FaTrashAlt } from 'react-icons/fa';
import { formatTime } from '../utils/TimeUtils';
import { truncateText, countCharacters, countLines } from '../utils/TextUtils';

/**
 * 文本卡片组件
 * 展示文本信息，包含复制、收藏、删除等操作
 * Props:
 *   - item: 文本数据对象 { _id, content, time, favorite, type }
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 */
class TextCard extends React.Component {
  render() {
    const { item, onCopy, onToggleFavorite, onDelete } = this.props;

    // 如果没有传入 item，显示空状态
    if (!item) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <div className="text-6xl mb-4">📋</div>
          <div className="text-lg font-medium">暂无文本内容</div>
          <div className="text-sm mt-2">复制文本后会自动出现在这里</div>
        </div>
      );
    }

    return (
      <div className="group bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 
                     hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md 
                     transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
        
        <div className="flex items-start justify-between">
          {/* 左侧内容区域 */}
          <div className="flex-1 min-w-0 pr-4">
            {/* 顶部信息行 */}
            <div className="flex items-center space-x-3 mb-3">
              {/* 文本图标 */}
              <div className="flex-shrink-0">
                <FaFileAlt className="text-gray-500 dark:text-gray-400 w-4 h-4" />
              </div>
              
              {/* 类型标签 */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                             bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                文本
              </span>
              
              {/* 时间信息 */}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(item.time)}
              </span>
              
              {/* 收藏状态显示（仅在已收藏时显示） */}
              {item.favorite && (
                <FaStar className="text-yellow-500 w-3 h-3" title="已收藏" />
              )}
            </div>
            
            {/* 文本内容 */}
            <div className="mb-3">
              <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed break-words">
                {truncateText(item.content, 200)}
              </div>
            </div>
            
            {/* 文本统计信息 */}
            <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
              <span>{countCharacters(item.content)} 字符</span>
              {item.content && countLines(item.content) > 1 && (
                <span>{countLines(item.content)} 行</span>
              )}
            </div>
          </div>

          {/* 右侧操作按钮区域 */}
          <div className="flex flex-col space-y-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            {/* 复制按钮 */}
            <button
              className="flex items-center justify-center w-8 h-8 bg-[#368CFF] hover:bg-blue-600 
                       text-white rounded-md transition-all duration-200 transform hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={() => onCopy && onCopy(item)}
              title="复制到剪贴板"
            >
              <FaCopy className="w-3 h-3" />
            </button>
            
            {/* 收藏/取消收藏按钮 */}
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 
                        transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                item.favorite 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500' 
                  : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-400 focus:ring-gray-500'
              }`}
              onClick={() => onToggleFavorite && onToggleFavorite(item)}
              title={item.favorite ? '取消收藏' : '添加到收藏'}
            >
              {item.favorite ? (
                <FaStar className="w-3 h-3" />
              ) : (
                <FaRegStar className="w-3 h-3" />
              )}
            </button>
            
            {/* 删除按钮 */}
            <button
              className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 
                       text-white rounded-md transition-all duration-200 transform hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              onClick={() => onDelete && onDelete(item)}
              title="删除"
            >
              <FaTrashAlt className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default TextCard; 