import React from 'react';
import './ThemeSelector.css';

class ThemeSelector extends React.Component {
  render() {
    const { themeMode, onThemeChange } = this.props;

    return (
      <div className="theme-selector">
        <div 
          className={`theme-option ${themeMode === 'light' ? 'active' : ''}`}
          onClick={() => onThemeChange('light')}
        >
          <div className="theme-preview light"></div>
          <span className="theme-label">浅色</span>
        </div>
        <div 
          className={`theme-option ${themeMode === 'dark' ? 'active' : ''}`}
          onClick={() => onThemeChange('dark')}
        >
          <div className="theme-preview dark"></div>
          <span className="theme-label">深色</span>
        </div>
        <div 
          className={`theme-option ${themeMode === 'auto' ? 'active' : ''}`}
          onClick={() => onThemeChange('auto')}
        >
          <div className="theme-preview auto"></div>
          <span className="theme-label">自动</span>
        </div>
      </div>
    );
  }
}

export default ThemeSelector; 