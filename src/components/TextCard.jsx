import React from 'react';
import { FaFileAlt, FaExpand } from 'react-icons/fa';
import { truncateText, countCharacters, countLines } from '../utils/TextUtils';
import CardHeader from './CardHeader';
import './TextCard.css';

/**
 * 文本卡片组件
 * 展示文本信息，包含复制、收藏、删除等操作
 * Props:
 *   - item: 文本数据对象 { _id, content, time, favorite, type }
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 *   - onHover: 鼠标进入回调函数
 *   - onLeave: 鼠标离开回调函数
 */
class TextCard extends React.Component {
  // 获取当前主题状态
  getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark');
  }

  // 检查文本是否被截断
  isTextTruncated = (originalText, truncatedText) => {
    return originalText.length > truncatedText.length;
  }

  render() {
    const { item, onCopy, onToggleFavorite, onDelete, onHover, onLeave } = this.props;
    const isDark = this.getCurrentTheme();

    // 如果没有传入 item，显示空状态
    if (!item) {
      return (
        <div className={`empty-state ${isDark ? 'dark' : ''}`}>
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">暂无文本内容</div>
          <div className="empty-state-subtitle">复制文本后会自动出现在这里</div>
        </div>
      );
    }

    const truncatedText = truncateText(item.content, 200);
    const isTruncated = this.isTextTruncated(item.content, truncatedText);

    return (
      <div 
        className={`text-card ${isDark ? 'dark' : ''}`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        
        {/* 使用 CardHeader 组件 */}
        <CardHeader
          item={item}
          icon={<FaFileAlt />}
          typeName="文本"
          typeColor="blue"
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
        
        {/* 文本内容 */}
        <div className="text-content">
          <div className={`text-content-body ${isDark ? 'dark' : ''}`}>
            {truncatedText}
          </div>
        </div>
        
        {/* 文本统计信息 */}
        <div className={`text-stats ${isDark ? 'dark' : ''}`}>
          <span>{countCharacters(item.content)} 字符</span>
          {item.content && countLines(item.content) > 1 && (
            <span>{countLines(item.content)} 行</span>
          )}
          {isTruncated && (
            <span className="preview-tip">悬停后按空格预览</span>
          )}
        </div>
      </div>
    );
  }
}

export default TextCard; 