import { render, screen } from '@testing-library/react'
import PurchaseImpactPanel from '../../components/measurement/PurchaseImpactPanel'
import { clients } from '../../data/clients'

const mockMetrics = clients[0].metrics // kayak

describe('PurchaseImpactPanel', () => {
  it('renders without crashing', () => {
    const { container } = render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the section heading', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('Purchase Impact Measurement')).toBeInTheDocument()
  })

  it('displays Conversion Rate label and value', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
    expect(screen.getByText('3.8%')).toBeInTheDocument() // (0.038 * 100).toFixed(1)
  })

  it('displays CTV benchmark label', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('2.8% CTV benchmark')).toBeInTheDocument()
  })

  it('displays benchmark delta', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    // delta = 0.038 - 0.028 = 0.01 -> +1.0pts vs benchmark
    expect(screen.getByText('+1.0pts vs benchmark')).toBeInTheDocument()
  })

  it('displays New Buyer CVR row', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('New Buyer CVR')).toBeInTheDocument()
    expect(screen.getByText('0.28%')).toBeInTheDocument() // (0.0028 * 100).toFixed(2)
    expect(screen.getByText('First-time purchasers')).toBeInTheDocument()
  })

  it('displays New Buyer ROAS row', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('New Buyer ROAS')).toBeInTheDocument()
    expect(screen.getByText('1.7x')).toBeInTheDocument()
    expect(screen.getByText('Return on ad spend, new buyers')).toBeInTheDocument()
  })

  it('displays New Buyer Sales Driven row', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('New Buyer Sales Driven')).toBeInTheDocument()
    expect(screen.getByText('$337K')).toBeInTheDocument() // 337000 / 1000 = 337
    expect(screen.getByText('Incremental verified purchases')).toBeInTheDocument()
  })

  it('displays New Buyer CPA row', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('New Buyer CPA')).toBeInTheDocument()
    expect(screen.getByText('$118')).toBeInTheDocument()
    expect(screen.getByText('Avg cost per new buyer')).toBeInTheDocument()
  })

  it('displays Avg Transaction row', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('Avg Transaction')).toBeInTheDocument()
    expect(screen.getByText('$24.50')).toBeInTheDocument()
    expect(screen.getByText('New buyer avg purchase value')).toBeInTheDocument()
  })

  it('shows benchmark ranges where applicable', () => {
    render(<PurchaseImpactPanel metrics={mockMetrics} />)
    expect(screen.getByText('0.22%–0.40% range')).toBeInTheDocument()
    expect(screen.getByText('1.2x–2.1x range')).toBeInTheDocument()
    expect(screen.getByText('$94–$140 range')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - CTV_BENCHMARK is a module-level constant; if this changes per campaign, it should be a prop.
 * - MetricRow is a good internal abstraction but could be extracted as a shared component.
 * - The CvrBar delta calculation is inline — a utility function would improve readability.
 * - Tests cover all 5 metric rows plus the CvrBar; comprehensive for a data-display panel.
 * - No mocking needed — clean component with props-only interface.
 */
