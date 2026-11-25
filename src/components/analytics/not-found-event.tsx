'use client'

import { trackEarly } from './track-early'
import { useEffect } from 'react'

export type NotFoundKind = 'page' | 'project' | 'post' | 'category'

/**
 * Sends one `Not Found` custom event when a 404 template renders, with the
 * missing path as `target` and the template kind as `location`. Page views of
 * a 404 are indistinguishable from real pages in the dashboard; this makes
 * broken inbound links and retired slugs visible. Renders nothing.
 */
export function NotFoundEvent({ kind }: { kind: NotFoundKind }) {
  useEffect(() => {
    trackEarly('Not Found', { target: window.location.pathname.slice(0, 255), location: kind })
  }, [kind])
  return null
}
