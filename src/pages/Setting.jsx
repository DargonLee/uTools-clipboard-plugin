import React from 'react';
import { 
  FaArrowLeft, 
  FaCog, 
  FaFilter, 
  FaKeyboard, 
  FaPalette, 
  FaDatabase, 
  FaHeart,
  FaAlipay,
  FaWeixin 
} from 'react-icons/fa';
import './Setting.css';

class Setting extends React.Component {
  state = {
    // 基本设置
    autoListen: true,
    showOnStartup: false,
    historyLimit: 500,
    
    // 内容过滤
    recordText: true,
    recordImages: true,
    recordFiles: true,
    filterSensitive: true,
    minTextLength: 3,
    
    // 外观设置
    themeMode: 'light', // light, dark, auto
    compactMode: false,
    showPreview: true,
    enableStickyHeader: true, // 控制头部悬停功能
    
    // 数据管理
    maxSaveTime: 30, // 天数
  };

  componentDidMount() {
    // 从 settingsService 加载已保存的设置
    this.loadSettings();
    
    // 如果父组件传入了 enableStickyHeader 值，使用它来初始化状态
    if (this.props.enableStickyHeader !== undefined) {
      this.setState({ enableStickyHeader: this.props.enableStickyHeader });
    }
  }

  // 从 settingsService 加载设置
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

  // 保存设置到 settingsService
  saveSettings = () => {
    try {
      const settingsToSave = {
        autoListen: this.state.autoListen,
        showOnStartup: this.state.showOnStartup,
        historyLimit: this.state.historyLimit,
        recordText: this.state.recordText,
        recordImages: this.state.recordImages,
        recordFiles: this.state.recordFiles,
        filterSensitive: this.state.filterSensitive,
        minTextLength: this.state.minTextLength,
        themeMode: this.state.themeMode,
        compactMode: this.state.compactMode,
        showPreview: this.state.showPreview,
        enableStickyHeader: this.state.enableStickyHeader,
        maxSaveTime: this.state.maxSaveTime,
      };
      
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

  // 切换开关状态
  handleToggleSwitch = (settingName) => {
    this.setState(prevState => ({
      [settingName]: !prevState[settingName]
    }), () => {
      // 状态更新完成后保存设置
      this.saveSettings();
    });
    
    // 如果是头部悬停设置，通知父组件
    if (settingName === 'enableStickyHeader' && this.props.onStickyHeaderChange) {
      this.props.onStickyHeaderChange(!this.state[settingName]);
    }
    
    // 显示提示
    const settingNames = {
      autoListen: '自动监听剪贴板',
      showOnStartup: '启动时显示',
      recordText: '记录文本内容',
      recordImages: '记录图片内容',
      recordFiles: '记录文件路径',
      filterSensitive: '过滤敏感信息',
      compactMode: '紧凑模式',
      showPreview: '显示预览',
      enableStickyHeader: '头部悬停功能'
    };
    
    const name = settingNames[settingName] || settingName;
    const newValue = !this.state[settingName];
    console.log(`${name} 已${newValue ? '开启' : '关闭'}`);
  };

  // 选择主题
  handleThemeChange = (theme) => {
    this.setState({ themeMode: theme }, () => {
      this.saveSettings();
    });
    console.log('主题已切换到:', theme);
  };

  // 滑块变化
  handleRangeChange = (settingName, value) => {
    this.setState({ [settingName]: parseInt(value) }, () => {
      this.saveSettings();
    });
  };

  // 下拉选择变化
  handleSelectChange = (settingName, value) => {
    this.setState({ [settingName]: value }, () => {
      this.saveSettings();
    });
  };

  // 返回主页
  handleGoBack = () => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    }
  };

  // 重置设置
  handleReset = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      try {
        const success = window.AppClipboard?.settingsService?.resetSettings();
        if (success) {
          // 重置成功后，重新加载设置到组件状态
          const defaultSettings = window.AppClipboard?.settingsService?.getDefaultSettings();
          if (defaultSettings) {
            this.setState(defaultSettings);
            console.log('设置已重置为默认值');
            
            // 如果重置了头部悬停设置，通知父组件
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

  // 支付二维码弹窗
  handleShowPayment = (type) => {
    console.log(`显示${type === 'alipay' ? '支付宝' : '微信'}打赏码`);
    // 这里可以实现弹窗逻辑
  };

  // 清除所有设置数据
  handleClearAllSettings = () => {
    if (confirm('确定要清除所有保存的设置数据吗？此操作不可恢复！')) {
      try {
        const success = window.AppClipboard?.settingsService?.clearAllSettings();
        if (success) {
          console.log('所有设置数据已清除');
          alert('设置数据已清除，请重新配置设置');
          // 重置为默认值
          this.handleReset();
        } else {
          alert('清除设置数据失败，请重试');
        }
      } catch (error) {
        console.error('清除设置数据失败:', error);
        alert('清除设置数据失败，请重试');
      }
    }
  };

  // 导出设置数据
  handleExportSettings = () => {
    try {
      const dataStr = window.AppClipboard?.settingsService?.exportSettings();
      if (dataStr) {
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // 创建下载链接
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

  // 导入设置数据
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
              // 导入成功后重新加载设置
              this.loadSettings();
              console.log('设置数据导入成功');
              alert('设置数据导入成功！');
              
              // 如果导入的设置包含头部悬停设置，通知父组件
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

  // 清空剪贴板历史记录
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

  // 渲染开关组件
  renderSwitch = (settingName, isActive) => {
    return (
      <button
        className={`switch ${isActive ? 'active' : ''}`}
        onClick={() => this.handleToggleSwitch(settingName)}
        aria-label={isActive ? '关闭' : '开启'}
      />
    );
  };

  render() {
    const {
      autoListen,
      showOnStartup,
      historyLimit,
      recordText,
      recordImages,
      recordFiles,
      filterSensitive,
      minTextLength,
      themeMode,
      compactMode,
      showPreview,
      enableStickyHeader,
      maxSaveTime
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
            <button className="reset-btn" onClick={this.handleReset}>
              重置默认
            </button>
          </div>

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
                    <option value={-1}>无限制</option>
                  </select>
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
                    <h3 className="setting-item-title">记录文本内容</h3>
                    <p className="setting-item-description">自动保存复制的文本内容</p>
                  </div>
                  {this.renderSwitch('recordText', recordText)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">记录图片内容</h3>
                    <p className="setting-item-description">自动保存复制的图片文件</p>
                  </div>
                  {this.renderSwitch('recordImages', recordImages)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">记录文件路径</h3>
                    <p className="setting-item-description">记录复制的文件和文件夹路径</p>
                  </div>
                  {this.renderSwitch('recordFiles', recordFiles)}
                </div>

                <div className="setting-item">
                  <div className="setting-item-info">
                    <h3 className="setting-item-title">过滤敏感信息</h3>
                    <p className="setting-item-description">自动过滤密码、密钥等敏感内容</p>
                  </div>
                  {this.renderSwitch('filterSensitive', filterSensitive)}
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
                    <p className="setting-item-description">向上滚动时固定搜索栏和过滤栏，便于快速操作</p>
                  </div>
                  {this.renderSwitch('enableStickyHeader', enableStickyHeader)}
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
                    <h3 className="setting-item-title">存储位置</h3>
                    <p className="setting-item-description">~/Library/Application Support/uTools/clipboard</p>
                  </div>
                  <button className="btn-base btn-secondary">更改</button>
                </div>

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
                    <option value={-1}>永久保存</option>
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
                    <button className="btn-base btn-danger" onClick={this.handleClearAllSettings}>
                      清除所有设置
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 支持开发 */}
            <div className="setting-section">
              <div className="setting-section-header">
                <FaHeart className="setting-section-icon" />
                <h2 className="setting-section-title">支持开发</h2>
              </div>
              
              <div className="support-section">
                <div className="support-intro">
                  <h3 className="support-title">如果这个工具对您有帮助</h3>
                  <p className="support-description">您的支持是我持续优化和开发新功能的动力 ❤️</p>
                </div>
                
                <div className="payment-options">
                  <div className="payment-option" onClick={() => this.handleShowPayment('alipay')}>
                    <div className="payment-icon alipay">
                      <div className="text-center">
                        <FaAlipay />
                        <div className="text-white text-xs font-medium mt-1">支付宝</div>
                      </div>
                    </div>
                    <div className="payment-label">点击查看二维码</div>
                  </div>
                  
                  <div className="payment-option" onClick={() => this.handleShowPayment('wechat')}>
                    <div className="payment-icon wechat">
                      <div className="text-center">
                        <FaWeixin />
                        <div className="text-white text-xs font-medium mt-1">微信</div>
                      </div>
                    </div>
                    <div className="payment-label">点击查看二维码</div>
          </div>
        </div>

                <div className="support-info">
                  <p className="support-tips">
                    💡 您的每一份支持都会用于：<br />
                    • 持续优化用户体验和性能<br />
                    • 开发更多实用功能和特性<br />
                    • 维护服务器运营和技术支持
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 设置页底部 */}
          <div className="setting-footer">
            <div className="version-info">
              版本 1.0.0 • 最后更新: 2024-01-15
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">帮助文档</a>
              <a href="#" className="footer-link">反馈建议</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Setting;
