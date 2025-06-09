import React from 'react';
import './ContentFilterOptions.css';

class ContentFilterOptions extends React.Component {
  render() {
    const { contentFilter, onSelectChange } = this.props;
    
    const options = [
      { value: 'off', label: '关闭', desc: '记录所有内容' },
      { value: 'basic', label: '基础', desc: '过滤明显敏感内容' },
      { value: 'smart', label: '智能', desc: 'AI智能识别敏感内容' },
      { value: 'advanced', label: '高级', desc: '严格过滤，可能误判' }
    ];

    return (
      <div className="filter-options">
        {options.map(option => (
          <div key={option.value} className={`filter-option ${contentFilter === option.value ? 'active' : ''}`}>
            <input
              type="radio"
              name="contentFilter"
              id={`filter-${option.value}`}
              value={option.value}
              checked={contentFilter === option.value}
              onChange={(e) => onSelectChange('contentFilter', e.target.value)}
            />
            <label htmlFor={`filter-${option.value}`} className="option-content">
              <div className="option-label">{option.label}</div>
              <div className="option-desc">{option.desc}</div>
            </label>
          </div>
        ))}
      </div>
    );
  }
}

export default ContentFilterOptions; 