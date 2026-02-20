import { useState, useEffect, useRef } from 'react'

export function useFadeIn({ threshold = 0.2, rootMargin = '0px 0px -10% 0px' } = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, className: isVisible ? 'fade-up-visible' : 'fade-up-hidden' }
}
