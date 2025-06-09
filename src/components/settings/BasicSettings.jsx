import React from 'react';
import { FaCog } from 'react-icons/fa';
import SettingSwitch from './SettingSwitch';
import './BasicSettings.css';

class BasicSettings extends React.Component {
  render() {
    const { 
      autoListen, 
      showOnStartup, 
      historyLimit, 
      subscriptionPlan,
      onToggleSwitch, 
      onSelectChange,
      isFeatureAvailable,
      onPremiumFeatureClick
    } = this.props;

    return (
      <div className="setting-section">
        <div className="setting-section-header">
          <FaCog className="setting-section-icon" />
          <h2 className="setting-section-title">基本设置</h2>
        </div>
        
        <div className="setting-items">

          {/* <div className="setting-item">
            <div className="setting-item-info">
              <h3 className="setting-item-title">自动监听剪贴板</h3>
              <p className="setting-item-description">实时监听系统剪贴板变化并记录</p>
            </div>
            <SettingSwitch
              settingName="autoListen"
              isActive={autoListen}
              onToggle={onToggleSwitch}
              isFeatureAvailable={isFeatureAvailable}
              onPremiumClick={onPremiumFeatureClick}
            />
          </div> */}

          {/* <div className="setting-item">
            <div className="setting-item-info">
              <h3 className="setting-item-title">启动时显示</h3>
              <p className="setting-item-description">程序启动时自动显示主界面</p>
            </div>
            <SettingSwitch
              settingName="showOnStartup"
              isActive={showOnStartup}
              onToggle={onToggleSwitch}
              isFeatureAvailable={isFeatureAvailable}
              onPremiumClick={onPremiumFeatureClick}
            />
          </div> */}

          <div className="setting-item">
            <div className="setting-item-info">
              <h3 className="setting-item-title">历史记录数量限制</h3>
              <p className="setting-item-description">最多保存的剪贴板记录数量</p>
            </div>
            <select 
              className="setting-select"
              value={historyLimit}
              onChange={(e) => onSelectChange('historyLimit', parseInt(e.target.value))}
            >
              <option value={100}>100 条</option>
              <option value={500}>500 条</option>
              <option value={1000}>1000 条</option>
              <option value={5000}>5000 条 {subscriptionPlan === 'free' && '(专业版)'}</option>
              <option value={-1}>无限制 {subscriptionPlan === 'free' && '(专业版)'}</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicSettings; 