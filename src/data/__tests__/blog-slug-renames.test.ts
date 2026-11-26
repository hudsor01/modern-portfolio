// @vitest-environment node
import { describe, expect, it } from 'vitest'
import retired from '../blog-retired-slugs.json'
import renames from '../blog-slug-renames.json'
import { REDIRECTS } from '@/lib/redirects'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// Old slugs are whatever went live, including a trailing hyphen from the old
// 80-character cut, so they only need to be URL-safe.
const OLD_SLUG = /^[a-z0-9-]+$/

const renameEntries = Object.entries(renames as Record<string, string>)
const retiredEntries = Object.entries(retired as Record<string, string>)
// Every redirect in the one table (hand-written, renames and retired).
const sources = new Set(REDIRECTS.map(({ source }) => source))

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

  it('never chains: no destination is itself redirected', () => {
    expect(REDIRECTS.length).toBeGreaterThan(0)
    for (const { destination } of REDIRECTS) expect(sources.has(destination)).toBe(false)
  })

  it('gives each old URL exactly one destination', () => {
    for (const [from] of renameEntries) expect(Object.hasOwn(retired, from)).toBe(false)
  })

  it('keeps hand-written redirects pointing at current slugs', () => {
    const handWritten = REDIRECTS.filter(({ destination }) => destination.startsWith('/blog/'))
    expect(handWritten.length).toBeGreaterThan(0)
    for (const { destination } of handWritten) expect(sources.has(destination)).toBe(false)
  })
})
