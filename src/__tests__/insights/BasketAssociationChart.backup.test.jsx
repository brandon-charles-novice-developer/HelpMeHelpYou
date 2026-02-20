import { render, screen } from '@testing-library/react'
import BasketAssociationChart from '../../components/insights/BasketAssociationChart'

describe('BasketAssociationChart — edge cases and prop variations', () => {
  it('renders with a single association', () => {
    const data = {
      title: 'Single Item',
      insight: 'One association.',
      associations: [{ item: 'Only Item', coRate: 0.50, lift: 3.0 }],
    }
    render(<BasketAssociationChart data={data} />)
    expect(screen.getByText('Only Item')).toBeInTheDocument()
    expect(screen.getByText('3.0x')).toBeInTheDocument()
    expect(screen.getByText('50% co-purchase')).toBeInTheDocument()
  })

  it('clamps co-purchase bar at 100% for coRate > 1.0', () => {
    const data = {
      title: 'Over 100',
      insight: 'Edge case.',
      associations: [{ item: 'Over Item', coRate: 1.5, lift: 2.0 }],
    }
    const { container } = render(<BasketAssociationChart data={data} />)
    // Math.min(1.5 * 100, 100) = 100 -> width: 100%
    const innerBar = container.querySelector('.h-full.rounded-full')
    expect(innerBar).toHaveStyle({ width: '100%' })
  })

  it('shows 0% co-purchase for zero coRate', () => {
    const data = {
      title: 'Zero Rate',
      insight: 'No co-purchase.',
      associations: [{ item: 'No Co', coRate: 0, lift: 1.0 }],
    }
    render(<BasketAssociationChart data={data} />)
    expect(screen.getByText('0% co-purchase')).toBeInTheDocument()
  })

  it('does not mutate the original associations array', () => {
    const originalAssociations = [
      { item: 'A', coRate: 0.20, lift: 1.5 },
      { item: 'B', coRate: 0.40, lift: 5.0 },
      { item: 'C', coRate: 0.30, lift: 3.0 },
    ]
    const data = {
      title: 'Immutability Test',
      insight: 'Check sort does not mutate.',
      associations: originalAssociations,
    }
    render(<BasketAssociationChart data={data} />)
    // Original order should be preserved
    expect(originalAssociations[0].item).toBe('A')
    expect(originalAssociations[1].item).toBe('B')
    expect(originalAssociations[2].item).toBe('C')
  })

  it('renders card backgrounds', () => {
    const data = {
      title: 'Card Style',
      insight: 'Background check.',
      associations: [{ item: 'Styled Item', coRate: 0.25, lift: 2.0 }],
    }
    const { container } = render(<BasketAssociationChart data={data} />)
    const card = container.querySelector('.rounded-lg.p-3')
    expect(card).toHaveStyle({ backgroundColor: '#1E1A2E' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The [...data.associations].sort() creates a new array each render — useMemo would help.
 * - The coRate clamp (Math.min) is the only defensive logic; could be a shared utility.
 * - Backup tests cover immutability, clamping, zero values, and styling.
 * - Good separation from primary tests which focus on real data rendering and sorting.
 */
