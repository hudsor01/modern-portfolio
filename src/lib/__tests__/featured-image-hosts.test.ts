// Drift guard: the schema-side host allowlist must stay in sync with
// `next/image`'s `remotePatterns`. If they diverge, validation accepts
// URLs that `next/image` rejects at request time (broken images in
// prod), or vice versa.
//
// This is the only place we import `next.config.js` from app code. It's
// quarantined to tests so the production client bundle stays free of
// `withSentryConfig` and the Sentry build graph.

import { describe, it, expect } from 'vitest'
import nextConfig from '../../../next.config.js'
import { FEATURED_IMAGE_ALLOWED_HOSTS } from '../featured-image-hosts'

describe('featured-image-hosts drift guard', () => {
  it('matches next.config.js images.remotePatterns hostnames exactly', () => {
    const fromNextConfig = (nextConfig.images?.remotePatterns ?? [])
      .map((p: { hostname?: string }) => p.hostname)
      .filter((h: string | undefined): h is string => typeof h === 'string')
      .sort()
    expect([...FEATURED_IMAGE_ALLOWED_HOSTS].sort()).toEqual(fromNextConfig)
  })
})
