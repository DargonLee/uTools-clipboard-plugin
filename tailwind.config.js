/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用 class 模式的暗黑模式
  theme: {
    extend: {
      colors: {
        primary: '2D75F3',
      }
    },
  },
  plugins: [],
} 