import { useState } from 'react'

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
    <div style={styles.backdrop}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>&#9670;</span>
          <span style={styles.logoText}>OutcomeHQ</span>
        </div>
        <p style={styles.subtitle}>Enter access code to continue</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Access code"
          autoFocus
          style={{
            ...styles.input,
            borderColor: error ? '#EF4444' : '#4D4176',
          }}
        />
        {error && <p style={styles.error}>Invalid code</p>}
        <button type="submit" style={styles.button}>
          Enter
        </button>
        <p style={styles.footer}>Attain &middot; Confidential Preview</p>
      </form>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1A2E',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  card: {
    width: 360,
    padding: '48px 36px 36px',
    backgroundColor: '#252040',
    borderRadius: 16,
    border: '1px solid #4D4176',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  logoIcon: {
    fontSize: 28,
    color: '#5C70D6',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 14,
    color: '#AFADAD',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    backgroundColor: '#1E1A2E',
    border: '1px solid #4D4176',
    borderRadius: 10,
    color: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.2s',
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
    backgroundColor: '#5C70D6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  },
  footer: {
    fontSize: 12,
    color: '#4D4176',
    marginTop: 8,
  },
}
