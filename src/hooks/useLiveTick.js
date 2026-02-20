import { useState, useEffect, useRef } from 'react'

// Calibrated to Attain's live dashboard numbers:
// ~2,340,000 daily transactions → ~27 per second
// ~$27,126,000 daily value → ~$0.314 per second
// Tick interval: 1-2s, increment ~27-54 transactions, ~$0.31-$0.63 value

export function useLiveTick({
  initialCount = 2340412,
  initialValue = 27126844,
  intervalMs = 1500,
} = {}) {
  const [count, setCount] = useState(initialCount)
  const [value, setValue] = useState(initialValue)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const countDelta = Math.floor(Math.random() * 28) + 20
      const valueDelta = parseFloat((Math.random() * 0.35 + 0.25).toFixed(2))

      setCount((c) => c + countDelta)
      setValue((v) => parseFloat((v + valueDelta).toFixed(2)))
    }, intervalMs)

    return () => clearInterval(intervalRef.current)
  }, [intervalMs])

  return { count, value }
}
