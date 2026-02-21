import { render, screen } from '@testing-library/react'
import MetricCard from '../../components/shared/MetricCard'

describe('MetricCard', () => {
  const defaultProps = {
    label: 'Revenue',
    value: '$17.5M',
  }

  it('renders without error', () => {
    const { container } = render(<MetricCard {...defaultProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the label text in uppercase style', () => {
    render(<MetricCard {...defaultProps} />)
    const label = screen.getByText('Revenue')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('uppercase', 'tracking-widest')
  })

  it('displays the value', () => {
    render(<MetricCard {...defaultProps} />)
    expect(screen.getByText('$17.5M')).toBeInTheDocument()
  })

  it('renders delta when provided', () => {
    render(<MetricCard {...defaultProps} delta="+12%" deltaPositive={true} />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  it('does not render delta when not provided', () => {
    const { container } = render(<MetricCard {...defaultProps} />)
    // Only label and value divs should exist as children of the card
    const card = container.firstChild
    expect(card.children).toHaveLength(2)
  })

  it('renders sublabel when provided', () => {
    render(<MetricCard {...defaultProps} sublabel="vs. last quarter" />)
    expect(screen.getByText('vs. last quarter')).toBeInTheDocument()
  })

  it('does not render sublabel when not provided', () => {
    expect(screen.queryByText('vs. last quarter')).not.toBeInTheDocument()
  })

  it('applies green color for positive delta', () => {
    render(<MetricCard {...defaultProps} delta="+5%" deltaPositive={true} />)
    expect(screen.getByText('+5%')).toHaveStyle({ color: '#22C55E' })
  })

  it('applies red color for negative delta', () => {
    render(<MetricCard {...defaultProps} delta="-3%" deltaPositive={false} />)
    expect(screen.getByText('-3%')).toHaveStyle({ color: '#EF4444' })
  })

  it('applies neutral color when deltaPositive is undefined', () => {
    render(<MetricCard {...defaultProps} delta="0%" />)
    expect(screen.getByText('0%')).toHaveStyle({ color: '#AFADAD' })
  })

  it('uses glass-card class for glassmorphism', () => {
    const { container } = render(<MetricCard {...defaultProps} />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('uses glass-card class even when accent is true', () => {
    const { container } = render(<MetricCard {...defaultProps} accent={true} />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('applies custom className', () => {
    const { container } = render(<MetricCard {...defaultProps} className="w-full" />)
    expect(container.firstChild).toHaveClass('w-full')
  })

  it('renders with all props simultaneously', () => {
    render(
      <MetricCard
        label="ROAS"
        value="4.2x"
        delta="+0.8x"
        deltaPositive={true}
        sublabel="Target: 3.5x"
        accent={true}
        className="col-span-2"
      />
    )
    expect(screen.getByText('ROAS')).toBeInTheDocument()
    expect(screen.getByText('4.2x')).toBeInTheDocument()
    expect(screen.getByText('+0.8x')).toBeInTheDocument()
    expect(screen.getByText('Target: 3.5x')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - MetricCard's ternary for deltaColor could be a lookup map: { true: '#22C55E', false: '#EF4444', undefined: '#AFADAD' }
 * - The boxShadow is identical for accent/non-accent — could be a shared constant
 * - Tests are straightforward; no mocking or async needed — good sign of a simple component
 * - The className concatenation could use clsx/cn utility for cleaner merging
 */
