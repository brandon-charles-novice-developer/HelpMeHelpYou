import { render, screen } from '@testing-library/react'
import RetailerBreakdown from '../../components/measurement/RetailerBreakdown'

describe('RetailerBreakdown — edge cases and styling', () => {
  it('renders with a single retailer', () => {
    const retailers = [{ retailer: 'Only Store', share: 1.0 }]
    render(<RetailerBreakdown retailers={retailers} />)
    expect(screen.getByText('Only Store')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('does not mutate the original retailers array', () => {
    const original = [
      { retailer: 'A', share: 0.20 },
      { retailer: 'B', share: 0.80 },
    ]
    render(<RetailerBreakdown retailers={original} />)
    expect(original[0].retailer).toBe('A')
    expect(original[1].retailer).toBe('B')
  })

  it('renders with Ricola retailer breakdown data', () => {
    const retailers = [
      { retailer: 'CVS', share: 0.38 },
      { retailer: 'Walgreens', share: 0.26 },
      { retailer: 'Target', share: 0.19 },
      { retailer: 'Whole Foods', share: 0.12 },
      { retailer: 'Other', share: 0.05 },
    ]
    render(<RetailerBreakdown retailers={retailers} />)
    expect(screen.getByText('CVS')).toBeInTheDocument()
    expect(screen.getByText('38%')).toBeInTheDocument()
    expect(screen.getByText('Whole Foods')).toBeInTheDocument()
    expect(screen.getByText('5%')).toBeInTheDocument()
  })

  it('all bars use the same blue color', () => {
    const retailers = [
      { retailer: 'R1', share: 0.50 },
      { retailer: 'R2', share: 0.50 },
    ]
    const { container } = render(<RetailerBreakdown retailers={retailers} />)
    const bars = container.querySelectorAll('.h-full.rounded-full.transition-all')
    bars.forEach((bar) => {
      expect(bar).toHaveStyle({ backgroundColor: '#5C70D6' })
    })
  })

  it('applies glass-card styling', () => {
    const retailers = [{ retailer: 'Test', share: 0.30 }]
    const { container } = render(<RetailerBreakdown retailers={retailers} />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('renders heading with uppercase tracking-widest class', () => {
    const retailers = [{ retailer: 'Test', share: 0.30 }]
    render(<RetailerBreakdown retailers={retailers} />)
    const heading = screen.getByText('Cross-Retailer Attribution')
    expect(heading).toHaveClass('uppercase', 'tracking-widest')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - All bars share the same color; using different colors or opacity based on rank
 *   would improve visual hierarchy.
 * - The component pattern (heading + sorted bars) is nearly identical to CategoryInsightsChart;
 *   a shared BarList component could serve both.
 * - Backup tests cover immutability, real data, and consistent styling.
 * - No redundancy with primary tests.
 */
