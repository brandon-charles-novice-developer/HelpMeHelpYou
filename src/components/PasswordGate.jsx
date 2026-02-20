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
        <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
          <path d="M8.5 26L15.5 6h4l7 20h-3.8l-1.6-5H14l-1.6 5H8.5zm6.4-8h7.2L18.5 9.2h-.1L14.9 18z" fill="#fff"/>
          <path d="M36 10.5v2.2h-3.8V22c0 .9.2 1.4.6 1.7.4.3 1 .4 1.8.4h1.4v2.5c-.7.1-1.5.2-2.2.2-1.6 0-2.8-.3-3.6-1-.8-.7-1.2-1.8-1.2-3.4V12.7h-2.7v-2.2H29l.8-4h2.4v4H36z" fill="#fff"/>
          <path d="M38 10.5h3v2.4c.5-.8 1.1-1.5 1.9-2 .8-.5 1.7-.7 2.7-.7h.8v3h-1.2c-1.2 0-2.2.4-2.9 1.1-.7.7-1.1 1.8-1.1 3.3v9h-3.2V10.5z" fill="#fff"/>
          <path d="M55.2 27H52v-2c-.6.7-1.3 1.3-2.1 1.7-.8.4-1.8.6-2.8.6-1.3 0-2.4-.3-3.2-.9-.8-.6-1.2-1.6-1.2-2.9 0-1.4.5-2.5 1.6-3.2 1.1-.7 2.6-1 4.6-1h3V18c0-.9-.3-1.6-.9-2.1-.6-.5-1.5-.7-2.6-.7-1 0-1.8.2-2.4.6-.6.4-1 1-1.1 1.7h-3.1c.2-1.4.8-2.5 2-3.3 1.1-.8 2.6-1.2 4.5-1.2 2 0 3.5.5 4.5 1.4 1 .9 1.5 2.3 1.5 4V27zm-3.1-5.5h-2.8c-1.2 0-2.1.2-2.7.6-.6.4-.9 1-.9 1.7 0 .7.3 1.2.8 1.6.5.4 1.2.5 2 .5 1.2 0 2.2-.3 2.9-1 .7-.7 1-1.6 1-2.8v-.6h-.3z" fill="#fff"/>
          <path d="M58.5 5.5h3.2v3h-3.2v-3zm0 5h3.2V27h-3.2V10.5z" fill="#fff"/>
          <path d="M65.5 10.5h3v2.2c.5-.8 1.2-1.4 2-1.8.8-.5 1.8-.7 2.9-.7 1.7 0 3.1.6 4.1 1.7 1 1.1 1.5 2.7 1.5 4.7V27h-3.2v-9.8c0-1.3-.3-2.3-1-3-.7-.7-1.6-1-2.7-1-1.2 0-2.1.4-2.8 1.2-.7.8-1 1.9-1 3.3V27h-3.2V10.5h.4z" fill="#fff"/>
        </svg>
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
