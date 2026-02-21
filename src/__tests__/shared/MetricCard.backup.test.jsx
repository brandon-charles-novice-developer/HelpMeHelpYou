import { render, screen } from '@testing-library/react'
import MetricCard from '../../components/shared/MetricCard'

describe('MetricCard — edge cases and accessibility', () => {
  it('renders with only required props (label, value)', () => {
    const { container } = render(<MetricCard label="CPC" value="$2.30" />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild.children).toHaveLength(2)
  })

  it('renders with empty string label', () => {
    render(<MetricCard label="" value="100" />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders with numeric value as number type', () => {
    render(<MetricCard label="Count" value={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders value of zero correctly', () => {
    render(<MetricCard label="Errors" value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders JSX value content', () => {
    render(
      <MetricCard
        label="Rate"
        value={<span data-testid="jsx-value">4.2<small>x</small></span>}
      />
    )
    expect(screen.getByTestId('jsx-value')).toBeInTheDocument()
  })

  it('renders with delta but without deltaPositive (neutral)', () => {
    render(<MetricCard label="CTR" value="2.1%" delta="unchanged" />)
    const delta = screen.getByText('unchanged')
    expect(delta).toHaveStyle({ color: '#AFADAD' })
  })

  it('renders delta of zero correctly', () => {
    render(<MetricCard label="CPA" value="$5" delta="0%" deltaPositive={true} />)
    expect(screen.getByText('0%')).toHaveStyle({ color: '#22C55E' })
  })

  it('renders both delta and sublabel together', () => {
    render(
      <MetricCard label="Revenue" value="$10M" delta="+5%" deltaPositive={true} sublabel="Q1 2026" />
    )
    expect(screen.getByText('+5%')).toBeInTheDocument()
    expect(screen.getByText('Q1 2026')).toBeInTheDocument()
  })

  it('maintains card structure order: label, value, delta, sublabel', () => {
    const { container } = render(
      <MetricCard label="L" value="V" delta="D" deltaPositive={true} sublabel="S" />
    )
    const card = container.firstChild
    const children = Array.from(card.children)
    expect(children[0].textContent).toBe('L')
    expect(children[1].textContent).toBe('V')
    expect(children[2].textContent).toBe('D')
    expect(children[3].textContent).toBe('S')
  })

  it('applies hover translate class for interaction hint', () => {
    const { container } = render(<MetricCard label="T" value="V" />)
    expect(container.firstChild).toHaveClass('hover:-translate-y-0.5')
  })

  it('has transition classes for smooth animation', () => {
    const { container } = render(<MetricCard label="T" value="V" />)
    expect(container.firstChild).toHaveClass('transition-all', 'duration-200')
  })

  it('has glass-card class for depth via CSS', () => {
    const { container } = render(<MetricCard label="T" value="V" />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('merges className without overriding base classes', () => {
    const { container } = render(<MetricCard label="T" value="V" className="custom-class" />)
    const card = container.firstChild
    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('rounded-card', 'p-5')
  })

  it('renders value with bold white text', () => {
    render(<MetricCard label="Test" value="Bold Value" />)
    const value = screen.getByText('Bold Value')
    expect(value).toHaveClass('text-3xl', 'font-bold', 'text-white')
  })

  it('sublabel has muted color styling', () => {
    render(<MetricCard label="T" value="V" sublabel="Sub" />)
    expect(screen.getByText('Sub')).toHaveStyle({ color: '#AFADAD' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Edge cases reveal that MetricCard handles JSX children and numeric values well due to React's rendering
 * - No aria attributes or roles — could benefit from role="group" and aria-label for screen readers
 * - The accent mode is purely visual (bg color change) — no semantic meaning is conveyed
 * - The deltaPositive prop uses strict equality (=== true, === false) which correctly handles undefined — good pattern
 */
