import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { truncateText, countCharacters, countLines } from '../utils/TextUtils';
import CardHeader from './CardHeader';

/**
 * 文本卡片组件
 * 展示文本信息，包含复制、收藏、删除等操作
 * Props:
 *   - item: 文本数据对象 { _id, content, time, favorite, type }
 *   - onCopy: 复制回调函数
 *   - onToggleFavorite: 收藏/取消收藏回调函数
 *   - onDelete: 删除回调函数
 */
class TextCard extends React.Component {
  render() {
    const { item, onCopy, onToggleFavorite, onDelete } = this.props;

    // 如果没有传入 item，显示空状态
    if (!item) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <div className="text-6xl mb-4">📋</div>
          <div className="text-lg font-medium">暂无文本内容</div>
          <div className="text-sm mt-2">复制文本后会自动出现在这里</div>
        </div>
      );
    }

    return (
      <div className="group rounded-lg p-4 border transition-all duration-200 ease-in-out transform hover:-translate-y-0.5
                     border-gray-200 hover:border-blue-300 hover:shadow-md
                     dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:shadow-gray-900/20">
        
        {/* 使用 CardHeader 组件 */}
        <CardHeader
          item={item}
          icon={<FaFileAlt className="w-4 h-4" />}
          typeName="文本"
          typeColor="blue"
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
        
        {/* 文本内容 */}
        <div className="mb-3">
          <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed break-words">
            {truncateText(item.content, 200)}
          </div>
        </div>
        
        {/* 文本统计信息 */}
        <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
          <span>{countCharacters(item.content)} 字符</span>
          {item.content && countLines(item.content) > 1 && (
            <span>{countLines(item.content)} 行</span>
          )}
        </div>
      </div>
    );
  }
}

export default TextCard; 