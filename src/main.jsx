import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import App from './App.jsx'

// 暗黑模式检测和切换逻辑
const initTheme = () => {
  // 检测系统主题
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 根据系统主题设置 dark class
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }
};

// 初始化主题
initTheme();

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
