import React from 'react';
import { FaLock } from 'react-icons/fa';
import SettingSection from './SettingSection';
import SettingSwitch from './SettingSwitch';

class SecuritySettings extends React.Component {
  render() {
    const { 
      encryptSensitiveData,
      biometricLock,
      autoLock,
      onToggleSwitch,
      onSelectChange,
      isFeatureAvailable,
      onPremiumFeatureClick
    } = this.props;

    return (
      <SettingSection icon={<FaLock />} title="安全与隐私">
        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">数据加密</h3>
            <p className="setting-item-description">使用AES-256加密存储敏感数据</p>
          </div>
          <SettingSwitch
            settingName="encryptSensitiveData"
            isActive={encryptSensitiveData}
            isPremium={true}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">生物识别锁定</h3>
            <p className="setting-item-description">使用Face ID或Touch ID保护应用</p>
          </div>
          <SettingSwitch
            settingName="biometricLock"
            isActive={biometricLock}
            isPremium={true}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">自动锁定时间</h3>
            <p className="setting-item-description">无操作后自动锁定应用的时间</p>
          </div>
          <select 
            className="setting-select"
            value={autoLock}
            onChange={(e) => onSelectChange('autoLock', parseInt(e.target.value))}
          >
            <option value={60}>1 分钟</option>
            <option value={300}>5 分钟</option>
            <option value={900}>15 分钟</option>
            <option value={1800}>30 分钟</option>
            <option value={-1}>从不</option>
          </select>
        </div>
      </SettingSection>
    );
  }
}

export default SecuritySettings; 