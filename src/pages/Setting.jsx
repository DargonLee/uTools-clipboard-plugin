import React from 'react';

class Setting extends React.Component {
  state = {
    darkMode: false,
    historyLimit: 20,
    autoSync: true,
    notify: false,
  };

  handleToggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode });
  };

  render() {
    const { darkMode, historyLimit, autoSync, notify } = this.state;
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
          <img src="/logo.png" alt="avatar" className="w-16 h-16 rounded-full bg-gray-200 object-cover" />
          <div className="flex-1">
            <div className="font-bold text-lg">Lee</div>
            <div className="text-gray-400 text-sm mt-1">已登录</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">深色模式</span>
            <input type="checkbox" checked={darkMode} onChange={this.handleToggleDarkMode} className="w-5 h-5" />
            <span className="text-gray-400 text-sm">{darkMode ? '开启' : '关闭'}</span>
          </div>
        </div>

        {/* 偏好设置卡片 */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-base mb-4 text-gray-700">偏好设置</div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span>剪贴板历史容量</span>
              <span className="text-gray-400">{historyLimit}条</span>
            </div>
            <div className="flex items-center justify-between">
              <span>自动同步</span>
              <span className="text-green-500">{autoSync ? '已开启' : '关闭'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>通知提醒</span>
              <span className="text-gray-400">{notify ? '已开启' : '关闭'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Setting;
