import { render, screen } from '@testing-library/react'
import SalesLiftChart from '../../components/measurement/SalesLiftChart'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

const mockData = [
  { week: 'W1', observed: 92000, expected: 85000, incremental: 7000 },
  { week: 'W2', observed: 98000, expected: 86000, incremental: 12000 },
  { week: 'W3', observed: 105000, expected: 88000, incremental: 17000 },
  { week: 'W4', observed: 110000, expected: 90000, incremental: 20000 },
]

describe('SalesLiftChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<SalesLiftChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the section heading', () => {
    render(<SalesLiftChart data={mockData} />)
    expect(screen.getByText('Sales Lift')).toBeInTheDocument()
  })

  it('displays legend labels', () => {
    render(<SalesLiftChart data={mockData} />)
    expect(screen.getByText('Observed')).toBeInTheDocument()
    expect(screen.getByText('Expected')).toBeInTheDocument()
    expect(screen.getByText('Incremental')).toBeInTheDocument()
  })

  it('renders the chart container', () => {
    const { container } = render(<SalesLiftChart data={mockData} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('applies glass-card styling', () => {
    const { container } = render(<SalesLiftChart data={mockData} />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('renders with empty data array', () => {
    const { container } = render(<SalesLiftChart data={[]} />)
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Sales Lift')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The fmt() function handles $M/$K/$plain formatting — it's a local utility that could
 *   be shared across measurement components.
 * - CustomTooltip is a good extraction but lives inside the module; if reused, extract to shared.
 * - The gradient definition (incrementalGrad) is inline SVG — standard Recharts pattern.
 * - Tests correctly avoid deep SVG/path testing and verify structure + labels.
 */
