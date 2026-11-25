'use client'

import { useEffect } from 'react'

/**
 * Counts one read of the current post (POST /api/blog/[slug]/view). Skipped for
 * automated browsers (navigator.webdriver: Playwright, Lighthouse) so e2e runs
 * never write to the database. Uses sendBeacon when available so the request
 * survives navigation; falls back to a keepalive fetch.
 */
export function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    if (typeof navigator === 'undefined' || navigator.webdriver) return
    const url = `/api/blog/${encodeURIComponent(slug)}/view`
    try {
      if (typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(url)) return
      void fetch(url, { method: 'POST', keepalive: true }).catch(() => {})
    } catch {
      // A failed count must never affect reading.
    }
  }, [slug])
  return null
}
