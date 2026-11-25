// @vitest-environment node
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import type { MetadataRoute } from 'next'
import sitemap from '../sitemap'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { tools, TOOLS_HUB_LAST_UPDATED } from '@/data/tools'

let entries: MetadataRoute.Sitemap

beforeAll(async () => {
  vi.stubEnv('NEXT_PHASE', 'phase-production-build')
  entries = await sitemap()
})

afterAll(() => {
  vi.unstubAllEnvs()
})

describe('sitemap tools entries', () => {
  it('lists /tools once with its own lastmod', () => {
    const hub = entries.filter((e) => e.url === `${SITE_ORIGIN}/tools`)
    expect(hub).toHaveLength(1)
    expect(hub[0]?.lastModified).toBe(`${TOOLS_HUB_LAST_UPDATED}T00:00:00.000Z`)
    expect(hub[0]?.changeFrequency).toBe('monthly')
    expect(hub[0]?.priority).toBe(0.8)
  })

  it('lists every tool from the catalog once', () => {
    for (const tool of tools) {
      const found = entries.filter((e) => e.url === `${SITE_ORIGIN}${tool.href}`)
      expect(found).toHaveLength(1)
      expect(found[0]?.changeFrequency).toBe('monthly')
      expect(found[0]?.priority).toBe(0.8)
    }
  })

  it('has no duplicate urls', () => {
    const urls = entries.map((e) => e.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('every other entry shares the one static lastmod', () => {
    const others = entries.filter(
      (e) => e.url !== `${SITE_ORIGIN}/tools` && e.url !== `${SITE_ORIGIN}/privacy`
    )
    expect(others.length).toBeGreaterThan(0)
    expect(new Set(others.map((e) => String(e.lastModified))).size).toBe(1)
  })
})
