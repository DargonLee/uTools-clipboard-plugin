import React from 'react';

/**
 * 剪贴板内容卡片组件
 * 支持类型：文本、图片、链接、文件
 * 操作按钮区预留
 */
class ClipboardCard extends React.Component {
  render() {
    // props: type, content, time, isFavorite, onCopy, onDelete, onToggleFavorite
    const { type, content, time } = this.props;
    return (
      <div className="rounded-xl shadow-md p-4 flex flex-col bg-white dark:bg-gray-800 transition border border-transparent hover:border-blue-400 hover:shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* 类型icon+标签 */}
            <span className="text-blue-400 font-bold text-xs">{type}</span>
          </div>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <div className="flex-1 min-h-[32px] max-h-[48px] overflow-hidden text-sm text-gray-900 dark:text-gray-100">
          {/* 内容区，后续可根据类型优化展示 */}
          {content}
        </div>
        <div className="flex justify-end gap-2 mt-2">
          {/* 操作按钮区，后续补充 */}
        </div>
      </div>
    );
  }
}

export default ClipboardCard; 