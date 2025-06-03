import React from 'react';

/**
 * 空状态组件
 * 无内容时展示插画和提示
 */
class EmptyState extends React.Component {
  render() {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
        <div className="text-6xl mb-4">📋</div>
        <div className="text-lg font-medium">暂无剪贴板内容</div>
        <div className="text-sm mt-2">复制内容后会自动出现在这里</div>
      </div>
    );
  }
}

export default EmptyState; 