// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import retired from '../blog-retired-slugs.json'
import renames from '../blog-slug-renames.json'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// Old slugs are whatever went live, including a trailing hyphen from the old
// 80-character cut, so they only need to be URL-safe.
const OLD_SLUG = /^[a-z0-9-]+$/

const renameEntries = Object.entries(renames as Record<string, string>)
const retiredEntries = Object.entries(retired as Record<string, string>)
// Every blog redirect next.config.js generates from the two maps.
const redirects = [...renameEntries, ...retiredEntries]
const sources = new Set(redirects.map(([from]) => from))

// Destinations of the hand-written redirects in next.config.js. A destination
// that was later renamed or retired would bounce visitors through two redirects.
const nextConfig = readFileSync(join(process.cwd(), 'next.config.js'), 'utf8')
const handWrittenDestinations = [...nextConfig.matchAll(/destination:\s*'\/blog\/([^']+)'/g)]
  .map((m) => m[1])
  .filter((slug): slug is string => slug !== undefined)

describe('blog slug redirects', () => {
  // Destinations are live URLs: generated ones are cut at 80 characters, but a
  // keeper that was never renamed can be slightly longer.
  it('maps valid old slugs to valid current slugs', () => {
    expect(renameEntries.length).toBeGreaterThan(0)
    expect(retiredEntries.length).toBeGreaterThan(0)
    for (const [from, to] of redirects) {
      expect(from).toMatch(OLD_SLUG)
      expect(to).toMatch(SLUG)
      expect(to.length).toBeLessThanOrEqual(100)
      expect(to).not.toBe(from)
    }
  })

  it('never chains: no destination is itself redirected', () => {
    for (const [, to] of redirects) expect(sources.has(to)).toBe(false)
  })

  it('gives each old URL exactly one destination', () => {
    for (const [from] of renameEntries) expect(Object.hasOwn(retired, from)).toBe(false)
  })

  it('keeps hand-written next.config.js redirects pointing at current slugs', () => {
    expect(handWrittenDestinations.length).toBeGreaterThan(0)
    for (const destination of handWrittenDestinations) {
      expect(sources.has(destination)).toBe(false)
    }
  })
})
