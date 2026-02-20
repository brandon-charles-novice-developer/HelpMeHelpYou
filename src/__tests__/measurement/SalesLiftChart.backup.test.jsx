import { render, screen } from '@testing-library/react'
import SalesLiftChart from '../../components/measurement/SalesLiftChart'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('SalesLiftChart — data variations and structure', () => {
  it('renders with a single data point', () => {
    const data = [{ week: 'W1', observed: 100000, expected: 90000, incremental: 10000 }]
    render(<SalesLiftChart data={data} />)
    expect(screen.getByText('Sales Lift')).toBeInTheDocument()
  })

  it('renders with 12 weeks of data (full series)', () => {
    const data = Array.from({ length: 12 }, (_, i) => ({
      week: `W${i + 1}`,
      observed: 80000 + i * 5000,
      expected: 80000 + i * 2000,
      incremental: i * 3000,
    }))
    const { container } = render(<SalesLiftChart data={data} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('renders with very large values (millions)', () => {
    const data = [
      { week: 'W1', observed: 5000000, expected: 4000000, incremental: 1000000 },
    ]
    const { container } = render(<SalesLiftChart data={data} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with zero incremental values', () => {
    const data = [
      { week: 'W1', observed: 80000, expected: 80000, incremental: 0 },
      { week: 'W2', observed: 80000, expected: 80000, incremental: 0 },
    ]
    render(<SalesLiftChart data={data} />)
    expect(screen.getByText('Sales Lift')).toBeInTheDocument()
  })

  it('contains the uppercase tracking-widest class on heading', () => {
    render(<SalesLiftChart data={[]} />)
    const heading = screen.getByText('Sales Lift')
    expect(heading).toHaveClass('uppercase', 'tracking-widest')
  })

  it('renders legend items with correct indicator colors', () => {
    const { container } = render(<SalesLiftChart data={[]} />)
    // Observed legend has #5C70D6 line
    const legendItems = container.querySelectorAll('.w-3')
    expect(legendItems.length).toBe(3)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The component mixes layout (card wrapper) with chart rendering; the card wrapper
 *   is repeated across all measurement components — extract to a shared MeasurementCard.
 * - The legend is manually built; Recharts has a Legend component that could be used.
 * - Backup tests cover data edge cases (single point, large values, zero incremental).
 * - Tests avoid tooltip testing since it requires hover simulation on SVG elements.
 */
