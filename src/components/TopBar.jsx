import React from 'react';
// import { FaBell, FaCog } from 'react-icons/fa'; // 如需图标可解开注释

/**
 * 顶部导航栏组件
 * 包含App名称、Logo、通知和设置按钮
 */
class TopBar extends React.Component {
  render() {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-sm rounded-t-xl">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="w-7 h-7" />
          <span className="font-bold text-lg text-blue-500">剪贴板工具</span>
        </div>
        <div className="flex items-center gap-3">
          <button title="通知" className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
            {/* <FaBell /> */}
            <span role="img" aria-label="通知">🔔</span>
          </button>
          <button title="设置" className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
            {/* <FaCog /> */}
            <span role="img" aria-label="设置">⚙️</span>
          </button>
        </div>
      </div>
    );
  }
}

export default TopBar; 