import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CampaignView from '../../components/manager/CampaignView'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

// Mock child components that need metrics fields not present on campaign.metrics
vi.mock('../../components/measurement/PurchaseImpactPanel', () => ({
  default: () => <div data-testid="purchase-impact-panel">PurchaseImpactPanel</div>,
}))
vi.mock('../../components/measurement/SalesLiftChart', () => ({
  default: () => <div data-testid="sales-lift-chart">SalesLiftChart</div>,
}))
vi.mock('../../components/measurement/ChannelSplitBar', () => ({
  default: () => <div data-testid="channel-split-bar">ChannelSplitBar</div>,
}))

function renderCampaignView(clientId, campaignId) {
  return render(
    <MemoryRouter initialEntries={[`/manager/${clientId}/${campaignId}`]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId" element={<CampaignView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CampaignView (backup — cross-campaign data validation)', () => {
  it('renders kayak-c2 (Hotel Deals) with correct KPIs', () => {
    renderCampaignView('kayak', 'kayak-c2')
    expect(screen.getAllByText(/Hotel Deals/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$143K')).toBeInTheDocument()
    expect(screen.getByText('3.2%')).toBeInTheDocument()
    expect(screen.getByText('5.1x')).toBeInTheDocument() // frequency
  })

  it('renders kayak-c3 (Loyalty Retargeting) with underpacing budget', () => {
    renderCampaignView('kayak', 'kayak-c3')
    expect(screen.getAllByText(/Loyalty Retargeting/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$62K')).toBeInTheDocument()
    // budgetPct = Math.round(18900/62000*100) = 30
    expect(screen.getByText(/\$19K spent · 30%/)).toBeInTheDocument()
  })

  it('renders spirit-c1 with correct ad groups', () => {
    renderCampaignView('spirit', 'spirit-c1')
    expect(screen.getByText(/Budget Air Purchasers/)).toBeInTheDocument()
    expect(screen.getByText(/Frontier Switchers/)).toBeInTheDocument()
    expect(screen.getByText('Ad Groups (2)')).toBeInTheDocument()
  })

  it('renders indeed-c1 with life events ad group', () => {
    renderCampaignView('indeed', 'indeed-c1')
    expect(screen.getByText(/Declared Job Transitioners/)).toBeInTheDocument()
    expect(screen.getByText('Ad Groups (1)')).toBeInTheDocument()
  })

  it('renders newell-c1 campaign details', () => {
    renderCampaignView('newell', 'newell-c1')
    expect(screen.getAllByText(/Rubbermaid Spring Organization/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$220K')).toBeInTheDocument()
  })

  it('renders propensity score for 30-day window', () => {
    renderCampaignView('kayak', 'kayak-c1')
    // kayak-c1-ag1 30-day score: 91
    expect(screen.getByText('91')).toBeInTheDocument()
  })

  it('renders audience size in millions', () => {
    renderCampaignView('kayak', 'kayak-c1')
    // kayak-c1-ag1: 2.8M, kayak-c1-ag2: 1.1M
    expect(screen.getByText('2.8M')).toBeInTheDocument()
    expect(screen.getByText('1.1M')).toBeInTheDocument()
  })

  it('renders status badge for campaign', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders ad group audience segment descriptions', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText(/Travel Purchasers · 2\+ bookings/)).toBeInTheDocument()
    expect(screen.getByText(/Hotel Booking Switchers/)).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Backup tests validate data across multiple campaigns. This serves as an integration test for the data pipeline (data files -> component -> DOM).
 * - The propensity score display logic (find 30-day window, apply color based on score) is duplicated between CampaignView and AdGroupView. Could be extracted to a PropensityBadge component.
 * - The audience size formatting (/ 1000000).toFixed(1) + "M" is repeated across multiple components. A formatNumber utility would reduce duplication.
 * - Status badge rendering relies on StatusBadge component which maps status strings to visual variants — well encapsulated.
 */
