import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ClientView from '../../components/manager/ClientView'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

// Mock heavy child components to isolate ClientView logic
vi.mock('../../components/measurement/PurchaseImpactPanel', () => ({
  default: () => <div data-testid="purchase-impact-panel">PurchaseImpactPanel</div>,
}))
vi.mock('../../components/measurement/ChannelSplitBar', () => ({
  default: () => <div data-testid="channel-split-bar">ChannelSplitBar</div>,
}))
vi.mock('../../components/measurement/RetailerBreakdown', () => ({
  default: () => <div data-testid="retailer-breakdown">RetailerBreakdown</div>,
}))
vi.mock('../../components/insights/ShopperInsightsTabs', () => ({
  default: () => <div data-testid="shopper-insights">ShopperInsightsTabs</div>,
}))
vi.mock('../../components/executive/OutcomeAICard', () => ({
  default: ({ card }) => <div data-testid="outcome-ai-card">{card.insight}</div>,
}))

function renderClientView(clientId = 'kayak') {
  return render(
    <MemoryRouter initialEntries={[`/manager/${clientId}`]}>
      <Routes>
        <Route path="/manager/:clientId" element={<ClientView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ClientView', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders client name in the header', () => {
    renderClientView('kayak')
    // Kayak appears in title and breadcrumb
    expect(screen.getAllByText('Kayak').length).toBeGreaterThanOrEqual(1)
  })

  it('renders client vertical and description', () => {
    renderClientView('kayak')
    expect(screen.getByText(/Travel · Multi-DSP programmatic/)).toBeInTheDocument()
  })

  it('renders the Campaigns tab as active by default', () => {
    renderClientView('kayak')
    expect(screen.getByText('Campaigns')).toBeInTheDocument()
    expect(screen.getByText('Shopper Insights')).toBeInTheDocument()
    expect(screen.getByText('Purchase Impact')).toBeInTheDocument()
  })

  it('renders campaign table headers on Campaigns tab', () => {
    renderClientView('kayak')
    expect(screen.getByText('Campaign')).toBeInTheDocument()
    expect(screen.getByText('Conv. Rate')).toBeInTheDocument()
    expect(screen.getByText('New Buyer ROAS')).toBeInTheDocument()
    expect(screen.getByText('Budget Pacing')).toBeInTheDocument()
    expect(screen.getByText('DSP')).toBeInTheDocument()
  })

  it('renders Kayak campaigns', () => {
    renderClientView('kayak')
    expect(screen.getByText('Spring Travel Q1 2026')).toBeInTheDocument()
    expect(screen.getByText(/Hotel Deals/)).toBeInTheDocument()
    expect(screen.getByText(/Loyalty Retargeting/)).toBeInTheDocument()
  })

  it('navigates to campaign detail when a campaign row is clicked', async () => {
    const user = userEvent.setup()
    renderClientView('kayak')

    // Find campaign rows — they're the clickable buttons in the campaign table
    const campaignBtn = screen.getByText('Spring Travel Q1 2026').closest('button')
    await user.click(campaignBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/manager/kayak/kayak-c1')
  })

  it('renders alert banner for clients with alerts', () => {
    renderClientView('kayak')
    expect(screen.getByText(/Amazon DSP underperforming TTD by 28%/)).toBeInTheDocument()
  })

  it('renders positive alert for Ricola', () => {
    renderClientView('ricola')
    expect(screen.getByText(/Q1 cold-season propensity index at 3.2x/)).toBeInTheDocument()
  })

  it('does not render alert banner for clients without alerts', () => {
    renderClientView('newell')
    expect(screen.queryByText(/underperforming/)).toBeNull()
  })

  it('renders BuyingTypeBadge in the header', () => {
    renderClientView('kayak')
    expect(screen.getAllByText('Programmatic').length).toBeGreaterThanOrEqual(1)
  })

  it('switches to Shopper Insights tab', async () => {
    const user = userEvent.setup()
    renderClientView('kayak')

    await user.click(screen.getByRole('button', { name: 'Shopper Insights' }))
    // Campaign table should not be visible
    expect(screen.queryByText('Budget Pacing')).toBeNull()
    expect(screen.getByTestId('shopper-insights')).toBeInTheDocument()
  })

  it('switches to Purchase Impact tab', async () => {
    const user = userEvent.setup()
    renderClientView('kayak')

    await user.click(screen.getByRole('button', { name: 'Purchase Impact' }))
    // Campaign table should not be visible
    expect(screen.queryByText('Budget Pacing')).toBeNull()
    expect(screen.getByTestId('purchase-impact-panel')).toBeInTheDocument()
  })

  it('renders "Client not found" for invalid clientId', () => {
    renderClientView('nonexistent')
    expect(screen.getByText('Client not found')).toBeInTheDocument()
  })

  it('renders Newell Brands correctly', () => {
    renderClientView('newell')
    expect(screen.getAllByText('Newell Brands').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Rubbermaid Spring Organization')).toBeInTheDocument()
    expect(screen.getByText('Coleman Outdoor Q1')).toBeInTheDocument()
  })

  it('renders breadcrumb with Tombras link', () => {
    renderClientView('kayak')
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
  })

  it('renders campaign pacing percentages', () => {
    renderClientView('kayak')
    // kayak-c1 pacing: 62%, kayak-c2: 69%, kayak-c3: 31%
    expect(screen.getByText('62%')).toBeInTheDocument()
    expect(screen.getByText('69%')).toBeInTheDocument()
    expect(screen.getByText('31%')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - ClientView has 3 tabs but manually builds the campaign table instead of using DrillTable. This is the same pattern duplication seen in ManagerHome.
 * - The PacingPill is a private component defined inside the file. It could be shared since pacing display is used across multiple views.
 * - Tab state management is basic useState — fine for 3 tabs, but if tabs grow or need URL persistence, a router-based tab approach would be better.
 * - The "Client not found" fallback is good but doesn't match the pattern of other views (which return null). Inconsistent error handling across views.
 * - Tests: the tab switching tests verify mutual exclusivity of tab content, which is the key behavior.
 */
