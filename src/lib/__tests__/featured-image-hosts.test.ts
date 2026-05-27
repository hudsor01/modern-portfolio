// Drift guard: the schema-side host allowlist must stay in sync with the
// `next/image` remotePatterns whitelist. If they diverge, validation can
// either accept URLs that `next/image` rejects at request time (broken
// images in prod), or vice versa (admin POST/PUT rejected on a host the
// renderer would have happily served).
//
// This test deliberately imports next.config.js — which pulls in
// `withSentryConfig` and friends — only at test time, not at app
// runtime, so the production client bundle stays Sentry-free.

import { describe, it, expect } from 'vitest'
import nextConfig from '../../../next.config.js'
import { FEATURED_IMAGE_ALLOWED_HOSTS } from '../featured-image-hosts'

describe('featured-image-hosts drift guard', () => {
  it('matches next.config.js images.remotePatterns hostnames exactly', () => {
    const fromNextConfig = (nextConfig.images?.remotePatterns ?? [])
      .map((p: { hostname?: string }) => p.hostname)
      .filter((h: string | undefined): h is string => typeof h === 'string')
      .sort()
    const fromAllowlist = [...FEATURED_IMAGE_ALLOWED_HOSTS].sort()
    expect(fromAllowlist).toEqual(fromNextConfig)
  })
})
