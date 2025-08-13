import React from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return <div style={{padding:16}}>Loading...</div>

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>FouraEthiopia</h1>
        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/">Home</Link>
          {user ? (
            <>
              <span style={{ fontSize: 14, opacity: 0.7 }}>{user.email}</span>
              <button onClick={async ()=>{ await signOut(auth); navigate('/login') }}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}
