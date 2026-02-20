import { renderHook, act } from '@testing-library/react'
import { useCountUp } from '../../hooks/useCountUp'

describe('useCountUp — edge cases and boundary values', () => {
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

  it('handles very large target values', () => {
    const { result } = renderHook(() =>
      useCountUp({ target: 10000000, duration: 1000, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)
    flushAllRAF(1100)

    expect(result.current).toBe(10000000)
  })

  it('handles fractional target values', () => {
    const { result } = renderHook(() =>
      useCountUp({ target: 1.61, duration: 500, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)
    flushAllRAF(600)

    expect(result.current).toBe(1.61)
  })

  it('handles negative target values', () => {
    const { result } = renderHook(() =>
      useCountUp({ target: -100, duration: 500, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)
    flushAllRAF(600)

    expect(result.current).toBe(-100)
  })

  it('handles very short duration', () => {
    const { result } = renderHook(() =>
      useCountUp({ target: 100, duration: 1, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)
    flushAllRAF(101)

    expect(result.current).toBe(100)
  })

  it('handles very long delay', () => {
    renderHook(() =>
      useCountUp({ target: 100, delay: 10000 })
    )

    act(() => { vi.advanceTimersByTime(5000) })
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()

    act(() => { vi.advanceTimersByTime(5000) })
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('restarts animation when target changes', () => {
    const { result, rerender } = renderHook(
      ({ target }) => useCountUp({ target, duration: 500, delay: 0 }),
      { initialProps: { target: 100 } }
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)
    flushAllRAF(600)
    expect(result.current).toBe(100)

    // Change target
    rerender({ target: 200 })

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(700)
    flushAllRAF(1200)
    expect(result.current).toBe(200)
  })

  it('value stays between 0 and target during animation', () => {
    const values = []
    const format = (v) => { values.push(v); return v }

    renderHook(() =>
      useCountUp({ target: 1000, duration: 1000, delay: 0, format })
    )

    act(() => { vi.advanceTimersByTime(0) })

    let t = 100
    for (let i = 0; i < 10; i++) {
      flushAllRAF(t)
      t += 100
    }

    values.forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1000)
    })
  })

  it('intermediate values are monotonically increasing for positive target', () => {
    const values = []
    const format = (v) => { values.push(v); return v }

    renderHook(() =>
      useCountUp({ target: 500, duration: 1000, delay: 0, format })
    )

    act(() => { vi.advanceTimersByTime(0) })

    let t = 100
    for (let i = 0; i < 12; i++) {
      flushAllRAF(t)
      t += 100
    }

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1])
    }
  })

  it('cleans up properly when unmounted mid-animation', () => {
    const { unmount } = renderHook(() =>
      useCountUp({ target: 100, duration: 2000, delay: 0 })
    )

    act(() => { vi.advanceTimersByTime(0) })
    flushAllRAF(100)

    unmount()

    expect(window.cancelAnimationFrame).toHaveBeenCalled()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Edge cases like negative targets are not documented in the hook — unclear if intentional
 * - The hook does not clamp values, so negative targets work by accident rather than design
 * - The format function receiving intermediate values means callers get called on every frame — could be expensive
 * - Tests need complex RAF mocking; the hook could expose a progress-based API instead for easier testing
 * - Duration=0 would cause division by zero in progress calc (elapsed/0) — no guard against this
 */
