import React from 'react';
import { FaLink, FaCopy, FaStar, FaRegStar, FaTrashAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { formatTime } from '../utils/TimeUtils';
import { truncateText, isLink } from '../utils/TextUtils';

/**
 * 链接卡片组件
 * 展示链接信息，包含复制、收藏、删除、访问等操作
 * Props:
 *   - item: 链接数据对象 { _id, content, time, favorite, type }
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 */
class LinkCard extends React.Component {
  // 提取域名
  extractDomain = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (error) {
      return '无效链接';
    }
  }

  // 获取链接标题（从 URL 路径提取或使用域名）
  getLinkTitle = (url) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      if (pathname && pathname !== '/') {
        // 从路径中提取有意义的部分作为标题
        const segments = pathname.split('/').filter(segment => segment);
        if (segments.length > 0) {
          return segments[segments.length - 1].replace(/[-_]/g, ' ');
        }
      }
      return this.extractDomain(url);
    } catch (error) {
      return '链接';
    }
  }

  // 打开链接
  handleOpenLink = () => {
    const { item } = this.props;
    if (isLink(item.content)) {
      window.open(item.content, '_blank');
    }
  }

  render() {
    const { item, onCopy, onToggleFavorite, onDelete } = this.props;

    // 如果没有传入 item，显示空状态
    if (!item) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <div className="text-6xl mb-4">🔗</div>
          <div className="text-lg font-medium">暂无链接内容</div>
          <div className="text-sm mt-2">复制链接后会自动出现在这里</div>
        </div>
      );
    }

    const domain = this.extractDomain(item.content);
    const title = this.getLinkTitle(item.content);
    const isValidLink = isLink(item.content);

    return (
      <div className="group rounded-lg p-4 border transition-all duration-200 ease-in-out transform hover:-translate-y-0.5
                     border-gray-200 hover:border-blue-300 hover:shadow-md
                     dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:shadow-gray-900/20">
        
        <div className="flex items-start justify-between">
          {/* 左侧内容区域 */}
          <div className="flex-1 min-w-0 pr-4">
            {/* 顶部信息行 */}
            <div className="flex items-center space-x-3 mb-3">
              {/* 链接图标 */}
              <div className="flex-shrink-0">
                <FaLink className="text-blue-500 dark:text-blue-400 w-4 h-4" />
              </div>
              
              {/* 类型标签 */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                             bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                链接
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
            
            {/* 链接内容 */}
            <div className="mb-3">
              {/* 链接标题 */}
              <div className="text-gray-800 dark:text-gray-200 text-sm font-medium mb-1 break-words">
                {title}
              </div>
              
              {/* 域名显示 */}
              <div className="text-blue-600 dark:text-blue-400 text-xs mb-2 break-all">
                {domain}
              </div>
              
              {/* 完整链接（截断显示） */}
              <div className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed break-all">
                {truncateText(item.content, 150)}
              </div>
            </div>
            
            {/* 链接统计信息 */}
            <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
              <span>{item.content.length} 字符</span>
              {isValidLink && <span className="text-green-500">✓ 有效链接</span>}
              {!isValidLink && <span className="text-red-500">⚠ 无效链接</span>}
            </div>
          </div>

          {/* 右侧操作按钮区域 */}
          <div className="flex flex-col space-y-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            {/* 访问链接按钮 */}
            {isValidLink && (
              <button
                className="flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 
                         text-white rounded-md transition-all duration-200 transform hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                onClick={this.handleOpenLink}
                title="访问链接"
              >
                <FaExternalLinkAlt className="w-3 h-3" />
              </button>
            )}
            
            {/* 复制按钮 */}
            <button
              className="flex items-center justify-center w-8 h-8 bg-[#368CFF] hover:bg-blue-600 
                       text-white rounded-md transition-all duration-200 transform hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={() => onCopy && onCopy(item)}
              title="复制链接"
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

export default LinkCard; 