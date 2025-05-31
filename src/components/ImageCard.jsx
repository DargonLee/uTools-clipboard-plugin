import React from 'react';

/**
 * 图片卡片组件
 * 展示图片信息
 */
class ImageCard extends React.Component {
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

export default ImageCard; 