import React from 'react';
import { FaDatabase, FaTrashAlt } from 'react-icons/fa';
import SettingSection from './SettingSection';
import './DataManagement.css';

class DataManagement extends React.Component {
  render() {
    const { 
      maxSaveTime,
      subscriptionPlan,
      onSelectChange,
      onClearAll
    } = this.props;

    return (
      <SettingSection icon={<FaDatabase />} title="数据管理">
        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">最长保存时间</h3>
            <p className="setting-item-description">超过指定时间的历史记录将自动清理</p>
          </div>
          <select 
            className="setting-select"
            value={maxSaveTime}
            onChange={(e) => onSelectChange('maxSaveTime', parseInt(e.target.value))}
          >
            <option value={7}>7 天</option>
            <option value={30}>30 天</option>
            <option value={90}>90 天</option>
            <option value={180}>6 个月</option>
            <option value={365}>1 年</option>
            <option value={-1}>永久保存 {subscriptionPlan === 'free' && '(专业版)'}</option>
          </select>
        </div>

        <div className="setting-item clear-data-section">
          <div className="clear-data-info">
            <h3 className="setting-item-title">清空数据</h3>
            <p className="setting-item-description">永久删除所有剪贴板历史记录</p>
          </div>
          <button className="clear-data-button" onClick={onClearAll}>
            <FaTrashAlt className="clear-data-icon" />
            <span>清空历史记录</span>
          </button>
        </div>
      </SettingSection>
    );
  }
}

export default DataManagement; 