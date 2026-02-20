import { render, screen } from '@testing-library/react'
import LoyaltySegmentsChart from '../../components/insights/LoyaltySegmentsChart'
import { shopperInsights } from '../../data/shopperInsights'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

const mockData = shopperInsights.kayak.loyalty

describe('LoyaltySegmentsChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoyaltySegmentsChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(<LoyaltySegmentsChart data={mockData} />)
    expect(screen.getByText('Loyalty Segments')).toBeInTheDocument()
  })

  it('displays the insight text', () => {
    render(<LoyaltySegmentsChart data={mockData} />)
    expect(screen.getByText(mockData.insight)).toBeInTheDocument()
  })

  it('displays all segment labels', () => {
    render(<LoyaltySegmentsChart data={mockData} />)
    mockData.segments.forEach((s) => {
      expect(screen.getByText(s.label)).toBeInTheDocument()
    })
  })

  it('displays segment percentage values', () => {
    render(<LoyaltySegmentsChart data={mockData} />)
    mockData.segments.forEach((s) => {
      const pct = `${Math.round(s.share * 100)}%`
      expect(screen.getByText(pct)).toBeInTheDocument()
    })
  })

  it('displays HHI index for each segment', () => {
    render(<LoyaltySegmentsChart data={mockData} />)
    mockData.segments.forEach((s) => {
      expect(screen.getByText(`HHI ${s.hhiIndex}`)).toBeInTheDocument()
    })
  })

  it('renders the PieChart wrapper area', () => {
    const { container } = render(<LoyaltySegmentsChart data={mockData} />)
    // ResponsiveContainer with fixed width renders as a div; verify the chart area exists
    // If recharts classes are not present (jsdom limitation), verify the flex layout containing the chart
    const flexLayout = container.querySelector('.flex.items-start.gap-6')
    expect(flexLayout).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The segment bar list and the PieChart display the same data — a single data-driven
 *   layout would reduce duplication in the component.
 * - HHI index is shown as a raw number; adding a tooltip explaining what HHI means
 *   would improve UX without code complexity.
 * - Tests focus on text rendering and avoid PieChart SVG internals (correct approach).
 * - No over-engineering in tests.
 */
