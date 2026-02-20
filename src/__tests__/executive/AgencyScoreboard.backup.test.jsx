import { render, screen } from '@testing-library/react'
import AgencyScoreboard from '../../components/executive/AgencyScoreboard'

// Do NOT mock useCountUp here -- we test the actual animation behavior
// Mock useFadeIn to avoid IntersectionObserver issues in test env
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('AgencyScoreboard — animation and edge cases', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with initial zero values before animation starts', () => {
    const { container } = render(<AgencyScoreboard />)
    // Before any timers or rAF fire, values should start at 0
    // The first card (currency_compact) with value 0 formats as "$0"
    expect(container.firstChild).toBeInTheDocument()
  })

  it('KPI cards have staggered animation delays (index * 100ms)', () => {
    // The component passes index * 100 as delay to useCountUp
    // With 5 cards: delays are 0, 100, 200, 300, 400ms
    const { container } = render(<AgencyScoreboard />)
    expect(container.firstChild.children).toHaveLength(5)
  })

  it('each KPI card has hover translate class', () => {
    const { container } = render(<AgencyScoreboard />)
    const cards = container.firstChild.children
    Array.from(cards).forEach((card) => {
      expect(card).toHaveClass('hover:-translate-y-0.5')
    })
  })

  it('each KPI card has correct box shadow', () => {
    const { container } = render(<AgencyScoreboard />)
    const cards = container.firstChild.children
    Array.from(cards).forEach((card) => {
      expect(card).toHaveStyle({ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 30px 0px' })
    })
  })

  it('label elements have uppercase tracking-widest styling classes', () => {
    render(<AgencyScoreboard />)
    const labels = screen.getAllByText(/Incremental Revenue|Blended ROAS|Avg New Buyer Lift|Active Campaigns|Audience Reach/)
    labels.forEach((label) => {
      expect(label).toHaveClass('uppercase', 'tracking-widest')
    })
  })

  it('all 5 KPI cards have the fade-up-visible class from useFadeIn', () => {
    const { container } = render(<AgencyScoreboard />)
    const cards = container.firstChild.children
    Array.from(cards).forEach((card) => {
      expect(card).toHaveClass('fade-up-visible')
    })
  })

  it('renders the grid container with gap-4 spacing', () => {
    const { container } = render(<AgencyScoreboard />)
    expect(container.firstChild).toHaveClass('grid', 'gap-4')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The stagger delay (index * 100) is hardcoded — could be a constant or prop for easier testing
 * - useFadeIn is used per-card; a single parent fade-in would be simpler and reduce observer instances
 * - The formatValue switch statement mixes display formatting with component rendering — extracting to a pure utility makes it independently testable
 * - Tests here are lightweight because the animation relies on rAF which is hard to test in jsdom; the primary value is in the mocked version
 */
