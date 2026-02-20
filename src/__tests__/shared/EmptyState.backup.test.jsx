import { render, screen } from '@testing-library/react'
import EmptyState from '../../components/shared/EmptyState'

describe('EmptyState — edge cases and accessibility', () => {
  describe('prop edge cases', () => {
    it('renders with empty string message', () => {
      render(<EmptyState message="" />)
      // The paragraph element still exists but is empty
      const { container } = render(<EmptyState message="" />)
      const p = container.querySelector('p')
      expect(p).toBeInTheDocument()
      expect(p.textContent).toBe('')
    })

    it('renders with very long message', () => {
      const longMessage = 'A'.repeat(500)
      render(<EmptyState message={longMessage} />)
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('renders with emoji icon', () => {
      render(<EmptyState icon="📊" />)
      expect(screen.getByText('📊')).toBeInTheDocument()
    })

    it('renders with multi-character icon', () => {
      render(<EmptyState icon="N/A" />)
      expect(screen.getByText('N/A')).toBeInTheDocument()
    })

    it('renders with empty string icon', () => {
      const { container } = render(<EmptyState icon="" />)
      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span.textContent).toBe('')
    })
  })

  describe('layout and positioning', () => {
    it('has gap-3 between icon and message', () => {
      const { container } = render(<EmptyState />)
      expect(container.firstChild).toHaveClass('gap-3')
    })

    it('icon comes before message in DOM order', () => {
      const { container } = render(<EmptyState message="Test" icon="X" />)
      const children = Array.from(container.firstChild.children)
      expect(children[0].tagName).toBe('SPAN') // icon
      expect(children[1].tagName).toBe('P') // message
    })
  })

  describe('text styling', () => {
    it('icon has text-3xl size', () => {
      render(<EmptyState icon="X" />)
      expect(screen.getByText('X')).toHaveClass('text-3xl')
    })

    it('message has text-sm size', () => {
      render(<EmptyState message="Test" />)
      expect(screen.getByText('Test')).toHaveClass('text-sm')
    })

    it('icon color is dark purple', () => {
      render(<EmptyState icon="!" />)
      expect(screen.getByText('!')).toHaveStyle({ color: '#4D4176' })
    })

    it('message color is muted grey', () => {
      render(<EmptyState message="Nothing here" />)
      expect(screen.getByText('Nothing here')).toHaveStyle({ color: '#AFADAD' })
    })
  })

  describe('accessibility observations', () => {
    it('has no role attribute (purely presentational)', () => {
      const { container } = render(<EmptyState />)
      expect(container.firstChild.getAttribute('role')).toBeNull()
    })

    it('has no aria-live for dynamic content updates', () => {
      const { container } = render(<EmptyState />)
      expect(container.firstChild.getAttribute('aria-live')).toBeNull()
    })

    it('message is readable by screen readers (paragraph element)', () => {
      render(<EmptyState message="No results found" />)
      // Paragraph elements are natural landmarks for screen readers
      expect(screen.getByText('No results found').tagName).toBe('P')
    })
  })

  describe('does not accept unsupported props', () => {
    it('renders without className prop (not supported)', () => {
      const { container } = render(<EmptyState />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - EmptyState lacks a className prop — inconsistent with other shared primitives that all accept className
 * - No children prop — can't add action buttons like "Create Campaign" below the message
 * - Could benefit from role="status" or aria-live="polite" for dynamic content changes
 * - The icon is a text character — an SVG/icon component would be more flexible
 * - Default icon '◦' is obscure — consider a more recognizable empty state icon
 */
