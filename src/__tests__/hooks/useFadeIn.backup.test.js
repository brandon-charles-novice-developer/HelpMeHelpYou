import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { useFadeIn } from '../../hooks/useFadeIn'
import React from 'react'

describe('useFadeIn — ref behavior and observer lifecycle', () => {
  let instances = []

  beforeEach(() => {
    instances = []
    window.IntersectionObserver = vi.fn(function (callback, options) {
      const instance = {
        callback,
        options,
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
      instances.push(instance)
      return instance
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('ref starts as null', () => {
    const { result } = renderHook(() => useFadeIn())
    expect(result.current.ref.current).toBeNull()
  })

  it('creates observer when attached to a real DOM element', () => {
    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    render(React.createElement(TestComponent))
    expect(instances.length).toBe(1)
  })

  it('passes correct default options to observer', () => {
    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    render(React.createElement(TestComponent))
    expect(instances[0].options).toEqual({
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    })
  })

  it('passes custom options to observer', () => {
    function TestComponent() {
      const { ref, className } = useFadeIn({ threshold: 0.7, rootMargin: '10px' })
      return React.createElement('div', { ref, className })
    }

    render(React.createElement(TestComponent))
    expect(instances[0].options).toEqual({
      threshold: 0.7,
      rootMargin: '10px',
    })
  })

  it('disconnects previous observer on unmount', () => {
    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    const { unmount } = render(React.createElement(TestComponent))
    const observer = instances[0]
    unmount()
    expect(observer.disconnect).toHaveBeenCalled()
  })

  it('returns consistent ref object identity across renders', () => {
    const { result, rerender } = renderHook(() => useFadeIn())
    const firstRef = result.current.ref
    rerender()
    expect(result.current.ref).toBe(firstRef)
  })

  it('accepts empty options object', () => {
    const { result } = renderHook(() => useFadeIn({}))
    expect(result.current.className).toBe('fade-up-hidden')
  })

  it('accepts no arguments (uses defaults)', () => {
    const { result } = renderHook(() => useFadeIn())
    expect(result.current.className).toBe('fade-up-hidden')
  })

  it('calls observe on the DOM element', () => {
    function TestComponent() {
      const { ref, className } = useFadeIn()
      return React.createElement('div', { ref, className })
    }

    render(React.createElement(TestComponent))
    expect(instances[0].observe).toHaveBeenCalledTimes(1)
  })

  it('className is always one of the two valid states', () => {
    const { result } = renderHook(() => useFadeIn())
    expect(['fade-up-hidden', 'fade-up-visible']).toContain(result.current.className)
  })
})

/*
 * SIMPLIFICATION ANALYSIS:
 * - Observer re-creation on option changes is handled by the dependency array but could cause unnecessary re-subscriptions
 * - The hook could accept a ref as a parameter instead of creating one, making it composable with existing refs
 * - The rootMargin default '0px 0px -10% 0px' is a magic string; a named constant would improve readability
 * - Tests tracking observer instances is fragile; a spy-based approach would be more resilient
 * - The two className values could be an enum or constants to prevent typos
 */
