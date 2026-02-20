import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PackageView from '../../components/manager/PackageView'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderPackageView(
  clientId = 'kayak',
  campaignId = 'kayak-c1',
  adGroupId = 'kayak-c1-ag1',
  packageId = 'kayak-c1-ag1-pk1'
) {
  const path = `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId" element={<PackageView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PackageView', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders package name in the header', () => {
    renderPackageView()
    expect(screen.getAllByText('CTV Premium Package').length).toBeGreaterThanOrEqual(1)
  })

  it('renders breadcrumb trail with all ancestor levels', () => {
    renderPackageView()
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spring Travel Q1 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Frequent Leisure Travelers/ })).toBeInTheDocument()
  })

  it('renders subtitle with environment and format', () => {
    renderPackageView()
    expect(screen.getByText('CTV · 15s + 30s')).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    renderPackageView()
    // "Impressions" and "Conv. Rate" appear in both KPI cards and deals table header
    expect(screen.getAllByText('Impressions').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Spend')).toBeInTheDocument()
    expect(screen.getAllByText('CPM').length).toBeGreaterThanOrEqual(2) // KPI card + deals table header
    expect(screen.getAllByText('Conv. Rate').length).toBeGreaterThanOrEqual(2)
  })

  it('renders KPI values', () => {
    renderPackageView()
    expect(screen.getByText('14.2M')).toBeInTheDocument()  // impressions
    expect(screen.getByText('$29K')).toBeInTheDocument()    // spend
    expect(screen.getByText('$2.07')).toBeInTheDocument()   // CPM
    expect(screen.getByText('4.4%')).toBeInTheDocument()    // conv rate
  })

  it('renders Deals section with count', () => {
    renderPackageView()
    expect(screen.getByText('Deals (2)')).toBeInTheDocument()
  })

  it('renders deal table headers', () => {
    renderPackageView()
    expect(screen.getByText('Deal Name')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Deal ID')).toBeInTheDocument()
    expect(screen.getByText('Publisher')).toBeInTheDocument()
  })

  it('renders deal names', () => {
    renderPackageView()
    expect(screen.getByText(/Hulu PMP — Travel Intent/)).toBeInTheDocument()
    expect(screen.getByText(/Peacock PG — Premium Travel/)).toBeInTheDocument()
  })

  it('renders deal types as badges', () => {
    renderPackageView()
    expect(screen.getByText('PMP')).toBeInTheDocument()
    expect(screen.getByText('PG')).toBeInTheDocument()
  })

  it('renders deal IDs', () => {
    renderPackageView()
    expect(screen.getByText('DID-HUL-74821')).toBeInTheDocument()
    expect(screen.getByText('DID-PCK-38291')).toBeInTheDocument()
  })

  it('navigates to deal when row is clicked', async () => {
    const user = userEvent.setup()
    renderPackageView()

    const dealBtn = screen.getByText(/Hulu PMP/).closest('button')
    await user.click(dealBtn)
    expect(mockNavigate).toHaveBeenCalledWith(
      '/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1/kayak-c1-ag1-pk1-d1'
    )
  })

  it('renders null for invalid package', () => {
    const { container } = renderPackageView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'nonexistent')
    expect(container.innerHTML).toBe('')
  })

  it('renders null for invalid client', () => {
    const { container } = renderPackageView('nonexistent', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk1')
    expect(container.innerHTML).toBe('')
  })

  it('shows empty deals message for packages without deals', () => {
    // kayak-c1-ag1-pk2 has no deals
    renderPackageView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk2')
    expect(screen.getByText(/No deals attached to this package/)).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - PackageView follows the exact same layout pattern as every other view: LevelHeader + KPI cards + drill table. The KPI card array.map is copy-paste with different data fields.
 * - The deals table is manually constructed instead of using DrillTable. 6th instance of this pattern.
 * - The deep URL structure (/manager/:clientId/:campaignId/:adGroupId/:packageId) makes route params increasingly unwieldy. A context-based approach or nested routes could simplify.
 * - Tests: The URL paths are getting very long. A test helper that builds URLs from ID segments would reduce repetition.
 */
