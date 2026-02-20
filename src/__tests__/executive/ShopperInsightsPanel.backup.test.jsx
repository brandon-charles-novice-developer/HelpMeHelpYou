import { render, screen } from '@testing-library/react'
import ShopperInsightsPanel from '../../components/executive/ShopperInsightsPanel'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('ShopperInsightsPanel — tile structure and styling', () => {
  it('applies fade-up-visible class to root', () => {
    const { container } = render(<ShopperInsightsPanel />)
    expect(container.firstChild).toHaveClass('fade-up-visible')
  })

  it('each tile has dark background (#1E1A2E)', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    Array.from(grid.children).forEach((tile) => {
      expect(tile).toHaveStyle({ backgroundColor: '#1E1A2E' })
    })
  })

  it('each tile has hover translate class', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    Array.from(grid.children).forEach((tile) => {
      expect(tile).toHaveClass('hover:-translate-y-0.5')
    })
  })

  it('each tile has rounded-card class', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    Array.from(grid.children).forEach((tile) => {
      expect(tile).toHaveClass('rounded-card')
    })
  })

  it('Ricola logo has green background (#009B3A)', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    const ricolaLogo = grid.children[0].querySelector('.rounded-full')
    expect(ricolaLogo).toHaveStyle({ backgroundColor: '#009B3A' })
  })

  it('Spirit logo has yellow background (#FFEC00)', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    const spiritLogo = grid.children[1].querySelector('.rounded-full')
    expect(spiritLogo).toHaveStyle({ backgroundColor: '#FFEC00' })
  })

  it('insight text has light gray color (#D4D2D2)', () => {
    render(<ShopperInsightsPanel />)
    const insightText = screen.getByText(/Halls is capturing 41%/)
    expect(insightText).toHaveStyle({ color: '#D4D2D2' })
  })

  it('metric label text has muted color (#AFADAD)', () => {
    render(<ShopperInsightsPanel />)
    const label = screen.getByText('Propensity Index')
    expect(label).toHaveStyle({ color: '#AFADAD' })
  })

  it('section label badge has purple theme styling', () => {
    render(<ShopperInsightsPanel />)
    // The badge text "Shopper Insights" appears in both the section header and each tile
    const badges = screen.getAllByText('Shopper Insights')
    // At least one badge should have the purple color
    const purpleBadge = badges.find((el) => {
      const style = el.getAttribute('style') || ''
      return style.includes('196, 181, 253') // C4B5FD in rgb
    })
    expect(purpleBadge).toBeTruthy()
  })

  it('each tile has a metric separator border', () => {
    const { container } = render(<ShopperInsightsPanel />)
    const grid = container.querySelector('.grid-cols-4')
    Array.from(grid.children).forEach((tile) => {
      // jsdom normalizes style property names to camelCase in getAttribute
      // Use a broader selector looking for the border-top in the style string
      const metricSection = tile.querySelector('[style*="border-top"]')
      expect(metricSection).toBeInTheDocument()
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The 4 highlights cover different insight types (switching, propensity, basket) but the tile component is generic
 * - The tile type field (switching/propensity/basket) is present in data but not displayed -- unused data
 * - Logo duplicate data (color, initial) between clients.js and HIGHLIGHTS means updates must happen in two places
 * - The "Shopper Insights" badge per tile is redundant since the whole panel is already labeled
 */
