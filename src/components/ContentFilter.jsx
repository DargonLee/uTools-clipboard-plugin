import React from 'react';
import { FaFilter } from 'react-icons/fa';
import SettingSection from './SettingSection';
import ContentFilterOptions from './ContentFilterOptions';
import './ContentFilter.css';

class ContentFilter extends React.Component {
  render() {
    const { 
      contentFilter, 
      minTextLength,
      onSelectChange,
      onRangeChange
    } = this.props;

    return (
      <SettingSection icon={<FaFilter />} title="内容过滤">
        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">过滤级别</h3>
            <p className="setting-item-description">选择内容过滤的严格程度</p>
          </div>
        </div>
        
        <div className="setting-item-full">
          <ContentFilterOptions 
            contentFilter={contentFilter}
            onSelectChange={onSelectChange}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">最小文本长度</h3>
            <p className="setting-item-description">忽略少于指定字符数的文本</p>
            <input
              type="range"
              min="1"
              max="50"
              value={minTextLength}
              className="setting-range"
              onChange={(e) => onRangeChange('minTextLength', e.target.value)}
            />
            <div className="range-labels">
              <span className="range-label">1 字符</span>
              <span className="range-current">当前: {minTextLength} 字符</span>
              <span className="range-label">50 字符</span>
            </div>
          </div>
        </div>
      </SettingSection>
    );
  }
}

export default ContentFilter; 