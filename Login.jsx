import React, { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        if (name) await updateProfile(user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        {mode === 'register' && (
          <label>
            Name<br/>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
          </label>
        )}
        <label>
          Email<br/>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <label>
          Password<br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
        </label>
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>

      <p style={{ marginTop: 12 }}>
        {mode === 'login' ? (
          <>No account? <button onClick={()=>setMode('register')}>Register</button></>
        ) : (
          <>Have an account? <button onClick={()=>setMode('login')}>Login</button></>
        )}
      </p>
    </div>
  )
}
