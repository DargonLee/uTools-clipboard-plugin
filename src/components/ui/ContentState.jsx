import React from 'react';

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

    return (
      <>
        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <div className="text-gray-500 dark:text-gray-400">加载中...</div>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && history.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">
              {searchKeyword || selectedType !== 'all' ? '🔍' : '📋'}
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
              {searchKeyword || selectedType !== 'all' ? '没有找到匹配的记录' : '暂无剪贴板历史'}
            </div>
            <div className="text-gray-500 dark:text-gray-600 text-sm">
              {searchKeyword || selectedType !== 'all' ? '尝试调整搜索条件' : '复制一些内容开始使用吧'}
            </div>
            {(searchKeyword || selectedType !== 'all') && (
              <div className="mt-4">
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  提示：可以尝试清空搜索条件或选择"全部"类型
                </div>
              </div>
            )}
          </div>
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