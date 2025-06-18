import { useEffect, useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws')
    ws.onmessage = (e) => setMessages(m => [...m, e.data])
    return () => ws.close()
  }, [])
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Nyancord</h1>
      <ul className="space-y-2">
        {messages.map((m, i) => (
          <li key={i} className="bg-gray-800 rounded p-2">{m}</li>
        ))}
      </ul>
    </div>
  )
}
