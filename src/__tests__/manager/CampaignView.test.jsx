import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CampaignView from '../../components/manager/CampaignView'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
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

function renderCampaignView(clientId = 'kayak', campaignId = 'kayak-c1') {
  return render(
    <MemoryRouter initialEntries={[`/manager/${clientId}/${campaignId}`]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId" element={<CampaignView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('CampaignView', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders campaign name in the header', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getAllByText('Spring Travel Q1 2026').length).toBeGreaterThanOrEqual(1)
  })

  it('renders breadcrumb with Tombras and client', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()
  })

  it('renders campaign subtitle with DSP, buying type, and flight dates', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText(/The Trade Desk · programmatic · 2026-01-15 – 2026-03-31/)).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByText('Impressions')).toBeInTheDocument()
    expect(screen.getByText('Reach')).toBeInTheDocument()
    expect(screen.getByText('Frequency')).toBeInTheDocument()
  })

  it('renders budget KPI values', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('$185K')).toBeInTheDocument()
    expect(screen.getByText(/\$114K spent · 62%/)).toBeInTheDocument()
  })

  it('renders impressions and reach values', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('42.8M')).toBeInTheDocument()  // impressions
    expect(screen.getByText('8.9M')).toBeInTheDocument()    // reach
  })

  it('renders frequency value', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('4.8x')).toBeInTheDocument()
  })

  it('renders conversion rate KPI', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('4.1%')).toBeInTheDocument()
    expect(screen.getByText('vs 2.8% benchmark')).toBeInTheDocument()
  })

  it('renders Ad Groups section with count', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('Ad Groups (2)')).toBeInTheDocument()
  })

  it('renders ad group table headers', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText('Ad Group')).toBeInTheDocument()
    expect(screen.getByText('Audience Type')).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('Propensity (30-day)')).toBeInTheDocument()
  })

  it('renders ad group names', () => {
    renderCampaignView('kayak', 'kayak-c1')
    expect(screen.getByText(/Frequent Leisure Travelers/)).toBeInTheDocument()
    expect(screen.getByText(/Hotel Purchasers — Switched from Expedia/)).toBeInTheDocument()
  })

  it('renders Outcome Audience badges', () => {
    renderCampaignView('kayak', 'kayak-c1')
    const badges = screen.getAllByText('Outcome Audience')
    expect(badges.length).toBeGreaterThanOrEqual(2)
  })

  it('navigates to ad group when row is clicked', async () => {
    const user = userEvent.setup()
    renderCampaignView('kayak', 'kayak-c1')

    const agBtn = screen.getByText(/Frequent Leisure Travelers/).closest('button')
    await user.click(agBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/manager/kayak/kayak-c1/kayak-c1-ag1')
  })

  it('renders null for invalid campaign', () => {
    const { container } = renderCampaignView('kayak', 'nonexistent')
    expect(container.innerHTML).toBe('')
  })

  it('renders null for invalid client', () => {
    const { container } = renderCampaignView('nonexistent', 'kayak-c1')
    expect(container.innerHTML).toBe('')
  })

  it('renders Ricola campaign with correct data', () => {
    renderCampaignView('ricola', 'ricola-c1')
    expect(screen.getAllByText('Cold & Flu Season Peak').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$196K')).toBeInTheDocument()
    expect(screen.getByText('5.4%')).toBeInTheDocument()
  })

  it('shows "No ad groups configured" for campaigns without ad groups', () => {
    // newell-c2 has no ad groups mapped
    renderCampaignView('newell', 'newell-c2')
    expect(screen.getByText('No ad groups configured')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - CampaignView has 5 KPI cards built inline with an array.map. This pattern repeats in every deep view (PackageView, DealView, etc.) — a shared KPIGrid component would eliminate significant duplication.
 * - The ad group table is manually built instead of using DrillTable. Same DRY issue seen in ClientView and ManagerHome.
 * - PurchaseImpactPanel and SalesLiftChart are imported as child components. These could fail independently and break this view's tests — hence the recharts mock.
 * - The budgetPct calculation is inline. With many calculations, a dedicated formatting/calculation utility would be cleaner.
 * - Tests: Mock recharts to prevent SVG rendering issues in jsdom. The mock is minimal and doesn't validate chart data.
 */
