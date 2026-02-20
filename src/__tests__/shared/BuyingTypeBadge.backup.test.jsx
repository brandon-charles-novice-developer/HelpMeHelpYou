import { render, screen } from '@testing-library/react'
import BuyingTypeBadge from '../../components/shared/BuyingTypeBadge'

describe('BuyingTypeBadge — edge cases and styling', () => {
  describe('type edge cases', () => {
    it('handles undefined type', () => {
      const { container } = render(<BuyingTypeBadge />)
      // type?.toLowerCase() returns undefined, falls back to config.programmatic
      expect(screen.getByText('Programmatic')).toBeInTheDocument()
      expect(container.firstChild).toHaveStyle({ color: '#5C70D6' })
    })

    it('handles mixed case type string', () => {
      render(<BuyingTypeBadge type="Retail_Media" />)
      expect(screen.getByText('Retail Media')).toBeInTheDocument()
    })

    it('handles all uppercase type string', () => {
      render(<BuyingTypeBadge type="PMP" />)
      expect(screen.getByText('PMP')).toBeInTheDocument()
    })

    it('handles empty string type', () => {
      render(<BuyingTypeBadge type="" />)
      // Empty string toLowerCase() is "", which is not in config, falls back to programmatic
      expect(screen.getByText('Programmatic')).toBeInTheDocument()
    })
  })

  describe('all 7 variants have correct styling', () => {
    const variants = [
      ['programmatic', '#5C70D6', 'rgba(92, 112, 214, 0.15)'],
      ['managed', '#C4B5FD', 'rgba(196, 181, 253, 0.15)'],
      ['mixed', '#2DD4BF', 'rgba(45, 212, 191, 0.15)'],
      ['retail_media', '#F59E0B', 'rgba(245, 158, 11, 0.15)'],
      ['direct_io', '#AFADAD', 'rgba(175, 173, 173, 0.15)'],
      ['pmp', '#9F8FC8', 'rgba(103, 87, 158, 0.2)'],
      ['pg', '#C4B5FD', 'rgba(103, 87, 158, 0.2)'],
    ]

    it.each(variants)(
      'type="%s" has color %s and bg %s',
      (type, expectedColor, expectedBg) => {
        const { container } = render(<BuyingTypeBadge type={type} />)
        const badge = container.firstChild
        expect(badge).toHaveStyle({ color: expectedColor })
        expect(badge).toHaveStyle({ backgroundColor: expectedBg })
      }
    )
  })

  describe('label override edge cases', () => {
    it('label override of empty string renders empty badge', () => {
      const { container } = render(<BuyingTypeBadge type="programmatic" label="" />)
      expect(container.firstChild.textContent).toBe('')
    })

    it('label override with number renders the number', () => {
      render(<BuyingTypeBadge type="programmatic" label={123} />)
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('label override preserves variant styling', () => {
      render(<BuyingTypeBadge type="retail_media" label="Custom" />)
      const badge = screen.getByText('Custom')
      expect(badge).toHaveStyle({ color: '#F59E0B' })
    })
  })

  describe('CSS class consistency', () => {
    it('all variants share the same base classes', () => {
      const types = ['programmatic', 'managed', 'mixed', 'retail_media', 'direct_io', 'pmp', 'pg']
      types.forEach((type) => {
        const { container, unmount } = render(<BuyingTypeBadge type={type} />)
        const badge = container.firstChild
        expect(badge).toHaveClass(
          'inline-flex', 'items-center', 'rounded-full', 'px-2.5', 'py-0.5',
          'text-[10px]', 'font-semibold', 'uppercase', 'tracking-wider'
        )
        unmount()
      })
    })
  })

  describe('semantic HTML', () => {
    it('renders as span (inline element)', () => {
      const { container } = render(<BuyingTypeBadge type="programmatic" />)
      expect(container.firstChild.tagName).toBe('SPAN')
    })

    it('has no interactive role or tabindex', () => {
      const { container } = render(<BuyingTypeBadge type="programmatic" />)
      expect(container.firstChild.getAttribute('role')).toBeNull()
      expect(container.firstChild.getAttribute('tabindex')).toBeNull()
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - BuyingTypeBadge and StatusBadge are nearly identical in structure — a shared GenericBadge component could serve both
 * - The config object could be a shared export for consistency across components
 * - No size prop unlike StatusBadge — inconsistency between similar components
 * - The case-insensitive matching via toLowerCase() is good but not documented
 */
