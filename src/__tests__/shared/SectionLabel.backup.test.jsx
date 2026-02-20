import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SectionLabel from '../../components/shared/SectionLabel'

describe('SectionLabel — edge cases, interactions, accessibility', () => {
  describe('edge cases', () => {
    it('renders with empty string children', () => {
      const { container } = render(<SectionLabel>{''}</SectionLabel>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with no children', () => {
      const { container } = render(<SectionLabel />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with multiple children', () => {
      render(
        <SectionLabel>
          <span>Part 1</span>
          <span>Part 2</span>
        </SectionLabel>
      )
      expect(screen.getByText('Part 1')).toBeInTheDocument()
      expect(screen.getByText('Part 2')).toBeInTheDocument()
    })

    it('right slot accepts complex JSX', () => {
      render(
        <SectionLabel right={<div data-testid="complex"><span>A</span><span>B</span></div>}>
          Label
        </SectionLabel>
      )
      expect(screen.getByTestId('complex')).toBeInTheDocument()
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
    })

    it('right slot with falsy value (null) does not render wrapper', () => {
      const { container } = render(<SectionLabel right={null}>Label</SectionLabel>)
      expect(container.firstChild.children).toHaveLength(1)
    })

    it('right slot with falsy value (undefined) does not render wrapper', () => {
      const { container } = render(<SectionLabel right={undefined}>Label</SectionLabel>)
      expect(container.firstChild.children).toHaveLength(1)
    })

    it('right slot with zero (0) does not render (falsy)', () => {
      const { container } = render(<SectionLabel right={0}>Label</SectionLabel>)
      // 0 is falsy, so the right slot should not render
      expect(container.firstChild.children).toHaveLength(1)
    })
  })

  describe('interaction with right slot', () => {
    it('button in right slot is clickable', async () => {
      const handleClick = vi.fn()
      render(
        <SectionLabel right={<button onClick={handleClick}>Click Me</button>}>
          Section
        </SectionLabel>
      )
      const user = userEvent.setup()
      await user.click(screen.getByText('Click Me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('className merging', () => {
    it('custom className is appended to base classes', () => {
      const { container } = render(<SectionLabel className="pt-6">Test</SectionLabel>)
      const el = container.firstChild
      expect(el).toHaveClass('flex', 'items-center', 'justify-between', 'mb-4', 'pt-6')
    })

    it('empty className string does not break class list', () => {
      const { container } = render(<SectionLabel className="">Test</SectionLabel>)
      expect(container.firstChild).toHaveClass('flex')
    })
  })

  describe('semantic structure', () => {
    it('renders outer container as a div', () => {
      const { container } = render(<SectionLabel>Test</SectionLabel>)
      expect(container.firstChild.tagName).toBe('DIV')
    })

    it('renders label text inside a span', () => {
      render(<SectionLabel>My Label</SectionLabel>)
      const label = screen.getByText('My Label')
      expect(label.tagName).toBe('SPAN')
    })

    it('wraps right slot in a div', () => {
      render(<SectionLabel right={<span data-testid="rs">R</span>}>L</SectionLabel>)
      const rightSlot = screen.getByTestId('rs')
      expect(rightSlot.parentElement.tagName).toBe('DIV')
    })
  })

  describe('text styling', () => {
    it('label text is 11px size', () => {
      render(<SectionLabel>Test</SectionLabel>)
      expect(screen.getByText('Test')).toHaveClass('text-[11px]')
    })

    it('label text has semibold weight', () => {
      render(<SectionLabel>Test</SectionLabel>)
      expect(screen.getByText('Test')).toHaveClass('font-semibold')
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The right slot pattern using `{right && <div>{right}</div>}` means `0` and `""` won't render — this could be intentional but is a subtle edge case
 * - No role="heading" or aria-level — screen readers won't treat it as a heading despite it being visually one
 * - The mb-4 margin is hardcoded — could be configurable or left to the parent's layout
 * - The wrapper div around the right slot is unnecessary if the right content is already a block element
 */
