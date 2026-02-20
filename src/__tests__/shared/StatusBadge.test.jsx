import { render, screen } from '@testing-library/react'
import StatusBadge from '../../components/shared/StatusBadge'

describe('StatusBadge', () => {
  it('renders without error', () => {
    const { container } = render(<StatusBadge status="active" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the default label for a known status', () => {
    render(<StatusBadge status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  describe('variant labels', () => {
    const variantLabels = [
      ['active', 'Active'],
      ['on_track', 'On Track'],
      ['paused', 'Paused'],
      ['underpacing', 'Underpacing'],
      ['slight_overpace', 'Overpacing'],
      ['ended', 'Ended'],
      ['verified', 'Verified'],
      ['approved', 'Approved'],
    ]

    it.each(variantLabels)('status="%s" renders label "%s"', (status, expectedLabel) => {
      render(<StatusBadge status={status} />)
      expect(screen.getByText(expectedLabel)).toBeInTheDocument()
    })
  })

  describe('variants with null label use status as fallback', () => {
    const nullLabelVariants = ['positive', 'caution', 'negative']

    it.each(nullLabelVariants)('status="%s" falls back to status string', (status) => {
      render(<StatusBadge status={status} />)
      expect(screen.getByText(status)).toBeInTheDocument()
    })
  })

  it('uses label override when provided', () => {
    render(<StatusBadge status="active" label="Custom Label" />)
    expect(screen.getByText('Custom Label')).toBeInTheDocument()
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })

  describe('variant colors', () => {
    it('applies green styling for active status', () => {
      render(<StatusBadge status="active" />)
      const badge = screen.getByText('Active')
      expect(badge).toHaveStyle({ color: '#22C55E' })
      expect(badge).toHaveStyle({ backgroundColor: 'rgba(34, 197, 94, 0.15)' })
    })

    it('applies yellow styling for underpacing status', () => {
      render(<StatusBadge status="underpacing" />)
      const badge = screen.getByText('Underpacing')
      expect(badge).toHaveStyle({ color: '#F59E0B' })
    })

    it('applies red styling for ended status', () => {
      render(<StatusBadge status="ended" />)
      const badge = screen.getByText('Ended')
      expect(badge).toHaveStyle({ color: '#EF4444' })
    })

    it('applies blue styling for verified status', () => {
      render(<StatusBadge status="verified" />)
      const badge = screen.getByText('Verified')
      expect(badge).toHaveStyle({ color: '#5C70D6' })
    })

    it('applies grey styling for paused status', () => {
      render(<StatusBadge status="paused" />)
      const badge = screen.getByText('Paused')
      expect(badge).toHaveStyle({ color: '#AFADAD' })
    })
  })

  it('defaults to active variant for unknown status', () => {
    render(<StatusBadge status="unknown_status" />)
    // Falls back to variants.active which has label: 'Active'
    const badge = screen.getByText('Active')
    expect(badge).toHaveStyle({ color: '#22C55E' })
  })

  it('applies sm size padding by default', () => {
    render(<StatusBadge status="active" />)
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-xs')
  })

  it('applies xs size padding when size="xs"', () => {
    render(<StatusBadge status="active" size="xs" />)
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-[10px]')
  })

  it('renders as an inline span element', () => {
    const { container } = render(<StatusBadge status="active" />)
    expect(container.firstChild.tagName).toBe('SPAN')
  })

  it('has uppercase and tracking-wider classes', () => {
    render(<StatusBadge status="active" />)
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('uppercase', 'tracking-wider')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The variants object with 11 entries could be split into color groups to reduce repetition
 * - 'positive', 'caution', 'negative' have null labels which makes the fallback chain (labelOverride ?? variant.label ?? status) necessary — these could have labels set to match their key
 * - The size prop only supports 'sm' and 'xs' — a Map or ternary is fine for two values
 * - Tests are well-suited to parameterized testing (.each) given the data-driven nature of variants
 */
