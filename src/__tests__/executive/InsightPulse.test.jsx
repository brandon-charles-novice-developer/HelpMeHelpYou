import { render, screen } from '@testing-library/react'
import InsightPulse from '../../components/executive/InsightPulse'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('InsightPulse', () => {
  it('renders without error', () => {
    const { container } = render(<InsightPulse />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays "Audience Trend Alerts" section label', () => {
    render(<InsightPulse />)
    expect(screen.getByText('Audience Trend Alerts')).toBeInTheDocument()
  })

  it('renders exactly 3 alert cards', () => {
    const { container } = render(<InsightPulse />)
    const alertList = container.querySelector('.flex.flex-col.gap-3')
    expect(alertList.children).toHaveLength(3)
  })

  it('displays all 3 audience names', () => {
    render(<InsightPulse />)
    expect(screen.getByText('Q1 Cold-Season Purchasers (Ricola)')).toBeInTheDocument()
    expect(screen.getByText('Frontier Switchers (Spirit Airlines target)')).toBeInTheDocument()
    expect(screen.getByText('Life Event Transitioners (Indeed)')).toBeInTheDocument()
  })

  it('displays all 3 signal descriptions', () => {
    render(<InsightPulse />)
    expect(screen.getByText(/Propensity spike \+3\.2x/)).toBeInTheDocument()
    expect(screen.getByText(/18% switching rate/)).toBeInTheDocument()
    expect(screen.getByText(/Q1 job transition index \+28%/)).toBeInTheDocument()
  })

  it('displays all 3 action recommendations', () => {
    render(<InsightPulse />)
    expect(screen.getByText(/Expand Ricola campaign budget by 15%/)).toBeInTheDocument()
    expect(screen.getByText(/Activate Frontier Switcher/)).toBeInTheDocument()
    expect(screen.getByText(/Indeed campaign CVR is 40% above/)).toBeInTheDocument()
  })

  it('first alert has green left border (positive type)', () => {
    const { container } = render(<InsightPulse />)
    const alerts = container.querySelector('.flex.flex-col.gap-3').children
    expect(alerts[0]).toHaveStyle({ borderLeft: '3px solid #22C55E' })
  })

  it('second alert has amber left border (caution type)', () => {
    const { container } = render(<InsightPulse />)
    const alerts = container.querySelector('.flex.flex-col.gap-3').children
    expect(alerts[1]).toHaveStyle({ borderLeft: '3px solid #F59E0B' })
  })

  it('third alert has green left border (positive type)', () => {
    const { container } = render(<InsightPulse />)
    const alerts = container.querySelector('.flex.flex-col.gap-3').children
    expect(alerts[2]).toHaveStyle({ borderLeft: '3px solid #22C55E' })
  })

  it('displays up-arrow icons for positive alerts', () => {
    render(<InsightPulse />)
    const upArrows = screen.getAllByText('\u2191')
    expect(upArrows).toHaveLength(2) // pulse-1 and pulse-3
  })

  it('displays warning icon for caution alert', () => {
    render(<InsightPulse />)
    expect(screen.getByText('\u26A0')).toBeInTheDocument()
  })

  it('action text matches alert color', () => {
    render(<InsightPulse />)
    const ricolaAction = screen.getByText(/Expand Ricola campaign budget/)
    expect(ricolaAction).toHaveStyle({ color: '#22C55E' })
    const spiritAction = screen.getByText(/Activate Frontier Switcher/)
    expect(spiritAction).toHaveStyle({ color: '#F59E0B' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - pulseAlerts data is hardcoded in the component file -- should be in the data layer
 * - The alert type ('positive'/'caution') maps directly to color -- could use a shared alertColor utility
 * - Icon selection (arrow vs warning) based on type is a simple ternary -- clean and readable
 * - The component is a simple list with no interactivity -- could be a generic AlertList component
 */
