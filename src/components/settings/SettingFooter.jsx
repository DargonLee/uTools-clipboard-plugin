import React from 'react';
import './SettingFooter.css';

class SettingFooter extends React.Component {
  render() {
    return (
      <div className="setting-footer">
        <div className="version-info">
          版本 0.1.0 • 最后更新: 2025-06-09
        </div>
        <div className="open-source-info">
          本插件计划在稳定版发布后开源，敬请期待
        </div>
      </div>
    );
  }
}

export default SettingFooter; 