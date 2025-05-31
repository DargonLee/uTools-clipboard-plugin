import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import App from './App.jsx'

// 暗黑模式检测和切换逻辑
const initTheme = () => {
  // 检测系统主题
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  console.log('系统主题检测:', isDarkMode ? '暗黑模式' : '浅色模式');
  
  // 根据系统主题设置 dark class
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    console.log('已添加 dark class 到 HTML 根元素');
  } else {
    document.documentElement.classList.remove('dark');
    console.log('已移除 dark class 从 HTML 根元素');
  }
  
  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      console.log('主题变化:', e.matches ? '暗黑模式' : '浅色模式');
      if (e.matches) {
        document.documentElement.classList.add('dark');
        console.log('切换到暗黑模式');
      } else {
        document.documentElement.classList.remove('dark');
        console.log('切换到浅色模式');
      }
    });
  }
};

// 初始化主题
initTheme();

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
