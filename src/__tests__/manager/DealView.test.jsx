import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DealView from '../../components/manager/DealView'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderDealView(
  clientId = 'kayak',
  campaignId = 'kayak-c1',
  adGroupId = 'kayak-c1-ag1',
  packageId = 'kayak-c1-ag1-pk1',
  dealId = 'kayak-c1-ag1-pk1-d1'
) {
  const path = `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId" element={<DealView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DealView', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders deal name in the header', () => {
    renderDealView()
    expect(screen.getAllByText(/Hulu PMP — Travel Intent/).length).toBeGreaterThanOrEqual(1)
  })

  it('renders breadcrumb trail with all ancestor levels', () => {
    renderDealView()
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spring Travel Q1 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Frequent Leisure Travelers/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'CTV Premium Package' })).toBeInTheDocument()
  })

  it('renders subtitle with deal type, publisher, and deal ID', () => {
    renderDealView()
    expect(screen.getByText('PMP · Hulu · DID-HUL-74821')).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    renderDealView()
    expect(screen.getByText('Deal Type')).toBeInTheDocument()
    expect(screen.getByText('CPM')).toBeInTheDocument()
    expect(screen.getByText('Imps Bought')).toBeInTheDocument()
    // "Conv. Rate" appears in both KPI cards and creatives table header
    expect(screen.getAllByText('Conv. Rate').length).toBeGreaterThanOrEqual(2)
  })

  it('renders KPI values', () => {
    renderDealView()
    // Deal type shown in KPI card
    const pmpElements = screen.getAllByText('PMP')
    expect(pmpElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$28.50')).toBeInTheDocument()
    expect(screen.getByText('8.4M')).toBeInTheDocument()
    expect(screen.getByText('4.6%')).toBeInTheDocument()
  })

  it('renders viewability metric', () => {
    renderDealView()
    expect(screen.getByText('Viewability')).toBeInTheDocument()
    // 94% appears in viewability and creative completion — verify at least one exists
    expect(screen.getAllByText('94%').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('(industry avg: 70%)')).toBeInTheDocument()
  })

  it('renders Creatives section with count', () => {
    renderDealView()
    expect(screen.getByText('Creatives (2)')).toBeInTheDocument()
  })

  it('renders creative table headers', () => {
    renderDealView()
    expect(screen.getByText('Creative')).toBeInTheDocument()
    expect(screen.getByText('Format')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Completion')).toBeInTheDocument()
  })

  it('renders creative names', () => {
    renderDealView()
    expect(screen.getByText(/Spring Getaways :30/)).toBeInTheDocument()
    expect(screen.getByText(/Hotel Deals :15/)).toBeInTheDocument()
  })

  it('navigates to creative when row is clicked', async () => {
    const user = userEvent.setup()
    renderDealView()

    const crBtn = screen.getByText(/Spring Getaways :30/).closest('button')
    await user.click(crBtn)
    expect(mockNavigate).toHaveBeenCalledWith(
      '/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1/kayak-c1-ag1-pk1-d1/kayak-cr1'
    )
  })

  it('renders null for invalid deal', () => {
    const { container } = renderDealView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk1', 'nonexistent')
    expect(container.innerHTML).toBe('')
  })

  it('renders creative completion rates', () => {
    renderDealView()
    // kayak-cr1 completion: 94%, kayak-cr2 completion: 97%
    expect(screen.getAllByText('94%').length).toBeGreaterThanOrEqual(1) // viewability is also 94%
    expect(screen.getByText('97%')).toBeInTheDocument()
  })

  it('renders creative approval status badges', () => {
    renderDealView()
    const approvedBadges = screen.getAllByText('Approved')
    expect(approvedBadges.length).toBeGreaterThanOrEqual(2)
  })

  it('shows empty creatives message for deals without creatives', () => {
    // Peacock deal (kayak-c1-ag1-pk1-d2) has no creatives in the data
    renderDealView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk1', 'kayak-c1-ag1-pk1-d2')
    expect(screen.getByText(/No creatives attached to this deal/)).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - DealView follows the same layout pattern as PackageView and every other drill view: LevelHeader + KPI cards + child table. 7th instance of this pattern.
 * - The viewability section is conditional and inline. Could be a ViewabilityIndicator component.
 * - The KPI "Deal Type" card displays the deal type with a special color — this is the only KPI card that uses color differentiation, introducing inconsistency.
 * - The creatives table uses StatusBadge for approval status — good component reuse.
 * - Tests: URL paths are now 6 segments deep. The renderDealView helper has 5 parameters — an object would be more readable.
 */
