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

  // buildRedirectTable only checks exact strings; this runs the proxy's real
  // resolver, so a destination it would canonicalize again fails here too.
  it('sends every internal redirect to a resolveSingleHop fixed point', () => {
    const internal = REDIRECTS.filter(({ destination }) => destination.startsWith('/'))
    expect(internal.length).toBeGreaterThan(0)
    for (const { destination } of internal) {
      expect(resolveSingleHop(destination, '', REDIRECT_MAP), destination).toBeNull()
    }
  })

  it('gives each old URL exactly one destination', () => {
    for (const [from] of renameEntries) expect(Object.hasOwn(retired, from)).toBe(false)
  })

  // Only the entries of src/data/redirects.json, not the two generated maps.
  it('points hand-written blog redirects at slugs that are not renamed or retired', () => {
    const handWrittenSources = new Set(handWritten.map(({ source }) => source))
    const blog = REDIRECTS.filter(
      ({ source, destination }) =>
        handWrittenSources.has(source) && destination.startsWith('/blog/')
    )
    expect(blog.length).toBeGreaterThan(0)
    for (const { destination } of blog) {
      const slug = destination.slice('/blog/'.length)
      expect(slug, destination).toMatch(SLUG)
      expect(Object.hasOwn(renames, slug), destination).toBe(false)
      expect(Object.hasOwn(retired, slug), destination).toBe(false)
    }
  })
})
