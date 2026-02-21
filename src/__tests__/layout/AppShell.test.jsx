import { render, screen, act } from '@testing-library/react'
import AppShell from '../../components/layout/AppShell'

describe('AppShell', () => {
  const defaultProps = {
    mode: 'executive',
    onModeChange: vi.fn(),
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without error', () => {
    const { container } = render(
      <AppShell {...defaultProps}>
        <div>Content</div>
      </AppShell>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <AppShell {...defaultProps}>
        <div>Dashboard Content</div>
      </AppShell>
    )
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })

  it('includes the Header component', () => {
    render(
      <AppShell {...defaultProps}>
        <div>Content</div>
      </AppShell>
    )
    // Header contains these elements
    expect(screen.getByText('Alexander Potts')).toBeInTheDocument()
    expect(screen.getByText('Tombras')).toBeInTheDocument()
  })

  it('has relative positioning for glass layering', () => {
    const { container } = render(
      <AppShell {...defaultProps}>
        <div>Content</div>
      </AppShell>
    )
    expect(container.firstChild).toHaveClass('relative')
  })

  it('uses min-h-screen and flex column layout', () => {
    const { container } = render(
      <AppShell {...defaultProps}>
        <div>Content</div>
      </AppShell>
    )
    expect(container.firstChild).toHaveClass('min-h-screen', 'flex', 'flex-col')
  })

  it('renders main element with flex-1', () => {
    const { container } = render(
      <AppShell {...defaultProps}>
        <div>Content</div>
      </AppShell>
    )
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('flex-1', 'overflow-auto')
  })

  it('starts with opacity 1 (visible)', () => {
    const { container } = render(
      <AppShell {...defaultProps}>
        <div>Content</div>
      </AppShell>
    )
    const main = container.querySelector('main')
    expect(main).toHaveStyle({ opacity: '1' })
  })

  it('fades out when mode changes, then fades back in', () => {
    const { container, rerender } = render(
      <AppShell {...defaultProps} mode="executive">
        <div>Content</div>
      </AppShell>
    )
    const main = container.querySelector('main')

    // Change mode
    rerender(
      <AppShell {...defaultProps} mode="manager">
        <div>Content</div>
      </AppShell>
    )

    // Should be fading out
    expect(main).toHaveStyle({ opacity: '0' })

    // After 180ms, should fade back in
    act(() => {
      vi.advanceTimersByTime(180)
    })

    expect(main).toHaveStyle({ opacity: '1' })
  })

  it('applies scale transform during fade', () => {
    const { container, rerender } = render(
      <AppShell {...defaultProps} mode="executive">
        <div>Content</div>
      </AppShell>
    )
    const main = container.querySelector('main')

    rerender(
      <AppShell {...defaultProps} mode="manager">
        <div>Content</div>
      </AppShell>
    )

    // During fade out
    expect(main).toHaveStyle({ transform: 'scale(0.99)' })

    // After timer, scale returns to normal
    act(() => {
      vi.advanceTimersByTime(180)
    })

    expect(main).toHaveStyle({ transform: 'scale(1)' })
  })

  it('does not fade when mode stays the same', () => {
    const { container, rerender } = render(
      <AppShell {...defaultProps} mode="executive">
        <div>Content</div>
      </AppShell>
    )
    const main = container.querySelector('main')

    rerender(
      <AppShell {...defaultProps} mode="executive">
        <div>Updated Content</div>
      </AppShell>
    )

    // Should remain visible — no mode change
    expect(main).toHaveStyle({ opacity: '1' })
  })

  it('has transition classes on main', () => {
    const { container } = render(
      <AppShell {...defaultProps}>
        <div>Content</div>
      </AppShell>
    )
    const main = container.querySelector('main')
    expect(main).toHaveClass('transition-all', 'duration-200')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The crossfade uses useState for both `visible` and `displayedMode` — could use a single state object or useReducer
 * - The 180ms fade duration is hardcoded — could be a constant or prop
 * - The cleanup function `clearTimeout(t)` is correct for avoiding stale timers on rapid mode switching
 * - The `displayedMode` state is tracked but not actually used for conditional rendering — it only triggers the fade cycle
 * - The scale(0.99) during fade is very subtle — almost imperceptible to users, could be removed
 */
