import { render, screen } from '@testing-library/react'
import PropensityWindowChart from '../../components/insights/PropensityWindowChart'
import { shopperInsights } from '../../data/shopperInsights'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

const mockData = shopperInsights.kayak.propensity

describe('PropensityWindowChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<PropensityWindowChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(<PropensityWindowChart data={mockData} />)
    expect(screen.getByText('Purchase Propensity')).toBeInTheDocument()
  })

  it('displays the insight text', () => {
    render(<PropensityWindowChart data={mockData} />)
    expect(screen.getByText(mockData.insight)).toBeInTheDocument()
  })

  it('renders the chart container', () => {
    const { container } = render(<PropensityWindowChart data={mockData} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('displays window labels in converter cards', () => {
    render(<PropensityWindowChart data={mockData} />)
    mockData.windows.forEach((w) => {
      // Window labels appear both in chart and in the grid below
      const labels = screen.getAllByText(w.window)
      expect(labels.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('displays propensity scores in converter cards', () => {
    render(<PropensityWindowChart data={mockData} />)
    mockData.windows.forEach((w) => {
      expect(screen.getByText(`${w.score}`)).toBeInTheDocument()
    })
  })

  it('displays converter counts with "likely converters" label', () => {
    render(<PropensityWindowChart data={mockData} />)
    mockData.windows.forEach((w) => {
      expect(
        screen.getByText(`${w.converters.toLocaleString()} likely converters`)
      ).toBeInTheDocument()
    })
  })

  it('applies green color to scores >= 90', () => {
    render(<PropensityWindowChart data={mockData} />)
    // 30-day window has score 91
    const score91 = screen.getByText('91')
    expect(score91).toHaveStyle({ color: '#22C55E' })
  })

  it('applies blue color to scores >= 80 and < 90', () => {
    render(<PropensityWindowChart data={mockData} />)
    // 10-day has 84, 60-day has 88, 90-day has 82
    const score84 = screen.getByText('84')
    expect(score84).toHaveStyle({ color: '#5C70D6' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The scoreColor function is defined inside the module but not exported — extracting it
 *   to a shared utility would allow reuse and direct unit testing.
 * - The converter grid duplicates window labels that also appear in the chart — consider
 *   whether the chart + grid is redundant.
 * - Tests verify both the chart container and the grid cards; appropriate coverage.
 * - No over-engineering in tests.
 */
