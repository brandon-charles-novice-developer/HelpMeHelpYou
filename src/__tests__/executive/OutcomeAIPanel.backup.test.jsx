import { render, screen } from '@testing-library/react'
import OutcomeAIPanel from '../../components/executive/OutcomeAIPanel'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('OutcomeAIPanel — structure and styling', () => {
  it('applies fade-up-visible class to root wrapper', () => {
    const { container } = render(<OutcomeAIPanel />)
    expect(container.firstChild).toHaveClass('fade-up-visible')
  })

  it('each card has 3 zones (insight, recommendation, impact)', () => {
    const { container } = render(<OutcomeAIPanel />)
    const grid = container.querySelector('.grid-cols-3')
    Array.from(grid.children).forEach((card) => {
      // Each OutcomeAICard has 3 child divs (zones)
      expect(card.children).toHaveLength(3)
    })
  })

  it('all cards display "Recommendation" label', () => {
    render(<OutcomeAIPanel />)
    const recLabels = screen.getAllByText('Recommendation')
    expect(recLabels).toHaveLength(3)
  })

  it('all cards display "Expected Impact" label', () => {
    render(<OutcomeAIPanel />)
    const impactLabels = screen.getAllByText('Expected Impact')
    expect(impactLabels).toHaveLength(3)
  })

  it('section label has uppercase tracking-widest classes', () => {
    render(<OutcomeAIPanel />)
    const label = screen.getByText('OutcomeAI Insights')
    expect(label).toHaveClass('uppercase', 'tracking-widest')
  })

  it('all 3 impact values are green (all agency cards are impactPositive)', () => {
    const { container } = render(<OutcomeAIPanel />)
    const grid = container.querySelector('.grid-cols-3')
    Array.from(grid.children).forEach((card) => {
      const zone3 = card.children[2]
      const impactText = zone3.querySelector('.font-bold')
      expect(impactText).toHaveStyle({ color: '#22C55E' })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Backup tests focus on structural invariants (3 zones per card, consistent labels)
 * - All agency-level cards happen to be impactPositive: true, so there is no negative impact color path exercised here
 * - The panel could accept cards as a prop for easier testing with different datasets
 * - The SectionLabel + grid pattern is repeated in ShopperInsightsPanel and InsightPulse -- could be a generic PanelLayout
 */
