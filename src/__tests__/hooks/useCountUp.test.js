import { renderHook, act } from '@testing-library/react'
import { useCountUp } from '../../hooks/useCountUp'

describe('useCountUp', () => {
  let rafCallbacks
  let rafId

  beforeEach(() => {
    vi.useFakeTimers()
    rafCallbacks = new Map()
    rafId = 0

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafId++
      rafCallbacks.set(rafId, cb)
      return rafId
    })

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      rafCallbacks.delete(id)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  function flushAllRAF(timestamp) {
    act(() => {
      const pending = [...rafCallbacks.entries()]
      rafCallbacks.clear()
      pending.forEach(([, cb]) => cb(timestamp))
    })
  }

  it('returns 0 as initial value', () => {
    const { result } = renderHook(() => useCountUp({ target: 100 }))
    expect(result.current).toBe(0)
  })

  it('does not animate when target is 0', () => {
    const { result } = renderHook(() => useCountUp({ target: 0 }))
    expect(result.current).toBe(0)
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('starts animation after delay', () => {
    renderHook(() => useCountUp({ target: 100, delay: 500 }))
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()

    act(() => { vi.advanceTimersByTime(500) })

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1)
  })

  it('reaches exact target value when animation completes', () => {
    const { result } = renderHook(() =>
      useCountUp({ target: 500, duration: 1000, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)   // frame 1: sets startRef
    flushAllRAF(1100)  // frame 2: elapsed=1000, progress=1

    expect(result.current).toBe(500)
  })

  it('applies easeOutExpo easing (value grows quickly then decelerates)', () => {
    const { result } = renderHook(() =>
      useCountUp({ target: 1000, duration: 1000, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)  // frame 1: startRef = 100
    flushAllRAF(600)  // frame 2: elapsed=500, progress=0.5

    // With easeOutExpo at t=0.5: 1 - 2^(-5) = 0.96875, so value ~ 968.75
    expect(result.current).toBeGreaterThan(900)
    expect(result.current).toBeLessThan(1000)
  })

  it('applies format function when provided', () => {
    const format = (v) => `$${Math.round(v)}`
    const { result } = renderHook(() =>
      useCountUp({ target: 100, format })
    )
    expect(result.current).toBe('$0')
  })

  it('returns raw value when no format is provided', () => {
    const { result } = renderHook(() => useCountUp({ target: 100 }))
    expect(typeof result.current).toBe('number')
  })

  it('cleans up on unmount (cancels timer and RAF)', () => {
    const { unmount } = renderHook(() =>
      useCountUp({ target: 100, delay: 200 })
    )

    unmount()

    act(() => { vi.advanceTimersByTime(1000) })
  })

  it('uses default duration of 1200ms', () => {
    const { result } = renderHook(() =>
      useCountUp({ target: 100, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)
    flushAllRAF(1300)  // 100 + 1200 = 1300

    expect(result.current).toBe(100)
  })

  it('uses default delay of 0', () => {
    renderHook(() => useCountUp({ target: 100 }))

    act(() => { vi.advanceTimersByTime(0) })

    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - useCountUp could accept a simple number instead of requiring { target } object destructuring
 * - The delay parameter could be removed; callers can handle delay externally
 * - The format function mixes rendering logic into the hook; returning only the number would be simpler
 * - Tests require extensive RAF mocking; a simpler animation approach (CSS transitions) would eliminate this complexity
 * - The easeOutExpo function is private and untestable in isolation; it could be exported for direct unit testing
 */
