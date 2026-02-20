import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ClientView from '../../components/manager/ClientView'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

// Mock heavy child components
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

function renderClientView(clientId) {
  return render(
    <MemoryRouter initialEntries={[`/manager/${clientId}`]}>
      <Routes>
        <Route path="/manager/:clientId" element={<ClientView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ClientView (backup — all clients data validation)', () => {
  it('renders all 3 Kayak campaigns with correct conversion rates', () => {
    renderClientView('kayak')
    expect(screen.getByText('4.1%')).toBeInTheDocument()  // kayak-c1
    expect(screen.getByText('3.2%')).toBeInTheDocument()  // kayak-c2
    expect(screen.getByText('3.5%')).toBeInTheDocument()  // kayak-c3
  })

  it('renders Kayak campaign ROAS values', () => {
    renderClientView('kayak')
    expect(screen.getByText('1.9x')).toBeInTheDocument()  // kayak-c1
    expect(screen.getByText('1.4x')).toBeInTheDocument()  // kayak-c2
    expect(screen.getByText('1.6x')).toBeInTheDocument()  // kayak-c3
  })

  it('renders Spirit Airlines with 2 campaigns', () => {
    renderClientView('spirit')
    expect(screen.getByText(/Spring Break Fares/)).toBeInTheDocument()
    expect(screen.getByText('Lapsed Flier Win-Back')).toBeInTheDocument()
  })

  it('renders Spirit Airlines alert about Frontier switching', () => {
    renderClientView('spirit')
    expect(screen.getByText(/18% of target audience switched to Frontier/)).toBeInTheDocument()
  })

  it('renders Ricola with 2 campaigns', () => {
    renderClientView('ricola')
    expect(screen.getByText('Cold & Flu Season Peak')).toBeInTheDocument()
    expect(screen.getByText('Herbal Wellness Audience Expansion')).toBeInTheDocument()
  })

  it('renders Indeed with 2 campaigns', () => {
    renderClientView('indeed')
    expect(screen.getByText(/Job Seeker Activation/)).toBeInTheDocument()
    expect(screen.getByText(/SMB Hiring/)).toBeInTheDocument()
  })

  it('renders campaign flight dates', () => {
    renderClientView('kayak')
    expect(screen.getByText(/2026-01-15 – 2026-03-31/)).toBeInTheDocument()
  })

  it('renders 3 tab buttons', () => {
    renderClientView('kayak')
    const tabs = ['Campaigns', 'Shopper Insights', 'Purchase Impact']
    tabs.forEach((tab) => {
      expect(screen.getByRole('button', { name: tab })).toBeInTheDocument()
    })
  })

  it('renders active tab with white color and border', () => {
    renderClientView('kayak')
    const activeTab = screen.getByRole('button', { name: 'Campaigns' })
    expect(activeTab.style.color).toBe('rgb(255, 255, 255)')
    expect(activeTab.style.borderBottom).toContain('2px solid')
  })

  it('renders inactive tabs with muted color', () => {
    renderClientView('kayak')
    const inactiveTab = screen.getByRole('button', { name: 'Shopper Insights' })
    expect(inactiveTab.style.color).toBe('rgb(175, 173, 173)')
  })

  it('shows OutcomeAI cards for kayak', () => {
    renderClientView('kayak')
    expect(screen.getByText(/OutcomeAI for Kayak/)).toBeInTheDocument()
  })

  it('renders Status column header', () => {
    renderClientView('kayak')
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('returns "Client not found" for empty string clientId', () => {
    render(
      <MemoryRouter initialEntries={['/manager/ ']}>
        <Routes>
          <Route path="/manager/:clientId" element={<ClientView />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Client not found')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Each client view test validates the same pattern: header + campaigns + metrics. These could share a parameterized test helper that takes clientId and expected values.
 * - The OutcomeAI card integration adds complexity. The component imports from outcomeAI.js, executive/OutcomeAICard, insights/ShopperInsightsTabs, and 3 measurement components — making it a heavy integration point.
 * - Tab active/inactive styling is managed via inline style objects in JSX. CSS classes or a TabButton component would simplify.
 * - Tests: Backup tests all 5 clients' data presence, serving as a data integration test. Primary focuses on behavior (clicks, tabs, navigation).
 */
