import { render, screen } from '@testing-library/react'
import SwitchingBehaviorChart from '../../components/insights/SwitchingBehaviorChart'
import { shopperInsights } from '../../data/shopperInsights'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

const mockData = shopperInsights.kayak.switching

describe('SwitchingBehaviorChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<SwitchingBehaviorChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(<SwitchingBehaviorChart data={mockData} />)
    expect(screen.getByText('Switching Behavior')).toBeInTheDocument()
  })

  it('displays the insight text', () => {
    render(<SwitchingBehaviorChart data={mockData} />)
    expect(screen.getByText(mockData.insight)).toBeInTheDocument()
  })

  it('displays legend labels', () => {
    render(<SwitchingBehaviorChart data={mockData} />)
    expect(screen.getByText('Switched To')).toBeInTheDocument()
    expect(screen.getByText('Switched From')).toBeInTheDocument()
  })

  it('displays net change cards for each competitor', () => {
    render(<SwitchingBehaviorChart data={mockData} />)
    mockData.competitors.forEach((c) => {
      expect(screen.getByText(c.brand)).toBeInTheDocument()
    })
  })

  it('displays net change label on each card', () => {
    render(<SwitchingBehaviorChart data={mockData} />)
    const netLabels = screen.getAllByText('net change')
    expect(netLabels).toHaveLength(mockData.competitors.length)
  })

  it('shows positive net changes in green and negative in red', () => {
    render(<SwitchingBehaviorChart data={mockData} />)
    // Priceline has positive net (+0.02)
    const priceline = mockData.competitors.find((c) => c.net >= 0)
    if (priceline) {
      const netValue = `+${(priceline.net * 100).toFixed(1)}%`
      expect(screen.getByText(netValue)).toHaveStyle({ color: '#22C55E' })
    }
    // Expedia has negative net (-0.10)
    const expedia = mockData.competitors.find((c) => c.net < 0)
    if (expedia) {
      const netValue = `${(expedia.net * 100).toFixed(1)}%`
      expect(screen.getByText(netValue)).toHaveStyle({ color: '#EF4444' })
    }
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The net change calculation uses `(c.net * 100).toFixed(1)` inline — could be a shared formatter.
 * - The net change grid is separate from the chart; could be its own sub-component.
 * - Tests avoid deep SVG testing (correct for Recharts) and focus on text and styling.
 * - No redundant patterns in these tests.
 */
