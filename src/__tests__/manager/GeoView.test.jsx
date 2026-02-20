import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import GeoView from '../../components/manager/GeoView'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderGeoView(ids = {}) {
  const {
    clientId = 'kayak',
    campaignId = 'kayak-c1',
    adGroupId = 'kayak-c1-ag1',
    packageId = 'kayak-c1-ag1-pk1',
    dealId = 'kayak-c1-ag1-pk1-d1',
    creativeId = 'kayak-cr1',
    geoId = 'kayak-cr1-geo1',
  } = ids
  const path = `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}/${creativeId}/${geoId}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId/:creativeId/:geoId"
          element={<GeoView />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('GeoView', () => {
  it('renders DMA name in the header', () => {
    renderGeoView()
    // "New York, NY" appears in the title
    const nyElements = screen.getAllByText('New York, NY')
    expect(nyElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders breadcrumb trail with all 8 levels', () => {
    renderGeoView()
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spring Travel Q1 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Frequent Leisure Travelers/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'CTV Premium Package' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hulu PMP/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Spring Getaways :30/ })).toBeInTheDocument()
  })

  it('renders subtitle with DMA code, creative, and campaign', () => {
    renderGeoView()
    expect(screen.getByText(/DMA 501 · Spring Getaways :30 — Lifestyle · Spring Travel Q1 2026/)).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    renderGeoView()
    expect(screen.getByText('DMA')).toBeInTheDocument()
    expect(screen.getByText('Impressions')).toBeInTheDocument()
    expect(screen.getByText('Spend')).toBeInTheDocument()
    expect(screen.getByText('Conv. Rate')).toBeInTheDocument()
  })

  it('renders KPI values for New York', () => {
    renderGeoView()
    expect(screen.getByText('#501')).toBeInTheDocument()
    expect(screen.getByText('1.2M')).toBeInTheDocument()
    expect(screen.getByText('$4.8K')).toBeInTheDocument()
    expect(screen.getByText('5.2%')).toBeInTheDocument()
  })

  it('renders New Buyer Performance section', () => {
    renderGeoView()
    expect(screen.getByText('New Buyer Performance')).toBeInTheDocument()
    expect(screen.getByText('New Buyer CVR')).toBeInTheDocument()
    expect(screen.getByText('vs. Campaign Avg')).toBeInTheDocument()
  })

  it('renders New Buyer CVR value', () => {
    renderGeoView()
    // kayak-cr1-geo1 newBuyerCvr: 0.0034 => 0.34%
    expect(screen.getByText('0.34%')).toBeInTheDocument()
  })

  it('shows "Above avg" for high conversion geos', () => {
    renderGeoView()
    // NY CVR 0.052 >= 0.05, so above avg
    expect(screen.getByText(/Above avg/)).toBeInTheDocument()
  })

  it('renders null for invalid geo', () => {
    const { container } = renderGeoView({ geoId: 'nonexistent' })
    expect(container.innerHTML).toBe('')
  })

  it('renders null for invalid client', () => {
    const { container } = renderGeoView({ clientId: 'nonexistent' })
    expect(container.innerHTML).toBe('')
  })

  it('renders null for invalid campaign', () => {
    const { container } = renderGeoView({ campaignId: 'nonexistent' })
    expect(container.innerHTML).toBe('')
  })

  it('renders null for invalid creative', () => {
    const { container } = renderGeoView({ creativeId: 'nonexistent' })
    expect(container.innerHTML).toBe('')
  })

  it('renders Miami geo with correct data', () => {
    renderGeoView({ geoId: 'kayak-cr1-geo5' })
    expect(screen.getAllByText('Miami-Ft. Lauderdale, FL').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('#528')).toBeInTheDocument()
    expect(screen.getByText('6.1%')).toBeInTheDocument()
  })

  it('renders conversion rate in green for high-performing geos', () => {
    renderGeoView() // NY with 5.2% CVR
    const cvrEl = screen.getByText('5.2%')
    expect(cvrEl.style.color).toBe('rgb(34, 197, 94)')
  })

  it('does not have any drill-down table (deepest level)', () => {
    renderGeoView()
    // GeoView is the leaf — no child table
    expect(screen.queryByRole('button', { name: /row/i })).toBeNull()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - GeoView is the deepest drill level and the simplest view. It has no child table, which makes it the only non-drill view.
 * - The "vs. Campaign Avg" comparison uses a hardcoded 5% threshold (geo.metrics.conversionRate >= 0.05). This should reference the actual campaign average, not a magic number.
 * - The New Buyer Performance section is unique to GeoView. In a real product, this data would likely exist at every level.
 * - The breadcrumb at 8 segments is very long. Production dashboards typically truncate or collapse middle segments.
 * - The component uses both useParams (7 params) and looks up 7 data objects. This is the heaviest data fetch of any view — a context or data loader pattern would simplify.
 */
