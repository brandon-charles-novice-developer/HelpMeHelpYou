import { render, screen } from '@testing-library/react'
import OutcomeAIPanel from '../../components/executive/OutcomeAIPanel'
import { agencyLevelCards } from '../../data/outcomeAI'

// Mock useFadeIn to avoid IntersectionObserver issues
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('OutcomeAIPanel', () => {
  it('renders without error', () => {
    const { container } = render(<OutcomeAIPanel />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the "OutcomeAI Insights" section label', () => {
    render(<OutcomeAIPanel />)
    expect(screen.getByText('OutcomeAI Insights')).toBeInTheDocument()
  })

  it('renders exactly 3 OutcomeAI cards', () => {
    const { container } = render(<OutcomeAIPanel />)
    const grid = container.querySelector('.grid-cols-3')
    expect(grid).toBeInTheDocument()
    expect(grid.children).toHaveLength(3)
  })

  it('displays insight text from all 3 agency-level cards', () => {
    render(<OutcomeAIPanel />)
    agencyLevelCards.forEach((card) => {
      expect(screen.getByText(card.insight)).toBeInTheDocument()
    })
  })

  it('displays recommendation text from all 3 agency-level cards', () => {
    render(<OutcomeAIPanel />)
    agencyLevelCards.forEach((card) => {
      expect(screen.getByText(card.recommendation)).toBeInTheDocument()
    })
  })

  it('displays expected impact from all 3 agency-level cards', () => {
    render(<OutcomeAIPanel />)
    agencyLevelCards.forEach((card) => {
      expect(screen.getByText(card.expectedImpact)).toBeInTheDocument()
    })
  })

  it('uses a 3-column grid layout', () => {
    const { container } = render(<OutcomeAIPanel />)
    const grid = container.querySelector('.grid-cols-3')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid', 'gap-4')
  })

  it('cards are indexed starting from 1', () => {
    render(<OutcomeAIPanel />)
    expect(screen.getByText(/OutcomeHQ AI Insight.*#1/)).toBeInTheDocument()
    expect(screen.getByText(/OutcomeHQ AI Insight.*#2/)).toBeInTheDocument()
    expect(screen.getByText(/OutcomeHQ AI Insight.*#3/)).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - OutcomeAIPanel is a thin wrapper that passes data to OutcomeAICard -- this is good composition
 * - The agencyLevelCards filter runs on every import -- could be pre-computed and exported as a constant (which it is)
 * - SectionLabel is reused across multiple panels -- consistent pattern
 * - useFadeIn per-panel (not per-card) is the right granularity -- only one observer instance
 */
