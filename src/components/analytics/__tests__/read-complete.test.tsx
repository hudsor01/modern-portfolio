// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const track = vi.fn()
vi.mock('@vercel/analytics', () => ({ track: (...args: unknown[]) => track(...args) }))

import { ReadComplete } from '../read-complete'

type Callback = (entries: Array<{ isIntersecting: boolean }>) => void
let fire: Callback = () => {}
const disconnect = vi.fn()

class FakeObserver {
  constructor(cb: Callback) {
    fire = cb
  }
  observe() {}
  disconnect = disconnect
}

afterEach(() => vi.unstubAllGlobals())

describe('ReadComplete', () => {
  it('sends Post Read once when the end of the article becomes visible', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    window.history.pushState({}, '', '/blog/some-post')
    render(<ReadComplete />)
    fire([{ isIntersecting: false }])
    expect(track).not.toHaveBeenCalled()
    fire([{ isIntersecting: true }])
    expect(track).toHaveBeenCalledTimes(1)
    expect(track).toHaveBeenCalledWith('Post Read', { target: '/blog/some-post' })
    expect(disconnect).toHaveBeenCalled()
  })

  it('does nothing without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    expect(() => render(<ReadComplete />)).not.toThrow()
    expect(track).not.toHaveBeenCalled()
  })
})
