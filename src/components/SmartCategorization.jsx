import React from 'react';
import { FaTags } from 'react-icons/fa';
import SettingSection from './SettingSection';
import SettingSwitch from './SettingSwitch';

class SmartCategorization extends React.Component {
  render() {
    const { 
      smartCategorization, 
      autoTagging,
      onToggleSwitch,
      isFeatureAvailable,
      onPremiumFeatureClick
    } = this.props;

    return (
      <SettingSection icon={<FaTags />} title="智能分类">
        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">AI智能分类</h3>
            <p className="setting-item-description">自动识别并分类不同类型的内容</p>
          </div>
          <SettingSwitch
            settingName="smartCategorization"
            isActive={smartCategorization}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">自动标签</h3>
            <p className="setting-item-description">基于内容自动添加相关标签</p>
          </div>
          <SettingSwitch
            settingName="autoTagging"
            isActive={autoTagging}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>
      </SettingSection>
    );
  }
}

export default SmartCategorization; 