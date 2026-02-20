import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CreativeView from '../../components/manager/CreativeView'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderCreativeView(ids = {}) {
  const {
    clientId = 'kayak',
    campaignId = 'kayak-c1',
    adGroupId = 'kayak-c1-ag1',
    packageId = 'kayak-c1-ag1-pk1',
    dealId = 'kayak-c1-ag1-pk1-d1',
    creativeId = 'kayak-cr1',
  } = ids
  const path = `/manager/${clientId}/${campaignId}/${adGroupId}/${packageId}/${dealId}/${creativeId}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId/:creativeId"
          element={<CreativeView />}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('CreativeView (backup — cross-client creative data)', () => {
  it('renders Spirit Spring Break Fares creative', () => {
    renderCreativeView({
      clientId: 'spirit',
      campaignId: 'spirit-c1',
      adGroupId: 'spirit-c1-ag1',
      packageId: 'spirit-c1-ag1-pk1',
      dealId: 'spirit-c1-ag1-pk1-d1',
      creativeId: 'spirit-cr1',
    })
    expect(screen.getAllByText(/Spring Break Fares :30/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('8.2M')).toBeInTheDocument()
    expect(screen.getByText('3.6%')).toBeInTheDocument()
  })

  it('renders Ricola Cold Relief creative', () => {
    renderCreativeView({
      clientId: 'ricola',
      campaignId: 'ricola-c1',
      adGroupId: 'ricola-c1-ag1',
      packageId: 'ricola-c1-ag1-pk1',
      dealId: 'ricola-c1-ag1-pk1-d1',
      creativeId: 'ricola-cr1',
    })
    expect(screen.getAllByText(/Cold Relief :30/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('6.2%')).toBeInTheDocument()
    expect(screen.getByText('Geo Performance (4 DMAs)')).toBeInTheDocument()
  })

  it('renders Indeed LinkedIn Sponsored creative with different KPIs', () => {
    renderCreativeView({
      clientId: 'indeed',
      campaignId: 'indeed-c2',
      adGroupId: 'indeed-c2-ag1',
      packageId: 'indeed-c2-ag1-pk1',
      dealId: 'indeed-c2-ag1-d1',
      creativeId: 'indeed-cr1',
    })
    // Indeed creative has ctr instead of completionRate
    expect(screen.getAllByText(/Hiring Now/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('CTR')).toBeInTheDocument()
    // No VTR or Completion Rate for non-CTV creative
    expect(screen.queryByText('VTR')).toBeNull()
    expect(screen.queryByText('Completion Rate')).toBeNull()
  })

  it('renders Kayak Hotel Deals creative', () => {
    renderCreativeView({ creativeId: 'kayak-cr2' })
    expect(screen.getAllByText(/Hotel Deals :15/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('CTV 15s · 1920x1080')).toBeInTheDocument()
  })

  it('renders Spirit creative tags', () => {
    renderCreativeView({
      clientId: 'spirit',
      campaignId: 'spirit-c1',
      adGroupId: 'spirit-c1-ag1',
      packageId: 'spirit-c1-ag1-pk1',
      dealId: 'spirit-c1-ag1-pk1-d1',
      creativeId: 'spirit-cr1',
    })
    expect(screen.getByText('Seasonal')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
  })

  it('renders geo impressions in millions', () => {
    renderCreativeView()
    expect(screen.getByText('1.2M')).toBeInTheDocument()  // NY
    expect(screen.getByText('1.0M')).toBeInTheDocument()  // LA — 980000 => 1.0M
  })

  it('shows no geo data message for creatives without geos', () => {
    renderCreativeView({ creativeId: 'kayak-cr2' })
    // kayak-cr2 has no geo entries in geos.js
    expect(screen.getByText(/No geo data available/)).toBeInTheDocument()
  })

  it('renders Newell Rubbermaid display creative with different metrics', () => {
    renderCreativeView({
      clientId: 'newell',
      campaignId: 'newell-c1',
      adGroupId: 'newell-c1-ag1',
      packageId: 'newell-c1-ag1-pk1',
      dealId: 'newell-c1-ag1-pk1-d1',
      creativeId: 'newell-cr1',
    })
    expect(screen.getAllByText(/Rubbermaid Organization/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Display 300x250 · 300x250')).toBeInTheDocument()
    // Display creative has CTR, not VTR or completion rate
    expect(screen.getByText('CTR')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Backup reveals that CreativeView adapts its KPI cards based on creative type (CTV gets VTR/Completion, Display gets CTR). This conditional logic is a strength but adds complexity.
 * - The tag rendering uses optional chaining (creative.tags?.length) which is good but the fallback is just not rendering — no visual indication that tags don't exist.
 * - Cross-client testing reveals inconsistencies in available metrics. Some creatives have completionRate, some ctr, some engagementRate — the component handles this well with conditional spreads.
 * - The geo data availability varies by creative. Testing both present and absent geo data validates the empty state path.
 */
