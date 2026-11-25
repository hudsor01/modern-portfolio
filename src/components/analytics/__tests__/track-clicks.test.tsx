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
