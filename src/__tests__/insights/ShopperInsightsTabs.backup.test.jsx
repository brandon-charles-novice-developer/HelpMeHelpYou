import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShopperInsightsTabs from '../../components/insights/ShopperInsightsTabs'

// Mock child charts with data passthrough to verify props
vi.mock('../../components/insights/SwitchingBehaviorChart', () => ({
  default: ({ data }) => <div data-testid="switching-chart">{data?.title}</div>,
}))
vi.mock('../../components/insights/LoyaltySegmentsChart', () => ({
  default: ({ data }) => <div data-testid="loyalty-chart">{data?.title}</div>,
}))
vi.mock('../../components/insights/CrossPurchaseChart', () => ({
  default: ({ data }) => <div data-testid="cross-chart">{data?.title}</div>,
}))
vi.mock('../../components/insights/CategoryInsightsChart', () => ({
  default: ({ data }) => <div data-testid="category-chart">{data?.title}</div>,
}))
vi.mock('../../components/insights/BasketAssociationChart', () => ({
  default: ({ data }) => <div data-testid="basket-chart">{data?.title}</div>,
}))
vi.mock('../../components/insights/PropensityWindowChart', () => ({
  default: ({ data }) => <div data-testid="propensity-chart">{data?.title}</div>,
}))

describe('ShopperInsightsTabs — prop passthrough and edge cases', () => {
  it('passes correct data slice to the active chart', () => {
    render(<ShopperInsightsTabs clientId="kayak" />)
    expect(screen.getByTestId('switching-chart')).toHaveTextContent('Switching Behavior')
  })

  it('passes loyalty data when loyalty tab is active', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)
    await user.click(screen.getByText('Loyalty Segments'))
    expect(screen.getByTestId('loyalty-chart')).toHaveTextContent('Loyalty Segments')
  })

  it('works with different client IDs', () => {
    render(<ShopperInsightsTabs clientId="spirit" />)
    expect(screen.getByTestId('switching-chart')).toHaveTextContent('Switching Behavior')
  })

  it('works with all 5 client IDs', () => {
    const clientIds = ['kayak', 'spirit', 'ricola', 'newell', 'indeed']
    clientIds.forEach((clientId) => {
      const { unmount } = render(<ShopperInsightsTabs clientId={clientId} />)
      expect(screen.getByTestId('switching-chart')).toBeInTheDocument()
      unmount()
    })
  })

  it('only renders one chart panel at a time', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)

    // Default: only switching-chart visible
    expect(screen.getAllByTestId(/chart/).length).toBe(1)

    await user.click(screen.getByText('Category Insights'))
    expect(screen.getAllByTestId(/chart/).length).toBe(1)
    expect(screen.getByTestId('category-chart')).toBeInTheDocument()
  })

  it('applies active styling to the selected tab button', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)

    // "Switching Behavior" appears in both button and chart mock; use getByRole
    const switchingBtn = screen.getByRole('button', { name: 'Switching Behavior' })
    expect(switchingBtn).toHaveStyle({ color: '#FFFFFF' })

    const loyaltyBtn = screen.getByRole('button', { name: 'Loyalty Segments' })
    expect(loyaltyBtn).toHaveStyle({ color: '#AFADAD' })

    await user.click(loyaltyBtn)
    expect(loyaltyBtn).toHaveStyle({ color: '#FFFFFF' })
    expect(switchingBtn).toHaveStyle({ color: '#AFADAD' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - ShopperInsightsTabs imports data internally from shopperInsights[clientId] — passing data
 *   as a prop would make this component more testable and reusable.
 * - The 6-line conditional rendering block could be replaced with a component lookup map.
 * - Backup tests verify prop passthrough and styling — complementary to primary tab-switch tests.
 * - No redundancy between primary and backup test files.
 */
