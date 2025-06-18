import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return (
    <button className="p-2" onClick={() => setDark(!dark)}>
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
