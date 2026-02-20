import { useState, useEffect, useRef } from 'react'

const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

export function useCountUp({ target, duration = 1200, delay = 0, format }) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (target === 0) return

    const timer = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp
        const elapsed = timestamp - startRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeOutExpo(progress)

        setValue(eased * target)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setValue(target)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [target, duration, delay])

  if (format) return format(value)
  return value
}
