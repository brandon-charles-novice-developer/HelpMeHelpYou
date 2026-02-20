import { render, screen } from '@testing-library/react'
import PurchaseImpactPanel from '../../components/measurement/PurchaseImpactPanel'

describe('PurchaseImpactPanel — metric colors and edge cases', () => {
  const baseMetrics = {
    conversionRate: 0.035,
    newBuyerCvr: 0.003,
    newBuyerRoas: 1.5,
    newBuyerSalesDriven: 200000,
    newBuyerCpa: 120,
    newBuyerAvgTransaction: 22.00,
  }

  it('shows green for New Buyer CVR when >= 0.003', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, newBuyerCvr: 0.004 }} />)
    const value = screen.getByText('0.40%')
    expect(value).toHaveStyle({ color: '#22C55E' })
  })

  it('shows red for New Buyer CVR when < 0.003', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, newBuyerCvr: 0.002 }} />)
    const value = screen.getByText('0.20%')
    expect(value).toHaveStyle({ color: '#EF4444' })
  })

  it('shows green for ROAS when >= 1.5', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, newBuyerRoas: 2.0 }} />)
    const value = screen.getByText('2.0x')
    expect(value).toHaveStyle({ color: '#22C55E' })
  })

  it('shows red for ROAS when < 1.5', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, newBuyerRoas: 1.2 }} />)
    const value = screen.getByText('1.2x')
    expect(value).toHaveStyle({ color: '#EF4444' })
  })

  it('shows green for CPA when <= 120', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, newBuyerCpa: 100 }} />)
    const value = screen.getByText('$100')
    expect(value).toHaveStyle({ color: '#22C55E' })
  })

  it('shows red for CPA when > 120', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, newBuyerCpa: 150 }} />)
    const value = screen.getByText('$150')
    expect(value).toHaveStyle({ color: '#EF4444' })
  })

  it('shows white for Avg Transaction (positive is null)', () => {
    render(<PurchaseImpactPanel metrics={baseMetrics} />)
    const value = screen.getByText('$22.00')
    expect(value).toHaveStyle({ color: '#FFFFFF' })
  })

  it('shows Sales Driven always in green (positive is hardcoded true)', () => {
    render(<PurchaseImpactPanel metrics={baseMetrics} />)
    const value = screen.getByText('$200K')
    expect(value).toHaveStyle({ color: '#22C55E' })
  })

  it('shows negative delta when CVR is below benchmark', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, conversionRate: 0.020 }} />)
    // delta = 0.020 - 0.028 = -0.008 -> -0.8pts
    expect(screen.getByText('-0.8pts vs benchmark')).toBeInTheDocument()
  })

  it('colors negative delta in red', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, conversionRate: 0.020 }} />)
    const delta = screen.getByText('-0.8pts vs benchmark')
    expect(delta).toHaveStyle({ color: '#EF4444' })
  })

  it('colors positive delta in green', () => {
    render(<PurchaseImpactPanel metrics={{ ...baseMetrics, conversionRate: 0.050 }} />)
    const delta = screen.getByText('+2.2pts vs benchmark')
    expect(delta).toHaveStyle({ color: '#22C55E' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The positive prop is computed differently for each MetricRow — a threshold config
 *   object would centralize these rules.
 * - CvrBar computes delta inline; extracting to a function would improve readability.
 * - Backup tests focus on color logic and edge cases, complementing primary data-display tests.
 * - MetricRow's positive prop accepts true/false/null — a clearer API would use an enum.
 */
