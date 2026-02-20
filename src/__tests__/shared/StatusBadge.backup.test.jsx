import { render, screen } from '@testing-library/react'
import StatusBadge from '../../components/shared/StatusBadge'

describe('StatusBadge — edge cases, interactions, accessibility', () => {
  describe('edge cases with missing or unusual props', () => {
    it('renders when status is undefined', () => {
      const { container } = render(<StatusBadge />)
      // Falls back to variants.active
      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild).toHaveStyle({ color: '#22C55E' })
    })

    it('renders when status is an empty string', () => {
      render(<StatusBadge status="" />)
      // Falls back to active variant, text shows empty string
      const badge = screen.getByText('Active')
      expect(badge).toBeInTheDocument()
    })

    it('label override works with null-label variants', () => {
      render(<StatusBadge status="positive" label="Up" />)
      expect(screen.getByText('Up')).toBeInTheDocument()
      expect(screen.queryByText('positive')).not.toBeInTheDocument()
    })

    it('label override of empty string renders empty badge', () => {
      const { container } = render(<StatusBadge status="active" label="" />)
      // Empty string override — badge renders but with no visible text
      const badge = container.firstChild
      expect(badge.textContent).toBe('')
    })
  })

  describe('all 11 variants render with correct background and text color', () => {
    const allVariants = [
      ['active', '#22C55E', 'rgba(34, 197, 94, 0.15)'],
      ['on_track', '#22C55E', 'rgba(34, 197, 94, 0.15)'],
      ['positive', '#22C55E', 'rgba(34, 197, 94, 0.15)'],
      ['paused', '#AFADAD', 'rgba(175, 173, 173, 0.15)'],
      ['underpacing', '#F59E0B', 'rgba(245, 158, 11, 0.15)'],
      ['slight_overpace', '#F59E0B', 'rgba(245, 158, 11, 0.15)'],
      ['caution', '#F59E0B', 'rgba(245, 158, 11, 0.15)'],
      ['ended', '#EF4444', 'rgba(239, 68, 68, 0.15)'],
      ['negative', '#EF4444', 'rgba(239, 68, 68, 0.15)'],
      ['verified', '#5C70D6', 'rgba(92, 112, 214, 0.15)'],
      ['approved', '#5C70D6', 'rgba(92, 112, 214, 0.15)'],
    ]

    it.each(allVariants)(
      'variant "%s" has color %s and bg %s',
      (status, expectedColor, expectedBg) => {
        const { container } = render(<StatusBadge status={status} />)
        const badge = container.firstChild
        expect(badge).toHaveStyle({ color: expectedColor })
        expect(badge).toHaveStyle({ backgroundColor: expectedBg })
      }
    )
  })

  describe('size boundary values', () => {
    it('handles unknown size value gracefully (defaults to sm)', () => {
      render(<StatusBadge status="active" size="lg" />)
      // Any unknown size falls into the else branch = sm
      const badge = screen.getByText('Active')
      expect(badge).toHaveClass('px-2.5', 'py-1', 'text-xs')
    })
  })

  describe('semantic HTML', () => {
    it('uses a span element (inline, no block-level side effects)', () => {
      const { container } = render(<StatusBadge status="active" />)
      expect(container.firstChild.tagName).toBe('SPAN')
    })

    it('has inline-flex display for badge alignment', () => {
      render(<StatusBadge status="active" />)
      expect(screen.getByText('Active')).toHaveClass('inline-flex', 'items-center')
    })

    it('has rounded-full for pill shape', () => {
      render(<StatusBadge status="active" />)
      expect(screen.getByText('Active')).toHaveClass('rounded-full')
    })
  })

  describe('label resolution priority', () => {
    it('priority 1: labelOverride wins over variant.label', () => {
      render(<StatusBadge status="active" label="Override" />)
      expect(screen.getByText('Override')).toBeInTheDocument()
    })

    it('priority 2: variant.label used when no override', () => {
      render(<StatusBadge status="active" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('priority 3: status string used when variant.label is null and no override', () => {
      render(<StatusBadge status="negative" />)
      expect(screen.getByText('negative')).toBeInTheDocument()
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The 3-level label fallback chain (override ?? variant.label ?? status) is tested thoroughly here
 * - Empty string behavior for label override could be a bug — an empty label produces an invisible badge
 * - The variants object is not exported, so it can't be tested independently — could be a separate export
 * - No aria-label or role on the badge — screen readers would just read the text content
 */
