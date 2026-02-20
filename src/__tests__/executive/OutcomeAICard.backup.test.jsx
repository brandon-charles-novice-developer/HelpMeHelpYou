import { render, screen } from '@testing-library/react'
import OutcomeAICard from '../../components/executive/OutcomeAICard'
import { agencyLevelCards } from '../../data/outcomeAI'

describe('OutcomeAICard — real data and edge cases', () => {
  it('renders with the first real agency-level card data', () => {
    render(<OutcomeAICard card={agencyLevelCards[0]} index={1} />)
    expect(screen.getByText(agencyLevelCards[0].insight)).toBeInTheDocument()
    expect(screen.getByText(agencyLevelCards[0].recommendation)).toBeInTheDocument()
    expect(screen.getByText(agencyLevelCards[0].expectedImpact)).toBeInTheDocument()
  })

  it('renders all 3 real agency cards without error', () => {
    agencyLevelCards.forEach((card, i) => {
      const { container } = render(<OutcomeAICard card={card} index={i + 1} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('the outer container has rounded-card and overflow-hidden classes', () => {
    const { container } = render(<OutcomeAICard card={agencyLevelCards[0]} />)
    expect(container.firstChild).toHaveClass('rounded-card', 'overflow-hidden')
  })

  it('applies box shadow to the outer container', () => {
    const { container } = render(<OutcomeAICard card={agencyLevelCards[0]} />)
    expect(container.firstChild).toHaveStyle({
      boxShadow: 'rgba(0, 0, 0, 0.25) 0px 2px 40px 0px',
    })
  })

  it('insight header contains a purple status dot indicator', () => {
    const { container } = render(<OutcomeAICard card={agencyLevelCards[0]} index={1} />)
    const zone1 = container.firstChild.children[0]
    const dot = zone1.querySelector('span.rounded-full')
    expect(dot).toBeInTheDocument()
    expect(dot).toHaveStyle({ backgroundColor: '#67579E' })
  })

  it('each zone has p-5 padding class', () => {
    const { container } = render(<OutcomeAICard card={agencyLevelCards[0]} />)
    Array.from(container.firstChild.children).forEach((zone) => {
      expect(zone).toHaveClass('p-5')
    })
  })

  it('insight text is white colored', () => {
    render(<OutcomeAICard card={agencyLevelCards[0]} index={1} />)
    const insightText = screen.getByText(agencyLevelCards[0].insight)
    expect(insightText).toHaveClass('text-white')
  })

  it('recommendation text is white colored', () => {
    render(<OutcomeAICard card={agencyLevelCards[0]} index={1} />)
    const recText = screen.getByText(agencyLevelCards[0].recommendation)
    expect(recText).toHaveClass('text-white')
  })

  it('impact text has font-bold class', () => {
    render(<OutcomeAICard card={agencyLevelCards[0]} index={1} />)
    const impact = screen.getByText(agencyLevelCards[0].expectedImpact)
    expect(impact).toHaveClass('font-bold')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Tests here use real data from the data module -- validates integration between data and component
 * - The purple dot indicator (#67579E) is hardcoded in the component and also in the header text -- could be a themed constant
 * - Zone backgrounds could be driven by a theme config instead of 3 separate inline styles
 * - The component is stateless and takes only props -- this is ideal; no internal state to test
 */
