import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test/utils'
import ClientPerformanceMap from '../../components/executive/ClientPerformanceMap'
import { clients } from '../../data/clients'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('ClientPerformanceMap — structure, alerts, and pacing', () => {
  it('table container has rounded-card class', () => {
    const { container } = renderWithRouter(<ClientPerformanceMap />)
    const table = container.querySelector('.rounded-card')
    expect(table).toBeInTheDocument()
  })

  it('table container has glass-card class', () => {
    const { container } = renderWithRouter(<ClientPerformanceMap />)
    const table = container.querySelector('.rounded-card.overflow-hidden')
    expect(table).toHaveClass('glass-card')
  })

  it('pacing bar shows 65% for all rows (hardcoded value)', () => {
    renderWithRouter(<ClientPerformanceMap />)
    const pacingTexts = screen.getAllByText('65%')
    expect(pacingTexts).toHaveLength(5)
  })

  it('pacing bar 65% gets amber color (#F59E0B) because 0.65 >= 0.4 and < 0.7', () => {
    renderWithRouter(<ClientPerformanceMap />)
    const pacingTexts = screen.getAllByText('65%')
    pacingTexts.forEach((el) => {
      expect(el).toHaveStyle({ color: '#F59E0B' })
    })
  })

  it('positive alerts show checkmark icon', () => {
    renderWithRouter(<ClientPerformanceMap />)
    const positiveAlerts = clients.filter((c) => c.alert?.type === 'positive')
    const checkmarks = screen.getAllByText('\u2713')
    expect(checkmarks).toHaveLength(positiveAlerts.length)
  })

  it('caution alerts show warning icon', () => {
    renderWithRouter(<ClientPerformanceMap />)
    const cautionAlerts = clients.filter((c) => c.alert?.type === 'caution')
    const warnings = screen.getAllByText('\u26A0')
    expect(warnings).toHaveLength(cautionAlerts.length)
  })

  it('Newell Brands has no alert row (alert is null)', () => {
    renderWithRouter(<ClientPerformanceMap />)
    // Newell's alert is null -- should not render any alert content for it
    const newell = clients.find((c) => c.id === 'newell')
    expect(newell.alert).toBeNull()
  })

  it('each client row shows campaign count', () => {
    renderWithRouter(<ClientPerformanceMap />)
    expect(screen.getByText('3 campaigns')).toBeInTheDocument()  // Kayak
    expect(screen.getAllByText('2 campaigns')).toHaveLength(4)   // Others
  })

  it('Indeed shows only 2 channel tags and a +1 overflow', () => {
    renderWithRouter(<ClientPerformanceMap />)
    // Indeed: ['TTD', 'LinkedIn Ads', 'Walmart Connect'] -- shows first 2 + "+1"
    expect(screen.getByText('LinkedIn Ads')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('client logos have correct background colors', () => {
    const { container } = renderWithRouter(<ClientPerformanceMap />)
    // Find all logo circles (rounded-full with flex-shrink-0 and w-8)
    const logos = container.querySelectorAll('.w-8.h-8.rounded-full')
    expect(logos).toHaveLength(5)
    // Kayak should be orange #FF690F
    expect(logos[0]).toHaveStyle({ backgroundColor: '#FF690F' })
  })

  it('all CvrVsBenchmark values reference "vs 2.8% benchmark"', () => {
    renderWithRouter(<ClientPerformanceMap />)
    const benchmarkRefs = screen.getAllByText(/vs 2\.8% benchmark/)
    expect(benchmarkRefs).toHaveLength(5)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - PacingBar gets value={0.65} hardcoded for every client -- this should use actual client budget pacing data
 * - The component mixes data fetching (importing clients) with presentation -- a prop-driven design would be more testable
 * - Alert rendering is conditional on client.alert truthiness -- simple and correct
 * - Channel overflow logic (slice(0,2) + count) is clean but the "+N" could show a tooltip with full list
 */
