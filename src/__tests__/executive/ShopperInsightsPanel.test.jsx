import { render, screen } from '@testing-library/react'
import ShopperInsightsPanel from '../../components/executive/ShopperInsightsPanel'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('ShopperInsightsPanel', () => {
  it('renders without error', () => {
    const { container } = render(<ShopperInsightsPanel />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the "Purchase Intelligence Highlights" section label', () => {
    render(<ShopperInsightsPanel />)
    expect(screen.getByText('Purchase Intelligence Highlights')).toBeInTheDocument()
  })

  it('renders exactly 4 InsightTile cards', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    expect(grid).toBeInTheDocument()
    expect(grid.children).toHaveLength(4)
  })

  it('displays all 4 client names', () => {
    render(<ShopperInsightsPanel />)
    expect(screen.getByText('Ricola')).toBeInTheDocument()
    expect(screen.getByText('Spirit Airlines')).toBeInTheDocument()
    expect(screen.getByText('Indeed')).toBeInTheDocument()
    expect(screen.getByText('Newell Brands')).toBeInTheDocument()
  })

  it('displays all insight texts', () => {
    render(<ShopperInsightsPanel />)
    expect(screen.getByText(/Halls is capturing 41%/)).toBeInTheDocument()
    expect(screen.getByText(/18% of Spirit's audience/)).toBeInTheDocument()
    expect(screen.getByText(/Life event segment hits 91/)).toBeInTheDocument()
    expect(screen.getByText(/34% of Rubbermaid buyers/)).toBeInTheDocument()
  })

  it('displays metric values for each tile', () => {
    render(<ShopperInsightsPanel />)
    expect(screen.getByText('3.2x')).toBeInTheDocument()   // Ricola propensity
    expect(screen.getByText('18%')).toBeInTheDocument()     // Spirit switching
    expect(screen.getByText('91')).toBeInTheDocument()      // Indeed propensity
    expect(screen.getByText('34%')).toBeInTheDocument()     // Newell cross-purchase
  })

  it('displays metric labels for each tile', () => {
    render(<ShopperInsightsPanel />)
    expect(screen.getByText('Propensity Index')).toBeInTheDocument()
    expect(screen.getByText('Switching to Frontier')).toBeInTheDocument()
    expect(screen.getByText('30-day Propensity')).toBeInTheDocument()
    expect(screen.getByText('Cross-purchase Rate')).toBeInTheDocument()
  })

  it('shows "Shopper Insights" badge on section label', () => {
    render(<ShopperInsightsPanel />)
    // There are 5 "Shopper Insights" texts: 1 in section label badge + 4 in tiles
    const badges = screen.getAllByText('Shopper Insights')
    expect(badges.length).toBeGreaterThanOrEqual(5)
  })

  it('displays client logo initials', () => {
    render(<ShopperInsightsPanel />)
    expect(screen.getByText('R')).toBeInTheDocument()    // Ricola
    expect(screen.getByText('SX')).toBeInTheDocument()   // Spirit
    expect(screen.getByText('I')).toBeInTheDocument()    // Indeed
    expect(screen.getByText('NB')).toBeInTheDocument()   // Newell
  })

  it('uses a 4-column grid layout', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    expect(grid).toHaveClass('grid', 'gap-4')
  })

  it('metric values have their correct colors', () => {
    render(<ShopperInsightsPanel />)
    // Ricola: green (#22C55E)
    expect(screen.getByText('3.2x')).toHaveStyle({ color: '#22C55E' })
    // Spirit: amber (#F59E0B)
    expect(screen.getByText('18%')).toHaveStyle({ color: '#F59E0B' })
    // Newell: blue (#5C70D6)
    expect(screen.getByText('34%')).toHaveStyle({ color: '#5C70D6' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - HIGHLIGHTS data is hardcoded inside the component file -- should be in the data layer for consistency
 * - InsightTile is defined inside ShopperInsightsPanel -- could be extracted to its own file for reuse
 * - The "Shopper Insights" badge appears on every tile AND the section label -- redundant visual information
 * - Logo colors match the clients data module but are duplicated here -- single source of truth would be better
 */
