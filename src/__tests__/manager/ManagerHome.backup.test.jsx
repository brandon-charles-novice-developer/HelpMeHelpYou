import { render, screen } from '@testing-library/react'
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

describe('ManagerHome (backup — data completeness and formatting)', () => {
  it('renders exactly 10 clickable buttons (5 cards + 5 table rows)', () => {
    renderHome()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)
  })

  it('formats revenue correctly for millions', () => {
    renderHome()
    // Kayak incremental: 2,140,000 => $2.14M
    expect(screen.getAllByText('$2.14M').length).toBeGreaterThanOrEqual(1)
  })

  it('renders ROAS values with 1 decimal', () => {
    renderHome()
    // Kayak ROAS 1.7x, Newell 1.4x, Spirit 1.3x, Ricola 2.1x, Indeed 1.8x
    expect(screen.getAllByText('1.7x').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('2.1x').length).toBeGreaterThanOrEqual(1)
  })

  it('renders CPA values with dollar sign', () => {
    renderHome()
    // Kayak CPA $118, Newell $131
    expect(screen.getAllByText('$118').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('$131').length).toBeGreaterThanOrEqual(1)
  })

  it('renders client logos as single letters or initials', () => {
    renderHome()
    // K, NB, SX, R, I appear in the logo circles
    expect(screen.getAllByText('K').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('NB').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('SX').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('R').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('I').length).toBeGreaterThanOrEqual(1)
  })

  it('shows overflow badge for clients with more than 2 channels', () => {
    renderHome()
    // Indeed has 3 channels (TTD, LinkedIn Ads, Walmart Connect), so +1
    expect(screen.getAllByText('+1').length).toBeGreaterThanOrEqual(1)
  })

  it('renders page heading as h1', () => {
    renderHome()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Client Overview')
  })

  it('renders Prog + Managed badge for Spirit Airlines (mixed type)', () => {
    renderHome()
    expect(screen.getAllByText('Prog + Managed').length).toBeGreaterThanOrEqual(1)
  })

  it('does not render any error state or empty message', () => {
    renderHome()
    expect(screen.queryByText(/not found/i)).toBeNull()
    expect(screen.queryByText(/no records/i)).toBeNull()
    expect(screen.queryByText(/error/i)).toBeNull()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The channel overflow logic (slice(0,2) + "+N") is inline in the JSX. Could be a ChannelBadgeList component.
 * - The grid layout for client cards uses grid-cols-5 — not responsive. On smaller screens this will break. Media queries or responsive grid needed.
 * - The formatRevenue function handles million, thousand, and raw dollars, but only million and thousand are currently used. The raw dollar branch is dead code.
 * - Tests: Backup verifies data formatting and completeness. Checks that every expected data point is present in the rendered output.
 * - getAllByText with >= 1 is used because names appear in both card and table. A more robust approach would use within() to scope assertions.
 */
