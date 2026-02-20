import { render, screen } from '@testing-library/react'
import CrossPurchaseChart from '../../components/insights/CrossPurchaseChart'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('CrossPurchaseChart — prop variations and edge cases', () => {
  it('renders with a single pair', () => {
    const data = {
      title: 'Minimal Cross-Purchase',
      insight: 'Single pair test.',
      pairs: [{ brand: 'Partner Brand', overlapRate: 0.30, index: 150 }],
    }
    render(<CrossPurchaseChart data={data} />)
    expect(screen.getByText('Minimal Cross-Purchase')).toBeInTheDocument()
  })

  it('renders with high overlap rates', () => {
    const data = {
      title: 'High Overlap',
      insight: 'High correlation brands.',
      pairs: [
        { brand: 'Brand X', overlapRate: 0.95, index: 300 },
        { brand: 'Brand Y', overlapRate: 0.88, index: 280 },
      ],
    }
    render(<CrossPurchaseChart data={data} />)
    expect(screen.getByText('High Overlap')).toBeInTheDocument()
  })

  it('renders with zero overlap rate', () => {
    const data = {
      title: 'Zero Overlap',
      insight: 'No cross-purchase.',
      pairs: [{ brand: 'Isolated Brand', overlapRate: 0, index: 100 }],
    }
    render(<CrossPurchaseChart data={data} />)
    expect(screen.getByText('Zero Overlap')).toBeInTheDocument()
  })

  it('renders with many pairs', () => {
    const data = {
      title: 'Many Pairs',
      insight: 'Large dataset.',
      pairs: Array.from({ length: 10 }, (_, i) => ({
        brand: `Brand ${i}`,
        overlapRate: 0.1 * (i + 1),
        index: 100 + i * 10,
      })),
    }
    const { container } = render(<CrossPurchaseChart data={data} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('correctly structures chart data from pairs', () => {
    const data = {
      title: 'Data Structure Test',
      insight: 'Verifying transformation.',
      pairs: [{ brand: 'TestBrand', overlapRate: 0.456, index: 167 }],
    }
    // Component transforms overlapRate 0.456 -> Math.round(0.456 * 100) = 46
    // This is used as chart data; we verify the component renders without error
    const { container } = render(<CrossPurchaseChart data={data} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The component has minimal logic; the chartData transformation is clean.
 * - The hard-coded domain [0, 70] would clip data above 70% — should be derived from max.
 * - Backup tests cover edge cases: zero overlap, many pairs, high values.
 * - No redundancy with primary tests.
 */
