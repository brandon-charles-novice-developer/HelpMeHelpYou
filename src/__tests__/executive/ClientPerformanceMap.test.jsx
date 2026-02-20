import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../test/utils'
import ClientPerformanceMap from '../../components/executive/ClientPerformanceMap'
import { clients } from '../../data/clients'

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

describe('ClientPerformanceMap', () => {
  it('renders without error', () => {
    const { container } = renderWithRouter(<ClientPerformanceMap />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays "Client Performance" section label', () => {
    renderWithRouter(<ClientPerformanceMap />)
    expect(screen.getByText('Client Performance')).toBeInTheDocument()
  })

  it('displays "5 clients" helper text', () => {
    renderWithRouter(<ClientPerformanceMap />)
    expect(screen.getByText(/5 clients/)).toBeInTheDocument()
  })

  it('renders all 5 client names', () => {
    renderWithRouter(<ClientPerformanceMap />)
    clients.forEach((client) => {
      expect(screen.getByText(client.name)).toBeInTheDocument()
    })
  })

  it('renders all 5 client verticals', () => {
    renderWithRouter(<ClientPerformanceMap />)
    clients.forEach((client) => {
      expect(screen.getByText(client.vertical)).toBeInTheDocument()
    })
  })

  it('renders 5 clickable row buttons', () => {
    renderWithRouter(<ClientPerformanceMap />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('displays table headers', () => {
    renderWithRouter(<ClientPerformanceMap />)
    expect(screen.getByText('Client')).toBeInTheDocument()
    expect(screen.getByText('Incr. Revenue')).toBeInTheDocument()
    expect(screen.getByText('Conv. Rate')).toBeInTheDocument()
    expect(screen.getByText('New Buyer ROAS')).toBeInTheDocument()
    expect(screen.getByText('Budget Pacing')).toBeInTheDocument()
    expect(screen.getByText('Channels')).toBeInTheDocument()
  })

  it('displays formatted revenue for Kayak ($2.14M)', () => {
    renderWithRouter(<ClientPerformanceMap />)
    expect(screen.getByText('$2.14M')).toBeInTheDocument()
  })

  it('displays conversion rate percentage for each client', () => {
    renderWithRouter(<ClientPerformanceMap />)
    // Kayak: 0.038 * 100 = 3.8%
    expect(screen.getByText('3.8%')).toBeInTheDocument()
    // Ricola: 0.051 * 100 = 5.1%
    expect(screen.getByText('5.1%')).toBeInTheDocument()
  })

  it('displays ROAS values with x suffix', () => {
    renderWithRouter(<ClientPerformanceMap />)
    // Kayak newBuyerRoas: 1.7
    expect(screen.getByText('1.7x')).toBeInTheDocument()
    // Ricola newBuyerRoas: 2.1
    expect(screen.getByText('2.1x')).toBeInTheDocument()
  })

  it('displays CvrVsBenchmark for clients above and below 2.8%', () => {
    renderWithRouter(<ClientPerformanceMap />)
    // Kayak: 0.038 - 0.028 = +1.0pts
    expect(screen.getByText('+1.0pts vs 2.8% benchmark')).toBeInTheDocument()
    // Spirit: 0.031 - 0.028 = +0.3pts
    expect(screen.getByText('+0.3pts vs 2.8% benchmark')).toBeInTheDocument()
  })

  it('displays channel tags for each client', () => {
    renderWithRouter(<ClientPerformanceMap />)
    // TTD appears for multiple clients (Kayak, Spirit, Indeed)
    const ttdTags = screen.getAllByText('TTD')
    expect(ttdTags.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Yahoo DSP')).toBeInTheDocument()
  })

  it('shows +N overflow badge for clients with more than 2 channels', () => {
    renderWithRouter(<ClientPerformanceMap />)
    // Indeed has 3 channels: TTD, LinkedIn Ads, Walmart Connect -- shows +1
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('displays alert messages for clients that have alerts', () => {
    renderWithRouter(<ClientPerformanceMap />)
    const alertClients = clients.filter((c) => c.alert)
    alertClients.forEach((client) => {
      expect(screen.getByText(client.alert.message)).toBeInTheDocument()
    })
  })

  it('navigates to /manager/{clientId} on row click', async () => {
    renderWithRouter(<ClientPerformanceMap />)
    const user = userEvent.setup()
    const kayakButton = screen.getAllByRole('button')[0]
    await user.click(kayakButton)
    expect(window.location.pathname).toBe('/manager/kayak')
  })

  it('displays client logo initials', () => {
    renderWithRouter(<ClientPerformanceMap />)
    expect(screen.getByText('K')).toBeInTheDocument()   // Kayak
    expect(screen.getByText('NB')).toBeInTheDocument()  // Newell Brands
    expect(screen.getByText('SX')).toBeInTheDocument()  // Spirit Airlines
    expect(screen.getByText('R')).toBeInTheDocument()    // Ricola
    expect(screen.getByText('I')).toBeInTheDocument()    // Indeed
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - formatRevenue is duplicated from AgencyScoreboard -- should be a shared utility
 * - PacingBar hardcodes value={0.65} for all clients instead of using client data -- likely a placeholder
 * - CTV_BENCHMARK (0.028) is a magic number -- could be imported from a constants file
 * - The mouseEnter/mouseLeave inline handlers for hover effect could use CSS :hover instead
 * - The grid-template-columns use fixed px widths inline -- could be a CSS class or variable
 */
