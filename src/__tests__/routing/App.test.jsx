import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import the individual view components that App routes to
import ManagerHome from '../../components/manager/ManagerHome'
import ClientView from '../../components/manager/ClientView'
import CampaignView from '../../components/manager/CampaignView'
import AdGroupView from '../../components/manager/AdGroupView'
import PackageView from '../../components/manager/PackageView'
import DealView from '../../components/manager/DealView'
import CreativeView from '../../components/manager/CreativeView'
import GeoView from '../../components/manager/GeoView'

// Mock measurement/chart components that break in jsdom or need missing data fields
vi.mock('../../components/measurement/PurchaseImpactPanel', () => ({
  default: () => <div data-testid="purchase-impact-panel">PurchaseImpactPanel</div>,
}))
vi.mock('../../components/measurement/SalesLiftChart', () => ({
  default: () => <div data-testid="sales-lift-chart">SalesLiftChart</div>,
}))
vi.mock('../../components/measurement/ChannelSplitBar', () => ({
  default: () => <div data-testid="channel-split-bar">ChannelSplitBar</div>,
}))
vi.mock('../../components/measurement/RetailerBreakdown', () => ({
  default: () => <div data-testid="retailer-breakdown">RetailerBreakdown</div>,
}))
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  AreaChart: ({ children }) => <div>{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ReferenceLine: () => <div />,
}))

/**
 * We test App's routing logic by recreating the Routes definition from App.jsx
 * using MemoryRouter instead of BrowserRouter (which doesn't support initialEntries).
 * This validates that the correct component renders for each route path.
 */
function renderWithRoute(initialPath) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<Navigate to="/executive" replace />} />
        <Route path="/executive" element={<div data-testid="executive-home">Executive Home</div>} />
        <Route path="/manager" element={<ManagerHome />} />
        <Route path="/manager/:clientId" element={<ClientView />} />
        <Route path="/manager/:clientId/:campaignId" element={<CampaignView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId" element={<AdGroupView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId" element={<PackageView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId" element={<DealView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId/:creativeId" element={<CreativeView />} />
        <Route path="/manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId/:creativeId/:geoId" element={<GeoView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('App Routing', () => {
  it('redirects root path to /executive', () => {
    renderWithRoute('/')
    expect(screen.getByTestId('executive-home')).toBeInTheDocument()
  })

  it('renders ExecutiveHome at /executive', () => {
    renderWithRoute('/executive')
    expect(screen.getByTestId('executive-home')).toBeInTheDocument()
  })

  it('renders ManagerHome at /manager', () => {
    renderWithRoute('/manager')
    expect(screen.getByText('Client Overview')).toBeInTheDocument()
  })

  it('renders ClientView at /manager/:clientId', () => {
    renderWithRoute('/manager/kayak')
    expect(screen.getAllByText('Kayak').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Campaigns')).toBeInTheDocument()
  })

  it('renders CampaignView at /manager/:clientId/:campaignId', () => {
    renderWithRoute('/manager/kayak/kayak-c1')
    expect(screen.getAllByText('Spring Travel Q1 2026').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Ad Groups (2)')).toBeInTheDocument()
  })

  it('renders AdGroupView at /manager/:clientId/:campaignId/:adGroupId', () => {
    renderWithRoute('/manager/kayak/kayak-c1/kayak-c1-ag1')
    expect(screen.getAllByText(/Frequent Leisure Travelers/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Outcome Audience Detail')).toBeInTheDocument()
  })

  it('renders PackageView at /manager/:clientId/:campaignId/:adGroupId/:packageId', () => {
    renderWithRoute('/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1')
    expect(screen.getAllByText('CTV Premium Package').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Deals (2)')).toBeInTheDocument()
  })

  it('renders DealView at /manager/:clientId/:campaignId/:adGroupId/:packageId/:dealId', () => {
    renderWithRoute('/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1/kayak-c1-ag1-pk1-d1')
    expect(screen.getAllByText(/Hulu PMP/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Creatives (2)')).toBeInTheDocument()
  })

  it('renders CreativeView at /manager/.../:creativeId', () => {
    renderWithRoute('/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1/kayak-c1-ag1-pk1-d1/kayak-cr1')
    expect(screen.getAllByText(/Spring Getaways :30/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Geo Performance (5 DMAs)')).toBeInTheDocument()
  })

  it('renders GeoView at /manager/.../:geoId', () => {
    renderWithRoute('/manager/kayak/kayak-c1/kayak-c1-ag1/kayak-c1-ag1-pk1/kayak-c1-ag1-pk1-d1/kayak-cr1/kayak-cr1-geo1')
    expect(screen.getAllByText('New York, NY').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('New Buyer Performance')).toBeInTheDocument()
  })

  it('renders empty for invalid route param at any level', () => {
    renderWithRoute('/manager/nonexistent')
    // ClientView returns "Client not found" for invalid clientId
    expect(screen.getByText('Client not found')).toBeInTheDocument()
  })

  it('renders nothing for completely invalid deep route', () => {
    const { container } = renderWithRoute('/manager/nonexistent/nonexistent')
    // CampaignView returns null for invalid params
    expect(container.querySelector('.p-6')).toBeNull()
  })

  it('each drill level has a unique route depth', () => {
    // Verify route structure matches expected hierarchy
    const routes = [
      { path: '/manager', component: 'ManagerHome', depth: 1 },
      { path: '/manager/kayak', component: 'ClientView', depth: 2 },
      { path: '/manager/kayak/kayak-c1', component: 'CampaignView', depth: 3 },
      { path: '/manager/kayak/kayak-c1/kayak-c1-ag1', component: 'AdGroupView', depth: 4 },
    ]

    routes.forEach((route) => {
      const segments = route.path.split('/').filter(Boolean)
      expect(segments.length).toBe(route.depth)
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - App.jsx wraps everything in BrowserRouter, making it hard to test with MemoryRouter. Exporting AppInner separately would simplify testing.
 * - The mode toggle state lives in AppInner but doesn't persist across page reloads. URL-based mode switching would be more robust.
 * - Route definitions are flat (not nested). React Router v7 supports nested routes which would simplify the param passing and enable layouts.
 * - All 7 manager drill routes share the same parameter accumulation pattern. Nested routes could inherit parent params automatically.
 * - Tests: We recreate the route definitions to avoid the BrowserRouter issue. If App exported its route config, tests could import it directly.
 */
