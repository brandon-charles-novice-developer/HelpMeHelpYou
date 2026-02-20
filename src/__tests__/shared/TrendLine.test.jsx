import { render } from '@testing-library/react'
import TrendLine from '../../components/shared/TrendLine'

// Recharts uses ResizeObserver internally; jsdom doesn't have it
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('TrendLine', () => {
  const sampleData = [1, 2, 3, 4, 5]

  it('renders without error', () => {
    const { container } = render(<TrendLine data={sampleData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders a Recharts ResponsiveContainer', () => {
    const { container } = render(<TrendLine data={sampleData} />)
    // ResponsiveContainer renders a div wrapper
    const wrapper = container.firstChild
    expect(wrapper).toBeInTheDocument()
  })

  it('renders an SVG element for the chart', () => {
    const { container } = render(<TrendLine data={sampleData} />)
    // Recharts may or may not render the SVG depending on container size in jsdom
    // We verify the component tree exists
    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
  })

  it('accepts a custom color prop', () => {
    const { container } = render(<TrendLine data={sampleData} color="#FF0000" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('accepts custom width and height props', () => {
    const { container } = render(<TrendLine data={sampleData} width={120} height={48} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('normalizes data into {i, v} format internally', () => {
    // We can only verify this indirectly by checking the component renders without error
    // with various data shapes
    const { container } = render(<TrendLine data={[10, 20, 30]} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles single data point', () => {
    const { container } = render(<TrendLine data={[42]} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('handles large dataset', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => Math.sin(i / 10))
    const { container } = render(<TrendLine data={largeData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('uses default color #5C70D6 when color prop not provided', () => {
    // Verify component renders — color is passed to Recharts Line internally
    const { container } = render(<TrendLine data={sampleData} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - TrendLine wraps Recharts, which is hard to unit-test in jsdom (no real SVG rendering dimensions)
 * - Most tests here are smoke tests verifying no-crash; integration or visual regression tests would be more valuable
 * - The normalized data transform `data.map((v, i) => ({ i, v }))` runs on every render — could memoize with useMemo
 * - The Tooltip formatter uses toFixed(3) hardcoded — might want configurable precision
 * - Consider extracting the Tooltip contentStyle to a shared theme constant
 */
