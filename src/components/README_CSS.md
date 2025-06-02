# CSS 架构指南

## 概述

本项目采用原生 CSS 进行样式开发，通过 CSS 变量、模块化和 BEM 命名规范来构建可维护的样式系统。

## 目录结构

```
src/
├── main.css              # 全局样式和 CSS 变量定义
└── components/
    ├── Common.css         # 公共组件样式
    ├── ComponentName.jsx  # React 组件
    └── ComponentName.css  # 组件对应的样式文件
```

## CSS 变量系统

### 主题色
```css
--primary-color: #368CFF;     /* 主色调 */
--primary-hover: #2563eb;     /* 悬停状态 */
--primary-light: #dbeafe;     /* 浅色背景 */
```

### 文本颜色
```css
--text-primary: #1f2937;      /* 主要文本 */
--text-secondary: #6b7280;    /* 次要文本 */
--text-muted: #9ca3af;        /* 弱化文本 */
```

### 背景色
```css
--bg-primary: #ffffff;        /* 主背景 */
--bg-secondary: #f9fafb;      /* 次背景 */
--bg-tertiary: #f3f4f6;       /* 第三层背景 */
```

### 间距系统
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

## 命名规范

### BEM 方法论
采用 Block__Element--Modifier 命名约定：

```css
/* Block 块 */
.card {}

/* Element 元素 */
.card__header {}
.card__content {}
.card__footer {}

/* Modifier 修饰符 */
.card--large {}
.card__header--highlighted {}
```

### 示例
```css
.clipboard-card {}
.clipboard-card__header {}
.clipboard-card__content {}
.clipboard-card__actions {}
.clipboard-card--selected {}
.clipboard-card__header--highlighted {}
```

## 响应式设计

### 断点定义
- **移动端**: `max-width: 768px`
- **平板**: `768px - 1024px`  
- **桌面**: `min-width: 1024px`

### 使用方式
```css
/* 移动端优先 */
.component {
  padding: var(--spacing-sm);
}

/* 平板 */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-md);
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .component {
    padding: var(--spacing-lg);
  }
}
```

## 深色模式

### 实现方式
通过 `data-theme` 属性切换主题：

```css
/* 浅色模式（默认） */
.component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* 深色模式会自动继承变量 */
[data-theme="dark"] {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}
```

### JavaScript 切换
```javascript
// 切换主题
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
}
```

## 布局系统

### Flexbox 布局
```css
.flex-container {
  display: flex;
  gap: var(--spacing-md);
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Grid 布局
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}
```

## 组件样式示例

### 卡片组件
```css
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card__header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.card__content {
  padding: var(--spacing-md);
}

.card--selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}
```

### 按钮组件
```css
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition);
}

.btn--primary {
  background-color: var(--primary-color);
  color: white;
}

.btn--primary:hover {
  background-color: var(--primary-hover);
}

.btn--secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

## 工具类

### 常用工具类
已在 `main.css` 中定义了一些常用的工具类：

```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: var(--spacing-sm); }
.gap-4 { gap: var(--spacing-md); }
.p-2 { padding: var(--spacing-sm); }
.p-4 { padding: var(--spacing-md); }
.rounded { border-radius: var(--border-radius); }
.shadow { box-shadow: var(--shadow-md); }
.transition { transition: var(--transition); }
```

## 最佳实践

### 1. 使用 CSS 变量
✅ **推荐**
```css
.component {
  color: var(--text-primary);
  padding: var(--spacing-md);
}
```

❌ **不推荐**
```css
.component {
  color: #1f2937;
  padding: 16px;
}
```

### 2. 遵循 BEM 命名
✅ **推荐**
```css
.search-bar {}
.search-bar__input {}
.search-bar__button {}
.search-bar--focused {}
```

❌ **不推荐**
```css
.searchBar {}
.searchInput {}
.searchBtn {}
.focused {}
```

### 3. 移动端优先
✅ **推荐**
```css
.component {
  font-size: var(--text-sm);
}

@media (min-width: 768px) {
  .component {
    font-size: var(--text-base);
  }
}
```

### 4. 避免深层嵌套
✅ **推荐**
```css
.card {}
.card__header {}
.card__content {}
```

❌ **不推荐**
```css
.card .header .title .text {}
```

### 5. 使用逻辑属性
✅ **推荐**
```css
.component {
  margin-inline: auto;
  padding-block: var(--spacing-md);
}
```

## 调试技巧

### 1. 使用浏览器开发者工具
- 检查 CSS 变量的计算值
- 使用 Grid/Flexbox 调试工具
- 测试响应式断点

### 2. CSS 变量调试
```css
/* 临时调试变量 */
:root {
  --debug-color: red;
}

.debug {
  border: 2px solid var(--debug-color) !important;
}
```

### 3. 性能优化
- 避免使用 `!important`
- 减少重排和重绘
- 使用 `will-change` 属性优化动画
- 合理使用 CSS 变量，避免过度嵌套

## 组件开发流程

1. **创建组件文件**: `ComponentName.jsx`
2. **创建样式文件**: `ComponentName.css`
3. **定义 BEM 类名**: 遵循命名规范
4. **使用 CSS 变量**: 保持一致性
5. **添加响应式**: 移动端优先
6. **测试深色模式**: 确保变量正确
7. **代码审查**: 检查命名和结构
