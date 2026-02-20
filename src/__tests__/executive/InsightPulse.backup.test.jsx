import { render, screen } from '@testing-library/react'
import InsightPulse from '../../components/executive/InsightPulse'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('InsightPulse — card structure and styling', () => {
  it('applies fade-up-visible class to root', () => {
    const { container } = render(<InsightPulse />)
    expect(container.firstChild).toHaveClass('fade-up-visible')
  })

  it('each alert card has rounded-card class', () => {
    const { container } = render(<InsightPulse />)
    const alertList = container.querySelector('.flex.flex-col.gap-3')
    Array.from(alertList.children).forEach((card) => {
      expect(card).toHaveClass('rounded-card')
    })
  })

  it('each alert card has dark background', () => {
    const { container } = render(<InsightPulse />)
    const alertList = container.querySelector('.flex.flex-col.gap-3')
    Array.from(alertList.children).forEach((card) => {
      expect(card).toHaveStyle({ backgroundColor: '#252040' })
    })
  })

  it('each alert card has hover translate animation class', () => {
    const { container } = render(<InsightPulse />)
    const alertList = container.querySelector('.flex.flex-col.gap-3')
    Array.from(alertList.children).forEach((card) => {
      expect(card).toHaveClass('hover:-translate-y-0.5')
    })
  })

  it('signal text has muted color (#AFADAD)', () => {
    render(<InsightPulse />)
    const signalText = screen.getByText(/Propensity spike \+3\.2x/)
    expect(signalText).toHaveStyle({ color: '#AFADAD' })
  })

  it('audience name text is white and has truncate class', () => {
    render(<InsightPulse />)
    const audience = screen.getByText('Q1 Cold-Season Purchasers (Ricola)')
    expect(audience).toHaveClass('text-white', 'truncate')
  })

  it('icon elements have matching color to their alert type', () => {
    const { container } = render(<InsightPulse />)
    const alertList = container.querySelector('.flex.flex-col.gap-3')
    // First card (positive): icon should be green
    const firstIcon = alertList.children[0].querySelector('.font-bold.flex-shrink-0')
    expect(firstIcon).toHaveStyle({ color: '#22C55E' })
    // Second card (caution): icon should be amber
    const secondIcon = alertList.children[1].querySelector('.font-bold.flex-shrink-0')
    expect(secondIcon).toHaveStyle({ color: '#F59E0B' })
  })

  it('cards are laid out in a vertical flex column', () => {
    const { container } = render(<InsightPulse />)
    const alertList = container.querySelector('.flex.flex-col.gap-3')
    expect(alertList).toHaveClass('flex', 'flex-col', 'gap-3')
  })

  it('section label has uppercase tracking-widest', () => {
    render(<InsightPulse />)
    const label = screen.getByText('Audience Trend Alerts')
    expect(label).toHaveClass('uppercase', 'tracking-widest')
  })

  it('each alert card has box shadow', () => {
    const { container } = render(<InsightPulse />)
    const alertList = container.querySelector('.flex.flex-col.gap-3')
    Array.from(alertList.children).forEach((card) => {
      expect(card).toHaveStyle({
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 1px 20px 0px',
      })
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The alert card layout (icon + content column) is a pattern that could be a shared AlertCard component
 * - Color-coding (green for positive, amber for caution) is duplicated in ClientPerformanceMap alerts
 * - The truncate class on audience name protects against overflow but names are short enough to never trigger it
 * - The component has zero interactivity -- purely presentational, which simplifies testing
 */
