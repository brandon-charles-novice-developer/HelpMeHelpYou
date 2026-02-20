import { render, screen } from '@testing-library/react'
import ChannelSplitBar from '../../components/measurement/ChannelSplitBar'

describe('ChannelSplitBar — edge cases and prop variations', () => {
  it('renders with 100% online / 0% in-store', () => {
    render(<ChannelSplitBar onlineSplit={1.0} inStoreSplit={0} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders with 0% online / 100% in-store', () => {
    render(<ChannelSplitBar onlineSplit={0} inStoreSplit={1.0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders with equal split', () => {
    render(<ChannelSplitBar onlineSplit={0.50} inStoreSplit={0.50} />)
    const fiftyPercents = screen.getAllByText('50%')
    expect(fiftyPercents).toHaveLength(2)
  })

  it('rounds split values to integers', () => {
    render(<ChannelSplitBar onlineSplit={0.333} inStoreSplit={0.667} />)
    // Math.round(0.333 * 100) = 33, Math.round(0.667 * 100) = 67
    expect(screen.getByText('33%')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('renders color indicators for each channel', () => {
    const { container } = render(<ChannelSplitBar onlineSplit={0.70} inStoreSplit={0.30} />)
    const indicators = container.querySelectorAll('.rounded-sm.inline-block')
    expect(indicators).toHaveLength(2)
    expect(indicators[0]).toHaveStyle({ backgroundColor: '#5C70D6' })
    expect(indicators[1]).toHaveStyle({ backgroundColor: '#2DD4BF' })
  })

  it('uses heavily in-store split like Newell (28%/72%)', () => {
    render(<ChannelSplitBar onlineSplit={0.28} inStoreSplit={0.72} />)
    expect(screen.getByText('28%')).toBeInTheDocument()
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders the stacked bar container with rounded-full class', () => {
    const { container } = render(<ChannelSplitBar onlineSplit={0.60} inStoreSplit={0.40} />)
    const bar = container.querySelector('.flex.h-3.rounded-full')
    expect(bar).toBeInTheDocument()
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The component does not validate that onlineSplit + inStoreSplit = 1.0; adding a
 *   PropTypes check or normalization would prevent display bugs.
 * - Two separate props (onlineSplit, inStoreSplit) could be a single `splits` object.
 * - Backup tests cover boundary values and rounding edge cases.
 * - No redundancy with primary tests which focus on standard rendering.
 */
