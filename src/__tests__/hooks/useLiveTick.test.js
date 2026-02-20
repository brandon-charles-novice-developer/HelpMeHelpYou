import { renderHook, act } from '@testing-library/react'
import { useLiveTick } from '../../hooks/useLiveTick'

describe('useLiveTick', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('returns count and value', () => {
    const { result } = renderHook(() => useLiveTick())
    expect(result.current).toHaveProperty('count')
    expect(result.current).toHaveProperty('value')
  })

  it('starts with default initial values', () => {
    const { result } = renderHook(() => useLiveTick())
    expect(result.current.count).toBe(2340412)
    expect(result.current.value).toBe(27126844)
  })

  it('accepts custom initial values', () => {
    const { result } = renderHook(() =>
      useLiveTick({ initialCount: 1000, initialValue: 5000 })
    )
    expect(result.current.count).toBe(1000)
    expect(result.current.value).toBe(5000)
  })

  it('increments count after interval', () => {
    const { result } = renderHook(() => useLiveTick())
    const initialCount = result.current.count

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(result.current.count).toBeGreaterThan(initialCount)
  })

  it('increments value after interval', () => {
    const { result } = renderHook(() => useLiveTick())
    const initialValue = result.current.value

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(result.current.value).toBeGreaterThan(initialValue)
  })

  it('count delta is between 20 and 47 per tick', () => {
    const { result } = renderHook(() =>
      useLiveTick({ initialCount: 0, initialValue: 0 })
    )

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    // Math.floor(Math.random() * 28) + 20 yields [20, 47]
    expect(result.current.count).toBeGreaterThanOrEqual(20)
    expect(result.current.count).toBeLessThanOrEqual(47)
  })

  it('value delta is between 0.25 and 0.60 per tick', () => {
    const { result } = renderHook(() =>
      useLiveTick({ initialCount: 0, initialValue: 0 })
    )

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    // Math.random() * 0.35 + 0.25 yields [0.25, 0.60]
    expect(result.current.value).toBeGreaterThanOrEqual(0.25)
    expect(result.current.value).toBeLessThanOrEqual(0.60)
  })

  it('uses default interval of 1500ms', () => {
    const { result } = renderHook(() => useLiveTick())
    const initial = result.current.count

    act(() => {
      vi.advanceTimersByTime(1499)
    })
    expect(result.current.count).toBe(initial)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current.count).toBeGreaterThan(initial)
  })

  it('respects custom interval', () => {
    const { result } = renderHook(() =>
      useLiveTick({ intervalMs: 3000 })
    )
    const initial = result.current.count

    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(result.current.count).toBe(initial)

    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(result.current.count).toBeGreaterThan(initial)
  })

  it('accumulates over multiple ticks', () => {
    const { result } = renderHook(() =>
      useLiveTick({ initialCount: 0, initialValue: 0 })
    )

    act(() => {
      vi.advanceTimersByTime(1500 * 5)
    })

    // After 5 ticks: count should be >= 100 (5 * 20 min)
    expect(result.current.count).toBeGreaterThanOrEqual(100)
    expect(result.current.value).toBeGreaterThan(0)
  })

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    const { unmount } = renderHook(() => useLiveTick())
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The hook mixes random number generation with state management; extracting the delta calculation would improve testability
 * - initialCount and initialValue could be a single config object or named more clearly (e.g., transactionCount, transactionValue)
 * - The parseFloat / toFixed(2) pattern for value delta is fragile with floating-point; could accumulate rounding errors over time
 * - The hook hardcodes delta ranges (20-47, 0.25-0.60) that match Attain calibration but are not configurable
 * - Tests rely on fake timers which is appropriate, but the random delta makes exact assertions impossible
 */
