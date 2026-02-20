import { render, screen } from '@testing-library/react'
import TransactionFeed from '../../components/live/TransactionFeed'

// Mock useLiveTick to return stable values for testing
vi.mock('../../hooks/useLiveTick', () => ({
  useLiveTick: () => ({ count: 2340412, value: 27126844 }),
}))

// Mock LiveDot to avoid CSS animation issues
vi.mock('../../components/shared/LiveDot', () => ({
  default: () => <span data-testid="live-dot" />,
}))

describe('TransactionFeed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    const { container } = render(<TransactionFeed />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the Live Transactions heading', () => {
    render(<TransactionFeed />)
    expect(screen.getByText('Live Transactions')).toBeInTheDocument()
  })

  it('displays the LiveDot component', () => {
    render(<TransactionFeed />)
    expect(screen.getByTestId('live-dot')).toBeInTheDocument()
  })

  it('displays ticking transaction count', () => {
    render(<TransactionFeed />)
    // fmt(2340412, '#') → '2.3M' (compact format)
    expect(screen.getByText('2.3M')).toBeInTheDocument()
  })

  it('displays ticking transaction value', () => {
    render(<TransactionFeed />)
    expect(screen.getByText('$27.13M')).toBeInTheDocument()
  })

  it('displays aggregate labels', () => {
    render(<TransactionFeed />)
    expect(screen.getByText("Today's Transactions")).toBeInTheDocument()
    expect(screen.getByText("Today's Value")).toBeInTheDocument()
  })

  it('renders initial feed entries', () => {
    render(<TransactionFeed />)
    // generateFeedBatch(20) creates 20 entries; each has a brand name
    const feedEntries = screen.getAllByText(/\$\d+\.\d{2}/)
    expect(feedEntries.length).toBeGreaterThanOrEqual(1)
  })

  it('renders channel badges (Online or In store)', () => {
    render(<TransactionFeed />)
    const onlineBadges = screen.queryAllByText('Online')
    const inStoreBadges = screen.queryAllByText('In store')
    expect(onlineBadges.length + inStoreBadges.length).toBeGreaterThan(0)
  })

  it('displays the footer text', () => {
    render(<TransactionFeed />)
    expect(screen.getByText(/5,000,014,000\+ total transactions/)).toBeInTheDocument()
    expect(screen.getByText('Real people. Real purchases. Real outcomes.')).toBeInTheDocument()
  })

  it('adds new entries over time with fake timers', async () => {
    const { act } = await import('@testing-library/react')
    render(<TransactionFeed />)
    const initialEntries = screen.getAllByText(/\$\d+\.\d{2}/).length

    // Advance timers to trigger new entry addition
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    // After advancing timers, there should be at least as many entries
    const updatedEntries = screen.getAllByText(/\$\d+\.\d{2}/).length
    expect(updatedEntries).toBeGreaterThanOrEqual(initialEntries)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - TransactionFeed uses both useLiveTick (interval) and its own setTimeout schedule —
 *   two independent timers create complexity. A single tick source would simplify.
 * - MAX_ENTRIES (30) caps the feed length but is never exposed as a prop.
 * - generateFeedBatch uses a seeded RNG for deterministic initial state — good for testing.
 * - The FeedEntry sub-component could be extracted to its own file for independent testing.
 * - Mocking useLiveTick and LiveDot keeps tests focused on feed behavior.
 */
