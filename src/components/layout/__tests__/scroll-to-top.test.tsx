// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import { ScrollToTop } from '../scroll-to-top'

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', {
    value: y,
    configurable: true,
    writable: true,
  })
}

describe('ScrollToTop', () => {
  beforeEach(() => {
    cleanup()
    setScrollY(0)
  })

  afterEach(() => {
    setScrollY(0)
  })

  it('does not render the button initially (scrollY = 0)', () => {
    const { container } = render(<ScrollToTop />)
    expect(container.querySelector('button')).toBeNull()
  })

  it('does not render below the 500px threshold', () => {
    const { container } = render(<ScrollToTop />)
    setScrollY(450)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(container.querySelector('button')).toBeNull()
  })

  it('renders the button after scrolling past 500px', () => {
    render(<ScrollToTop />)
    setScrollY(600)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    const btn = screen.getByRole('button', { name: 'Scroll to top' })
    expect(btn).toBeTruthy()
  })

  it('calls window.scrollTo({ top: 0, behavior: "smooth" }) when clicked', () => {
    const scrollToSpy = vi.fn()
    Object.defineProperty(window, 'scrollTo', {
      value: scrollToSpy,
      configurable: true,
      writable: true,
    })
    render(<ScrollToTop />)
    setScrollY(800)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    const btn = screen.getByRole('button', { name: 'Scroll to top' })
    act(() => {
      btn.click()
    })
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('hides again when scrolling back below threshold', () => {
    const { container } = render(<ScrollToTop />)
    setScrollY(800)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(container.querySelector('button')).toBeTruthy()

    setScrollY(100)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(container.querySelector('button')).toBeNull()
  })
})
