import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test/utils'
import ExecutiveHome from '../../components/executive/ExecutiveHome'
import { agencyScoreboardKpis } from '../../data/agency'

// Mock useCountUp to return final values immediately
vi.mock('../../hooks/useCountUp', () => ({
  useCountUp: ({ target }) => target,
}))

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

// Mock useLiveTick to return static values (TransactionFeed dependency)
vi.mock('../../hooks/useLiveTick', () => ({
  useLiveTick: () => ({ count: 2340412, value: 27126844 }),
}))

// Mock Recharts ResponsiveContainer (ConversionChart dependency)
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container" style={{ width: 500, height: 200 }}>
        {children}
      </div>
    ),
  }
})

describe('ExecutiveHome', () => {
  it('renders without error', () => {
    const { container } = renderWithRouter(<ExecutiveHome />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the AgencyScoreboard with 5 KPI labels', () => {
    renderWithRouter(<ExecutiveHome />)
    agencyScoreboardKpis.forEach((kpi) => {
      expect(screen.getByText(kpi.label)).toBeInTheDocument()
    })
  })

  it('renders the ImpactBrief with headline', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Strong new buyer momentum across travel and CPG verticals.')).toBeInTheDocument()
  })

  it('renders the ConversionChart section', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Conversion Rate vs CTV Benchmark')).toBeInTheDocument()
  })

  it('renders the OutcomeAI Insights section', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('OutcomeAI Insights')).toBeInTheDocument()
  })

  it('renders the Client Performance section with 5 client rows', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Client Performance')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('renders the Shopper Insights section', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Purchase Intelligence Highlights')).toBeInTheDocument()
  })

  it('renders the TransactionFeed with Live Transactions header', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Live Transactions')).toBeInTheDocument()
  })

  it('renders the Audience Trend Alerts section', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Audience Trend Alerts')).toBeInTheDocument()
  })

  it('page container has max-width and auto margins', () => {
    const { container } = renderWithRouter(<ExecutiveHome />)
    expect(container.firstChild).toHaveClass('max-w-[1280px]', 'mx-auto')
  })

  it('page container has padding and flex-col layout', () => {
    const { container } = renderWithRouter(<ExecutiveHome />)
    expect(container.firstChild).toHaveClass('p-6', 'flex', 'flex-col', 'gap-6')
  })

  it('renders all 7 major sections as children', () => {
    const { container } = renderWithRouter(<ExecutiveHome />)
    // AgencyScoreboard, ImpactBrief+ConversionChart grid, OutcomeAIPanel,
    // ClientPerformanceMap, ShopperInsightsPanel, TransactionFeed+InsightPulse grid
    const topLevel = container.firstChild.children
    expect(topLevel.length).toBeGreaterThanOrEqual(6)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - ExecutiveHome is a pure layout component with no logic -- this is ideal for a page-level component
 * - All data fetching/state is pushed to child components -- clean separation
 * - The 3-column grids for top row and bottom row could use a shared TwoThirdsLayout component
 * - The component imports 8 child components -- consider lazy loading for performance
 * - The tests require mocking 3 hooks and Recharts to render the full page -- a sign that integration test scope is wide
 */
