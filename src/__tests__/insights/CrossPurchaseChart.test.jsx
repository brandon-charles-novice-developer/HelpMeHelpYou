import { render, screen } from '@testing-library/react'
import CrossPurchaseChart from '../../components/insights/CrossPurchaseChart'
import { shopperInsights } from '../../data/shopperInsights'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

const mockData = shopperInsights.kayak.crossPurchase

describe('CrossPurchaseChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<CrossPurchaseChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(<CrossPurchaseChart data={mockData} />)
    expect(screen.getByText('Cross-Purchase')).toBeInTheDocument()
  })

  it('displays the insight text', () => {
    render(<CrossPurchaseChart data={mockData} />)
    expect(screen.getByText(mockData.insight)).toBeInTheDocument()
  })

  it('renders the chart container', () => {
    const { container } = render(<CrossPurchaseChart data={mockData} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('renders with ricola cross-purchase data', () => {
    const ricolaData = shopperInsights.ricola.crossPurchase
    render(<CrossPurchaseChart data={ricolaData} />)
    expect(screen.getByText('Cross-Purchase')).toBeInTheDocument()
    expect(screen.getByText(ricolaData.insight)).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - CrossPurchaseChart uses a horizontal BarChart with a label renderer that accesses
 *   `entry?.index` — the optional chaining suggests defensive coding against undefined
 *   entries; the data contract should guarantee index exists.
 * - The domain is hard-coded to [0, 70] — this should be dynamic based on data.
 * - Tests correctly avoid deep SVG testing for the horizontal bar chart.
 * - No over-engineering in tests.
 */
