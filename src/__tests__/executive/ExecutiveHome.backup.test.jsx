import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../test/utils'
import ExecutiveHome from '../../components/executive/ExecutiveHome'

// Mock useCountUp
vi.mock('../../hooks/useCountUp', () => ({
  useCountUp: ({ target }) => target,
}))

// Mock useFadeIn
vi.mock('../../hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: 'fade-up-visible' }),
}))

// Mock useLiveTick
vi.mock('../../hooks/useLiveTick', () => ({
  useLiveTick: () => ({ count: 2340412, value: 27126844 }),
}))

// Mock Recharts
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="responsive-container" style={{ width: 500, height: 200 }}>
        {children}
      </div>
    ),
  }
})

describe('ExecutiveHome — interactions and layout integration', () => {
  it('client rows navigate to manager view on click', async () => {
    renderWithRouter(<ExecutiveHome />)
    const user = userEvent.setup()
    const clientButtons = screen.getAllByRole('button')
    await user.click(clientButtons[0]) // Kayak
    expect(window.location.pathname).toBe('/manager/kayak')
  })

  it('KPI scoreboard shows all 5 formatted values', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('$8.42M')).toBeInTheDocument()
    expect(screen.getByText('1.61x')).toBeInTheDocument()
    expect(screen.getByText('24%')).toBeInTheDocument()
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('4.2M')).toBeInTheDocument()
  })

  it('all 3 OutcomeAI cards render with zone labels', () => {
    renderWithRouter(<ExecutiveHome />)
    const recs = screen.getAllByText('Recommendation')
    expect(recs).toHaveLength(3)
    const impacts = screen.getAllByText('Expected Impact')
    expect(impacts).toHaveLength(3)
  })

  it('all 5 client names appear in the page (performance table and insights)', () => {
    renderWithRouter(<ExecutiveHome />)
    // Some names appear in both ClientPerformanceMap and ShopperInsightsPanel
    expect(screen.getAllByText('Kayak').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Newell Brands').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Spirit Airlines').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Ricola').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Indeed').length).toBeGreaterThanOrEqual(1)
  })

  it('shopper insights tiles show metric values', () => {
    renderWithRouter(<ExecutiveHome />)
    // 3.2x appears in both OutcomeAI insight text and ShopperInsightsPanel metric
    expect(screen.getAllByText('3.2x').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('91')).toBeInTheDocument()
  })

  it('insight pulse shows all 3 audience trend alerts', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Q1 Cold-Season Purchasers (Ricola)')).toBeInTheDocument()
    expect(screen.getByText('Frontier Switchers (Spirit Airlines target)')).toBeInTheDocument()
    expect(screen.getByText('Life Event Transitioners (Indeed)')).toBeInTheDocument()
  })

  it('transaction feed shows the live indicator and totals', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Live Transactions')).toBeInTheDocument()
    expect(screen.getByText(/total transactions/)).toBeInTheDocument()
  })

  it('morning brief shows today date and action alert', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText(/Morning Brief/)).toBeInTheDocument()
    // Multiple elements mention Kayak + Amazon DSP across the page
    const kayakDspRefs = screen.getAllByText(/Kayak.*Amazon DSP/)
    expect(kayakDspRefs.length).toBeGreaterThanOrEqual(1)
  })

  it('conversion chart legend shows both series', () => {
    renderWithRouter(<ExecutiveHome />)
    expect(screen.getByText('Tombras Blended CVR')).toBeInTheDocument()
    expect(screen.getByText('CTV Benchmark (2.8%)')).toBeInTheDocument()
  })

  it('renders without crashing when navigated to different client', async () => {
    renderWithRouter(<ExecutiveHome />)
    const user = userEvent.setup()
    const clientButtons = screen.getAllByRole('button')
    // Click the last client (Indeed)
    await user.click(clientButtons[4])
    expect(window.location.pathname).toBe('/manager/indeed')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The full-page test requires 4 mocks (3 hooks + Recharts) -- this is the cost of integration testing a composed page
 * - A lighter approach would be to mock all child components and only test that they render -- but that misses real integration bugs
 * - The page has no state of its own -- it is purely a composition shell, which is the simplest possible page component
 * - The grid layout (grid-cols-3 with col-span-2) could be abstracted into layout components
 * - TransactionFeed has its own interval/timeout side effects -- even mocked, it adds complexity to page-level tests
 */
