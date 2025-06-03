import React from 'react';
import {
  SettingHeader,
  SubscriptionStatus,
  BasicSettings,
  SmartCategorization,
  ContentFilter,
  SecuritySettings,
  KeyboardSettings,
  AppearanceSettings,
  AdvancedSettings,
  DataManagement,
  SubscriptionPlans,
  SettingFooter
} from '../components';
import './Setting.css';

class Setting extends React.Component {
  state = {
    // 基本设置
    autoListen: true,
    showOnStartup: false,
    historyLimit: 500,
    
    // 智能分类与标签
    smartCategorization: true,
    autoTagging: true,
    customTags: [],
    
    // 内容过滤（简化）
    contentFilter: 'smart', // 'off', 'basic', 'smart', 'advanced'
    filterSensitive: true,
    minTextLength: 3,
    
    // 安全与隐私
    encryptSensitiveData: false, // 付费功能
    biometricLock: false,        // 付费功能
    autoLock: 300,
    
    // 外观设置
    themeMode: 'auto',
    compactMode: false,
    showPreview: true,
    enableStickyHeader: true,
    
    // 高级功能
    cloudSync: false,      // 付费功能
    teamSharing: false,    // 付费功能
    deviceSync: false,     // 付费功能
    smartSearch: true,
    regexSearch: false,    // 付费功能
    
    // 数据管理
    maxSaveTime: 30,
    
    // 订阅状态
    subscriptionPlan: 'free', // 'free', 'pro', 'team'
    subscriptionExpiry: null,
    isTrialActive: false,
  };

  // 检查功能是否可用
  isFeatureAvailable = (feature) => {
    const { subscriptionPlan } = this.state;
    
    const proFeatures = [
      'encryptSensitiveData', 'biometricLock', 'cloudSync', 
      'deviceSync', 'regexSearch'
    ];
    
    const teamFeatures = [
      'teamSharing'
    ];
    
    if (proFeatures.includes(feature)) {
      return subscriptionPlan === 'pro' || subscriptionPlan === 'team';
    }
    
    if (teamFeatures.includes(feature)) {
      return subscriptionPlan === 'team';
    }
    
    return true;
  };

  // 处理付费功能点击
  handlePremiumFeatureClick = (feature) => {
    if (!this.isFeatureAvailable(feature)) {
      this.showUpgradeModal(feature);
      return;
    }
    
    // 正常处理功能开关
    this.handleToggleSwitch(feature);
  };

  // 显示升级弹窗
  showUpgradeModal = (feature) => {
    const featureNames = {
      encryptSensitiveData: '数据加密',
      biometricLock: '生物识别锁定',
      cloudSync: '云同步',
      deviceSync: '多设备同步',
      teamSharing: '团队共享',
      regexSearch: '正则表达式搜索'
    };
    
    const featureName = featureNames[feature] || feature;
    alert(`${featureName} 是专业版功能，请升级后使用。`);
  };

  componentDidMount() {
    this.loadSettings();
    
    if (this.props.enableStickyHeader !== undefined) {
      this.setState({ enableStickyHeader: this.props.enableStickyHeader });
    }
  }

  loadSettings = () => {
    try {
      const savedSettings = window.AppClipboard?.settingsService?.loadSettings();
      if (savedSettings) {
        this.setState(savedSettings);
        console.log('Setting.jsx 已加载保存的设置:', savedSettings);
      }
    } catch (error) {
      console.error('Setting.jsx 加载设置失败:', error);
    }
  }

  saveSettings = () => {
    try {
      const settingsToSave = { ...this.state };
      delete settingsToSave.subscriptionPlan;
      delete settingsToSave.subscriptionExpiry;
      delete settingsToSave.isTrialActive;
      
      const success = window.AppClipboard?.settingsService?.saveSettings(settingsToSave);
      if (success) {
        console.log('Setting.jsx 设置已保存:', settingsToSave);
      } else {
        console.warn('Setting.jsx 设置保存失败');
      }
    } catch (error) {
      console.error('Setting.jsx 保存设置失败:', error);
    }
  }

  handleToggleSwitch = (settingName) => {
    this.setState(prevState => ({
      [settingName]: !prevState[settingName]
    }), () => {
      this.saveSettings();
    });
    
    if (settingName === 'enableStickyHeader' && this.props.onStickyHeaderChange) {
      this.props.onStickyHeaderChange(!this.state[settingName]);
    }
  };

  handleThemeChange = (theme) => {
    this.setState({ themeMode: theme }, () => {
      this.saveSettings();
    });
    console.log('主题已切换到:', theme);
  };

  handleRangeChange = (settingName, value) => {
    this.setState({ [settingName]: parseInt(value) }, () => {
      this.saveSettings();
    });
  };

  handleSelectChange = (settingName, value) => {
    this.setState({ [settingName]: value }, () => {
      this.saveSettings();
    });
  };

  handleGoBack = () => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    }
  };

  handleReset = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      try {
        const success = window.AppClipboard?.settingsService?.resetSettings();
        if (success) {
          const defaultSettings = window.AppClipboard?.settingsService?.getDefaultSettings();
          if (defaultSettings) {
            this.setState(defaultSettings);
            console.log('设置已重置为默认值');
            
            if (this.props.onStickyHeaderChange) {
              this.props.onStickyHeaderChange(defaultSettings.enableStickyHeader);
            }
          }
        } else {
          alert('重置设置失败，请重试');
        }
      } catch (error) {
        console.error('重置设置失败:', error);
        alert('重置设置失败，请重试');
      }
    }
  };

  // 开始试用
  handleStartTrial = () => {
    this.setState({
      subscriptionPlan: 'pro',
      isTrialActive: true,
      subscriptionExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后
    });
    alert('专业版试用已开启，您有7天的试用期！');
  };

  // 升级订阅
  handleUpgrade = (plan) => {
    console.log(`升级到 ${plan} 计划`);
    // 这里会调用支付接口
  };

  handleExportSettings = () => {
    try {
      const dataStr = window.AppClipboard?.settingsService?.exportSettings();
      if (dataStr) {
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `clipboard-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('设置数据已导出');
      } else {
        alert('没有找到可导出的设置数据');
      }
    } catch (error) {
      console.error('导出设置数据失败:', error);
      alert('导出设置数据失败，请重试');
    }
  };

  handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const success = window.AppClipboard?.settingsService?.importSettings(e.target.result);
            if (success) {
              this.loadSettings();
              console.log('设置数据导入成功');
              alert('设置数据导入成功！');
              
              if (this.props.onStickyHeaderChange) {
                this.props.onStickyHeaderChange(this.state.enableStickyHeader);
              }
            } else {
              alert('导入的文件格式错误，请检查文件内容');
            }
          } catch (error) {
            console.error('导入设置数据失败:', error);
            alert('导入的文件格式错误，请检查文件内容');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  handleClearAll = async () => {
    if (confirm('确定要清空所有剪贴板历史记录吗？此操作不可恢复！')) {
      try {
        await window.AppClipboard?.clipboardService?.deleteAllHistory();
        console.log('剪贴板历史记录已清空');
        alert('剪贴板历史记录已清空');
      } catch (error) {
        console.error('清空剪贴板历史记录失败:', error);
        alert('清空失败，请重试');
      }
    }
  };

  render() {
    const {
      autoListen,
      showOnStartup,
      historyLimit,
      smartCategorization,
      autoTagging,
      contentFilter,
      filterSensitive,
      minTextLength,
      encryptSensitiveData,
      biometricLock,
      autoLock,
      themeMode,
      compactMode,
      showPreview,
      enableStickyHeader,
      cloudSync,
      teamSharing,
      deviceSync,
      smartSearch,
      regexSearch,
      maxSaveTime,
      subscriptionPlan,
      isTrialActive
    } = this.state;

    return (
      <div className="setting-page">
        <div className="setting-container">
          
          {/* 设置页标题栏 */}
          <SettingHeader
            subscriptionPlan={subscriptionPlan}
            onGoBack={this.handleGoBack}
            onStartTrial={this.handleStartTrial}
            onReset={this.handleReset}
          />

          {/* 订阅状态 */}
          {subscriptionPlan !== 'free' && (
            <SubscriptionStatus
              subscriptionPlan={subscriptionPlan}
              isTrialActive={isTrialActive}
              subscriptionExpiry={this.state.subscriptionExpiry}
            />
          )}

          {/* 设置分组 */}
          <div className="setting-sections">
            
            {/* 基本设置 */}
            <BasicSettings
              autoListen={autoListen}
              showOnStartup={showOnStartup}
              historyLimit={historyLimit}
              subscriptionPlan={subscriptionPlan}
              onToggleSwitch={this.handleToggleSwitch}
              onSelectChange={this.handleSelectChange}
              isFeatureAvailable={this.isFeatureAvailable}
              onPremiumFeatureClick={this.handlePremiumFeatureClick}
            />

            {/* 智能分类与标签 */}
            <SmartCategorization
              smartCategorization={smartCategorization}
              autoTagging={autoTagging}
              onToggleSwitch={this.handleToggleSwitch}
              isFeatureAvailable={this.isFeatureAvailable}
              onPremiumFeatureClick={this.handlePremiumFeatureClick}
            />

            {/* 内容过滤 */}
            <ContentFilter
              contentFilter={contentFilter}
              filterSensitive={filterSensitive}
              minTextLength={minTextLength}
              onToggleSwitch={this.handleToggleSwitch}
              onSelectChange={this.handleSelectChange}
              onRangeChange={this.handleRangeChange}
              isFeatureAvailable={this.isFeatureAvailable}
              onPremiumFeatureClick={this.handlePremiumFeatureClick}
            />

            {/* 安全与隐私 */}
            <SecuritySettings
              encryptSensitiveData={encryptSensitiveData}
              biometricLock={biometricLock}
              autoLock={autoLock}
              onToggleSwitch={this.handleToggleSwitch}
              onSelectChange={this.handleSelectChange}
              isFeatureAvailable={this.isFeatureAvailable}
              onPremiumFeatureClick={this.handlePremiumFeatureClick}
            />

            {/* 快捷键设置 */}
            <KeyboardSettings />

            {/* 外观设置 */}
            <AppearanceSettings
              themeMode={themeMode}
              compactMode={compactMode}
              showPreview={showPreview}
              enableStickyHeader={enableStickyHeader}
              onThemeChange={this.handleThemeChange}
              onToggleSwitch={this.handleToggleSwitch}
              isFeatureAvailable={this.isFeatureAvailable}
              onPremiumFeatureClick={this.handlePremiumFeatureClick}
            />

            {/* 高级功能 */}
            <AdvancedSettings
              cloudSync={cloudSync}
              deviceSync={deviceSync}
              teamSharing={teamSharing}
              smartSearch={smartSearch}
              regexSearch={regexSearch}
              onToggleSwitch={this.handleToggleSwitch}
              isFeatureAvailable={this.isFeatureAvailable}
              onPremiumFeatureClick={this.handlePremiumFeatureClick}
            />

            {/* 数据管理 */}
            <DataManagement
              maxSaveTime={maxSaveTime}
              subscriptionPlan={subscriptionPlan}
              onSelectChange={this.handleSelectChange}
              onExportSettings={this.handleExportSettings}
              onImportSettings={this.handleImportSettings}
              onClearAll={this.handleClearAll}
            />

            {/* 订阅管理 */}
            {subscriptionPlan === 'free' && (
              <SubscriptionPlans
                onUpgrade={this.handleUpgrade}
              />
            )}

          </div>

          {/* 设置页底部 */}
          <SettingFooter />
        </div>
      </div>
    );
  }
}

export default Setting;
