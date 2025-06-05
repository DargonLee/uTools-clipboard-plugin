import React from 'react';
import { FaLink, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';
import { truncateText, isLink } from '../../utils/TextUtils';
import CardHeader from './CardHeader';
import './LinkCard.css';

/**
 * 链接卡片组件
 * 展示链接信息，包含复制、收藏、删除、访问等操作
 * Props:
 *   - item: 链接数据对象 { _id, content, time, favorite, type }
 *   - selected: 是否选中状态
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 */
class LinkCard extends React.Component {
  // 获取当前主题状态
  getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark');
  }

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
    const { item, selected, onCopy, onToggleFavorite, onDelete } = this.props;
    const isDark = this.getCurrentTheme();

    // 如果没有传入 item，显示空状态
    if (!item) {
      return (
        <div className={`empty-state ${isDark ? 'dark' : ''}`}>
          <div className="empty-state-icon">🔗</div>
          <div className="empty-state-title">暂无链接内容</div>
          <div className="empty-state-subtitle">复制链接后会自动出现在这里</div>
        </div>
      );
    }

    const domain = this.extractDomain(item.content);
    const title = this.getLinkTitle(item.content);
    const isValidLink = isLink(item.content);

    // 为CardHeader准备额外的操作按钮
    const extraActions = [];
    if (isValidLink) {
      extraActions.push({
        icon: <FaExternalLinkAlt />,
        onClick: this.handleOpenLink,
        title: "访问链接",
        className: "action-btn open-link-btn",
      });
    }

    return (
      <div className={`link-card ${isDark ? 'dark' : ''} ${selected ? 'selected' : ''}`}>
        
        {/* 使用 CardHeader 组件 */}
        <CardHeader
          item={item}
          icon={<FaGlobe />}
          typeName="链接"
          typeColor="purple"
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          extraActions={extraActions}
        />
        
        {/* 链接内容 */}
        <div className="link-info">
          {/* 链接标题与图标 */}
          <div className={`link-title ${isDark ? 'dark' : ''}`}>
            <FaLink className="link-title-icon" />
            {title}
          </div>
          
          {/* 域名显示 */}
          <div className={`link-domain ${isDark ? 'dark' : ''}`}>
            {domain}
          </div>
          
          {/* 完整链接（截断显示） */}
          <div className={`link-url ${isDark ? 'dark' : ''}`}>
            {truncateText(item.content, 150)}
          </div>
        </div>
        
        {/* 链接统计信息 */}
        <div className={`link-stats ${isDark ? 'dark' : ''}`}>
          <span>{item.content.length} 字符</span>
          {isValidLink && (
            <span className="valid-link">
              <FaGlobe className="status-icon" />
              有效链接
            </span>
          )}
          {!isValidLink && (
            <span className="invalid-link">
              <FaLink className="status-icon error" />
              无效链接
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default LinkCard; 