// CI exerciser for the throw-on-missing-slug contract in
// `featuredImageFor`. The seed script and admin enrichment paths rely
// on this throw to catch copy-paste-wrong-slug bugs at runtime — but
// the seed isn't run in CI, so without this test a wrong slug would
// only surface when an operator runs `bun run db:seed` locally.
// Asserting the round-trip here closes that gap.

import { describe, it, expect } from 'vitest'
import {
  BLOG_FEATURED_IMAGES,
  BLOG_FEATURED_IMAGE_BY_SLUG,
  featuredImageFor,
} from '../blog-featured-images'

describe('BLOG_FEATURED_IMAGES', () => {
  it('has no duplicate slugs', () => {
    const slugs = BLOG_FEATURED_IMAGES.map((e) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has no duplicate photoIds (would violate the partial unique index in prod)', () => {
    const photoIds = BLOG_FEATURED_IMAGES.map((e) => e.photoId)
    expect(new Set(photoIds).size).toBe(photoIds.length)
  })

  it('every entry resolves via BLOG_FEATURED_IMAGE_BY_SLUG with non-empty src + alt', () => {
    for (const entry of BLOG_FEATURED_IMAGES) {
      const resolved = BLOG_FEATURED_IMAGE_BY_SLUG[entry.slug]
      expect(resolved, `slug ${entry.slug}`).toBeDefined()
      expect(resolved?.src).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/)
      expect(resolved?.alt.length).toBeGreaterThan(0)
    }
  })
})

describe('featuredImageFor', () => {
  it('returns Drizzle-row-shaped fields for every canonical slug', () => {
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
