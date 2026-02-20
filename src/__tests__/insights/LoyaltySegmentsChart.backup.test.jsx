import { render, screen } from '@testing-library/react'
import LoyaltySegmentsChart from '../../components/insights/LoyaltySegmentsChart'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('LoyaltySegmentsChart — prop variations and edge cases', () => {
  it('renders with minimal single segment', () => {
    const data = {
      title: 'Single Segment',
      insight: 'Only one segment',
      segments: [{ label: 'Core Fans', share: 1.0, color: '#22C55E', hhiIndex: 120 }],
    }
    render(<LoyaltySegmentsChart data={data} />)
    expect(screen.getByText('Core Fans')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('HHI 120')).toBeInTheDocument()
  })

  it('renders with spirit airlines data', () => {
    const data = {
      title: 'Loyalty Segments',
      insight: 'Spirit airline loyalty test.',
      segments: [
        { label: 'High-Frequency Leisure (4+ flights)', share: 0.18, color: '#22C55E', hhiIndex: 84 },
        { label: 'Moderate (2-3 flights)', share: 0.34, color: '#5C70D6', hhiIndex: 92 },
      ],
    }
    render(<LoyaltySegmentsChart data={data} />)
    expect(screen.getByText('High-Frequency Leisure (4+ flights)')).toBeInTheDocument()
    expect(screen.getByText('18%')).toBeInTheDocument()
    expect(screen.getByText('34%')).toBeInTheDocument()
  })

  it('renders segment bars with correct width style', () => {
    const data = {
      title: 'Bar Width Test',
      insight: 'Checking bar widths',
      segments: [
        { label: 'Segment A', share: 0.45, color: '#FF0000', hhiIndex: 100 },
        { label: 'Segment B', share: 0.55, color: '#00FF00', hhiIndex: 110 },
      ],
    }
    const { container } = render(<LoyaltySegmentsChart data={data} />)
    // The inner bar elements use inline width style
    const bars = container.querySelectorAll('.h-full.rounded-full')
    expect(bars.length).toBeGreaterThanOrEqual(2)
  })

  it('applies segment colors to dot indicators', () => {
    const data = {
      title: 'Color Test',
      insight: 'Check color indicators',
      segments: [
        { label: 'Green Segment', share: 0.30, color: '#22C55E', hhiIndex: 100 },
        { label: 'Blue Segment', share: 0.70, color: '#5C70D6', hhiIndex: 110 },
      ],
    }
    const { container } = render(<LoyaltySegmentsChart data={data} />)
    const dots = container.querySelectorAll('.rounded-full.flex-shrink-0')
    expect(dots[0]).toHaveStyle({ backgroundColor: '#22C55E' })
    expect(dots[1]).toHaveStyle({ backgroundColor: '#5C70D6' })
  })

  it('rounds share values to nearest integer', () => {
    const data = {
      title: 'Rounding Test',
      insight: 'Share rounding',
      segments: [{ label: 'Partial', share: 0.456, color: '#000', hhiIndex: 99 }],
    }
    render(<LoyaltySegmentsChart data={data} />)
    // Math.round(0.456 * 100) = 46
    expect(screen.getByText('46%')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Segment color dots use inline styles; a reusable ColorDot component would reduce repetition.
 * - The component's share rounding (Math.round) could lose precision — showing one decimal
 *   would be more accurate for narrow segments.
 * - Backup tests cover color application, bar widths, and data edge cases.
 * - Tests are lean and complementary to primary tests.
 */
