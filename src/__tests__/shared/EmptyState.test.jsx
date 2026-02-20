import { render, screen } from '@testing-library/react'
import EmptyState from '../../components/shared/EmptyState'

describe('EmptyState', () => {
  it('renders without error', () => {
    const { container } = render(<EmptyState />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the default message', () => {
    render(<EmptyState />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('displays a custom message', () => {
    render(<EmptyState message="No campaigns found" />)
    expect(screen.getByText('No campaigns found')).toBeInTheDocument()
  })

  it('displays the default icon', () => {
    render(<EmptyState />)
    expect(screen.getByText('\u25E6')).toBeInTheDocument()
  })

  it('displays a custom icon', () => {
    render(<EmptyState icon="!" />)
    expect(screen.getByText('!')).toBeInTheDocument()
  })

  it('centers content with flex layout', () => {
    const { container } = render(<EmptyState />)
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })

  it('has vertical padding via py-16', () => {
    const { container } = render(<EmptyState />)
    expect(container.firstChild).toHaveClass('py-16')
  })

  it('applies muted color to the message text', () => {
    render(<EmptyState message="Test" />)
    expect(screen.getByText('Test')).toHaveStyle({ color: '#AFADAD' })
  })

  it('applies purple color to the icon', () => {
    render(<EmptyState icon="X" />)
    expect(screen.getByText('X')).toHaveStyle({ color: '#4D4176' })
  })

  it('renders message as a paragraph element', () => {
    render(<EmptyState message="Test" />)
    expect(screen.getByText('Test').tagName).toBe('P')
  })

  it('renders icon as a span element', () => {
    render(<EmptyState icon="!" />)
    expect(screen.getByText('!').tagName).toBe('SPAN')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - EmptyState is already minimal — 9 lines, pure presentational
 * - The default icon character '◦' is Unicode — an SVG icon or Lucide icon might be more visually consistent
 * - Could accept a className prop for custom positioning (currently not supported)
 * - Could accept children for more complex empty state content (action buttons, links)
 */
