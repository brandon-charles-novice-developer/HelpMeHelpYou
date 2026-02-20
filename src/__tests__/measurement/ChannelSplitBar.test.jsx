import { render, screen } from '@testing-library/react'
import ChannelSplitBar from '../../components/measurement/ChannelSplitBar'

describe('ChannelSplitBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChannelSplitBar onlineSplit={0.60} inStoreSplit={0.40} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays the section heading', () => {
    render(<ChannelSplitBar onlineSplit={0.60} inStoreSplit={0.40} />)
    expect(screen.getByText('Purchase Channel Split')).toBeInTheDocument()
  })

  it('displays online percentage', () => {
    render(<ChannelSplitBar onlineSplit={0.60} inStoreSplit={0.40} />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('displays in-store percentage', () => {
    render(<ChannelSplitBar onlineSplit={0.60} inStoreSplit={0.40} />)
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('displays Online label', () => {
    render(<ChannelSplitBar onlineSplit={0.60} inStoreSplit={0.40} />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('displays In Store label', () => {
    render(<ChannelSplitBar onlineSplit={0.60} inStoreSplit={0.40} />)
    expect(screen.getByText('In Store')).toBeInTheDocument()
  })

  it('renders the split bar with correct widths', () => {
    const { container } = render(<ChannelSplitBar onlineSplit={0.94} inStoreSplit={0.06} />)
    const bars = container.querySelectorAll('.h-full.transition-all')
    expect(bars[0]).toHaveStyle({ width: '94%', backgroundColor: '#5C70D6' })
    expect(bars[1]).toHaveStyle({ width: '6%', backgroundColor: '#2DD4BF' })
  })

  it('renders with Kayak split (94% online / 6% in-store)', () => {
    render(<ChannelSplitBar onlineSplit={0.94} inStoreSplit={0.06} />)
    expect(screen.getByText('94%')).toBeInTheDocument()
    expect(screen.getByText('6%')).toBeInTheDocument()
  })

  it('applies correct card background color', () => {
    const { container } = render(<ChannelSplitBar onlineSplit={0.50} inStoreSplit={0.50} />)
    expect(container.firstChild).toHaveStyle({ backgroundColor: '#252040' })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - ChannelSplitBar is the simplest measurement component — two props, no state.
 * - The component uses Math.round which could cause splits to not add to exactly 100%
 *   (e.g., onlineSplit=0.333, inStoreSplit=0.667 -> 33% + 67% = 100%, but edge cases exist).
 * - The bar colors are hardcoded; extracting to constants would improve maintainability.
 * - Tests are straightforward; no simplification needed.
 */
