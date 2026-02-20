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

  it('Zone 1 has dark background (#1E1A2E)', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    const zone1 = container.firstChild.children[0]
    expect(zone1).toHaveStyle({ backgroundColor: '#1E1A2E' })
  })

  it('Zone 2 has purple background (#4D4176)', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    const zone2 = container.firstChild.children[1]
    expect(zone2).toHaveStyle({ backgroundColor: '#4D4176' })
  })

  it('Zone 3 has card surface background (#252040)', () => {
    const { container } = render(<OutcomeAICard card={mockCard} />)
    const zone3 = container.firstChild.children[2]
    expect(zone3).toHaveStyle({ backgroundColor: '#252040' })
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
    expect(screen.getByText(/OutcomeHQ AI Insight/)).toHaveTextContent('#2')
  })

  it('does not show index number when index is 0 (default)', () => {
    render(<OutcomeAICard card={mockCard} index={0} />)
    const header = screen.getByText(/OutcomeHQ AI Insight/)
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
