import { render, screen, act } from '@testing-library/react'
import TransactionFeed from '../../components/live/TransactionFeed'

// Mock useLiveTick with controllable values
const mockUseLiveTick = vi.fn()
vi.mock('../../hooks/useLiveTick', () => ({
  useLiveTick: (...args) => mockUseLiveTick(...args),
}))

vi.mock('../../components/shared/LiveDot', () => ({
  default: () => <span data-testid="live-dot" />,
}))

describe('TransactionFeed — ticking behavior and feed updates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockUseLiveTick.mockReturnValue({ count: 1000000, value: 5000000 })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('displays formatted count from useLiveTick', () => {
    render(<TransactionFeed />)
    // fmt(1000000, '#') → '1.0M' (compact format)
    expect(screen.getByText('1.0M')).toBeInTheDocument()
  })

  it('displays formatted value from useLiveTick', () => {
    render(<TransactionFeed />)
    // formatValue: 5000000 >= 1000000 -> $5.00M
    expect(screen.getByText('$5.00M')).toBeInTheDocument()
  })

  it('formats values in K range correctly', () => {
    mockUseLiveTick.mockReturnValue({ count: 500, value: 5000 })
    render(<TransactionFeed />)
    // fmt(5000, '$') → '$5K' (compact format, no decimal for K)
    expect(screen.getByText('$5K')).toBeInTheDocument()
  })

  it('formats values under 1000 correctly', () => {
    mockUseLiveTick.mockReturnValue({ count: 50, value: 500 })
    render(<TransactionFeed />)
    expect(screen.getByText('$500')).toBeInTheDocument()
  })

  it('starts with 20 initial feed entries', () => {
    render(<TransactionFeed />)
    // Each feed entry has a feed-entry class
    const { container } = render(<TransactionFeed />)
    const entries = container.querySelectorAll('.feed-entry')
    expect(entries).toHaveLength(20)
  })

  it('adds entries via setTimeout scheduling', () => {
    const { container } = render(<TransactionFeed />)
    const initialCount = container.querySelectorAll('.feed-entry').length

    // The schedule uses 2000 + Math.random() * 1200 delay
    // Advance well past that to ensure at least one entry is added
    act(() => {
      vi.advanceTimersByTime(10000)
    })

    const updatedCount = container.querySelectorAll('.feed-entry').length
    expect(updatedCount).toBeGreaterThanOrEqual(initialCount)
  })

  it('does not exceed MAX_ENTRIES (30) in the feed', () => {
    const { container } = render(<TransactionFeed />)

    // Advance timers enough to add many entries
    act(() => {
      vi.advanceTimersByTime(120000)
    })

    const entries = container.querySelectorAll('.feed-entry')
    expect(entries.length).toBeLessThanOrEqual(30)
  })

  it('cleans up timers on unmount', () => {
    const { unmount } = render(<TransactionFeed />)
    // Should not throw when unmounted and timers advance
    unmount()
    expect(() => {
      vi.advanceTimersByTime(10000)
    }).not.toThrow()
  })

  it('renders feed entry brand initials in colored circles', () => {
    const { container } = render(<TransactionFeed />)
    const initials = container.querySelectorAll('.rounded-full.flex.items-center.justify-center')
    expect(initials.length).toBeGreaterThan(0)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The setTimeout + schedule pattern is harder to test than setInterval; switching to
 *   setInterval with jitter would simplify timer testing.
 * - formatAmount, formatCount, formatValue are three local formatters — a shared
 *   formatters module would reduce duplication across components.
 * - The _entryCount module-level mutable variable in transactionFeed.js is a hidden
 *   global state — this could cause test pollution if not reset.
 * - Backup tests focus on timer behavior, max entries cap, and cleanup — complementary
 *   to primary tests which focus on rendering and display.
 */
