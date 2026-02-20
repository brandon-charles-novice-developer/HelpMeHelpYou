import { render, screen } from '@testing-library/react'
import RetailerBreakdown from '../../components/measurement/RetailerBreakdown'
import { clients } from '../../data/clients'

const mockRetailers = clients.find((c) => c.id === 'newell').retailerBreakdown

describe('RetailerBreakdown', () => {
  it('renders without crashing', () => {
    const { container } = render(<RetailerBreakdown retailers={mockRetailers} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders null when retailers is empty', () => {
    const { container } = render(<RetailerBreakdown retailers={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders null when retailers is undefined', () => {
    const { container } = render(<RetailerBreakdown retailers={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders null when retailers is null', () => {
    const { container } = render(<RetailerBreakdown retailers={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('displays the section heading', () => {
    render(<RetailerBreakdown retailers={mockRetailers} />)
    expect(screen.getByText('Cross-Retailer Attribution')).toBeInTheDocument()
  })

  it('displays all retailer names', () => {
    render(<RetailerBreakdown retailers={mockRetailers} />)
    mockRetailers.forEach((r) => {
      expect(screen.getByText(r.retailer)).toBeInTheDocument()
    })
  })

  it('displays share percentages', () => {
    render(<RetailerBreakdown retailers={mockRetailers} />)
    mockRetailers.forEach((r) => {
      expect(screen.getByText(`${Math.round(r.share * 100)}%`)).toBeInTheDocument()
    })
  })

  it('sorts retailers by share descending', () => {
    const retailers = [
      { retailer: 'Small', share: 0.10 },
      { retailer: 'Large', share: 0.60 },
      { retailer: 'Medium', share: 0.30 },
    ]
    render(<RetailerBreakdown retailers={retailers} />)
    const names = screen.getAllByText(/Small|Large|Medium/).map((el) => el.textContent)
    expect(names[0]).toBe('Large')
    expect(names[1]).toBe('Medium')
    expect(names[2]).toBe('Small')
  })

  it('renders progress bars with correct width', () => {
    const retailers = [{ retailer: 'Solo', share: 0.45 }]
    const { container } = render(<RetailerBreakdown retailers={retailers} />)
    const bar = container.querySelector('.h-full.rounded-full.transition-all')
    expect(bar).toHaveStyle({ width: '45%' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - RetailerBreakdown sorts on every render; memoizing the sort would improve performance.
 * - The null guard checks `!retailers?.length` — good defensive coding.
 * - The bar color (#5C70D6) is hardcoded for all retailers; adding per-retailer colors
 *   would improve visual differentiation.
 * - Tests cover null/empty guards, sorting, and data display; clean and complete.
 */
