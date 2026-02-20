import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdGroupView from '../../components/manager/AdGroupView'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderAdGroupView(clientId = 'kayak', campaignId = 'kayak-c1', adGroupId = 'kayak-c1-ag1') {
  return render(
    <MemoryRouter initialEntries={[`/manager/${clientId}/${campaignId}/${adGroupId}`]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId/:adGroupId" element={<AdGroupView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdGroupView', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders ad group name in the header', () => {
    renderAdGroupView()
    expect(screen.getAllByText(/Frequent Leisure Travelers/).length).toBeGreaterThanOrEqual(1)
  })

  it('renders breadcrumb trail with all levels', () => {
    renderAdGroupView()
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spring Travel Q1 2026' })).toBeInTheDocument()
  })

  it('renders audience segment as subtitle', () => {
    renderAdGroupView()
    expect(screen.getByText(/Travel Purchasers · 2\+ bookings \/ 90 days/)).toBeInTheDocument()
  })

  it('renders Outcome Audience badge', () => {
    renderAdGroupView()
    expect(screen.getAllByText('Outcome Audience').length).toBeGreaterThanOrEqual(1)
  })

  it('renders audience size', () => {
    renderAdGroupView()
    expect(screen.getByText('2.8M')).toBeInTheDocument()
  })

  it('renders Verified Purchase status', () => {
    renderAdGroupView()
    expect(screen.getByText(/Verified Purchase/)).toBeInTheDocument()
  })

  it('renders demo filter', () => {
    renderAdGroupView()
    expect(screen.getByText('HHI $75K+, Age 28–55')).toBeInTheDocument()
  })

  it('renders all 4 propensity windows', () => {
    renderAdGroupView()
    expect(screen.getByText('10-day')).toBeInTheDocument()
    expect(screen.getByText('30-day')).toBeInTheDocument()
    expect(screen.getByText('60-day')).toBeInTheDocument()
    expect(screen.getByText('90-day')).toBeInTheDocument()
  })

  it('renders propensity scores', () => {
    renderAdGroupView()
    // kayak-c1-ag1 scores: 84, 91, 88, 82
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.getByText('91')).toBeInTheDocument()
    expect(screen.getByText('88')).toBeInTheDocument()
    expect(screen.getByText('82')).toBeInTheDocument()
  })

  it('renders propensity labels', () => {
    renderAdGroupView()
    const highLabels = screen.getAllByText('High')
    expect(highLabels.length).toBeGreaterThanOrEqual(3)
    expect(screen.getByText('Very High')).toBeInTheDocument()
  })

  it('renders Performance section with metrics', () => {
    renderAdGroupView()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('4.2%')).toBeInTheDocument()  // conv rate
    expect(screen.getByText('22.4M')).toBeInTheDocument()  // impressions
    expect(screen.getByText('$68K')).toBeInTheDocument()   // spend
  })

  it('renders Packages section with count', () => {
    renderAdGroupView()
    expect(screen.getByText('Packages (2)')).toBeInTheDocument()
  })

  it('renders package table headers', () => {
    renderAdGroupView()
    expect(screen.getByText('Package')).toBeInTheDocument()
    expect(screen.getByText('Environment')).toBeInTheDocument()
    expect(screen.getByText('CPM')).toBeInTheDocument()
  })

  it('renders package names', () => {
    renderAdGroupView()
    expect(screen.getByText('CTV Premium Package')).toBeInTheDocument()
    expect(screen.getByText('Display Prospecting')).toBeInTheDocument()
  })

  it('navigates to package when row is clicked', async () => {
    const user = userEvent.setup()
    renderAdGroupView()

    const pkgBtn = screen.getByText('CTV Premium Package').closest('button')
    await user.click(pkgBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1')
  })

  it('renders null for invalid ad group', () => {
    const { container } = renderAdGroupView('kayak', 'kayak-c1', 'nonexistent')
    expect(container.innerHTML).toBe('')
  })

  it('renders null for invalid client', () => {
    const { container } = renderAdGroupView('nonexistent', 'kayak-c1', 'kayak-c1-ag1')
    expect(container.innerHTML).toBe('')
  })

  it('shows empty packages message for ad groups without packages', () => {
    // kayak-c1-ag2 has no packages
    renderAdGroupView('kayak', 'kayak-c1', 'kayak-c1-ag2')
    expect(screen.getByText(/No packages yet/)).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The scoreColor helper function is private to this file but could be shared since propensity score coloring is a cross-cutting concern.
 * - The Outcome Audience Detail section is a complex layout built inline. It could be a standalone OutcomeAudienceDetail component.
 * - Propensity windows are rendered with a 4-column grid inside the audience detail card. This widget could be reused if propensity data appears elsewhere.
 * - The packages table is manually built instead of using DrillTable — same DRY issue.
 * - Tests: Testing propensity scores by exact number is brittle if data changes, but acceptable for mock data.
 */
