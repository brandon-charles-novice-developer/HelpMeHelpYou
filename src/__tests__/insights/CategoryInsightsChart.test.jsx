import { render, screen } from '@testing-library/react'
import CategoryInsightsChart from '../../components/insights/CategoryInsightsChart'
import { shopperInsights } from '../../data/shopperInsights'

const mockData = shopperInsights.kayak.category

describe('CategoryInsightsChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<CategoryInsightsChart data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(<CategoryInsightsChart data={mockData} />)
    expect(screen.getByText('Category Insights')).toBeInTheDocument()
  })

  it('displays the static subtitle', () => {
    render(<CategoryInsightsChart data={mockData} />)
    expect(
      screen.getByText('Audience share by purchase category · Index vs U.S. average (100 = baseline)')
    ).toBeInTheDocument()
  })

  it('displays all category names', () => {
    render(<CategoryInsightsChart data={mockData} />)
    mockData.data.forEach((d) => {
      expect(screen.getByText(d.category)).toBeInTheDocument()
    })
  })

  it('displays share percentages', () => {
    render(<CategoryInsightsChart data={mockData} />)
    mockData.data.forEach((d) => {
      const pct = `${Math.round(d.share * 100)}%`
      expect(screen.getByText(pct)).toBeInTheDocument()
    })
  })

  it('displays index badges', () => {
    render(<CategoryInsightsChart data={mockData} />)
    mockData.data.forEach((d) => {
      expect(screen.getByText(`${d.index} index`)).toBeInTheDocument()
    })
  })

  it('applies green color for index >= 180', () => {
    const data = {
      title: 'Category Insights',
      data: [{ category: 'High Index', share: 0.50, index: 200 }],
    }
    render(<CategoryInsightsChart data={data} />)
    const badge = screen.getByText('200 index')
    expect(badge).toHaveStyle({ color: '#22C55E' })
  })

  it('applies blue color for index >= 130 and < 180', () => {
    const data = {
      title: 'Category Insights',
      data: [{ category: 'Mid Index', share: 0.40, index: 150 }],
    }
    render(<CategoryInsightsChart data={data} />)
    const badge = screen.getByText('150 index')
    expect(badge).toHaveStyle({ color: '#5C70D6' })
  })

  it('applies gray color for index < 130', () => {
    const data = {
      title: 'Category Insights',
      data: [{ category: 'Low Index', share: 0.20, index: 100 }],
    }
    render(<CategoryInsightsChart data={data} />)
    const badge = screen.getByText('100 index')
    expect(badge).toHaveStyle({ color: '#AFADAD' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - CategoryInsightsChart uses pure CSS progress bars (no Recharts) — the simplest chart component.
 * - The color logic for index thresholds is duplicated between the badge and the bar fill;
 *   extracting a shared indexColor(index) function would reduce duplication.
 * - The subtitle is hardcoded — if this varies per dataset, it should be a prop or data field.
 * - Tests are clean and straightforward for a non-Recharts component.
 */
