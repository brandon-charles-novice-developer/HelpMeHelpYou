import { render, screen } from '@testing-library/react'
import ImpactBrief from '../../components/executive/ImpactBrief'
import { agency } from '../../data/agency'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('ImpactBrief', () => {
  it('renders without error', () => {
    const { container } = render(<ImpactBrief />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the headline', () => {
    render(<ImpactBrief />)
    expect(screen.getByText(agency.impactBrief.headline)).toBeInTheDocument()
  })

  it('displays the body text', () => {
    render(<ImpactBrief />)
    expect(screen.getByText(agency.impactBrief.body)).toBeInTheDocument()
  })

  it('displays the action alert text', () => {
    render(<ImpactBrief />)
    expect(screen.getByText(agency.impactBrief.action)).toBeInTheDocument()
  })

  it('has a purple left border', () => {
    const { container } = render(<ImpactBrief />)
    expect(container.firstChild).toHaveStyle({ borderLeft: '3px solid #67579E' })
  })

  it('has the card background color', () => {
    const { container } = render(<ImpactBrief />)
    expect(container.firstChild).toHaveStyle({ backgroundColor: '#252040' })
  })

  it('displays the morning brief header with Tombras name', () => {
    render(<ImpactBrief />)
    expect(screen.getByText(/Morning Brief.*Tombras/)).toBeInTheDocument()
  })

  it('displays today\'s date in the header', () => {
    render(<ImpactBrief />)
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    expect(screen.getByText(new RegExp(today))).toBeInTheDocument()
  })

  it('displays the action alert icon (triangle)', () => {
    render(<ImpactBrief />)
    expect(screen.getByText('\u25B2')).toBeInTheDocument()
  })

  it('action alert has amber/warning color', () => {
    render(<ImpactBrief />)
    const triangleIcon = screen.getByText('\u25B2')
    expect(triangleIcon.closest('div')).toHaveStyle({ color: '#F59E0B' })
  })

  it('headline is an h2 with text-xl font-bold', () => {
    render(<ImpactBrief />)
    const headline = screen.getByText(agency.impactBrief.headline)
    expect(headline.tagName).toBe('H2')
    expect(headline).toHaveClass('text-xl', 'font-bold', 'text-white')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The date formatting uses new Date() inline -- for testing predictability, could accept a date prop
 * - The action alert section uses a Unicode triangle character -- a simple icon component or SVG would be more accessible
 * - The component reads directly from the agency data module -- no props, making it a "connected" presentational component
 * - The purple left border color (#67579E) is hardcoded in multiple places -- could be a theme variable
 */
