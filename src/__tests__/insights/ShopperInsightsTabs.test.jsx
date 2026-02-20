import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShopperInsightsTabs from '../../components/insights/ShopperInsightsTabs'

// Mock all child chart components to isolate tab switching logic
vi.mock('../../components/insights/SwitchingBehaviorChart', () => ({
  default: () => <div data-testid="switching-chart">SwitchingBehaviorChart</div>,
}))
vi.mock('../../components/insights/LoyaltySegmentsChart', () => ({
  default: () => <div data-testid="loyalty-chart">LoyaltySegmentsChart</div>,
}))
vi.mock('../../components/insights/CrossPurchaseChart', () => ({
  default: () => <div data-testid="cross-chart">CrossPurchaseChart</div>,
}))
vi.mock('../../components/insights/CategoryInsightsChart', () => ({
  default: () => <div data-testid="category-chart">CategoryInsightsChart</div>,
}))
vi.mock('../../components/insights/BasketAssociationChart', () => ({
  default: () => <div data-testid="basket-chart">BasketAssociationChart</div>,
}))
vi.mock('../../components/insights/PropensityWindowChart', () => ({
  default: () => <div data-testid="propensity-chart">PropensityWindowChart</div>,
}))

describe('ShopperInsightsTabs', () => {
  it('renders nothing when clientId has no data', () => {
    const { container } = render(<ShopperInsightsTabs clientId="nonexistent" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all 6 tab buttons', () => {
    render(<ShopperInsightsTabs clientId="kayak" />)
    expect(screen.getByText('Switching Behavior')).toBeInTheDocument()
    expect(screen.getByText('Loyalty Segments')).toBeInTheDocument()
    expect(screen.getByText('Cross-Purchase')).toBeInTheDocument()
    expect(screen.getByText('Category Insights')).toBeInTheDocument()
    expect(screen.getByText('Basket Association')).toBeInTheDocument()
    expect(screen.getByText('Purchase Propensity')).toBeInTheDocument()
  })

  it('shows SwitchingBehaviorChart by default', () => {
    render(<ShopperInsightsTabs clientId="kayak" />)
    expect(screen.getByTestId('switching-chart')).toBeInTheDocument()
    expect(screen.queryByTestId('loyalty-chart')).not.toBeInTheDocument()
  })

  it('switches to Loyalty Segments tab', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)
    await user.click(screen.getByText('Loyalty Segments'))
    expect(screen.getByTestId('loyalty-chart')).toBeInTheDocument()
    expect(screen.queryByTestId('switching-chart')).not.toBeInTheDocument()
  })

  it('switches to Cross-Purchase tab', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)
    await user.click(screen.getByText('Cross-Purchase'))
    expect(screen.getByTestId('cross-chart')).toBeInTheDocument()
  })

  it('switches to Category Insights tab', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)
    await user.click(screen.getByText('Category Insights'))
    expect(screen.getByTestId('category-chart')).toBeInTheDocument()
  })

  it('switches to Basket Association tab', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)
    await user.click(screen.getByText('Basket Association'))
    expect(screen.getByTestId('basket-chart')).toBeInTheDocument()
  })

  it('switches to Purchase Propensity tab', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)
    await user.click(screen.getByText('Purchase Propensity'))
    expect(screen.getByTestId('propensity-chart')).toBeInTheDocument()
  })

  it('can switch back to the first tab after navigating away', async () => {
    const user = userEvent.setup()
    render(<ShopperInsightsTabs clientId="kayak" />)
    await user.click(screen.getByText('Basket Association'))
    expect(screen.getByTestId('basket-chart')).toBeInTheDocument()
    await user.click(screen.getByText('Switching Behavior'))
    expect(screen.getByTestId('switching-chart')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The TABS array and tab-content mapping use parallel structures; a config-driven renderer
 *   (e.g., TABS with a `component` key) would eliminate the 6-line conditional block.
 * - Active tab style could use a shared utility instead of inline ternaries.
 * - Tests mock all children — fast and focused on tab switching logic only.
 * - No simplification needed in tests; mocking children is the correct pattern here.
 */
