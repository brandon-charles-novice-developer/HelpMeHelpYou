import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test/utils'
import AgencyScoreboard from '../../components/executive/AgencyScoreboard'
import { agencyScoreboardKpis } from '../../data/agency'

// Mock useCountUp to return target value immediately (skip animation)
vi.mock('../../hooks/useCountUp', () => ({
  useCountUp: ({ target }) => target,
}))

// Mock useFadeIn to return a simple ref and visible class
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('AgencyScoreboard', () => {
  it('renders without error', () => {
    const { container } = renderWithRouter(<AgencyScoreboard />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders exactly 5 KPI cards', () => {
    const { container } = renderWithRouter(<AgencyScoreboard />)
    const grid = container.firstChild
    expect(grid.children).toHaveLength(5)
  })

  it('renders all KPI labels', () => {
    renderWithRouter(<AgencyScoreboard />)
    agencyScoreboardKpis.forEach((kpi) => {
      expect(screen.getByText(kpi.label)).toBeInTheDocument()
    })
  })

  it('renders all KPI delta strings', () => {
    renderWithRouter(<AgencyScoreboard />)
    agencyScoreboardKpis.forEach((kpi) => {
      expect(screen.getByText(kpi.delta)).toBeInTheDocument()
    })
  })

  it('displays formatted currency value for incremental revenue', () => {
    renderWithRouter(<AgencyScoreboard />)
    // $8,420,000 formatted as currency_compact = $8.42M
    expect(screen.getByText('$8.42M')).toBeInTheDocument()
  })

  it('displays formatted multiplier value for blended ROAS', () => {
    renderWithRouter(<AgencyScoreboard />)
    expect(screen.getByText('1.61x')).toBeInTheDocument()
  })

  it('displays formatted percent value for new buyer lift', () => {
    renderWithRouter(<AgencyScoreboard />)
    expect(screen.getByText('24%')).toBeInTheDocument()
  })

  it('displays formatted integer for active campaigns', () => {
    renderWithRouter(<AgencyScoreboard />)
    expect(screen.getByText('11')).toBeInTheDocument()
  })

  it('displays formatted integer_compact for audience reach', () => {
    renderWithRouter(<AgencyScoreboard />)
    // 4,200,000 formatted as integer_compact = 4.2M
    expect(screen.getByText('4.2M')).toBeInTheDocument()
  })

  it('applies green color to positive delta text', () => {
    renderWithRouter(<AgencyScoreboard />)
    const positiveDelta = screen.getByText('+12% vs last period')
    expect(positiveDelta).toHaveStyle({ color: '#22C55E' })
  })

  it('applies neutral color to null deltaPositive text', () => {
    renderWithRouter(<AgencyScoreboard />)
    const neutralDelta = screen.getByText('5 clients')
    expect(neutralDelta).toHaveStyle({ color: '#AFADAD' })
  })

  it('uses a 5-column grid layout', () => {
    const { container } = renderWithRouter(<AgencyScoreboard />)
    expect(container.firstChild).toHaveClass('grid-cols-5')
  })

  it('applies correct background color to KPI cards', () => {
    const { container } = renderWithRouter(<AgencyScoreboard />)
    const firstCard = container.firstChild.children[0]
    expect(firstCard).toHaveStyle({ backgroundColor: '#252040' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - formatValue function is duplicated between AgencyScoreboard and other components (TransactionFeed, ClientPerformanceMap) -- could be a shared utility
 * - The deltaColor ternary could be a simple lookup object like { true: '#22C55E', false: '#EF4444', default: '#AFADAD' }
 * - KpiCard could accept formatValue as a prop instead of importing format logic internally
 * - Tests mock useCountUp at module level which is the simplest approach; no fake timers needed when mocking the hook
 */
