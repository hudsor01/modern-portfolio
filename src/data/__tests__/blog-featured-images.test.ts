// CI exerciser for the throw-on-missing-slug contract in
// `featuredImageFor`. The seed script and admin enrichment paths rely
// on this throw to catch copy-paste-wrong-slug bugs at runtime — but
// the seed isn't run in CI, so without this test a wrong slug would
// only surface when an operator runs `bun run db:seed` locally.
// Asserting the round-trip here closes that gap.

import { describe, it, expect } from 'vitest'
import { BLOG_FEATURED_IMAGES, featuredImageFor } from '../blog-featured-images'

// The duplicate-slug guard lives in the module's load-time IIFE — if a
// duplicate ever lands, this module's `import` would throw before any
// test runs, failing CI at load. We don't assert it here (the assertion
// would be unreachable). The photoId-uniqueness assertion below IS
// load-bearing because nothing else enforces it.
describe('BLOG_FEATURED_IMAGES', () => {
  it('has no duplicate photoIds (would violate the partial unique index in prod)', () => {
    const photoIds = BLOG_FEATURED_IMAGES.map((e) => e.photoId)
    expect(new Set(photoIds).size).toBe(photoIds.length)
  })
})

describe('featuredImageFor', () => {
  it('returns Drizzle-row-shaped fields with non-empty src + alt for every canonical slug', () => {
    for (const entry of BLOG_FEATURED_IMAGES) {
      const result = featuredImageFor(entry.slug)
      expect(result.featuredImage).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/)
      expect(result.featuredImageAlt.length).toBeGreaterThan(0)
    }
  })

  it('throws on missing slug with a helpful message', () => {
    expect(() => featuredImageFor('this-slug-does-not-exist')).toThrow(
      /Missing featured-image mapping for blog slug "this-slug-does-not-exist"/
    )
  })
})

describe('DATA-03: Gong/Salesloft call-coaching post thumbnail', () => {
  const slug = 'stop-guessing-how-we-turned-call-coaching-into-a-revenue-engine-using-gong-and-s'
  const photoId = '1766066014237-00645c74e9c6'

  it('maps to the relevant sales-floor photo with accurate alt text', () => {
    const entry = BLOG_FEATURED_IMAGES.find((e) => e.slug === slug)
    expect(entry).toBeDefined()
    expect(entry?.photoId).toBe(photoId)
    expect(entry?.alt).toBe(
      'Sales development rep on a live call at a busy sales-floor workstation'
    )
    expect(featuredImageFor(slug).featuredImage).toContain(`photo-${photoId}`)
  })

  it('uses that photoId on exactly one entry', () => {
    expect(BLOG_FEATURED_IMAGES.filter((e) => e.photoId === photoId)).toHaveLength(1)
  })
})
