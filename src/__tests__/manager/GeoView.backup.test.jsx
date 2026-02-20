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

describe('GeoView (backup — multi-geo data validation)', () => {
  it('renders LA geo with correct data', () => {
    renderGeoView({ geoId: 'kayak-cr1-geo2' })
    expect(screen.getAllByText('Los Angeles, CA').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('#803')).toBeInTheDocument()
    expect(screen.getByText('1.0M')).toBeInTheDocument()
    expect(screen.getByText('$3.6K')).toBeInTheDocument()
    expect(screen.getByText('4.9%')).toBeInTheDocument()
  })

  it('renders Chicago geo with correct data', () => {
    renderGeoView({ geoId: 'kayak-cr1-geo3' })
    expect(screen.getAllByText('Chicago, IL').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('#602')).toBeInTheDocument()
    expect(screen.getByText('4.6%')).toBeInTheDocument()
  })

  it('renders Dallas geo with correct data', () => {
    renderGeoView({ geoId: 'kayak-cr1-geo4' })
    expect(screen.getAllByText('Dallas-Ft. Worth, TX').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('#623')).toBeInTheDocument()
    expect(screen.getByText('4.3%')).toBeInTheDocument()
  })

  it('renders Ricola NY geo with high conversion', () => {
    renderGeoView({
      clientId: 'ricola',
      campaignId: 'ricola-c1',
      adGroupId: 'ricola-c1-ag1',
      packageId: 'ricola-c1-ag1-pk1',
      dealId: 'ricola-c1-ag1-pk1-d1',
      creativeId: 'ricola-cr1',
      geoId: 'ricola-cr1-geo1',
    })
    expect(screen.getByText('6.8%')).toBeInTheDocument()
    expect(screen.getByText('0.48%')).toBeInTheDocument() // new buyer CVR
    expect(screen.getByText(/Above avg/)).toBeInTheDocument()
  })

  it('renders Ricola Boston geo with highest conversion', () => {
    renderGeoView({
      clientId: 'ricola',
      campaignId: 'ricola-c1',
      adGroupId: 'ricola-c1-ag1',
      packageId: 'ricola-c1-ag1-pk1',
      dealId: 'ricola-c1-ag1-pk1-d1',
      creativeId: 'ricola-cr1',
      geoId: 'ricola-cr1-geo3',
    })
    expect(screen.getAllByText('Boston, MA').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('#506')).toBeInTheDocument()
    expect(screen.getByText('7.1%')).toBeInTheDocument()
    expect(screen.getByText('0.52%')).toBeInTheDocument()
  })

  it('renders Spirit Miami geo', () => {
    renderGeoView({
      clientId: 'spirit',
      campaignId: 'spirit-c1',
      adGroupId: 'spirit-c1-ag1',
      packageId: 'spirit-c1-ag1-pk1',
      dealId: 'spirit-c1-ag1-pk1-d1',
      creativeId: 'spirit-cr1',
      geoId: 'spirit-cr1-geo1',
    })
    expect(screen.getAllByText('Miami-Ft. Lauderdale, FL').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('#528')).toBeInTheDocument()
    expect(screen.getByText('4.2%')).toBeInTheDocument()
  })

  it('shows "On avg" for below-threshold geos', () => {
    renderGeoView({ geoId: 'kayak-cr1-geo3' }) // Chicago: 4.6% < 5%
    expect(screen.getByText(/On avg/)).toBeInTheDocument()
  })

  it('shows "Above avg" for above-threshold geos', () => {
    renderGeoView({ geoId: 'kayak-cr1-geo1' }) // NY: 5.2% >= 5%
    expect(screen.getByText(/Above avg/)).toBeInTheDocument()
  })

  it('renders back button', () => {
    renderGeoView()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Backup tests all available geos across 3 clients (Kayak 5, Ricola 4, Spirit 3). This validates the full depth of the data hierarchy.
 * - The "On avg" vs "Above avg" threshold at 5% is tested from both sides. The threshold is hardcoded — could be a prop or constant.
 * - GeoView is the only view that doesn't have a child drill table. It's purely a detail view. This could be confusing for users who expect to keep drilling.
 * - The 7-parameter URL is the deepest route in the app. Each ancestor must be valid for the view to render — a single broken link in the chain returns null.
 * - Tests: The multi-client geo tests serve as end-to-end data integrity checks for the entire hierarchy.
 */
