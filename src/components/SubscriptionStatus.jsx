import React from 'react';
import { FaCrown } from 'react-icons/fa';
import './SubscriptionStatus.css';

class SubscriptionStatus extends React.Component {
  render() {
    const { subscriptionPlan, isTrialActive, subscriptionExpiry } = this.props;

    if (subscriptionPlan === 'free') {
      return null;
    }

    return (
      <div className="subscription-status">
        <div className="subscription-info">
          <FaCrown className="crown-icon" />
          <span>
            {subscriptionPlan === 'pro' ? '专业版' : '团队版'} 
            {isTrialActive ? ' (试用中)' : ''}
          </span>
        </div>
        {!isTrialActive && (
          <div className="subscription-expiry">
            到期时间: {subscriptionExpiry?.toLocaleDateString() || '永久'}
          </div>
        )}
      </div>
    );
  }
}

export default SubscriptionStatus; 