import { render, screen } from '@testing-library/react'
import ConversionChart from '../../components/executive/ConversionChart'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

// Mock Recharts with more granular component tracking
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children, width, height }) => (
    <div data-testid="responsive-container" data-width={width} data-height={height}>
      {children}
    </div>
  ),
  AreaChart: ({ children, data }) => (
    <div data-testid="area-chart" data-points={data?.length}>
      {children}
    </div>
  ),
  Area: ({ dataKey, name, stroke }) => (
    <div data-testid={`area-${dataKey}`} data-name={name} data-stroke={stroke} />
  ),
  XAxis: ({ dataKey }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ReferenceLine: ({ y, stroke }) => (
    <div data-testid="reference-line" data-y={y} data-stroke={stroke} />
  ),
}))

describe('ConversionChart — chart structure and data', () => {
  it('passes 12 data points to AreaChart', () => {
    render(<ConversionChart />)
    const chart = screen.getByTestId('area-chart')
    expect(chart).toHaveAttribute('data-points', '12')
  })

  it('renders a Tombras CVR area with correct stroke color', () => {
    render(<ConversionChart />)
    const area = screen.getByTestId('area-tombras')
    expect(area).toHaveAttribute('data-stroke', '#5C70D6')
    expect(area).toHaveAttribute('data-name', 'Tombras CVR')
  })

  it('renders a reference line at 2.8% benchmark', () => {
    render(<ConversionChart />)
    const refLine = screen.getByTestId('reference-line')
    expect(refLine).toHaveAttribute('data-y', '0.028')
    expect(refLine).toHaveAttribute('data-stroke', '#2DD4BF')
  })

  it('X axis uses "week" as dataKey', () => {
    render(<ConversionChart />)
    const xAxis = screen.getByTestId('x-axis')
    expect(xAxis).toHaveAttribute('data-key', 'week')
  })

  it('renders CartesianGrid, XAxis, YAxis, and Tooltip', () => {
    render(<ConversionChart />)
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
    expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
  })

  it('ResponsiveContainer has 100% width and 200px height', () => {
    render(<ConversionChart />)
    const container = screen.getByTestId('responsive-container')
    expect(container).toHaveAttribute('data-width', '100%')
    expect(container).toHaveAttribute('data-height', '200')
  })

  it('legend has a colored line indicator for Tombras', () => {
    render(<ConversionChart />)
    // The Tombras legend is next to the label text
    const tombrasLabel = screen.getByText('Tombras Blended CVR')
    const legendGroup = tombrasLabel.closest('.flex.items-center.gap-1\\.5')
    expect(legendGroup).toBeInTheDocument()
    // The line indicator span should exist as sibling
    const lineIndicator = legendGroup.querySelector('span.rounded')
    expect(lineIndicator).toBeInTheDocument()
  })

  it('section label has uppercase tracking-widest', () => {
    render(<ConversionChart />)
    const label = screen.getByText('Conversion Rate vs CTV Benchmark')
    expect(label).toHaveClass('uppercase', 'tracking-widest')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The granular Recharts mock lets us verify chart configuration without SVG rendering
 * - Chart data (12 weeks) is static and embedded -- could be dynamic or fetched
 * - Only one Area is rendered (tombras) -- the benchmark is a ReferenceLine, not a second Area; this is good practice
 * - The custom tooltip function is never tested because jsdom cannot trigger Recharts tooltip interactions
 * - The gradient definition (linearGradient) is part of SVG defs and cannot be easily tested in jsdom
 */
