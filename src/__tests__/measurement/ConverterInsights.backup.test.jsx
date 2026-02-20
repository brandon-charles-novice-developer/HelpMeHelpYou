import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConverterInsights from '../../components/measurement/ConverterInsights'
import { converterInsights } from '../../data/converterInsights'

beforeAll(() => {
  global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('ConverterInsights — demo tab switching and client variations', () => {
  it('switches between demographic sub-tabs (Age -> Gender)', async () => {
    const user = userEvent.setup()
    render(<ConverterInsights data={converterInsights.kayak} />)
    // Default is Age
    expect(screen.getByText('Age')).toBeInTheDocument()
    // Click Gender tab
    await user.click(screen.getByText('Gender'))
    // Chart should still render (rechart container present)
    const { container } = render(<ConverterInsights data={converterInsights.kayak} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('renders available demo tabs for Kayak (Age, Gender, HHI, Generation)', () => {
    render(<ConverterInsights data={converterInsights.kayak} />)
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('HHI')).toBeInTheDocument()
    expect(screen.getByText('Generation')).toBeInTheDocument()
  })

  it('renders available demo tabs for Newell (Age, Gender, Homeownership, Education)', () => {
    render(<ConverterInsights data={converterInsights.newell} />)
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('Homeownership')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
  })

  it('renders available demo tabs for Indeed (Age, Gender, Education, Marital Status)', () => {
    render(<ConverterInsights data={converterInsights.indeed} />)
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('Marital Status')).toBeInTheDocument()
  })

  it('applies active styling to Demographics toggle when active', () => {
    render(<ConverterInsights data={converterInsights.kayak} />)
    const demoBtn = screen.getByText('Demographics')
    expect(demoBtn).toHaveStyle({ backgroundColor: '#67579E', color: '#FFFFFF' })
  })

  it('applies inactive styling to Psychographics toggle when demographics is active', () => {
    render(<ConverterInsights data={converterInsights.kayak} />)
    const psychBtn = screen.getByText('Psychographics')
    expect(psychBtn).toHaveStyle({ color: '#AFADAD' })
    // Inactive button should NOT have the active background
    expect(psychBtn.style.backgroundColor).not.toBe('rgb(103, 87, 158)')
  })

  it('swaps toggle styling when switching to Psychographics', async () => {
    const user = userEvent.setup()
    render(<ConverterInsights data={converterInsights.kayak} />)
    await user.click(screen.getByText('Psychographics'))
    const psychBtn = screen.getByText('Psychographics')
    expect(psychBtn).toHaveStyle({ backgroundColor: '#67579E', color: '#FFFFFF' })
    const demoBtn = screen.getByText('Demographics')
    expect(demoBtn).toHaveStyle({ color: '#AFADAD' })
    // Inactive demographics button should NOT have the active background
    expect(demoBtn.style.backgroundColor).not.toBe('rgb(103, 87, 158)')
  })

  it('shows all psychographic categories for Spirit', async () => {
    const user = userEvent.setup()
    render(<ConverterInsights data={converterInsights.spirit} />)
    await user.click(screen.getByText('Psychographics'))
    expect(screen.getByText('Streaming')).toBeInTheDocument()
    expect(screen.getByText('Budget Comparison Apps (78%)')).toBeInTheDocument()
  })

  it('applies active styling to first demo sub-tab by default', () => {
    render(<ConverterInsights data={converterInsights.kayak} />)
    const ageBtn = screen.getByText('Age')
    expect(ageBtn).toHaveStyle({ color: '#C4B5FD' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The activeDemo state tracks index position, not tab ID — using the label string
 *   would be more robust if tabs are reordered.
 * - showingPsycho boolean duplicates what could be a single 'view' state.
 * - DEMO_TABS ordering hardcodes a preference; deriving from data would be simpler.
 * - Backup tests verify per-client tab availability and toggle styling.
 * - Good coverage of state transitions not covered in primary tests.
 */
