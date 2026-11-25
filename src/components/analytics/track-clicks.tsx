'use client'

import { track } from '@vercel/analytics'
import { useEffect } from 'react'

/**
 * Site-wide click and first-use tracking for Vercel Web Analytics custom events.
 *
 * Mark any element with `data-track="<Event Name>"` and optionally
 * `data-track-location="<section>"`; a click sends
 * `track(name, { location, target })`, where `target` is the link's path (or
 * its `data-track-target`). One delegated listener keeps Server Components
 * server-rendered: the markup carries the intent, no per-link client code.
 * Two properties at most, to stay inside the plan's custom-data limit; values
 * are capped at the documented 255 characters.
 */
const MAX = 255

export function trackedEvent(el: Element): { name: string; data: Record<string, string> } | null {
  const host = el.closest<HTMLElement>('[data-track]')
  if (!host) return null
  const name = host.dataset.track?.trim()
  if (!name) return null
  const href = host.getAttribute('href') ?? ''
  let target = host.dataset.trackTarget ?? href
  if (target.startsWith('mailto:')) target = 'mailto'
  else if (target.startsWith('/') || target.startsWith('http')) {
    try {
      const url = new URL(target, window.location.origin)
      target = url.origin === window.location.origin ? url.pathname : url.host + url.pathname
    } catch {
      // keep the raw value
    }
  }
  const data: Record<string, string> = {}
  const location = host.dataset.trackLocation?.trim()
  if (location) data.location = location.slice(0, MAX)
  if (target) data.target = target.slice(0, MAX)
  return { name: name.slice(0, MAX), data }
}

/**
 * First use of an interactive tool: an element marked
 * `data-track-input="<Event Name>"` sends that event once per page load when
 * the visitor first types into, changes or presses a control inside it.
 * Only the event name, `data-track-location` and the page path are sent,
 * never a value the visitor entered. Tools stay free of analytics imports
 * (src/app/tools/__tests__/no-network-guard.test.ts): the markup carries the
 * intent and this layout-level listener sends it.
 */
const CONTROL = 'input, select, textarea, button, [role="radio"], [role="checkbox"]'

export function firstUseEvent(
  el: Element,
  fired: WeakSet<Element>
): { name: string; data: Record<string, string> } | null {
  if (!el.closest(CONTROL)) return null
  const host = el.closest<HTMLElement>('[data-track-input]')
  if (!host || fired.has(host)) return null
  const name = host.dataset.trackInput?.trim()
  if (!name) return null
  fired.add(host)
  const data: Record<string, string> = { target: window.location.pathname.slice(0, MAX) }
  const location = host.dataset.trackLocation?.trim()
  if (location) data.location = location.slice(0, MAX)
  return { name: name.slice(0, MAX), data }
}

export function TrackClicks() {
  useEffect(() => {
    const fired = new WeakSet<Element>()
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const tracked = trackedEvent(event.target)
      if (tracked) track(tracked.name, tracked.data)
      const used = firstUseEvent(event.target, fired)
      if (used) track(used.name, used.data)
    }
    const onInput = (event: Event) => {
      if (!(event.target instanceof Element)) return
      const used = firstUseEvent(event.target, fired)
      if (used) track(used.name, used.data)
    }
    document.addEventListener('click', onClick, { capture: true })
    document.addEventListener('input', onInput, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('input', onInput, { capture: true })
    }
  }, [])
  return null
}
