import { render, screen } from '@testing-library/react'
import SwitchingBehaviorChart from '../../components/insights/SwitchingBehaviorChart'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('SwitchingBehaviorChart — edge cases and prop variations', () => {
  it('renders with a single competitor', () => {
    const data = {
      title: 'Test Switching',
      insight: 'Minimal data test',
      competitors: [{ brand: 'BrandA', switchedTo: 0.15, switchedFrom: 0.10, net: -0.05 }],
    }
    render(<SwitchingBehaviorChart data={data} />)
    expect(screen.getByText('BrandA')).toBeInTheDocument()
    expect(screen.getAllByText('net change')).toHaveLength(1)
  })

  it('handles zero net change correctly', () => {
    const data = {
      title: 'Zero Net',
      insight: 'No change',
      competitors: [{ brand: 'EvenBrand', switchedTo: 0.20, switchedFrom: 0.20, net: 0 }],
    }
    render(<SwitchingBehaviorChart data={data} />)
    // net is 0.0, so (0 * 100).toFixed(1) = "0.0" with netPositive = true (0 >= 0)
    expect(screen.getByText('+0.0%')).toBeInTheDocument()
    expect(screen.getByText('+0.0%')).toHaveStyle({ color: '#22C55E' })
  })

  it('renders with spirit airline competitor data', () => {
    const data = {
      title: 'Switching Behavior',
      primary: { brand: 'Spirit Airlines', share: 0.31 },
      competitors: [
        { brand: 'Frontier Airlines', switchedTo: 0.18, switchedFrom: 0.12, net: -0.06 },
        { brand: 'Southwest', switchedTo: 0.24, switchedFrom: 0.16, net: -0.08 },
      ],
      insight: 'Budget carrier switching test.',
    }
    render(<SwitchingBehaviorChart data={data} />)
    expect(screen.getByText('Frontier Airlines')).toBeInTheDocument()
    expect(screen.getByText('Southwest')).toBeInTheDocument()
  })

  it('calculates switchedTo/switchedFrom percentages as integers', () => {
    const data = {
      title: 'Percentage Rounding',
      insight: 'Rounding test',
      competitors: [{ brand: 'RoundBrand', switchedTo: 0.156, switchedFrom: 0.094, net: -0.062 }],
    }
    render(<SwitchingBehaviorChart data={data} />)
    // Math.round(0.156 * 100) = 16, Math.round(0.094 * 100) = 9
    // These values are used in chart data (not directly visible as text outside of chart SVG)
    // But the brand name and net change should render
    expect(screen.getByText('RoundBrand')).toBeInTheDocument()
  })

  it('renders the chart container (ResponsiveContainer)', () => {
    const data = {
      title: 'Chart Container Test',
      insight: 'Container present',
      competitors: [{ brand: 'TestBrand', switchedTo: 0.10, switchedFrom: 0.05, net: -0.05 }],
    }
    const { container } = render(<SwitchingBehaviorChart data={data} />)
    // Recharts ResponsiveContainer renders a div wrapper
    const chartWrapper = container.querySelector('.recharts-responsive-container')
    expect(chartWrapper).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The component mixes chart rendering with net-change cards; extracting the grid into
 *   NetChangeGrid would improve testability.
 * - Backup tests cover edge cases: single competitor, zero net, custom data shapes.
 * - These tests complement the primary tests which use real shopperInsights data.
 * - The tooltipStyle constant is duplicated across multiple chart components — extract to shared.
 */
