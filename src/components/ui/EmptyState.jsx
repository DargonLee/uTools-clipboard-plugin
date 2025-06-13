import React from 'react';
import './EmptyState.css';

/**
 * 空状态组件
 * 无内容时展示插画和提示
 */
class EmptyState extends React.Component {
  render() {
    return (
      <div className="empty-state">
        <h2 className="empty-state-title">剪贴板历史为空</h2>
        <p className="empty-state-subtitle">
          开始复制文本、图片或文件，它们将自动显示在这里。
        </p>
        <div className="hotkey-tips">
          <div className="hotkey-tip">
            <span className="hotkey-key">悬停</span> + <span className="hotkey-key">空格</span>
            <span className="hotkey-desc">快速预览内容</span>
          </div>
          <div className="hotkey-tip">
            <span className="hotkey-key">↑</span> / <span className="hotkey-key">↓</span>
            <span className="hotkey-desc">选择项目</span>
          </div>
          <div className="hotkey-tip">
            <span className="hotkey-key">Enter</span>
            <span className="hotkey-desc">复制到剪贴板</span>
          </div>
        </div>
        
        <div className="startup-tip">
          <div className="startup-tip-title">设置开机自启</div>
          <div className="startup-tip-content">
            点击右上角 <span className="tip-icon">⋮</span> → 插件应用设置 → 勾选"跟随主程序同时启动运行"
          </div>
        </div>
      </div>
    );
  }
}

export default EmptyState; 