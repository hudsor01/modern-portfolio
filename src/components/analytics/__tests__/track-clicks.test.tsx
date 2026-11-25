// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const track = vi.fn()
vi.mock('@vercel/analytics', () => ({ track: (...args: unknown[]) => track(...args) }))

import { TrackClicks, trackedEvent } from '../track-clicks'

function el(html: string): Element {
  document.body.innerHTML = html
  return document.body.querySelector('[data-probe]') as Element
}

describe('trackedEvent', () => {
  it('reads the event name, location and same-origin path from the marked ancestor', () => {
    const target = el(
      '<a data-track="CTA Click" data-track-location="home-hero" href="/contact?x=1"><span data-probe>Go</span></a>'
    )
    expect(trackedEvent(target)).toEqual({
      name: 'CTA Click',
      data: { location: 'home-hero', target: '/contact' },
    })
  })

  it('never sends an email address, and keeps host + path for external links', () => {
    expect(
      trackedEvent(el('<a data-probe data-track="Email Click" href="mailto:me@example.com">m</a>'))
    ).toEqual({
      name: 'Email Click',
      data: { target: 'mailto' },
    })
    expect(
      trackedEvent(
        el('<a data-probe data-track="Out" href="https://github.com/hudsor01?tab=1">g</a>')
      )?.data.target
    ).toBe('github.com/hudsor01')
  })

  it('ignores unmarked elements and caps values at 255 characters', () => {
    expect(trackedEvent(el('<a data-probe href="/x">x</a>'))).toBeNull()
    const long = 'a'.repeat(400)
    const out = trackedEvent(
      el(`<button data-probe data-track="${long}" data-track-location="${long}">b</button>`)
    )
    expect(out?.name.length).toBe(255)
    expect(out?.data.location?.length).toBe(255)
  })
})

describe('TrackClicks', () => {
  it('sends one track() per click on a marked element and none otherwise', () => {
    render(<TrackClicks />)
    document.body.insertAdjacentHTML(
      'beforeend',
      '<a id="t" data-track="CTA Click" data-track-location="nav" href="/contact">c</a><a id="u" href="/x">x</a>'
    )
    ;(document.getElementById('u') as HTMLElement).click()
    expect(track).not.toHaveBeenCalled()
    ;(document.getElementById('t') as HTMLElement).click()
    expect(track).toHaveBeenCalledWith('CTA Click', { location: 'nav', target: '/contact' })
  })
})

describe('first-use tracking', () => {
  it('sends the marked event once, on the first control used, with no entered value', async () => {
    const { firstUseEvent } = await import('../track-clicks')
    document.body.innerHTML =
      '<div data-track-input="Tool Used" data-track-location="calc"><input id="a" value="42"><button id="b">x</button><p id="c">text</p></div>'
    window.history.pushState({}, '', '/tools/calc')
    const fired = new WeakSet<Element>()
    expect(firstUseEvent(document.getElementById('c') as Element, fired)).toBeNull()
    expect(firstUseEvent(document.getElementById('a') as Element, fired)).toEqual({
      name: 'Tool Used',
      data: { target: '/tools/calc', location: 'calc' },
    })
    expect(firstUseEvent(document.getElementById('b') as Element, fired)).toBeNull()
  })

  it('the listener tracks the first input event inside a marked container only once', () => {
    track.mockClear()
    render(<TrackClicks />)
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div data-track-input="Tool Used"><input id="i2"></div>'
    )
    const input = document.getElementById('i2') as HTMLInputElement
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('input', { bubbles: true }))
    expect(track.mock.calls.filter((c) => c[0] === 'Tool Used')).toHaveLength(1)
  })
})
