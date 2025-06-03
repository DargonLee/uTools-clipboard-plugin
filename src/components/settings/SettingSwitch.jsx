import React from 'react';
import { FaCrown } from 'react-icons/fa';
import './SettingSwitch.css';

class SettingSwitch extends React.Component {
  render() {
    const { 
      settingName, 
      isActive, 
      isPremium = false, 
      isFeatureAvailable, 
      onToggle,
      onPremiumClick 
    } = this.props;
    
    const available = isPremium ? isFeatureAvailable(settingName) : true;
    
    return (
      <div className="setting-switch-container">
        <button
          className={`switch ${isActive ? 'active' : ''} ${!available ? 'disabled' : ''}`}
          onClick={() => isPremium ? onPremiumClick(settingName) : onToggle(settingName)}
          disabled={!available}
          aria-label={isActive ? '关闭' : '开启'}
        />
        {isPremium && !available && (
          <FaCrown className="premium-icon" title="专业版功能" />
        )}
      </div>
    );
  }
}

export default SettingSwitch; 