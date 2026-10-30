import { useState, type FormEvent } from 'react'
import './nearfind-additions.css'
import whiteLogo from '../public/WhiteLogo.png'
export type User = { name: string; email: string }
type StoredUser = User & { password: string }

const USERS_KEY = 'nearquest_users'
const SESSION_KEY = 'nearquest_session'

/*
  DEMO AUTH — stores accounts in this browser's localStorage only.
  Passwords are NOT secure here. Before real users touch this, replace
  signUp / logIn / logOut with Firebase Auth:
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
*/
function readUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function saveSession(user: User) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } catch {
    /* storage unavailable — session lasts until refresh */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function signUp(name: string, email: string, password: string): User {
  const users = readUsers()
  const key = email.toLowerCase()
  if (users[key]) throw new Error('An account with this email already exists. Log in instead.')
  users[key] = { name, email: key, password }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return { name, email: key }
}

function logIn(email: string, password: string): User {
  const found = readUsers()[email.toLowerCase()]
  if (!found || found.password !== password) throw new Error('Email or password is incorrect.')
  return { name: found.name, email: found.email }
}

export default function AuthScreen({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  function switchMode(next: 'login' | 'signup') {
    setMode(next)
    setError('')
    setPassword('')
    setConfirm('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const cleanEmail = email.trim()

    if (isSignup && !name.trim()) return setError('Enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (isSignup && password !== confirm) return setError('Passwords do not match.')

    try {
      const user = isSignup ? signUp(name.trim(), cleanEmail, password) : logIn(cleanEmail, password)
      onAuth(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="screen auth-screen">
      <div className="status-bar status-light">
        <span>9:41</span>
        <div className="status-icons">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><path d="M1 8h2v3H1zm4-3h2v6H5zm4-3h2v9H9zm4-2h2v11h-2z" /></svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4.5a9 9 0 0 1 13 0M3.5 7a5.5 5.5 0 0 1 8 0M6.2 9.3a1.8 1.8 0 0 1 2.6 0" /></svg>
          <span className="battery"><i /></span>
        </div>
      </div>

      <div className="auth-hero">
        <div className="brand-mark brand-light">
          <img src={whiteLogo} alt="NearQuest" className="brand-logo" />
          <span className="brand-word">Near<span>Quest</span></span>
        </div>
        <h1>{isSignup ? 'Start mapping Baguio' : 'Welcome back, Pathfinder'}</h1>
        <p>{isSignup ? 'Create an account to save your badges and cleared map.' : 'Log in to pick up your commissions where you left off.'}</p>
      </div>

      <form className="auth-panel" onSubmit={handleSubmit} noValidate>
        <div className="auth-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={!isSignup} className={!isSignup ? 'is-active' : ''} onClick={() => switchMode('login')}>Log in</button>
          <button type="button" role="tab" aria-selected={isSignup} className={isSignup ? 'is-active' : ''} onClick={() => switchMode('signup')}>Sign up</button>
        </div>

        {isSignup && (
          <label className="auth-field">
            <span>Name</span>
            <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Mendoza" />
          </label>
        )}
        <label className="auth-field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </label>
        {isSignup && (
          <label className="auth-field">
            <span>Confirm password</span>
            <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" />
          </label>
        )}

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary auth-submit">{isSignup ? 'Create account' : 'Log in'}</button>

        <p className="auth-switch">
          {isSignup ? 'Already exploring?' : 'New to NearQuest?'}{' '}
          <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>{isSignup ? 'Log in' : 'Sign up'}</button>
        </p>
      </form>
    </div>
  )
}