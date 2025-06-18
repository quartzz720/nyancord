import { useState } from 'react'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const submit = e => {
    e.preventDefault()
    console.log('login', user)
  }
  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 bg-gray-800" value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" />
        <input className="w-full p-2 bg-gray-800" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" />
        <button className="p-2 bg-blue-500 w-full">Sign In</button>
      </form>
    </div>
  )
}
