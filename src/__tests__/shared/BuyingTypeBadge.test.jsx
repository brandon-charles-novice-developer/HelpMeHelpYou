import { render, screen } from '@testing-library/react'
import BuyingTypeBadge from '../../components/shared/BuyingTypeBadge'

describe('BuyingTypeBadge', () => {
  it('renders without error', () => {
    const { container } = render(<BuyingTypeBadge type="programmatic" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the correct label for each buying type', () => {
    const types = [
      ['programmatic', 'Programmatic'],
      ['managed', 'Managed Service'],
      ['mixed', 'Prog + Managed'],
      ['retail_media', 'Retail Media'],
      ['direct_io', 'Direct IO'],
      ['pmp', 'PMP'],
      ['pg', 'PG'],
    ]

    types.forEach(([type, expectedLabel]) => {
      const { unmount } = render(<BuyingTypeBadge type={type} />)
      expect(screen.getByText(expectedLabel)).toBeInTheDocument()
      unmount()
    })
  })

  it('uses label override when provided', () => {
    render(<BuyingTypeBadge type="programmatic" label="Custom" />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
    expect(screen.queryByText('Programmatic')).not.toBeInTheDocument()
  })

  it('applies correct color for programmatic type', () => {
    render(<BuyingTypeBadge type="programmatic" />)
    const badge = screen.getByText('Programmatic')
    expect(badge).toHaveStyle({ color: '#5C70D6' })
    expect(badge).toHaveStyle({ backgroundColor: 'rgba(92, 112, 214, 0.15)' })
  })

  it('applies correct color for managed type', () => {
    render(<BuyingTypeBadge type="managed" />)
    const badge = screen.getByText('Managed Service')
    expect(badge).toHaveStyle({ color: '#C4B5FD' })
  })

  it('applies correct color for retail_media type', () => {
    render(<BuyingTypeBadge type="retail_media" />)
    const badge = screen.getByText('Retail Media')
    expect(badge).toHaveStyle({ color: '#F59E0B' })
  })

  it('applies correct color for mixed type', () => {
    render(<BuyingTypeBadge type="mixed" />)
    const badge = screen.getByText('Prog + Managed')
    expect(badge).toHaveStyle({ color: '#2DD4BF' })
  })

  it('defaults to programmatic for unknown type', () => {
    render(<BuyingTypeBadge type="unknown" />)
    expect(screen.getByText('Programmatic')).toBeInTheDocument()
  })

  it('defaults to programmatic when type is null', () => {
    render(<BuyingTypeBadge type={null} />)
    expect(screen.getByText('Programmatic')).toBeInTheDocument()
  })

  it('handles case-insensitive type matching', () => {
    render(<BuyingTypeBadge type="PROGRAMMATIC" />)
    expect(screen.getByText('Programmatic')).toBeInTheDocument()
  })

  it('renders as an inline span', () => {
    const { container } = render(<BuyingTypeBadge type="programmatic" />)
    expect(container.firstChild.tagName).toBe('SPAN')
  })

  it('has uppercase and tracking-wider classes', () => {
    render(<BuyingTypeBadge type="programmatic" />)
    const badge = screen.getByText('Programmatic')
    expect(badge).toHaveClass('uppercase', 'tracking-wider', 'font-semibold')
  })

  it('has correct text size class', () => {
    render(<BuyingTypeBadge type="programmatic" />)
    const badge = screen.getByText('Programmatic')
    expect(badge).toHaveClass('text-[10px]')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - BuyingTypeBadge and StatusBadge share the same pattern — could be a single generic BadgePill component with a config prop
 * - The toLowerCase() call on type handles case insensitivity, which is good defensive coding
 * - The fallback to config.programmatic on unknown type is a reasonable default
 * - The config object could be co-located with StatusBadge variants in a shared badges config file
 */
