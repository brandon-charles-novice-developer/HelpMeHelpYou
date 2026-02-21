import { useState } from 'react'
import AttainLogo from './layout/AttainLogo'
import GradientMesh from './layout/GradientMesh'

const PASS_KEY = 'outcomehq_access'
const VALID_HASH = 'Whaleinachinashop' // change this to set the password

function isUnlocked() {
  return sessionStorage.getItem(PASS_KEY) === 'granted'
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (value === VALID_HASH) {
      sessionStorage.setItem(PASS_KEY, 'granted')
      setUnlocked(true)
    } else {
      setError(true)
      setValue('')
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div style={styles.page}>
      <GradientMesh />

      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <AttainLogo height={32} />
        </div>

        {/* Title */}
        <h1 style={styles.title}>Outcome HQ 2.0</h1>
        <p style={styles.tagline}>Measurement for the modern marketer</p>

        {/* Glass card */}
        <form onSubmit={handleSubmit} style={styles.card}>
          <p style={styles.cardLabel}>Enter access code to continue</p>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Access code"
            autoFocus
            className="glass-input"
            style={{
              ...styles.input,
              borderColor: error
                ? 'rgba(239, 68, 68, 0.6)'
                : undefined,
              boxShadow: error
                ? '0 0 20px rgba(239, 68, 68, 0.15)'
                : undefined,
            }}
          />
          {error && <p style={styles.error}>Invalid code</p>}
          <button type="submit" style={styles.button}>
            Request Access
          </button>
          <p style={styles.footer}>Confidential Preview</p>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#1E1A2E',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 20,
  },
  logoWrap: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    width: 380,
    maxWidth: '100%',
    padding: '32px 28px 24px',
    background: 'rgba(255, 255, 255, 0.05)',
    WebkitBackdropFilter: 'blur(16px)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 500,
    margin: 0,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    color: '#FFFFFF',
    borderRadius: 10,
    fontFamily: 'inherit',
  },
  error: {
    fontSize: 13,
    color: '#EF4444',
    margin: '-8px 0 0',
  },
  button: {
    width: '100%',
    padding: '12px 0',
    fontSize: 15,
    fontWeight: 600,
    background: 'rgba(103, 87, 158, 0.5)',
    WebkitBackdropFilter: 'blur(8px)',
    backdropFilter: 'blur(8px)',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 4,
  },
}
