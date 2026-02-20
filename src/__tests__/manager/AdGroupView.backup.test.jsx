import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdGroupView from '../../components/manager/AdGroupView'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderAdGroupView(clientId, campaignId, adGroupId) {
  return render(
    <MemoryRouter initialEntries={[`/manager/${clientId}/${campaignId}/${adGroupId}`]}>
      <Routes>
        <Route path="/manager/:clientId/:campaignId/:adGroupId" element={<AdGroupView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdGroupView (backup — multi-client ad group data)', () => {
  it('renders Spirit Budget Air Purchasers ad group', () => {
    renderAdGroupView('spirit', 'spirit-c1', 'spirit-c1-ag1')
    expect(screen.getAllByText(/Budget Air Purchasers/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Domestic Flight Purchasers · 3\+ flights/)).toBeInTheDocument()
    expect(screen.getByText('3.4M')).toBeInTheDocument()
  })

  it('renders Spirit Frontier Switchers ad group', () => {
    renderAdGroupView('spirit', 'spirit-c1', 'spirit-c1-ag2')
    expect(screen.getAllByText(/Frontier Switchers/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Switched to Frontier · Last 60 days/)).toBeInTheDocument()
  })

  it('renders Ricola Herbal Remedy ad group with high propensity', () => {
    renderAdGroupView('ricola', 'ricola-c1', 'ricola-c1-ag1')
    expect(screen.getAllByText(/Herbal Remedy Purchasers/).length).toBeGreaterThanOrEqual(1)
    // 10-day: 94, 30-day: 91 — both Very High
    expect(screen.getByText('94')).toBeInTheDocument()
    const veryHighLabels = screen.getAllByText('Very High')
    expect(veryHighLabels.length).toBeGreaterThanOrEqual(2)
  })

  it('renders Indeed Declared Job Transitioners ad group', () => {
    renderAdGroupView('indeed', 'indeed-c1', 'indeed-c1-ag1')
    expect(screen.getAllByText(/Declared Job Transitioners/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Life Event: Job Change Signal/)).toBeInTheDocument()
  })

  it('renders Newell Home Organization ad group', () => {
    renderAdGroupView('newell', 'newell-c1', 'newell-c1-ag1')
    expect(screen.getAllByText(/Home Organization Purchasers/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('6.2M')).toBeInTheDocument()
    expect(screen.getByText(/Homeowners, Age 28–55/)).toBeInTheDocument()
  })

  it('applies correct color for high propensity scores (>= 90)', () => {
    renderAdGroupView('ricola', 'ricola-c1', 'ricola-c1-ag1')
    const score94 = screen.getByText('94')
    // score >= 90 gets green (#22C55E)
    expect(score94.style.color).toBe('rgb(34, 197, 94)')
  })

  it('applies correct color for medium propensity scores (80-89)', () => {
    renderAdGroupView('kayak', 'kayak-c1', 'kayak-c1-ag1')
    const score84 = screen.getByText('84')
    // score >= 80 gets blue (#5C70D6)
    expect(score84.style.color).toBe('rgb(92, 112, 214)')
  })

  it('renders package environment as colored text', () => {
    renderAdGroupView('kayak', 'kayak-c1', 'kayak-c1-ag1')
    const ctvText = screen.getByText('CTV')
    expect(ctvText.style.color).toBe('rgb(196, 181, 253)')
  })

  it('renders package CPM values', () => {
    renderAdGroupView('kayak', 'kayak-c1', 'kayak-c1-ag1')
    expect(screen.getByText('$2.07')).toBeInTheDocument()
    expect(screen.getByText('$2.29')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The propensity score color logic has 4 tiers (90+, 80+, 65+, default). This could be a shared utility or component.
 * - All ad group views share the same layout pattern: header -> audience detail -> metrics -> packages table. A layout component could reduce boilerplate.
 * - The test file validates ad groups across all 5 clients, serving as a comprehensive data integration test.
 * - Score color assertions test inline style values — fragile if implementation changes from inline to CSS classes.
 */
