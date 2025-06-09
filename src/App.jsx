import { useEffect, useState } from 'react'
import ClipboardHome from './pages/ClipboardHome'
import Setting from './pages/Setting'

export default function App () {
  const [enterAction, setEnterAction] = useState({})
  const [route, setRoute] = useState('')

  useEffect(() => {
    // 自动跟随系统主题
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateTheme = () => {
      const newTheme = mediaQuery.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', newTheme)
    }

    // 初始化时设置主题
    updateTheme()

    // 监听系统主题变化
    mediaQuery.addEventListener('change', updateTheme)

    // 组件卸载时清理监听器
    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, []) // 空依赖数组确保此 effect 仅运行一次

  useEffect(() => {
    window.utools.onPluginEnter((action) => {
      setRoute(action.code)
      setEnterAction(action)
    })
    window.utools.onPluginOut((isKill) => {
      setRoute('')
    })
  }, [])

  if (route === 'paste') {
    return <ClipboardHome enterAction={enterAction} />
  }

  if (route === 'setting') {
    return <Setting enterAction={enterAction} />
  }

  return false
}
