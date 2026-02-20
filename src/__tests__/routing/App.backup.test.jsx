import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'

import ManagerHome from '../../components/manager/ManagerHome'
import ClientView from '../../components/manager/ClientView'
import CampaignView from '../../components/manager/CampaignView'
import AdGroupView from '../../components/manager/AdGroupView'

// Mock measurement/chart components
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
 * Backup tests focus on navigation flow and mode switching logic.
 * We test the actual navigation between views using MemoryRouter.
 */
function RoutesUnderTest() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/executive" replace />} />
      <Route path="/executive" element={<div data-testid="executive-view">Executive Dashboard</div>} />
      <Route path="/manager" element={<ManagerHome />} />
      <Route path="/manager/:clientId" element={<ClientView />} />
      <Route path="/manager/:clientId/:campaignId" element={<CampaignView />} />
      <Route path="/manager/:clientId/:campaignId/:adGroupId" element={<AdGroupView />} />
    </Routes>
  )
}

describe('App Routing (backup — navigation flow tests)', () => {
  it('navigates from ManagerHome to ClientView via client card click', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/manager']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )

    expect(screen.getByText('Client Overview')).toBeInTheDocument()

    // Click the first client card (Kayak)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])

    // Should navigate to Kayak ClientView
    expect(screen.getAllByText('Kayak').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Campaigns')).toBeInTheDocument()
  })

  it('navigates from ClientView to CampaignView via campaign row click', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/manager/kayak']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )

    expect(screen.getByText('Spring Travel Q1 2026')).toBeInTheDocument()

    const campaignBtn = screen.getByText('Spring Travel Q1 2026').closest('button')
    await user.click(campaignBtn)

    // Should navigate to CampaignView
    expect(screen.getByText('Ad Groups (2)')).toBeInTheDocument()
  })

  it('navigates from CampaignView to AdGroupView via ad group row click', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/manager/kayak/kayak-c1']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )

    expect(screen.getByText(/Frequent Leisure Travelers/)).toBeInTheDocument()

    const agBtn = screen.getByText(/Frequent Leisure Travelers/).closest('button')
    await user.click(agBtn)

    // Should navigate to AdGroupView
    expect(screen.getByText('Outcome Audience Detail')).toBeInTheDocument()
    expect(screen.getByText('Purchase Propensity Windows')).toBeInTheDocument()
  })

  it('navigates back via breadcrumb from CampaignView to ClientView', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/manager/kayak/kayak-c1']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )

    // Click the "Kayak" breadcrumb to go back to ClientView
    const kayakBreadcrumb = screen.getByRole('button', { name: 'Kayak' })
    await user.click(kayakBreadcrumb)

    // Should navigate to ClientView
    expect(screen.getByText('Campaigns')).toBeInTheDocument()
    expect(screen.getByText('Shopper Insights')).toBeInTheDocument()
  })

  it('navigates back via breadcrumb from AdGroupView to manager home', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/manager/kayak/kayak-c1/kayak-c1-ag1']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )

    const tombrasBreadcrumb = screen.getByRole('button', { name: 'Tombras' })
    await user.click(tombrasBreadcrumb)

    // Should navigate to ManagerHome
    expect(screen.getByText('Client Overview')).toBeInTheDocument()
  })

  it('different clients render different data at the same route depth', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/manager/kayak']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )
    expect(screen.getByText('Spring Travel Q1 2026')).toBeInTheDocument()
    unmount()

    render(
      <MemoryRouter initialEntries={['/manager/ricola']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )
    expect(screen.getByText('Cold & Flu Season Peak')).toBeInTheDocument()
    expect(screen.queryByText('Spring Travel Q1 2026')).toBeNull()
  })

  it('invalid deep route renders empty rather than crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/manager/fake-client/fake-campaign/fake-adgroup']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )
    // AdGroupView returns null for invalid params
    expect(container.querySelector('.max-w-\\[1280px\\]')).toBeNull()
  })

  it('root path redirects to executive view', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RoutesUnderTest />
      </MemoryRouter>
    )
    expect(screen.getByTestId('executive-view')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Backup tests actual navigation flows (click -> navigate -> verify new view). This validates the integration between components and routing.
 * - The breadcrumb navigation test validates that breadcrumb paths in child components correctly map to parent routes.
 * - The "different clients at same route depth" test validates data isolation — each client ID produces different content.
 * - App.jsx could benefit from nested routes to reduce route path repetition and enable shared layouts.
 * - The mode toggle (executive vs manager) requires AppShell context which is hard to test in isolation. The modes could be URL-based (/executive vs /manager) which is already the case.
 */
