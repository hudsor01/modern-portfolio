'use client'

import { track } from '@vercel/analytics'
import { useEffect, useRef } from 'react'

/**
 * Sends one `Post Read` custom event when the reader reaches the end of the
 * article body (this element scrolls into view), with the post path as
 * `target`. Page views say a post was opened; this says it was finished.
 * Fires at most once per mount and never without IntersectionObserver.
 */
export function ReadComplete() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect()
        track('Post Read', { target: window.location.pathname })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} aria-hidden="true" data-slot="read-end" />
}
