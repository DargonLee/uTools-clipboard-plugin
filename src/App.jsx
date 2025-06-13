import { useEffect, useState } from 'react'
import ClipboardHome from './pages/ClipboardHome'
import Setting from './pages/Setting'

export default function App () {
  const [enterAction, setEnterAction] = useState({})
  const [route, setRoute] = useState('')

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

  return false
}
