// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { siteConfig, navConfig } from '@/lib/site'

describe('siteConfig', () => {
  it('has a name and description', () => {
    expect(siteConfig.name).toBeTruthy()
    expect(siteConfig.description).toBeTruthy()
  })

  it('url is a valid URL', () => {
    expect(() => new URL(siteConfig.url)).not.toThrow()
  })

  it('exposes social links', () => {
    expect(siteConfig.links.github).toMatch(/^https:\/\//)
    expect(siteConfig.links.linkedin).toMatch(/^https:\/\//)
    expect(siteConfig.links.twitter).toMatch(/^https:\/\//)
  })

  it('author has name + email + url', () => {
    expect(siteConfig.author.name).toBeTruthy()
    expect(siteConfig.author.email).toContain('@')
    expect(() => new URL(siteConfig.author.url)).not.toThrow()
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
