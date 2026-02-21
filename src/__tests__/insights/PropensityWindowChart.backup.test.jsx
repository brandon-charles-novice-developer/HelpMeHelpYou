import { render, screen } from '@testing-library/react'
import PropensityWindowChart from '../../components/insights/PropensityWindowChart'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('PropensityWindowChart — score color thresholds and edge cases', () => {
  const makeData = (windows) => ({
    title: 'Propensity Test',
    insight: 'Test insight.',
    windows,
  })

  it('applies green for score = 90 (boundary)', () => {
    const data = makeData([{ window: '30d', score: 90, converters: 100000, label: 'High' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('90')).toHaveStyle({ color: '#22C55E' })
  })

  it('applies blue for score = 89 (just below green)', () => {
    const data = makeData([{ window: '30d', score: 89, converters: 100000, label: 'High' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('89')).toHaveStyle({ color: '#5C70D6' })
  })

  it('applies blue for score = 80 (boundary)', () => {
    const data = makeData([{ window: '30d', score: 80, converters: 100000, label: 'High' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('80')).toHaveStyle({ color: '#5C70D6' })
  })

  it('applies amber for score = 79 (just below blue)', () => {
    const data = makeData([{ window: '30d', score: 79, converters: 100000, label: 'Moderate' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('79')).toHaveStyle({ color: '#F59E0B' })
  })

  it('applies amber for score = 65 (boundary)', () => {
    const data = makeData([{ window: '30d', score: 65, converters: 50000, label: 'Low' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('65')).toHaveStyle({ color: '#F59E0B' })
  })

  it('applies gray for score = 64 (below all thresholds)', () => {
    const data = makeData([{ window: '30d', score: 64, converters: 30000, label: 'Very Low' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('64')).toHaveStyle({ color: '#AFADAD' })
  })

  it('renders with a single window', () => {
    const data = makeData([{ window: '7d', score: 95, converters: 50000, label: 'Very High' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('7d')).toBeInTheDocument()
    expect(screen.getByText('95')).toBeInTheDocument()
    expect(screen.getByText('50,000 likely converters')).toBeInTheDocument()
  })

  it('formats large converter counts with commas', () => {
    const data = makeData([{ window: '90d', score: 85, converters: 1234567, label: 'High' }])
    render(<PropensityWindowChart data={data} />)
    expect(screen.getByText('1,234,567 likely converters')).toBeInTheDocument()
  })

  it('renders converter card backgrounds with glass styling', () => {
    const data = makeData([{ window: '10d', score: 88, converters: 100000, label: 'High' }])
    const { container } = render(<PropensityWindowChart data={data} />)
    const cards = container.querySelectorAll('.rounded-lg.p-3.text-center')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveStyle({ backgroundColor: 'rgba(255,255,255,0.05)' })
    expect(cards[0]).toHaveStyle({ backdropFilter: 'blur(6px)' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - scoreColor() has 4 tiers (90+, 80+, 65+, else) — the thresholds are magic numbers;
 *   a config-driven approach would be more maintainable.
 * - The converters.toLocaleString() call is simple but depends on locale — tests assume
 *   en-US formatting with commas.
 * - Backup tests exhaustively cover all 4 color thresholds at boundaries.
 * - These tests complement primary tests which use real shopperInsights data.
 */
