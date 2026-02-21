import { render, screen } from '@testing-library/react'
import ConversionChart from '../../components/executive/ConversionChart'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

// Mock Recharts to avoid SVG rendering issues in jsdom
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container" style={{ width: 500, height: 200 }}>
        {children}
      </div>
    ),
  }
})

describe('ConversionChart', () => {
  it('renders without error', () => {
    const { container } = render(<ConversionChart />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the section label "Conversion Rate vs CTV Benchmark"', () => {
    render(<ConversionChart />)
    expect(screen.getByText('Conversion Rate vs CTV Benchmark')).toBeInTheDocument()
  })

  it('displays the Tombras CVR legend label', () => {
    render(<ConversionChart />)
    expect(screen.getByText('Tombras Blended CVR')).toBeInTheDocument()
  })

  it('displays the CTV benchmark legend label', () => {
    render(<ConversionChart />)
    expect(screen.getByText('CTV Benchmark (2.8%)')).toBeInTheDocument()
  })

  it('renders the chart container', () => {
    render(<ConversionChart />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('has glass-card class', () => {
    const { container } = render(<ConversionChart />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('has rounded-card class', () => {
    const { container } = render(<ConversionChart />)
    expect(container.firstChild).toHaveClass('rounded-card')
  })

  it('has glass-card class for shadow styling', () => {
    const { container } = render(<ConversionChart />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('legend items have muted gray color', () => {
    render(<ConversionChart />)
    const tombrasLabel = screen.getByText('Tombras Blended CVR')
    expect(tombrasLabel).toHaveStyle({ color: '#AFADAD' })
    const benchmarkLabel = screen.getByText('CTV Benchmark (2.8%)')
    expect(benchmarkLabel).toHaveStyle({ color: '#AFADAD' })
  })

  it('applies fade-up-visible class', () => {
    const { container } = render(<ConversionChart />)
    expect(container.firstChild).toHaveClass('fade-up-visible')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The chart data is hardcoded inline -- could be imported from the data layer for consistency
 * - CustomTooltip is defined inside the file -- could be extracted as a shared chart tooltip component
 * - The Recharts mock is necessary because jsdom cannot render SVG charts properly
 * - The legend is manually built with spans -- Recharts has a Legend component that could replace this
 * - tooltipStyle is a plain object -- consistent with the rest of the codebase's inline style approach
 */
