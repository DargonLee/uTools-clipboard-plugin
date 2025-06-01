import React from 'react';
import { FaCopy, FaStar, FaRegStar, FaTrashAlt } from 'react-icons/fa';
import { formatTime } from '../utils/TimeUtils';

/**
 * 卡片头部组件
 * 包含左侧信息（图标、类型、时间、收藏状态）和右侧操作按钮（复制、收藏、删除）
 * Props:
 *   - item: 数据对象 { _id, content, time, favorite, type }
 *   - icon: 类型图标组件
 *   - typeName: 类型名称（如"文本"、"链接"等）
 *   - typeColor: 类型标签颜色配置，默认为蓝色
 *   - showActions: 是否显示右侧操作按钮，默认为 true
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 *   - extraActions: 额外的操作按钮（可选）
 */
class CardHeader extends React.Component {
  render() {
    const { 
      item, 
      icon, 
      typeName, 
      typeColor = 'blue',
      showActions = true,
      onCopy, 
      onToggleFavorite, 
      onDelete,
      extraActions = []
    } = this.props;

    // 类型标签颜色配置
    const typeColorClasses = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      orange: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
      red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    };

    return (
      <div className="flex items-center justify-between mb-3">
        {/* 左侧信息区域 */}
        <div className="flex items-center space-x-3">
          {/* 类型图标 */}
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          
          {/* 类型标签 */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                           ${typeColorClasses[typeColor] || typeColorClasses.blue}`}>
            {typeName}
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
        
        {/* 右侧操作按钮区域 */}
        {showActions && (
          <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            {/* 额外操作按钮 */}
            {extraActions.map((action, index) => (
              <button
                key={index}
                className={action.className}
                onClick={action.onClick}
                title={action.title}
              >
                {action.icon}
              </button>
            ))}
            
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
            
            {/* 收藏/取消收藏按钮 - 点击收藏后隐藏 */}
            {!item.favorite && (
              <button
                className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 
                          transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 
                          bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-400 focus:ring-gray-500"
                onClick={() => onToggleFavorite && onToggleFavorite(item)}
                title="添加到收藏"
              >
                <FaRegStar className="w-3 h-3" />
              </button>
            )}
            
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
        )}
      </div>
    );
  }
}

export default CardHeader; 