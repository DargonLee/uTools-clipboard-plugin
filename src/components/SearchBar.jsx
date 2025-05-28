import React from 'react';

/**
 * 搜索栏组件
 * 圆角设计，内置搜索icon，支持输入实时过滤
 */
class SearchBar extends React.Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 mb-4">
        <span className="mr-2 text-blue-400">🔍</span>
        <input
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100"
          type="text"
          placeholder="搜索剪贴板内容..."
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
        />
      </div>
    );
  }
}

export default SearchBar; 