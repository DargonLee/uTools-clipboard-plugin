import React from 'react';

/**
 * 分类Tab组件
 * 支持六大分类，点击切换
 */
const categories = [
  { key: 'all', label: '全部' },
  { key: 'text', label: '文本' },
  { key: 'image', label: '图片' },
  { key: 'file', label: '文件' },
  { key: 'link', label: '链接' },
  { key: 'favorite', label: '收藏' },
];

class CategoryTabs extends React.Component {
  render() {
    const { active, onChange } = this.props;
    return (
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${active === cat.key ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'}`}
            onClick={() => onChange && onChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    );
  }
}

export default CategoryTabs; 