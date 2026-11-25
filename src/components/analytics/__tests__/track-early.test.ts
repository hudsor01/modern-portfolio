// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { trackEarly } from '../track-early'

type W = { va?: (...args: unknown[]) => void; vaq?: unknown[][] }

describe('trackEarly', () => {
  it('queues the event when Vercel Analytics has not initialised yet', () => {
    const w = window as unknown as W
    delete w.va
    delete w.vaq
    trackEarly('Not Found', { target: '/x', location: 'page' })
    expect(typeof w.va).toBe('function')
    expect(w.vaq).toEqual([
      ['event', { name: 'Not Found', data: { target: '/x', location: 'page' } }],
    ])
  })

  it('keeps an existing window.va (does not replace the live script)', () => {
    const calls: unknown[][] = []
    const live = (...args: unknown[]) => calls.push(args)
    ;(window as unknown as W).va = live
    trackEarly('Post Read', { target: '/blog/a' })
    expect((window as unknown as W).va).toBe(live)
    expect(calls).toHaveLength(1)
  })
})
