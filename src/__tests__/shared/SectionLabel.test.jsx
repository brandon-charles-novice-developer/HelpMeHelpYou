import { render, screen } from '@testing-library/react'
import SectionLabel from '../../components/shared/SectionLabel'

describe('SectionLabel', () => {
  it('renders without error', () => {
    const { container } = render(<SectionLabel>Test Section</SectionLabel>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the children text', () => {
    render(<SectionLabel>Campaign Overview</SectionLabel>)
    expect(screen.getByText('Campaign Overview')).toBeInTheDocument()
  })

  it('applies uppercase styling to the label', () => {
    render(<SectionLabel>My Label</SectionLabel>)
    const label = screen.getByText('My Label')
    expect(label).toHaveClass('uppercase', 'tracking-widest')
  })

  it('applies muted color to the label', () => {
    render(<SectionLabel>My Label</SectionLabel>)
    const label = screen.getByText('My Label')
    expect(label).toHaveStyle({ color: '#AFADAD' })
  })

  it('renders the right slot when provided', () => {
    render(
      <SectionLabel right={<button>View All</button>}>
        Section
      </SectionLabel>
    )
    expect(screen.getByText('View All')).toBeInTheDocument()
  })

  it('does not render the right slot container when right is not provided', () => {
    const { container } = render(<SectionLabel>Section</SectionLabel>)
    // Should only have the span child, no wrapping div for right
    const outerDiv = container.firstChild
    expect(outerDiv.children).toHaveLength(1)
  })

  it('uses flex layout with justify-between', () => {
    const { container } = render(<SectionLabel>Test</SectionLabel>)
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-between')
  })

  it('applies bottom margin via mb-4', () => {
    const { container } = render(<SectionLabel>Test</SectionLabel>)
    expect(container.firstChild).toHaveClass('mb-4')
  })

  it('applies custom className', () => {
    const { container } = render(<SectionLabel className="mt-8">Test</SectionLabel>)
    expect(container.firstChild).toHaveClass('mt-8')
  })

  it('renders JSX children', () => {
    render(
      <SectionLabel>
        <span data-testid="custom-child">Custom</span>
      </SectionLabel>
    )
    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - SectionLabel is clean and minimal — 15 lines of code
 * - The right slot pattern is straightforward; conditional rendering is appropriate here
 * - Could use a shared text style constant since the same `#AFADAD` / uppercase / tracking-widest pattern appears in MetricCard too
 * - No simplification needed in the tests
 */
