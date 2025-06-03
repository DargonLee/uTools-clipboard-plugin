import React from 'react';
import { FaCrown } from 'react-icons/fa';
import './SubscriptionPlans.css';

class SubscriptionPlans extends React.Component {
  render() {
    const { onUpgrade } = this.props;

    return (
      <div className="setting-section subscription-section">
        <div className="setting-section-header">
          <FaCrown className="setting-section-icon crown" />
          <h2 className="setting-section-title">升级专业版</h2>
        </div>
        
        <div className="subscription-plans">
          <div className="plan-card pro">
            <h3>专业版</h3>
            <div className="price">¥19/月</div>
            <ul className="features">
              <li>数据加密保护</li>
              <li>生物识别锁定</li>
              <li>云同步</li>
              <li>多设备同步</li>
              <li>无限历史记录</li>
              <li>正则表达式搜索</li>
            </ul>
            <button className="btn-base btn-primary" onClick={() => onUpgrade('pro')}>
              立即升级
            </button>
          </div>
          
          <div className="plan-card team">
            <h3>团队版</h3>
            <div className="price">¥99/月</div>
            <ul className="features">
              <li>包含专业版所有功能</li>
              <li>团队共享</li>
              <li>团队管理</li>
              <li>高级分析</li>
              <li>优先技术支持</li>
            </ul>
            <button className="btn-base btn-primary" onClick={() => onUpgrade('team')}>
              联系销售
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SubscriptionPlans; 