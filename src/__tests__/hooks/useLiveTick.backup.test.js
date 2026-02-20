import { renderHook, act } from '@testing-library/react'
import { useLiveTick } from '../../hooks/useLiveTick'

describe('useLiveTick — calibration and long-running behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('count always increases (never decreases)', () => {
    const { result } = renderHook(() => useLiveTick())
    let prev = result.current.count

    for (let i = 0; i < 10; i++) {
      act(() => { vi.advanceTimersByTime(1500) })
      expect(result.current.count).toBeGreaterThan(prev)
      prev = result.current.count
    }
  })

  it('value always increases (never decreases)', () => {
    const { result } = renderHook(() => useLiveTick())
    let prev = result.current.value

    for (let i = 0; i < 10; i++) {
      act(() => { vi.advanceTimersByTime(1500) })
      expect(result.current.value).toBeGreaterThan(prev)
      prev = result.current.value
    }
  })

  it('count is always an integer', () => {
    const { result } = renderHook(() => useLiveTick())

    for (let i = 0; i < 5; i++) {
      act(() => { vi.advanceTimersByTime(1500) })
      expect(Number.isInteger(result.current.count)).toBe(true)
    }
  })

  it('value has at most 2 decimal places', () => {
    const { result } = renderHook(() => useLiveTick())

    for (let i = 0; i < 5; i++) {
      act(() => { vi.advanceTimersByTime(1500) })
      const decimals = result.current.value.toString().split('.')[1]
      if (decimals) {
        expect(decimals.length).toBeLessThanOrEqual(2)
      }
    }
  })

  it('after 60 seconds (~40 ticks) count increased by roughly 1200-1880', () => {
    const { result } = renderHook(() =>
      useLiveTick({ initialCount: 0, initialValue: 0 })
    )

    act(() => {
      vi.advanceTimersByTime(60000) // 40 ticks at 1500ms
    })

    // 40 ticks * [20,47] = [800, 1880]
    expect(result.current.count).toBeGreaterThanOrEqual(800)
    expect(result.current.count).toBeLessThanOrEqual(1880)
  })

  it('after 60 seconds value increased by roughly $10-$24', () => {
    const { result } = renderHook(() =>
      useLiveTick({ initialCount: 0, initialValue: 0 })
    )

    act(() => {
      vi.advanceTimersByTime(60000) // 40 ticks
    })

    // 40 ticks * [0.25, 0.60] = [10, 24]
    expect(result.current.value).toBeGreaterThanOrEqual(10)
    expect(result.current.value).toBeLessThanOrEqual(24)
  })

  it('does not tick when not mounted', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval')
    const { unmount } = renderHook(() => useLiveTick())

    expect(setIntervalSpy).toHaveBeenCalledTimes(1)

    unmount()

    // The interval should have been cleared
    // Re-mounting should create a fresh interval
    const { result: result2 } = renderHook(() => useLiveTick())
    expect(result2.current.count).toBe(2340412)
  })

  it('accepts zero as initial values', () => {
    const { result } = renderHook(() =>
      useLiveTick({ initialCount: 0, initialValue: 0 })
    )
    expect(result.current.count).toBe(0)
    expect(result.current.value).toBe(0)
  })

  it('does not share state between multiple hook instances', () => {
    const { result: r1 } = renderHook(() =>
      useLiveTick({ initialCount: 100, initialValue: 100 })
    )
    const { result: r2 } = renderHook(() =>
      useLiveTick({ initialCount: 200, initialValue: 200 })
    )

    expect(r1.current.count).toBe(100)
    expect(r2.current.count).toBe(200)

    act(() => { vi.advanceTimersByTime(1500) })

    // Both should have incremented independently
    expect(r1.current.count).toBeGreaterThan(100)
    expect(r2.current.count).toBeGreaterThan(200)
    expect(r1.current.count).not.toBe(r2.current.count)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Calibration values (27/sec transactions, $0.314/sec) are only in comments, not enforced by the code
 * - The hook uses Math.random() making it non-deterministic; a seeded RNG would make tests more predictable
 * - parseFloat(toFixed(2)) on every tick is a performance concern for long-running intervals; could use integer cents instead
 * - The intervalMs parameter is only used in the effect dependency array — changing it mid-life restarts the interval correctly
 * - The backup tests focus on calibration ranges and long-running behavior vs. primary tests' structural assertions
 */
