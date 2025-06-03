import React from 'react';
import { FaKeyboard } from 'react-icons/fa';
import SettingSection from './SettingSection';
import './KeyboardSettings.css';

class KeyboardSettings extends React.Component {
  render() {
    return (
      <SettingSection icon={<FaKeyboard />} title="快捷键">
        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">打开主界面</h3>
            <p className="setting-item-description">快速调用剪贴板管理界面</p>
          </div>
          <div className="shortcut-keys">
            <span className="key-badge">⌘</span>
            <span className="key-badge">⇧</span>
            <span className="key-badge">V</span>
            <button className="modify-shortcut-btn">修改</button>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">快速粘贴历史</h3>
            <p className="setting-item-description">显示历史记录快速选择菜单</p>
          </div>
          <div className="shortcut-keys">
            <span className="key-badge">⌘</span>
            <span className="key-badge">⇧</span>
            <span className="key-badge">H</span>
            <button className="modify-shortcut-btn">修改</button>
          </div>
        </div>
      </SettingSection>
    );
  }
}

export default KeyboardSettings; 