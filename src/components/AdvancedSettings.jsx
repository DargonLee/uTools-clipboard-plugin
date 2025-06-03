import React from 'react';
import { FaCloud } from 'react-icons/fa';
import SettingSection from './SettingSection';
import SettingSwitch from './SettingSwitch';

class AdvancedSettings extends React.Component {
  render() {
    const { 
      cloudSync,
      deviceSync,
      teamSharing,
      smartSearch,
      regexSearch,
      onToggleSwitch,
      isFeatureAvailable,
      onPremiumFeatureClick
    } = this.props;

    return (
      <SettingSection icon={<FaCloud />} title="高级功能">
        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">云同步</h3>
            <p className="setting-item-description">将剪贴板历史同步到云端</p>
          </div>
          <SettingSwitch
            settingName="cloudSync"
            isActive={cloudSync}
            isPremium={true}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">多设备同步</h3>
            <p className="setting-item-description">在多个设备间同步剪贴板</p>
          </div>
          <SettingSwitch
            settingName="deviceSync"
            isActive={deviceSync}
            isPremium={true}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">团队共享</h3>
            <p className="setting-item-description">与团队成员共享剪贴板内容</p>
          </div>
          <SettingSwitch
            settingName="teamSharing"
            isActive={teamSharing}
            isPremium={true}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">智能搜索</h3>
            <p className="setting-item-description">支持模糊搜索和内容理解</p>
          </div>
          <SettingSwitch
            settingName="smartSearch"
            isActive={smartSearch}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">正则表达式搜索</h3>
            <p className="setting-item-description">使用正则表达式进行高级搜索</p>
          </div>
          <SettingSwitch
            settingName="regexSearch"
            isActive={regexSearch}
            isPremium={true}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>
      </SettingSection>
    );
  }
}

export default AdvancedSettings; 