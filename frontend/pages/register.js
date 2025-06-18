import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const router = useRouter()
  const submit = async e => {
    e.preventDefault()
    await fetch('/api/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: user, password: pass})
    })
    router.push('/login')
  }
  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 bg-gray-800" value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" />
        <input className="w-full p-2 bg-gray-800" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" />
        <button className="p-2 bg-green-600 w-full">Sign Up</button>
      </form>
    </div>
  )
}
