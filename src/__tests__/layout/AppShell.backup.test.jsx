import { render, screen, act } from '@testing-library/react'
import AppShell from '../../components/layout/AppShell'

describe('AppShell — edge cases, animation timing, structure', () => {
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

  describe('children rendering', () => {
    it('renders multiple children', () => {
      render(
        <AppShell {...defaultProps}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </AppShell>
      )
      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })

    it('renders with no children', () => {
      const { container } = render(<AppShell {...defaultProps} />)
      const main = container.querySelector('main')
      expect(main).toBeInTheDocument()
      expect(main.childNodes).toHaveLength(0)
    })

    it('renders complex JSX children', () => {
      render(
        <AppShell {...defaultProps}>
          <section data-testid="complex">
            <h1>Title</h1>
            <p>Paragraph</p>
          </section>
        </AppShell>
      )
      expect(screen.getByTestId('complex')).toBeInTheDocument()
      expect(screen.getByText('Title')).toBeInTheDocument()
    })
  })

  describe('crossfade animation timing', () => {
    it('fade out happens immediately on mode change', () => {
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

      // Immediate: opacity should be 0
      expect(main).toHaveStyle({ opacity: '0' })
    })

    it('fade in happens after exactly 180ms', () => {
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

      // At 179ms — still faded out
      act(() => {
        vi.advanceTimersByTime(179)
      })
      expect(main).toHaveStyle({ opacity: '0' })

      // At 180ms — faded in
      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(main).toHaveStyle({ opacity: '1' })
    })

    it('rapid mode changes clear previous timer (cleanup works)', () => {
      const { container, rerender } = render(
        <AppShell {...defaultProps} mode="executive">
          <div>Content</div>
        </AppShell>
      )
      const main = container.querySelector('main')

      // First mode change: executive -> manager
      rerender(
        <AppShell {...defaultProps} mode="manager">
          <div>Content</div>
        </AppShell>
      )
      expect(main).toHaveStyle({ opacity: '0' })

      // 100ms in, complete the fade to manager first
      act(() => {
        vi.advanceTimersByTime(180)
      })
      expect(main).toHaveStyle({ opacity: '1' })

      // Now switch again: manager -> executive
      rerender(
        <AppShell {...defaultProps} mode="executive">
          <div>Content</div>
        </AppShell>
      )
      expect(main).toHaveStyle({ opacity: '0' })

      // Complete second fade
      act(() => {
        vi.advanceTimersByTime(180)
      })
      expect(main).toHaveStyle({ opacity: '1' })
    })
  })

  describe('DOM structure', () => {
    it('root is a div with min-h-screen', () => {
      const { container } = render(
        <AppShell {...defaultProps}>
          <div>Content</div>
        </AppShell>
      )
      expect(container.firstChild.tagName).toBe('DIV')
      expect(container.firstChild).toHaveClass('min-h-screen')
    })

    it('header comes before main in DOM order', () => {
      const { container } = render(
        <AppShell {...defaultProps}>
          <div>Content</div>
        </AppShell>
      )
      const root = container.firstChild
      const children = Array.from(root.children)
      expect(children[0].tagName).toBe('HEADER')
      expect(children[1].tagName).toBe('MAIN')
    })

    it('main element has overflow-auto for scrolling', () => {
      const { container } = render(
        <AppShell {...defaultProps}>
          <div>Content</div>
        </AppShell>
      )
      expect(container.querySelector('main')).toHaveClass('overflow-auto')
    })
  })

  describe('mode prop passthrough to Header', () => {
    it('Header receives mode prop (executive shows active)', () => {
      render(
        <AppShell {...defaultProps} mode="executive">
          <div>Content</div>
        </AppShell>
      )
      expect(screen.getByText('Morning Coffee')).toHaveClass('bg-attain-primary')
    })

    it('Header receives mode prop (manager shows active)', () => {
      render(
        <AppShell {...defaultProps} mode="manager">
          <div>Content</div>
        </AppShell>
      )
      expect(screen.getByText('Campaign Manager')).toHaveClass('bg-attain-primary')
    })
  })

  describe('stability when mode does not change', () => {
    it('re-render with same mode does not trigger fade', () => {
      const { container, rerender } = render(
        <AppShell {...defaultProps} mode="executive">
          <div>Original</div>
        </AppShell>
      )
      const main = container.querySelector('main')

      rerender(
        <AppShell {...defaultProps} mode="executive">
          <div>Updated</div>
        </AppShell>
      )

      expect(main).toHaveStyle({ opacity: '1' })
      expect(screen.getByText('Updated')).toBeInTheDocument()
    })
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The dual state (visible + displayedMode) creates a two-step fade cycle that's harder to reason about than a CSS-only transition
 * - Could replace the JS timer approach with CSS transitions triggered by a class toggle
 * - The 180ms constant is not exported or configurable — if it needs to change, you'd have to update tests too
 * - The effect dependency array [mode, displayedMode] means the effect runs on displayedMode changes too, which is the "fade back in" phase
 * - Consider useTransition or startTransition for non-urgent mode switches instead of manual timers
 */
