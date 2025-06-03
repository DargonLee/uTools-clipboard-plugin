import React from 'react';
import './SettingSection.css';

class SettingSection extends React.Component {
  render() {
    const { icon, title, children, className = '' } = this.props;

    return (
      <div className={`setting-section ${className}`}>
        <div className="setting-section-header">
          {React.cloneElement(icon, { className: `setting-section-icon ${icon.props.className || ''}` })}
          <h2 className="setting-section-title">{title}</h2>
        </div>
        
        <div className="setting-items">
          {children}
        </div>
      </div>
    );
  }
}

export default SettingSection; 