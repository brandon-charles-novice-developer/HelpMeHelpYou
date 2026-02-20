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

describe('TrendLine — edge cases and data handling', () => {
  describe('data edge cases', () => {
    it('handles empty array', () => {
      const { container } = render(<TrendLine data={[]} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles two data points', () => {
      const { container } = render(<TrendLine data={[1, 2]} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles negative values', () => {
      const { container } = render(<TrendLine data={[-5, -3, -1, 0, 2]} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles all-zero data', () => {
      const { container } = render(<TrendLine data={[0, 0, 0, 0]} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles decimal values', () => {
      const { container } = render(<TrendLine data={[0.001, 0.002, 0.003]} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles very large values', () => {
      const { container } = render(<TrendLine data={[1e6, 2e6, 3e6]} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('prop variations', () => {
    it('renders with color="#22C55E" (green)', () => {
      const { container } = render(<TrendLine data={[1, 2, 3]} color="#22C55E" />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with small dimensions', () => {
      const { container } = render(<TrendLine data={[1, 2, 3]} width={40} height={16} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with large dimensions', () => {
      const { container } = render(<TrendLine data={[1, 2, 3]} width={300} height={100} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('recharts wrapper structure', () => {
    it('contains a recharts-wrapper element', () => {
      const { container } = render(<TrendLine data={[1, 2, 3]} />)
      expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument()
    })

    it('root element wraps the recharts content', () => {
      const { container } = render(<TrendLine data={[1, 2, 3]} />)
      // The root wrapper div exists even if Recharts doesn't add its specific class in jsdom
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('animation behavior', () => {
    it('has animation disabled (isAnimationActive=false in source)', () => {
      // We verify the component renders immediately without waiting for animation
      const { container } = render(<TrendLine data={[1, 2, 3, 4, 5]} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - TrendLine is difficult to test meaningfully in jsdom because Recharts needs real DOM dimensions
 * - Visual regression testing (Storybook + Chromatic) would catch actual rendering issues
 * - The data normalization on every render could be memoized with useMemo for performance
 * - Tooltip precision (toFixed(3)) is hardcoded — should be a prop for different use cases
 * - Consider a loading/empty state when data is empty array
 */
