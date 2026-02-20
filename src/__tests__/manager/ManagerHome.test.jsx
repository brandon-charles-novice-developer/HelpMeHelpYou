import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ManagerHome from '../../components/manager/ManagerHome'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/manager']}>
      <ManagerHome />
    </MemoryRouter>
  )
}

describe('ManagerHome', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders the page title', () => {
    renderHome()
    expect(screen.getByText('Client Overview')).toBeInTheDocument()
  })

  it('renders the agency subtitle', () => {
    renderHome()
    expect(screen.getByText(/Campaign Manager · Tombras/)).toBeInTheDocument()
  })

  it('renders the description with client and campaign count', () => {
    renderHome()
    expect(screen.getByText(/5 clients · 11 active campaigns/)).toBeInTheDocument()
  })

  it('renders all 5 client cards', () => {
    renderHome()
    expect(screen.getAllByText('Kayak').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Newell Brands').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Spirit Airlines').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Ricola').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Indeed').length).toBeGreaterThanOrEqual(1)
  })

  it('renders client verticals', () => {
    renderHome()
    expect(screen.getAllByText('Travel').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('CPG / Home').length).toBeGreaterThanOrEqual(1)
  })

  it('renders incremental revenue for each client', () => {
    renderHome()
    // Kayak: $2.14M, Newell: $1.62M, Spirit: $1.38M, Ricola: $1.89M, Indeed: $1.39M
    expect(screen.getAllByText('$2.14M').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('$1.62M').length).toBeGreaterThanOrEqual(1)
  })

  it('renders "incremental revenue" labels', () => {
    renderHome()
    const labels = screen.getAllByText('incremental revenue')
    expect(labels).toHaveLength(5)
  })

  it('renders the "All Clients" section label', () => {
    renderHome()
    expect(screen.getByText('All Clients')).toBeInTheDocument()
  })

  it('renders table column headers', () => {
    renderHome()
    expect(screen.getByText('Conv. Rate')).toBeInTheDocument()
    expect(screen.getByText('New Buyer ROAS')).toBeInTheDocument()
    expect(screen.getByText('New Buyer CPA')).toBeInTheDocument()
    expect(screen.getByText('Campaigns')).toBeInTheDocument()
    expect(screen.getByText('Channels')).toBeInTheDocument()
  })

  it('navigates to client detail when a client card is clicked', async () => {
    const user = userEvent.setup()
    renderHome()

    // Cards and table rows are both buttons — click the first one
    const buttons = screen.getAllByRole('button')
    // First 5 are cards, next 5 are table rows
    await user.click(buttons[0])
    expect(mockNavigate).toHaveBeenCalledWith('/manager/kayak')
  })

  it('navigates to correct client from table row click', async () => {
    const user = userEvent.setup()
    renderHome()

    const buttons = screen.getAllByRole('button')
    // Table rows start at index 5
    await user.click(buttons[5])
    expect(mockNavigate).toHaveBeenCalledWith('/manager/kayak')
  })

  it('renders BuyingTypeBadge for each client card', () => {
    renderHome()
    expect(screen.getAllByText('Programmatic').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Managed Service').length).toBeGreaterThanOrEqual(1)
  })

  it('renders conversion rates in the table', () => {
    renderHome()
    // Kayak: 3.8%, Newell: 3.4%, Ricola: 5.1%
    expect(screen.getAllByText('3.8%').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('5.1%').length).toBeGreaterThanOrEqual(1)
  })

  it('renders active campaign counts', () => {
    renderHome()
    expect(screen.getAllByText('3 active').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('2 active').length).toBeGreaterThanOrEqual(1)
  })

  it('renders channel badges', () => {
    renderHome()
    expect(screen.getAllByText('TTD').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Amazon DSP').length).toBeGreaterThanOrEqual(1)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - ManagerHome builds a client table manually (grid with inline styles) rather than reusing DrillTable. This is the biggest DRY violation — the same grid pattern appears here and in every other view.
 * - The formatRevenue helper is a private function. It should be extracted to a shared utility so tests can validate it independently and other components can reuse it.
 * - Client cards and table rows both navigate to the same URL — the duplication serves different UI affordances (cards for visual overview, table for detailed comparison) so it's reasonable.
 * - The logo circle pattern (w-10 h-10 rounded-full) is repeated for cards and table — could be a shared ClientLogo component.
 * - Tests: Using getAllByText with length >= 1 handles the duplication between card and table views. Could be more specific with within() scoping.
 */
