import React from 'react';
import EmptyState from './EmptyState';

/**
 * 内容状态组件
 * 处理加载状态、空状态和历史记录列表的展示
 * Props:
 *   - isLoading: 是否正在加载
 *   - history: 历史记录数组
 *   - searchKeyword: 搜索关键词
 *   - selectedType: 选中的类型
 *   - renderHistoryItem: 渲染历史记录项的函数
 *   - enterAction: 调试信息（可选）
 */
class ContentState extends React.Component {
  render() {
    const { 
      isLoading, 
      history, 
      searchKeyword, 
      selectedType, 
      renderHistoryItem,
      enterAction 
    } = this.props;

    // 是否是搜索或过滤导致的结果为空
    const isSearchResultEmpty = !isLoading && history.length === 0 && (searchKeyword || selectedType !== 'all');

    return (
      <>
        {/* 加载状态 */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
            <span className="ml-4 text-lg text-secondary">加载中...</span>
          </div>
        )}

        {/* 搜索结果为空的状态 */}
        {isSearchResultEmpty && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
              没有找到匹配的记录
            </div>
            <div className="text-gray-500 dark:text-gray-600 text-sm">
              尝试调整或清空搜索/过滤条件
            </div>
          </div>
        )}
        
        {/* 真正无历史记录的空状态 */}
        {!isLoading && history.length === 0 && !isSearchResultEmpty && (
          <EmptyState />
        )}

        {/* 历史记录列表 */}
        {!isLoading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item, index) => renderHistoryItem(item, index))}
          </div>
        )}
      </>
    );
  }
}

export default ContentState; 