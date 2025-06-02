import React from 'react';
import { FaCopy, FaStar, FaRegStar, FaTrashAlt } from 'react-icons/fa';
import { formatTime } from '../utils/TimeUtils';
import './CardHeader.css';

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
  // 获取当前主题状态
  getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark');
  }

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

    const isDark = this.getCurrentTheme();

    return (
      <div className="card-header">
        {/* 左侧信息区域 */}
        <div className="header-info">
          {/* 类型图标 */}
          {icon && (
            <div className={`type-icon ${isDark ? 'dark' : 'light'}`}>
              {icon}
            </div>
          )}
          
          {/* 类型标签 */}
          <span className={`type-tag ${typeColor} ${isDark ? 'dark' : ''}`}>
            {typeName}
          </span>
          
          {/* 时间信息 */}
          <span className={`time-info ${isDark ? 'dark' : ''}`}>
            {formatTime(item.time)}
          </span>
          
          {/* 收藏状态显示（仅在已收藏时显示） */}
          {item.favorite && (
            <FaStar className="favorite-star" title="已收藏" />
          )}
        </div>
        
        {/* 右侧操作按钮区域 */}
        {showActions && (
          <div className="actions-container">
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
              className="action-btn copy-btn"
              onClick={() => onCopy && onCopy(item)}
              title="复制到剪贴板"
            >
              <FaCopy className="copy-icon" />
            </button>
            
            {/* 收藏/取消收藏按钮 - 点击收藏后隐藏 */}
            {!item.favorite && (
              <button
                className={`action-btn favorite-btn ${isDark ? 'dark' : ''}`}
                onClick={() => onToggleFavorite && onToggleFavorite(item)}
                title="添加到收藏"
              >
                <FaRegStar className="favorite-icon" />
              </button>
            )}
            
            {/* 删除按钮 */}
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete && onDelete(item)}
              title="删除"
            >
              <FaTrashAlt className="delete-icon" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default CardHeader; 