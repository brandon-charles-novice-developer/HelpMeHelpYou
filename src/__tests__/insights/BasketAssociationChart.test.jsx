import { render, screen } from '@testing-library/react'
import BasketAssociationChart from '../../components/insights/BasketAssociationChart'
import { shopperInsights } from '../../data/shopperInsights'

const mockData = shopperInsights.kayak.basket

describe('BasketAssociationChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<BasketAssociationChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(<BasketAssociationChart data={mockData} />)
    expect(screen.getByText('Basket Association')).toBeInTheDocument()
  })

  it('displays the insight text', () => {
    render(<BasketAssociationChart data={mockData} />)
    expect(screen.getByText(mockData.insight)).toBeInTheDocument()
  })

  it('displays all association item names', () => {
    render(<BasketAssociationChart data={mockData} />)
    mockData.associations.forEach((a) => {
      expect(screen.getByText(a.item)).toBeInTheDocument()
    })
  })

  it('displays co-purchase percentages', () => {
    render(<BasketAssociationChart data={mockData} />)
    mockData.associations.forEach((a) => {
      const pct = `${Math.round(a.coRate * 100)}% co-purchase`
      expect(screen.getByText(pct)).toBeInTheDocument()
    })
  })

  it('displays lift values', () => {
    render(<BasketAssociationChart data={mockData} />)
    mockData.associations.forEach((a) => {
      expect(screen.getByText(`${a.lift.toFixed(1)}x`)).toBeInTheDocument()
    })
  })

  it('displays lift labels', () => {
    render(<BasketAssociationChart data={mockData} />)
    const liftLabels = screen.getAllByText('lift')
    expect(liftLabels).toHaveLength(mockData.associations.length)
  })

  it('sorts items by lift descending', () => {
    render(<BasketAssociationChart data={mockData} />)
    const items = screen.getAllByText(/x$/).map((el) => parseFloat(el.textContent))
    for (let i = 1; i < items.length; i++) {
      expect(items[i - 1]).toBeGreaterThanOrEqual(items[i])
    }
  })

  it('applies green color for lift >= 4', () => {
    render(<BasketAssociationChart data={mockData} />)
    // Currency Exchange App has lift 4.2
    const highLift = screen.getByText('4.2x')
    expect(highLift).toHaveStyle({ color: '#22C55E' })
  })

  it('applies blue color for lift >= 2.5 and < 4', () => {
    render(<BasketAssociationChart data={mockData} />)
    // Airport Lounge Pass has lift 3.4
    const midLift = screen.getByText('3.4x')
    expect(midLift).toHaveStyle({ color: '#5C70D6' })
  })

  it('applies gray color for lift < 2.5', () => {
    render(<BasketAssociationChart data={mockData} />)
    // Premium Luggage has lift 2.1
    const lowLift = screen.getByText('2.1x')
    expect(lowLift).toHaveStyle({ color: '#AFADAD' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The lift color thresholds (>= 4, >= 2.5) are inline ternaries; extract to a liftColor() function.
 * - The sort is done on every render with [...data.associations].sort() — memoization or
 *   pre-sorting the data would be more efficient.
 * - The co-purchase bar uses Math.min(item.coRate * 100, 100) — good defensive clamp.
 * - Tests verify sorting, colors, and data display comprehensively.
 */
