import { useEffect, useState } from 'react'
import ClipboardHome from './pages/ClipboardHome'

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

  if (route === 'setting') {
    return <Setting enterAction={enterAction} />
  }

  return false
}
