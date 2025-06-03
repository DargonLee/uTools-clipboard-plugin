import React from 'react';
import { FaPalette } from 'react-icons/fa';
import SettingSection from './SettingSection';
import SettingSwitch from './SettingSwitch';
import ThemeSelector from './ThemeSelector';

class AppearanceSettings extends React.Component {
  render() {
    const { 
      themeMode,
      compactMode,
      showPreview,
      enableStickyHeader,
      onThemeChange,
      onToggleSwitch,
      isFeatureAvailable,
      onPremiumFeatureClick
    } = this.props;

    return (
      <SettingSection icon={<FaPalette />} title="外观">
        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">主题模式</h3>
            <ThemeSelector 
              themeMode={themeMode}
              onThemeChange={onThemeChange}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">紧凑模式</h3>
            <p className="setting-item-description">减少界面元素间距，显示更多内容</p>
          </div>
          <SettingSwitch
            settingName="compactMode"
            isActive={compactMode}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">显示预览</h3>
            <p className="setting-item-description">在列表中显示内容预览</p>
          </div>
          <SettingSwitch
            settingName="showPreview"
            isActive={showPreview}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>

        <div className="setting-item">
          <div className="setting-item-info">
            <h3 className="setting-item-title">头部悬停</h3>
            <p className="setting-item-description">向上滚动时固定搜索栏和过滤栏</p>
          </div>
          <SettingSwitch
            settingName="enableStickyHeader"
            isActive={enableStickyHeader}
            onToggle={onToggleSwitch}
            isFeatureAvailable={isFeatureAvailable}
            onPremiumClick={onPremiumFeatureClick}
          />
        </div>
      </SettingSection>
    );
  }
}

export default AppearanceSettings;