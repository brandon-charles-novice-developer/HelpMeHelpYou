import { render, screen } from '@testing-library/react'
import CategoryInsightsChart from '../../components/insights/CategoryInsightsChart'

describe('CategoryInsightsChart — bar widths and boundary conditions', () => {
  it('renders progress bar with correct width percentage', () => {
    const data = {
      title: 'Bar Width',
      data: [{ category: 'Test Category', share: 0.65, index: 140 }],
    }
    const { container } = render(<CategoryInsightsChart data={data} />)
    const innerBar = container.querySelector('.h-full.rounded-full.transition-all')
    expect(innerBar).toHaveStyle({ width: '65%' })
  })

  it('renders 100% bar for share of 1.0', () => {
    const data = {
      title: 'Full Bar',
      data: [{ category: 'Full Share', share: 1.0, index: 200 }],
    }
    const { container } = render(<CategoryInsightsChart data={data} />)
    const innerBar = container.querySelector('.h-full.rounded-full.transition-all')
    expect(innerBar).toHaveStyle({ width: '100%' })
  })

  it('applies correct bar fill color based on index threshold', () => {
    const data = {
      title: 'Colors',
      data: [
        { category: 'Green', share: 0.50, index: 180 },
        { category: 'Blue', share: 0.40, index: 130 },
        { category: 'Gray', share: 0.30, index: 110 },
      ],
    }
    const { container } = render(<CategoryInsightsChart data={data} />)
    const bars = container.querySelectorAll('.h-full.rounded-full.transition-all')
    expect(bars[0]).toHaveStyle({ backgroundColor: '#22C55E' })
    expect(bars[1]).toHaveStyle({ backgroundColor: '#5C70D6' })
    expect(bars[2]).toHaveStyle({ backgroundColor: '#AFADAD' })
  })

  it('handles boundary index value of exactly 130', () => {
    const data = {
      title: 'Boundary',
      data: [{ category: 'Boundary 130', share: 0.35, index: 130 }],
    }
    render(<CategoryInsightsChart data={data} />)
    const badge = screen.getByText('130 index')
    expect(badge).toHaveStyle({ color: '#5C70D6' })
  })

  it('handles boundary index value of exactly 180', () => {
    const data = {
      title: 'Boundary',
      data: [{ category: 'Boundary 180', share: 0.45, index: 180 }],
    }
    render(<CategoryInsightsChart data={data} />)
    const badge = screen.getByText('180 index')
    expect(badge).toHaveStyle({ color: '#22C55E' })
  })

  it('renders with empty data array', () => {
    const data = {
      title: 'Empty',
      data: [],
    }
    render(<CategoryInsightsChart data={data} />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('renders with many categories', () => {
    const data = {
      title: 'Many Categories',
      data: Array.from({ length: 8 }, (_, i) => ({
        category: `Category ${i + 1}`,
        share: 0.1 * (i + 1),
        index: 100 + i * 15,
      })),
    }
    render(<CategoryInsightsChart data={data} />)
    expect(screen.getByText('Category 1')).toBeInTheDocument()
    expect(screen.getByText('Category 8')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The index color threshold logic (>= 180, >= 130, else) is repeated for both the badge
 *   and the bar fill — a single function would eliminate this duplication.
 * - Backup tests focus on bar rendering, boundary conditions, and empty/large datasets.
 * - The transition-all class on bars is purely cosmetic; no animation testing needed.
 * - Clean separation between primary (data display) and backup (visual/edge) tests.
 */
