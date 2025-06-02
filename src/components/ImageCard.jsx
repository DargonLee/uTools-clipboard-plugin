import React from 'react';
import { FaImage, FaExpand } from 'react-icons/fa';
import CardHeader from './CardHeader';
import './ImageCard.css';

/**
 * 图片卡片组件
 * 展示图片信息，包含复制、收藏、删除等操作
 * Props:
 *   - item: 图片数据对象 { _id, content, time, favorite, type }
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 *   - onHover: 鼠标进入回调函数
 *   - onLeave: 鼠标离开回调函数
 */
class ImageCard extends React.Component {
  // 获取当前主题状态
  getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark');
  }

  // 获取图片尺寸信息
  getImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = src;
    });
  }

  // 格式化文件大小
  formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  render() {
    const { item, onCopy, onToggleFavorite, onDelete, onHover, onLeave } = this.props;
    const isDark = this.getCurrentTheme();

    // 如果没有传入 item，显示空状态
    if (!item) {
      return (
        <div className={`empty-state ${isDark ? 'dark' : ''}`}>
          <div className="empty-state-icon">🖼️</div>
          <div className="empty-state-title">暂无图片内容</div>
          <div className="empty-state-subtitle">复制图片后会自动出现在这里</div>
        </div>
      );
    }

    return (
      <div 
        className={`image-card ${isDark ? 'dark' : ''}`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        
        {/* 使用 CardHeader 组件 */}
        <CardHeader
          item={item}
          icon={<FaImage />}
          typeName="图片"
          typeColor="green"
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
        
        {/* 图片内容 */}
        <div className="image-content">
          <div className={`image-preview ${isDark ? 'dark' : ''}`}>
            <img 
              src={item.content} 
              alt="剪贴板图片"
              className="preview-image"
              loading="lazy"
            />
          </div>
        </div>
        
        {/* 图片信息统计 */}
        <div className={`image-stats ${isDark ? 'dark' : ''}`}>
          <span>图片文件</span>
          {item.size && (
            <span>{this.formatFileSize(item.size)}</span>
          )}
          {item.dimensions && (
            <span>{item.dimensions.width} × {item.dimensions.height}</span>
          )}
          <span className="preview-tip">悬停后按空格预览</span>
        </div>
      </div>
    );
  }
}

export default ImageCard; 