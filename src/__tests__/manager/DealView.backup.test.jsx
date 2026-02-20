import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DealView from '../../components/manager/DealView'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderDealView(ids) {
  const { clientId, campaignId, adGroupId, packageId, dealId } = ids
  const path = `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId" element={<DealView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DealView (backup — multi-client deal data)', () => {
  it('renders Spirit Paramount+ deal', () => {
    renderDealView({
      clientId: 'spirit',
      campaignId: 'spirit-c1',
      adGroupId: 'spirit-c1-ag1',
      packageId: 'spirit-c1-ag1-pk1',
      dealId: 'spirit-c1-ag1-pk1-d1',
    })
    expect(screen.getAllByText(/Paramount\+ PMP/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$26.80')).toBeInTheDocument()
    expect(screen.getByText('93%')).toBeInTheDocument() // viewability
  })

  it('renders Ricola Discovery+ deal', () => {
    renderDealView({
      clientId: 'ricola',
      campaignId: 'ricola-c1',
      adGroupId: 'ricola-c1-ag1',
      packageId: 'ricola-c1-ag1-pk1',
      dealId: 'ricola-c1-ag1-pk1-d1',
    })
    expect(screen.getAllByText(/Discovery\+ PMP/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$22.40')).toBeInTheDocument()
    expect(screen.getByText('6.0%')).toBeInTheDocument()
  })

  it('renders Newell Direct IO deal', () => {
    renderDealView({
      clientId: 'newell',
      campaignId: 'newell-c1',
      adGroupId: 'newell-c1-ag1',
      packageId: 'newell-c1-ag1-pk1',
      dealId: 'newell-c1-ag1-pk1-d1',
    })
    expect(screen.getAllByText(/Direct IO — Retail Display/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$8.40')).toBeInTheDocument()
  })

  it('renders Kayak Peacock PG deal', () => {
    renderDealView({
      clientId: 'kayak',
      campaignId: 'kayak-c1',
      adGroupId: 'kayak-c1-ag1',
      packageId: 'kayak-c1-ag1-pk1',
      dealId: 'kayak-c1-ag1-pk1-d2',
    })
    expect(screen.getAllByText(/Peacock PG/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('$32.00')).toBeInTheDocument()
    expect(screen.getByText('96%')).toBeInTheDocument() // viewability
  })

  it('renders viewability in green for high values', () => {
    renderDealView({
      clientId: 'kayak',
      campaignId: 'kayak-c1',
      adGroupId: 'kayak-c1-ag1',
      packageId: 'kayak-c1-ag1-pk1',
      dealId: 'kayak-c1-ag1-pk1-d1',
    })
    // 94% appears in both viewability and creative completion. Find the green one (viewability).
    const all94 = screen.getAllByText('94%')
    const greenOne = all94.find((el) => el.style.color === 'rgb(34, 197, 94)')
    expect(greenOne).toBeTruthy()
  })

  it('renders conversion rate in green for deal KPI', () => {
    renderDealView({
      clientId: 'kayak',
      campaignId: 'kayak-c1',
      adGroupId: 'kayak-c1-ag1',
      packageId: 'kayak-c1-ag1-pk1',
      dealId: 'kayak-c1-ag1-pk1-d1',
    })
    const cvrValue = screen.getByText('4.6%')
    expect(cvrValue.style.color).toBe('rgb(34, 197, 94)')
  })

  it('renders deal type in blue for deal KPI card', () => {
    renderDealView({
      clientId: 'kayak',
      campaignId: 'kayak-c1',
      adGroupId: 'kayak-c1-ag1',
      packageId: 'kayak-c1-ag1-pk1',
      dealId: 'kayak-c1-ag1-pk1-d1',
    })
    // Find PMP in the KPI card (not the subtitle)
    const pmpElements = screen.getAllByText('PMP')
    const kpiPmp = pmpElements.find((el) => el.style.color === 'rgb(92, 112, 214)')
    expect(kpiPmp).toBeTruthy()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Backup uses object params for the render helper — cleaner than positional args. Primary should adopt this pattern.
 * - All deal views display the same 4 KPIs (Deal Type, CPM, Imps Bought, Conv. Rate). This array could be defined once and reused.
 * - The viewability section only renders when deal.metrics.viewability is truthy. All current test deals have viewability. A test for a deal without viewability would be valuable but no such data exists.
 * - Deal IDs shown in the table (DID-HUL-74821 format) are good for developer debugging but may not mean much to business users.
 */
