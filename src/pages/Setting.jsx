import React from 'react';
import { 
  FaArrowLeft, 
  FaCog, 
  FaFilter, 
  FaKeyboard, 
  FaPalette, 
  FaDatabase, 
  FaCrown,
  FaLock,
  FaCloud,
  FaSearch,
  FaTags,
  FaUsers
} from 'react-icons/fa';
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

  // 渲染开关组件
  renderSwitch = (settingName, isActive, isPremium = false) => {
    const available = isPremium ? this.isFeatureAvailable(settingName) : true;
    
    return (
      <div className="setting-switch-container">
        <button
          className={`switch ${isActive ? 'active' : ''} ${!available ? 'disabled' : ''}`}
          onClick={() => isPremium ? this.handlePremiumFeatureClick(settingName) : this.handleToggleSwitch(settingName)}
          disabled={!available}
          aria-label={isActive ? '关闭' : '开启'}
        />
        {isPremium && !available && (
          <FaCrown className="premium-icon" title="专业版功能" />
        )}
      </div>
    );
  };

  // 渲染内容过滤选项
  renderContentFilterOptions = () => {
    const { contentFilter } = this.state;
    const options = [
      { value: 'off', label: '关闭', desc: '记录所有内容' },
      { value: 'basic', label: '基础', desc: '过滤明显敏感内容' },
      { value: 'smart', label: '智能', desc: 'AI智能识别敏感内容' },
      { value: 'advanced', label: '高级', desc: '严格过滤，可能误判' }
    ];

    return (
      <div className="filter-options">
        {options.map(option => (
          <label key={option.value} className={`filter-option ${contentFilter === option.value ? 'active' : ''}`}>
            <input
              type="radio"
              name="contentFilter"
              value={option.value}
              checked={contentFilter === option.value}
              onChange={(e) => this.handleSelectChange('contentFilter', e.target.value)}
            />
            <div className="option-content">
              <div className="option-label">{option.label}</div>
              <div className="option-desc">{option.desc}</div>
            </div>
          </label>
        ))}
      </div>
    );
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
          <div className="setting-header">
            <div className="setting-header-left">
              <button className="back-btn" onClick={this.handleGoBack}>
                <FaArrowLeft className="text-gray-500" />
              </button>
              <h1 className="setting-title">设置</h1>
            </div>
            <div className="setting-header-right">
              {subscriptionPlan === 'free' && (
                <button className="trial-btn" onClick={this.handleStartTrial}>
                  <FaCrown /> 免费试用专业版
                </button>
              )}
              <button className="reset-btn" onClick={this.handleReset}>
                重置默认
              </button>
            </div>
          </div>

          {/* 订阅状态 */}
          {subscriptionPlan !== 'free' && (
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
                  到期时间: {this.state.subscriptionExpiry?.toLocaleDateString() || '永久'}
                </div>
              )}
            </div>
          )}

          {/* 设置分组 */}
          <div className="setting-sections">
            
            {/* 基本设置 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaCog className="setting-section-icon" />
                <h2 className="setting-section-title">基本设置</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">自动监听剪贴板</h3>
                    <p className="setting-item-description">实时监听系统剪贴板变化并记录</p>
                  </div>
                  {this.renderSwitch('autoListen', autoListen)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">启动时显示</h3>
                    <p className="setting-item-description">程序启动时自动显示主界面</p>
                  </div>
                  {this.renderSwitch('showOnStartup', showOnStartup)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">历史记录数量限制</h3>
                    <p className="setting-item-description">最多保存的剪贴板记录数量</p>
                  </div>
                  <select 
                    className="setting-select"
                    value={historyLimit}
                    onChange={(e) => this.handleSelectChange('historyLimit', parseInt(e.target.value))}
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

            {/* 智能分类与标签 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaTags className="setting-section-icon" />
                <h2 className="setting-section-title">智能分类</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">AI智能分类</h3>
                    <p className="setting-item-description">自动识别并分类不同类型的内容</p>
                  </div>
                  {this.renderSwitch('smartCategorization', smartCategorization)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">自动标签</h3>
                    <p className="setting-item-description">基于内容自动添加相关标签</p>
                  </div>
                  {this.renderSwitch('autoTagging', autoTagging)}
                </div>
              </div>
            </div>

            {/* 内容过滤 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaFilter className="setting-section-icon" />
                <h2 className="setting-section-title">内容过滤</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">过滤级别</h3>
                    <p className="setting-item-description">选择内容过滤的严格程度</p>
                  </div>
                </div>
                
                <div className="setting-item-full">
                  {this.renderContentFilterOptions()}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">最小文本长度</h3>
                    <p className="setting-item-description">忽略少于指定字符数的文本</p>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={minTextLength}
                      className="setting-range"
                      onChange={(e) => this.handleRangeChange('minTextLength', e.target.value)}
                    />
                    <div className="range-labels">
                      <span className="range-label">1 字符</span>
                      <span className="range-current">当前: {minTextLength} 字符</span>
                      <span className="range-label">50 字符</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 安全与隐私 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaLock className="setting-section-icon" />
                <h2 className="setting-section-title">安全与隐私</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">数据加密</h3>
                    <p className="setting-item-description">使用AES-256加密存储敏感数据</p>
                  </div>
                  {this.renderSwitch('encryptSensitiveData', encryptSensitiveData, true)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">生物识别锁定</h3>
                    <p className="setting-item-description">使用Face ID或Touch ID保护应用</p>
                  </div>
                  {this.renderSwitch('biometricLock', biometricLock, true)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">自动锁定时间</h3>
                    <p className="setting-item-description">无操作后自动锁定应用的时间</p>
                  </div>
                  <select 
                    className="setting-select"
                    value={autoLock}
                    onChange={(e) => this.handleSelectChange('autoLock', parseInt(e.target.value))}
                  >
                    <option value={60}>1 分钟</option>
                    <option value={300}>5 分钟</option>
                    <option value={900}>15 分钟</option>
                    <option value={1800}>30 分钟</option>
                    <option value={-1}>从不</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 快捷键设置 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaKeyboard className="setting-section-icon" />
                <h2 className="setting-section-title">快捷键</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">打开主界面</h3>
                    <p className="setting-item-description">快速调用剪贴板管理界面</p>
                  </div>
                  <div className="shortcut-keys">
                    <span className="key-badge">⌘</span>
                    <span className="key-badge">⇧</span>
                    <span className="key-badge">V</span>
                    <button className="modify-shortcut-btn">修改</button>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">快速粘贴历史</h3>
                    <p className="setting-item-description">显示历史记录快速选择菜单</p>
                  </div>
                  <div className="shortcut-keys">
                    <span className="key-badge">⌘</span>
                    <span className="key-badge">⇧</span>
                    <span className="key-badge">H</span>
                    <button className="modify-shortcut-btn">修改</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 外观设置 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaPalette className="setting-section-icon" />
                <h2 className="setting-section-title">外观</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">主题模式</h3>
                    <div className="theme-selector">
                      <div 
                        className={`theme-option ${themeMode === 'light' ? 'active' : ''}`}
                        onClick={() => this.handleThemeChange('light')}
                      >
                        <div className="theme-preview light"></div>
                        <span className="theme-label">浅色</span>
                      </div>
                      <div 
                        className={`theme-option ${themeMode === 'dark' ? 'active' : ''}`}
                        onClick={() => this.handleThemeChange('dark')}
                      >
                        <div className="theme-preview dark"></div>
                        <span className="theme-label">深色</span>
                      </div>
                      <div 
                        className={`theme-option ${themeMode === 'auto' ? 'active' : ''}`}
                        onClick={() => this.handleThemeChange('auto')}
                      >
                        <div className="theme-preview auto"></div>
                        <span className="theme-label">自动</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">紧凑模式</h3>
                    <p className="setting-item-description">减少界面元素间距，显示更多内容</p>
                  </div>
                  {this.renderSwitch('compactMode', compactMode)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">显示预览</h3>
                    <p className="setting-item-description">在列表中显示内容预览</p>
                  </div>
                  {this.renderSwitch('showPreview', showPreview)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">头部悬停</h3>
                    <p className="setting-item-description">向上滚动时固定搜索栏和过滤栏</p>
                  </div>
                  {this.renderSwitch('enableStickyHeader', enableStickyHeader)}
                </div>
              </div>
            </div>

            {/* 高级功能 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaCloud className="setting-section-icon" />
                <h2 className="setting-section-title">高级功能</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">云同步</h3>
                    <p className="setting-item-description">将剪贴板历史同步到云端</p>
                  </div>
                  {this.renderSwitch('cloudSync', cloudSync, true)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">多设备同步</h3>
                    <p className="setting-item-description">在多个设备间同步剪贴板</p>
                  </div>
                  {this.renderSwitch('deviceSync', deviceSync, true)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">团队共享</h3>
                    <p className="setting-item-description">与团队成员共享剪贴板内容</p>
                  </div>
                  {this.renderSwitch('teamSharing', teamSharing, true)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">智能搜索</h3>
                    <p className="setting-item-description">支持模糊搜索和内容理解</p>
                  </div>
                  {this.renderSwitch('smartSearch', smartSearch)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">正则表达式搜索</h3>
                    <p className="setting-item-description">使用正则表达式进行高级搜索</p>
                  </div>
                  {this.renderSwitch('regexSearch', regexSearch, true)}
                </div>
              </div>
            </div>

            {/* 数据管理 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaDatabase className="setting-section-icon" />
                <h2 className="setting-section-title">数据管理</h2>
              </div>
              
              <div className="setting-items">
                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">最长保存时间</h3>
                    <p className="setting-item-description">超过指定时间的历史记录将自动清理</p>
                  </div>
                  <select 
                    className="setting-select"
                    value={maxSaveTime}
                    onChange={(e) => this.handleSelectChange('maxSaveTime', parseInt(e.target.value))}
                  >
                    <option value={7}>7 天</option>
                    <option value={30}>30 天</option>
                    <option value={90}>90 天</option>
                    <option value={180}>6 个月</option>
                    <option value={365}>1 年</option>
                    <option value={-1}>永久保存 {subscriptionPlan === 'free' && '(专业版)'}</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="button-group">
                    <button className="btn-base btn-primary" onClick={this.handleExportSettings}>
                      导出设置
                    </button>
                    <button className="btn-base btn-secondary" onClick={this.handleImportSettings}>
                      导入设置
                    </button>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="button-group">
                    <button className="btn-base btn-danger" onClick={this.handleClearAll}>
                      清空历史记录
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 订阅管理 */}
            {subscriptionPlan === 'free' && (
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
                    <button className="btn-base btn-primary" onClick={() => this.handleUpgrade('pro')}>
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
                    <button className="btn-base btn-primary" onClick={() => this.handleUpgrade('team')}>
                      联系销售
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 设置页底部 */}
          <div className="setting-footer">
            <div className="version-info">
              版本 1.0.0 • 最后更新: 2024-01-15
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">帮助文档</a>
              <a href="#" className="footer-link">反馈建议</a>
              <a href="#" className="footer-link">隐私政策</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
}

export default Setting;
