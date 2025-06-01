# CSS 架构重构说明

## 重构概述

为了提高代码的可维护性和一致性，我们将组件样式进行了重构，将公用的样式部分抽离到了 `common.css` 文件中。

## 文件结构

```
src/components/
├── common.css           # 公共样式文件
├── CardHeader.css       # 卡片头部组件样式
├── TextCard.css        # 文本卡片组件样式
├── LinkCard.css        # 链接卡片组件样式
├── SearchBar.css       # 搜索栏组件样式
├── FilterBar.css       # 过滤栏组件样式
└── README_CSS.md       # 本说明文档
```

## 公共样式文件 (common.css)

### 主要包含内容：

1. **CSS 变量定义**

   - 主题色系
   - 功能色彩（成功、警告、危险等）
   - 中性色彩和蓝色系
   - 标准间距、圆角、阴影
   - 过渡动画
2. **基础样式类**

   - `.base-card` - 卡片基础样式
   - `.empty-state` - 空状态样式
   - `.btn-base` - 按钮基础样式
   - `.input-base` - 输入框基础样式
   - `.tag-base` - 标签基础样式
   - `.text-*` - 文本样式类
3. **按钮变体**

   - `.btn-primary` - 主要按钮
   - `.btn-secondary` - 次要按钮
   - `.btn-success` - 成功按钮
   - `.btn-warning` - 警告按钮
   - `.btn-danger` - 危险按钮
4. **响应式设计**

   - 移动端适配
   - 暗色模式支持

## CSS 变量系统

### 主题色

```css
--primary-color: #368CFF;     /* 主题蓝色 */
--primary-hover: rgb(37, 99, 235);
```

### 功能色彩

```css
--success-color: rgb(34, 197, 94);   /* 成功绿色 */
--warning-color: rgb(245, 158, 11);  /* 警告黄色 */
--danger-color: rgb(239, 68, 68);    /* 危险红色 */
```

### 间距系统

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
```

### 圆角系统

```css
--radius-sm: 0.25rem;   /* 小圆角 */
--radius-md: 0.375rem;  /* 中圆角 */
--radius-lg: 0.5rem;    /* 大圆角 */
--radius-full: 9999px;  /* 完全圆角 */
```

## 使用指南

### 1. 导入公共样式

每个组件的 CSS 文件都需要先导入公共样式：

```css
@import './common.css';
```

### 2. 使用 CSS 变量

替换硬编码的数值：

```css
/* 之前 */
margin-bottom: 1rem;
color: rgb(31, 41, 55);

/* 现在 */
margin-bottom: var(--spacing-4);
color: var(--gray-900);
```

### 3. 使用公共类名

尽量使用预定义的类名：

```css
/* 卡片容器 */
.my-card {
  /* 继承基础卡片样式 */
  @extend .base-card;
}

/* 按钮 */
.my-button {
  @extend .btn-base;
  @extend .btn-primary;
}
```

## 暗色模式支持

所有样式都包含了暗色模式支持：

### 1. 条件类名

```css
.my-element {
  color: var(--gray-900);
}

.my-element.dark {
  color: var(--gray-100);
}
```

### 2. 媒体查询适配

```css
@media (prefers-color-scheme: dark) {
  .my-element:not(.dark) {
    color: var(--gray-100);
  }
}
```

## 响应式设计

统一的响应式断点：

- 小屏：`@media (max-width: 640px)`
- 超小屏：`@media (max-width: 480px)`

## 重构带来的好处

1. **一致性**：所有组件使用统一的设计变量
2. **可维护性**：修改主题色只需要改动 `common.css`
3. **可扩展性**：新组件可以直接使用现有的基础样式
4. **代码减少**：消除重复的样式定义
5. **主题支持**：统一的暗色模式和响应式适配

## 注意事项

1. **导入顺序**：始终先导入 `common.css`
2. **变量命名**：使用语义化的变量名，避免硬编码
3. **类名规范**：遵循 BEM 命名规范
4. **向后兼容**：现有功能保持不变，只是代码更规范

## 未来计划

1. 考虑迁移到 CSS-in-JS 或 styled-components
2. 添加更多的设计 tokens
3. 实现主题切换功能
4. 创建组件样式库文档
