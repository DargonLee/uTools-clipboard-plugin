import React from 'react';
import { FaArrowLeft, FaCrown } from 'react-icons/fa';
import './SettingHeader.css';

class SettingHeader extends React.Component {
  render() {
    const { subscriptionPlan, onGoBack, onStartTrial, onReset } = this.props;

    return (
      <div className="setting-header">
        <div className="setting-header-left">
          <button className="back-btn" onClick={onGoBack}>
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h1 className="setting-title">设置</h1>
        </div>
        <div className="setting-header-right">
          {subscriptionPlan === 'free' && (
            <button className="trial-btn" onClick={onStartTrial}>
              <FaCrown /> 免费试用专业版
            </button>
          )}
          <button className="reset-btn" onClick={onReset}>
            重置默认
          </button>
        </div>
      </div>
    );
  }
}

export default SettingHeader; 