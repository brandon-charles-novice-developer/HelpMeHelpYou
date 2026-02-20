import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PackageView from '../../components/manager/PackageView'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderPackageView(clientId, campaignId, adGroupId, packageId) {
  const path = `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId" element={<PackageView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PackageView (backup — cross-client package data)', () => {
  it('renders Spirit CTV Awareness package', () => {
    renderPackageView('spirit', 'spirit-c1', 'spirit-c1-ag1', 'spirit-c1-ag1-pk1')
    expect(screen.getAllByText('CTV Awareness').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$2.48')).toBeInTheDocument()
    expect(screen.getByText('19.8M')).toBeInTheDocument()
  })

  it('renders Ricola Peak Season CTV package', () => {
    renderPackageView('ricola', 'ricola-c1', 'ricola-c1-ag1', 'ricola-c1-ag1-pk1')
    expect(screen.getAllByText('Peak Season CTV').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$2.05')).toBeInTheDocument()
    expect(screen.getByText('5.8%')).toBeInTheDocument()
  })

  it('renders Indeed CTV Life Event Targeting package', () => {
    renderPackageView('indeed', 'indeed-c1', 'indeed-c1-ag1', 'indeed-c1-ag1-pk1')
    expect(screen.getAllByText('CTV Life Event Targeting').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$1.49')).toBeInTheDocument()
  })

  it('renders Newell Managed Display Package', () => {
    renderPackageView('newell', 'newell-c1', 'newell-c1-ag1', 'newell-c1-ag1-pk1')
    expect(screen.getAllByText('Managed Display Package').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$1.19')).toBeInTheDocument()
    expect(screen.getByText('3.8%')).toBeInTheDocument()
  })

  it('renders deal publisher names', () => {
    renderPackageView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk1')
    expect(screen.getByText('Hulu')).toBeInTheDocument()
    expect(screen.getByText('Peacock')).toBeInTheDocument()
  })

  it('renders deal CPM values', () => {
    renderPackageView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk1')
    expect(screen.getByText('$28.50')).toBeInTheDocument()
    expect(screen.getByText('$32.00')).toBeInTheDocument()
  })

  it('renders deal conversion rates', () => {
    renderPackageView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk1')
    expect(screen.getByText('4.6%')).toBeInTheDocument()
    expect(screen.getByText('4.2%')).toBeInTheDocument()
  })

  it('renders deal format descriptions', () => {
    renderPackageView('kayak', 'kayak-c1', 'kayak-c1-ag1', 'kayak-c1-ag1-pk1')
    expect(screen.getByText('CTV 30s')).toBeInTheDocument()
    expect(screen.getByText('CTV 15s')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Backup validates package data across all 5 clients, confirming data integrity from the data layer through rendering.
 * - Each package shares identical KPI card structure. A PackageKPIs component extracting the 4-card grid would reduce inline JSX.
 * - Deal table format column shows the format string — redundant with the deal name which often includes format info. Consider removing one.
 * - The test helper function signature is getting long (4 IDs). An object param would be more readable.
 */
