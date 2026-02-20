import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CreativeView from '../../components/manager/CreativeView'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
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

describe('CreativeView', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders creative name in the header', () => {
    renderCreativeView()
    expect(screen.getAllByText(/Spring Getaways :30/).length).toBeGreaterThanOrEqual(1)
  })

  it('renders breadcrumb trail with all ancestor levels', () => {
    renderCreativeView()
    expect(screen.getByRole('button', { name: 'Tombras' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayak' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spring Travel Q1 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Frequent Leisure Travelers/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'CTV Premium Package' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hulu PMP/ })).toBeInTheDocument()
  })

  it('renders subtitle with format and size', () => {
    renderCreativeView()
    expect(screen.getByText('CTV 30s · 1920x1080')).toBeInTheDocument()
  })

  it('renders approval status badge', () => {
    renderCreativeView()
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('renders KPI cards', () => {
    renderCreativeView()
    // "Impressions" appears in both KPI cards and geo table header
    expect(screen.getAllByText('Impressions').length).toBeGreaterThanOrEqual(2)
    // Conv. Rate also appears in both sections
    expect(screen.getAllByText('Conv. Rate').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Completion Rate')).toBeInTheDocument()
    expect(screen.getByText('VTR')).toBeInTheDocument()
  })

  it('renders KPI values', () => {
    renderCreativeView()
    expect(screen.getByText('4.8M')).toBeInTheDocument()   // impressions
    expect(screen.getByText('4.8%')).toBeInTheDocument()   // conv rate
  })

  it('renders tags', () => {
    renderCreativeView()
    expect(screen.getByText('CTV')).toBeInTheDocument()
    expect(screen.getByText('Brand')).toBeInTheDocument()
    expect(screen.getByText('Lifestyle')).toBeInTheDocument()
  })

  it('renders Geo Performance section with count', () => {
    renderCreativeView()
    expect(screen.getByText('Geo Performance (5 DMAs)')).toBeInTheDocument()
  })

  it('renders geo table headers', () => {
    renderCreativeView()
    expect(screen.getByText('DMA')).toBeInTheDocument()
    expect(screen.getByText('Spend')).toBeInTheDocument()
  })

  it('renders geo DMA names', () => {
    renderCreativeView()
    expect(screen.getByText('New York, NY')).toBeInTheDocument()
    expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument()
    expect(screen.getByText('Chicago, IL')).toBeInTheDocument()
    expect(screen.getByText('Dallas-Ft. Worth, TX')).toBeInTheDocument()
    expect(screen.getByText('Miami-Ft. Lauderdale, FL')).toBeInTheDocument()
  })

  it('navigates to geo when row is clicked', async () => {
    const user = userEvent.setup()
    renderCreativeView()

    const geoBtn = screen.getByText('New York, NY').closest('button')
    await user.click(geoBtn)
    expect(mockNavigate).toHaveBeenCalledWith(
      '/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1/kayak-c1-ag1-pk1-d1/kayak-cr1/kayak-cr1-geo1'
    )
  })

  it('renders null for invalid creative', () => {
    const { container } = renderCreativeView({ creativeId: 'nonexistent' })
    expect(container.innerHTML).toBe('')
  })

  it('renders null for invalid client', () => {
    const { container } = renderCreativeView({ clientId: 'nonexistent' })
    expect(container.innerHTML).toBe('')
  })

  it('renders geo conversion rates', () => {
    renderCreativeView()
    expect(screen.getByText('5.2%')).toBeInTheDocument()  // NY
    expect(screen.getByText('4.9%')).toBeInTheDocument()  // LA
    expect(screen.getByText('6.1%')).toBeInTheDocument()  // Miami
  })

  it('renders geo spend values', () => {
    renderCreativeView()
    expect(screen.getByText('$4.8K')).toBeInTheDocument()
    expect(screen.getByText('$3.6K')).toBeInTheDocument()
  })

  it('highlights high-conversion geo in green', () => {
    renderCreativeView()
    // Miami has 6.1% CVR which is >= 5%, so green
    const miamiCvr = screen.getByText('6.1%')
    expect(miamiCvr.style.color).toBe('rgb(34, 197, 94)')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - CreativeView conditionally renders KPI cards based on which metrics exist (completionRate, vtr, ctr). The spread operator with conditional arrays is functional but harder to read than a filter approach.
 * - The tags section is optional (creative.tags?.length). Good defensive coding but adds another conditional block.
 * - The geo table highlights conversion rates >= 5% in green via inline color. This threshold should be configurable or extracted as a constant.
 * - The breadcrumb at this depth has 7 segments. Consider truncating middle segments or using a collapsible breadcrumb.
 * - Tests: Object destructuring with defaults in renderCreativeView is the cleanest approach for deep routes.
 */
