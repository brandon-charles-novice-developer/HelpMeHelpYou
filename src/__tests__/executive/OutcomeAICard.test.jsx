import { render, screen } from '@testing-library/react'
import OutcomeAICard from '../../components/executive/OutcomeAICard'

const mockCard = {
  id: 'ai-test-1',
  insight: 'Test insight about performance trends.',
  recommendation: 'Shift budget to higher-performing channels.',
  expectedImpact: '+$50K in incremental revenue',
  impactPositive: true,
}

const negativeCard = {
  id: 'ai-test-neg',
  insight: 'Declining conversion in Q4.',
  recommendation: 'Pause underperforming segments.',
  expectedImpact: '-12% projected revenue loss',
  impactPositive: false,
}

describe('OutcomeAICard', () => {
  it('renders without error', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the insight text in Zone 1', () => {
    render(<OutcomeAICard card={mockCard} />)
    expect(screen.getByText(mockCard.insight)).toBeInTheDocument()
  })

  it('displays the recommendation text in Zone 2', () => {
    render(<OutcomeAICard card={mockCard} />)
    expect(screen.getByText(mockCard.recommendation)).toBeInTheDocument()
  })

  it('displays the expected impact text in Zone 3', () => {
    render(<OutcomeAICard card={mockCard} />)
    expect(screen.getByText(mockCard.expectedImpact)).toBeInTheDocument()
  })

  it('has 3 zones as child divs', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    const zones = container.firstChild.children
    expect(zones).toHaveLength(3)
  })

  it('Zone 1 has glassmorphism background', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    const zone1 = container.firstChild.children[0]
    expect(zone1).toHaveStyle({ background: 'rgba(30, 26, 46, 0.60)' })
    expect(zone1).toHaveStyle({ backdropFilter: 'blur(14px)' })
  })

  it('Zone 2 has glassmorphism background', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    const zone2 = container.firstChild.children[1]
    expect(zone2).toHaveStyle({ background: 'rgba(77, 65, 118, 0.40)' })
    expect(zone2).toHaveStyle({ backdropFilter: 'blur(12px)' })
  })

  it('Zone 3 has glassmorphism background', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    const zone3 = container.firstChild.children[2]
    expect(zone3).toHaveStyle({ background: 'rgba(37, 32, 64, 0.50)' })
    expect(zone3).toHaveStyle({ backdropFilter: 'blur(14px)' })
  })

  it('displays "Recommendation" section label', () => {
    render(<OutcomeAICard card={mockCard} />)
    expect(screen.getByText('Recommendation')).toBeInTheDocument()
  })

  it('displays "Expected Impact" section label', () => {
    render(<OutcomeAICard card={mockCard} />)
    expect(screen.getByText('Expected Impact')).toBeInTheDocument()
  })

  it('shows index number in insight header when index > 0', () => {
    render(<OutcomeAICard card={mockCard} index={2} />)
    expect(screen.getByText(/Outcome HQ AI Insight/)).toHaveTextContent('#2')
  })

  it('does not show index number when index is 0 (default)', () => {
    render(<OutcomeAICard card={mockCard} index={0} />)
    const header = screen.getByText(/Outcome HQ AI Insight/)
    expect(header.textContent).not.toContain('#')
  })

  it('applies green color to positive impact', () => {
    render(<OutcomeAICard card={mockCard} />)
    const impact = screen.getByText(mockCard.expectedImpact)
    expect(impact).toHaveStyle({ color: '#22C55E' })
  })

  it('applies red color to negative impact', () => {
    render(<OutcomeAICard card={negativeCard} />)
    const impact = screen.getByText(negativeCard.expectedImpact)
    expect(impact).toHaveStyle({ color: '#EF4444' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The 3-zone backgrounds are hardcoded inline styles -- could be constants or CSS variables
 * - The index display logic (index > 0 ? `#${index}` : '') is a minor inline conditional that could be extracted
 * - impactPositive color ternary is the same pattern as deltaColor in AgencyScoreboard -- could share a color utility
 * - The card takes a single `card` prop object -- this is clean and simple
 */
