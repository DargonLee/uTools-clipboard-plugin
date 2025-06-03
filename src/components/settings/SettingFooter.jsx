import React from 'react';
import './SettingFooter.css';

class SettingFooter extends React.Component {
  render() {
    return (
      <div className="setting-footer">
        <div className="version-info">
          版本 1.0.0 • 最后更新: 2024-01-15
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">帮助文档</a>
          <a href="#" className="footer-link">反馈建议</a>
          <a href="#" className="footer-link">隐私政策</a>
        </div>
      </div>
    );
  }
}

export default SettingFooter; 