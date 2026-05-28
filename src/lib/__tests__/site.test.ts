// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { siteConfig, navConfig } from '@/lib/site'
import { SITE_ORIGIN } from '@/lib/absolute-url'

describe('siteConfig', () => {
  it('has a name and description', () => {
    expect(siteConfig.name).toBeTruthy()
    expect(siteConfig.description).toBeTruthy()
  })

  it('exposes social links', () => {
    expect(siteConfig.links.github).toMatch(/^https:\/\//)
    expect(siteConfig.links.linkedin).toMatch(/^https:\/\//)
    expect(siteConfig.links.twitter).toMatch(/^https:\/\//)
  })

  it('author has name + email', () => {
    expect(siteConfig.author.name).toBeTruthy()
    expect(siteConfig.author.email).toContain('@')
  })
})

describe('SITE_ORIGIN', () => {
  // Regression pin for the 2026-05-07 incident: a previous version of
  // siteConfig.url fell back to `http://localhost:3000` on Vercel
  // preview builds without NEXT_PUBLIC_SITE_URL, leaking localhost
  // into JSON-LD. SITE_ORIGIN must stay hardcoded to prod regardless
  // of build env.
  it('is the exact production origin', () => {
    expect(SITE_ORIGIN).toBe('https://richardwhudsonjr.com')
  })
})

describe('navConfig', () => {
  it('mainNav contains expected core routes', () => {
    const hrefs = navConfig.mainNav.map((n) => n.href)
    expect(hrefs).toEqual(
      expect.arrayContaining(['/', '/about', '/projects', '/blog', '/resume', '/contact'])
    )
  })

  it('every mainNav entry has title and href', () => {
    for (const n of navConfig.mainNav) {
      expect(n.title).toBeTruthy()
      expect(n.href.startsWith('/')).toBe(true)
    }
  })

  it('footerNav.resources is non-empty', () => {
    expect(navConfig.footerNav.resources.length).toBeGreaterThan(0)
  })
})
