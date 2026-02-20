import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConverterInsights from '../../components/measurement/ConverterInsights'
import { converterInsights } from '../../data/converterInsights'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

const mockData = converterInsights.kayak

describe('ConverterInsights', () => {
  it('renders without crashing', () => {
    const { container } = render(<ConverterInsights data={mockData} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders null when data is null', () => {
    const { container } = render(<ConverterInsights data={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders null when data is undefined', () => {
    const { container } = render(<ConverterInsights data={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('displays the section heading with client label', () => {
    render(<ConverterInsights data={mockData} />)
    expect(
      screen.getByText(`Converter Insights · ${mockData.label}`)
    ).toBeInTheDocument()
  })

  it('displays Demographics and Psychographics toggle buttons', () => {
    render(<ConverterInsights data={mockData} />)
    expect(screen.getByText('Demographics')).toBeInTheDocument()
    expect(screen.getByText('Psychographics')).toBeInTheDocument()
  })

  it('shows Demographics view by default', () => {
    render(<ConverterInsights data={mockData} />)
    // Demographics tab pills should be visible (Age, Gender, HHI, Generation)
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
  })

  it('displays legend labels in demographics view', () => {
    render(<ConverterInsights data={mockData} />)
    expect(screen.getByText('Attain Panel')).toBeInTheDocument()
    expect(screen.getByText('U.S. Census')).toBeInTheDocument()
  })

  it('switches to Psychographics view on button click', async () => {
    const user = userEvent.setup()
    render(<ConverterInsights data={mockData} />)
    await user.click(screen.getByText('Psychographics'))
    // Should show psychographic category labels
    expect(screen.getByText('Streaming')).toBeInTheDocument()
    expect(screen.getByText('Social Media')).toBeInTheDocument()
    expect(screen.getByText('Tech Interest')).toBeInTheDocument()
    expect(screen.getByText('Memberships')).toBeInTheDocument()
    expect(screen.getByText('Life Events')).toBeInTheDocument()
  })

  it('displays psychographic items as tags', async () => {
    const user = userEvent.setup()
    render(<ConverterInsights data={mockData} />)
    await user.click(screen.getByText('Psychographics'))
    // Kayak streaming psychographics
    expect(screen.getByText('Netflix (82%)')).toBeInTheDocument()
    expect(screen.getByText('Hulu (61%)')).toBeInTheDocument()
  })

  it('switches back to Demographics from Psychographics', async () => {
    const user = userEvent.setup()
    render(<ConverterInsights data={mockData} />)
    await user.click(screen.getByText('Psychographics'))
    expect(screen.getByText('Streaming')).toBeInTheDocument()
    await user.click(screen.getByText('Demographics'))
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.queryByText('Streaming')).not.toBeInTheDocument()
  })

  it('renders the chart container in demographics view', () => {
    const { container } = render(<ConverterInsights data={mockData} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - DEMO_TABS is hardcoded and then filtered against available data — the tabs should
 *   be derived directly from the data to avoid sync issues.
 * - The demographics/psychographics toggle uses two separate state booleans — a single
 *   state variable (e.g., 'mode') would be cleaner.
 * - DemographicChart and MatchLegend are good internal extractions.
 * - Tests verify tab switching, data display, and null guards comprehensively.
 */
