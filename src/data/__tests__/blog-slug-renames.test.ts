// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import renames from '../blog-slug-renames.json'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// Old slugs are whatever went live, including a trailing hyphen from the old
// 80-character cut, so they only need to be URL-safe.
const OLD_SLUG = /^[a-z0-9-]+$/
const entries = Object.entries(renames as Record<string, string>)

// Destinations of the hand-written redirects in next.config.js. A destination
// that was later renamed would bounce visitors through two redirects.
const nextConfig = readFileSync(join(process.cwd(), 'next.config.js'), 'utf8')
const handWrittenDestinations = [...nextConfig.matchAll(/destination:\s*'\/blog\/([^']+)'/g)]
  .map((m) => m[1])
  .filter((slug): slug is string => slug !== undefined)

describe('blog slug renames', () => {
  it('maps valid old slugs to valid new slugs of at most 80 characters', () => {
    expect(entries.length).toBeGreaterThan(0)
    for (const [from, to] of entries) {
      expect(from).toMatch(OLD_SLUG)
      expect(to).toMatch(SLUG)
      expect(to.length).toBeLessThanOrEqual(80)
      expect(to).not.toBe(from)
    }
  })

  it('never chains: no new slug is itself renamed', () => {
    const sources = new Set(entries.map(([from]) => from))
    for (const [, to] of entries) expect(sources.has(to)).toBe(false)
  })

  it('gives every renamed post its own new slug', () => {
    const targets = entries.map(([, to]) => to)
    expect(new Set(targets).size).toBe(targets.length)
  })

  it('keeps hand-written next.config.js redirects pointing at current slugs', () => {
    expect(handWrittenDestinations.length).toBeGreaterThan(0)
    for (const destination of handWrittenDestinations) {
      expect(Object.hasOwn(renames, destination)).toBe(false)
    }
  })
})
