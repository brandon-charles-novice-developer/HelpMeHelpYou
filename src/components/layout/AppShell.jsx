import { useState, useEffect } from 'react'
import Header from './Header'

export default function AppShell({ mode, onModeChange, children }) {
  const [visible, setVisible] = useState(true)
  const [displayedMode, setDisplayedMode] = useState(mode)

  useEffect(() => {
    if (mode === displayedMode) {
      setVisible(true)
      return
    }

    // Fade out, swap, fade in
    setVisible(false)
    const t = setTimeout(() => {
      setDisplayedMode(mode)
      setVisible(true)
    }, 180)
    return () => clearTimeout(t)
  }, [mode, displayedMode])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1E1A2E' }}>
      <Header mode={mode} onModeChange={onModeChange} />
      <main
        className="flex-1 overflow-auto transition-all duration-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.99)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
