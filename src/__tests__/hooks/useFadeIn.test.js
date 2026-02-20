import { renderHook, act } from '@testing-library/react'
import { useFadeIn } from '../../hooks/useFadeIn'
import React from 'react'

// The useFadeIn hook only creates an observer when ref.current is set.
// In renderHook, ref.current is always null since there's no real DOM.
// We test with a wrapper component that attaches the ref to a real element.

describe('useFadeIn', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns ref and className', () => {
    window.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    const { result } = renderHook(() => useFadeIn())
    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('className')
  })

  it('starts with hidden class', () => {
    window.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    const { result } = renderHook(() => useFadeIn())
    expect(result.current.className).toBe('fade-up-hidden')
  })

  it('does not create observer when ref.current is null', () => {
    const mockCtor = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
    window.IntersectionObserver = mockCtor

    renderHook(() => useFadeIn())
    // ref.current is null so the effect returns early
    expect(mockCtor).not.toHaveBeenCalled()
  })

  it('transitions to visible class when element intersects', () => {
    let observeCallback
    const mockUnobserve = vi.fn()

    window.IntersectionObserver = vi.fn(function (cb) {
      observeCallback = cb
      return {
        observe: vi.fn(),
        unobserve: mockUnobserve,
        disconnect: vi.fn(),
      }
    })

    // Render a real component that uses the hook and attaches ref to a div
    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    const { container } = require('@testing-library/react').render(
      React.createElement(TestComponent)
    )

    // Now the observer should be created since ref.current is a real element
    expect(observeCallback).toBeDefined()

    // Simulate intersection
    act(() => {
      observeCallback([{ isIntersecting: true }])
    })

    expect(container.firstChild.className).toBe('fade-up-visible')
  })

  it('does not change to visible when not intersecting', () => {
    let observeCallback

    window.IntersectionObserver = vi.fn(function (cb) {
      observeCallback = cb
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })

    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    const { container } = require('@testing-library/react').render(
      React.createElement(TestComponent)
    )

    act(() => {
      observeCallback([{ isIntersecting: false }])
    })

    expect(container.firstChild.className).toBe('fade-up-hidden')
  })

  it('unobserves element after becoming visible', () => {
    let observeCallback
    const mockUnobserve = vi.fn()

    window.IntersectionObserver = vi.fn(function (cb) {
      observeCallback = cb
      return {
        observe: vi.fn(),
        unobserve: mockUnobserve,
        disconnect: vi.fn(),
      }
    })

    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    require('@testing-library/react').render(
      React.createElement(TestComponent)
    )

    act(() => {
      observeCallback([{ isIntersecting: true }])
    })

    expect(mockUnobserve).toHaveBeenCalled()
  })

  it('disconnects observer on unmount', () => {
    const mockDisconnect = vi.fn()

    window.IntersectionObserver = vi.fn(function () {
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
      }
    })

    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    const { unmount } = require('@testing-library/react').render(
      React.createElement(TestComponent)
    )

    unmount()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('stays visible once triggered (no toggle back)', () => {
    let observeCallback

    window.IntersectionObserver = vi.fn(function (cb) {
      observeCallback = cb
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    })

    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    const { container } = require('@testing-library/react').render(
      React.createElement(TestComponent)
    )

    act(() => {
      observeCallback([{ isIntersecting: true }])
    })
    expect(container.firstChild.className).toBe('fade-up-visible')

    // Fire again with false — should stay visible
    act(() => {
      observeCallback([{ isIntersecting: false }])
    })
    expect(container.firstChild.className).toBe('fade-up-visible')
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - The hook returns { ref, className } but could return { ref, isVisible } and let the caller set the class
 * - The hardcoded class names 'fade-up-visible' / 'fade-up-hidden' couple the hook to specific CSS; a boolean would be more reusable
 * - Default options (threshold, rootMargin) are reasonable but could be constants for documentation
 * - The hook does not handle the case where ref.current is null (effect returns early, observer not created)
 * - Tests require IntersectionObserver mock since jsdom does not implement it; a real component is needed to test the ref attachment
 */
