import { useState } from 'react'
import AttainLogo from './layout/AttainLogo'

const PASS_KEY = 'outcomehq_access'
const VALID_HASH = 'Whaleinachinashop' // change this to set the password

function isUnlocked() {
  return sessionStorage.getItem(PASS_KEY) === 'granted'
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [hover, setHover] = useState(false)

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
      {/* Purple header bar matching Attain nav */}
      <div style={styles.header}>
        <AttainLogo height={28} />
      </div>

      {/* Hero section with purple gradient */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Outcome HQ 2.0 - Global Meltdown</h1>
        <p style={styles.heroApproved}>Approved By Tugg Speedman and Les Grossman</p>
        <p style={styles.heroTagline}>Measurement for the modern marketer</p>
      </div>

      {/* Login card */}
      <div style={styles.cardWrap}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <p style={styles.cardLabel}>Enter access code to continue</p>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Access code"
            autoFocus
            style={{
              ...styles.input,
              borderColor: error ? '#DC2626' : '#D1D5DB',
            }}
          />
          {error && <p style={styles.error}>Invalid code</p>}
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: hover ? '#4A2D7A' : '#5B3B8C',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#3D2066',
    minHeight: 64,
  },
  hero: {
    background: 'linear-gradient(180deg, #3D2066 0%, #6B4FA0 100%)',
    padding: '60px 40px 80px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  heroApproved: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    marginTop: 8,
  },
  heroTagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 16,
    fontWeight: 400,
  },
  cardWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: -40,
    padding: '0 20px 60px',
  },
  card: {
    width: 400,
    padding: '36px 32px 28px',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  cardLabel: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: 500,
    margin: 0,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: 8,
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  error: {
    fontSize: 13,
    color: '#DC2626',
    margin: '-8px 0 0',
  },
  button: {
    width: '100%',
    padding: '12px 0',
    fontSize: 15,
    fontWeight: 600,
    backgroundColor: '#5B3B8C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.15s',
  },
  footer: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
}
