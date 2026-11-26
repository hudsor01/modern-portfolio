// @vitest-environment node
import { describe, expect, it } from 'vitest'
import retired from '../blog-retired-slugs.json'
import renames from '../blog-slug-renames.json'
import handWritten from '../redirects.json'
import { resolveSingleHop } from '@/lib/redirect-resolve'
import { REDIRECT_MAP, REDIRECTS } from '@/lib/redirects'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// Old slugs are whatever went live, including a trailing hyphen from the old
// 80-character cut, so they only need to be URL-safe.
const OLD_SLUG = /^[a-z0-9-]+$/

const renameEntries = Object.entries(renames as Record<string, string>)
const retiredEntries = Object.entries(retired as Record<string, string>)

describe('blog slug redirects', () => {
  // Destinations are live URLs: generated ones are cut at 80 characters, but a
  // keeper that was never renamed can be slightly longer.
  it('maps valid old slugs to valid current slugs', () => {
    expect(renameEntries.length).toBeGreaterThan(0)
    expect(retiredEntries.length).toBeGreaterThan(0)
    for (const [from, to] of [...renameEntries, ...retiredEntries]) {
      expect(from).toMatch(OLD_SLUG)
      expect(to).toMatch(SLUG)
      expect(to.length).toBeLessThanOrEqual(100)
      expect(to).not.toBe(from)
    }
  })

  // The proxy emits new URL(destination, origin); run the real resolver on
  // that URL-normalized path, so a destination URL parsing would rewrite
  // (dot segments, encodings) fails here as well as in the builder.
  it('sends every internal redirect to a resolveSingleHop fixed point', () => {
    const internal = REDIRECTS.filter(({ destination }) => destination.startsWith('/'))
    expect(internal.length).toBeGreaterThan(0)
    for (const { destination } of internal) {
      const emitted = new URL(destination, 'https://richardwhudsonjr.com').pathname
      expect(emitted, destination).toBe(destination)
      expect(resolveSingleHop(emitted, '', REDIRECT_MAP), destination).toBeNull()
    }
  })

  // Duplicate sources, and destinations that are themselves sources, already
  // make buildRedirectTable throw when @/lib/redirects is imported above, so
  // they are not restated here. This checks what the builder does not: the
  // hand-written blog destinations use the current slug grammar.
  it('points hand-written blog redirects at well-formed current slugs', () => {
    const handWrittenSources = new Set(handWritten.map(({ source }) => source))
    const blog = REDIRECTS.filter(
      ({ source, destination }) =>
        handWrittenSources.has(source) && destination.startsWith('/blog/')
    )
    expect(blog.length).toBeGreaterThan(0)
    for (const { destination } of blog) {
      const slug = destination.slice('/blog/'.length)
      expect(slug, destination).toMatch(SLUG)
      expect(slug.length, destination).toBeLessThanOrEqual(100)
    }
  })
})
