import { render } from '@testing-library/react'
import LiveDot from '../../components/shared/LiveDot'

describe('LiveDot — edge cases and accessibility', () => {
  it('renders with size of 0', () => {
    const { container } = render(<LiveDot size={0} />)
    const dot = container.firstChild
    expect(dot).toHaveStyle({ width: '0px', height: '0px' })
  })

  it('renders with very large size', () => {
    const { container } = render(<LiveDot size={100} />)
    const dot = container.firstChild
    expect(dot).toHaveStyle({ width: '100px', height: '100px' })
  })

  it('renders with fractional size', () => {
    const { container } = render(<LiveDot size={6.5} />)
    const dot = container.firstChild
    expect(dot).toHaveStyle({ width: '6.5px', height: '6.5px' })
  })

  it('maintains square aspect ratio (width equals height)', () => {
    const { container } = render(<LiveDot size={20} />)
    const dot = container.firstChild
    const styles = dot.style
    expect(styles.width).toBe('20px')
    expect(styles.height).toBe('20px')
  })

  it('uses self-closing span (no children)', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild.childNodes).toHaveLength(0)
  })

  it('preserves default className alongside custom className', () => {
    const { container } = render(<LiveDot className="mr-1" />)
    const dot = container.firstChild
    expect(dot).toHaveClass('live-pulse', 'inline-block', 'rounded-full', 'mr-1')
  })

  it('empty className string does not break class list', () => {
    const { container } = render(<LiveDot className="" />)
    const dot = container.firstChild
    expect(dot).toHaveClass('live-pulse', 'inline-block', 'rounded-full')
  })

  it('all inline styles are applied together', () => {
    const { container } = render(<LiveDot size={10} />)
    const dot = container.firstChild
    expect(dot.style.width).toBe('10px')
    expect(dot.style.height).toBe('10px')
    expect(dot.style.backgroundColor).toBe('rgb(34, 197, 94)')
    expect(dot.style.flexShrink).toBe('0')
  })

  it('is a purely visual element with no text content', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild.textContent).toBe('')
  })

  it('is not focusable by default (no tabIndex)', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild.getAttribute('tabindex')).toBeNull()
  })

  it('has no aria attributes (purely decorative)', () => {
    const { container } = render(<LiveDot />)
    const dot = container.firstChild
    expect(dot.getAttribute('role')).toBeNull()
    expect(dot.getAttribute('aria-label')).toBeNull()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - LiveDot has no accessibility features — should have aria-hidden="true" if purely decorative, or aria-label="Live" if semantic
 * - The green color is hardcoded — no way to make a red/yellow dot variant without a new component
 * - Edge case: size={0} creates an invisible dot, which is valid but unusual
 * - The component could accept a "label" prop for screen reader support
 */
