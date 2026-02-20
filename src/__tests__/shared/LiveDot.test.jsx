import { render } from '@testing-library/react'
import LiveDot from '../../components/shared/LiveDot'

describe('LiveDot', () => {
  it('renders without error', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild.tagName).toBe('SPAN')
  })

  it('has the live-pulse CSS class for animation', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild).toHaveClass('live-pulse')
  })

  it('has rounded-full class for circular shape', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('applies default size of 8px', () => {
    const { container } = render(<LiveDot />)
    const dot = container.firstChild
    expect(dot).toHaveStyle({ width: '8px', height: '8px' })
  })

  it('applies custom size', () => {
    const { container } = render(<LiveDot size={12} />)
    const dot = container.firstChild
    expect(dot).toHaveStyle({ width: '12px', height: '12px' })
  })

  it('has green background color', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild).toHaveStyle({ backgroundColor: '#22C55E' })
  })

  it('has a green glow box-shadow', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild).toHaveStyle({
      boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
    })
  })

  it('has flexShrink: 0 to prevent compression', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild).toHaveStyle({ flexShrink: '0' })
  })

  it('applies custom className', () => {
    const { container } = render(<LiveDot className="ml-2" />)
    expect(container.firstChild).toHaveClass('ml-2')
  })

  it('has inline-block display class', () => {
    const { container } = render(<LiveDot />)
    expect(container.firstChild).toHaveClass('inline-block')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - LiveDot is already minimal — 14 lines, no logic beyond defaults
 * - The green color (#22C55E) is hardcoded; could accept a color prop for reusability (e.g. red dot for errors)
 * - The boxShadow glow color is derived from the same green but also hardcoded — coupling
 * - Tests are exhaustive for such a simple component; could be trimmed to 5-6 tests
 */
