import { render, screen } from '@testing-library/react'
import ImpactBrief from '../../components/executive/ImpactBrief'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('ImpactBrief — layout and structure', () => {
  it('applies fade-up-visible class from useFadeIn', () => {
    const { container } = render(<ImpactBrief />)
    expect(container.firstChild).toHaveClass('fade-up-visible')
  })

  it('has rounded-card class', () => {
    const { container } = render(<ImpactBrief />)
    expect(container.firstChild).toHaveClass('rounded-card')
  })

  it('has glass-card class on the card', () => {
    const { container } = render(<ImpactBrief />)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('header label has muted purple color', () => {
    render(<ImpactBrief />)
    const header = screen.getByText(/Morning Brief/)
    expect(header).toHaveStyle({ color: '#67579E' })
  })

  it('body text has light gray color', () => {
    render(<ImpactBrief />)
    const bodyText = screen.getByText(/Tombras campaigns drove/)
    expect(bodyText).toHaveStyle({ color: '#D4D2D2' })
  })

  it('action section has a top border separator', () => {
    const { container } = render(<ImpactBrief />)
    // The action section is the last child with flex and border-top
    const actionSection = container.querySelector('.flex.items-start.gap-2')
    expect(actionSection).toBeInTheDocument()
    expect(actionSection).toHaveStyle({ borderTop: '1px solid rgba(255, 255, 255, 0.06)' })
  })

  it('headline mentions key metrics from the data', () => {
    render(<ImpactBrief />)
    // The headline is about strong momentum
    expect(screen.getByText(/Strong new buyer momentum/)).toBeInTheDocument()
  })

  it('body references specific revenue and ROAS figures', () => {
    render(<ImpactBrief />)
    expect(screen.getByText(/\$8\.42M/)).toBeInTheDocument()
    expect(screen.getByText(/1\.61x/)).toBeInTheDocument()
  })

  it('action mentions specific DSP recommendation', () => {
    render(<ImpactBrief />)
    expect(screen.getByText(/Kayak.*Amazon DSP/)).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The component has no interactive behavior -- purely presentational, which is ideal
 * - The border-top on the action section uses rgba inline -- could be a shared border utility class
 * - The agency.impactBrief structure (headline/body/action) is clean and well-separated
 * - Date in header means snapshot tests would fail across days -- mocking Date would fix but adds complexity
 */
