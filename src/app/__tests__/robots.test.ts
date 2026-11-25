// @vitest-environment node
import { describe, it, expect } from 'vitest'
import robots from '../robots'

const rules = (() => {
  const r = robots().rules
  return Array.isArray(r) ? r : [r]
})()

const list = (v: string | string[] | undefined): string[] => (v === undefined ? [] : [v].flat())

function ruleFor(ua: string) {
  return rules.find((r) => list(r.userAgent).includes(ua))
}

const PUBLIC_ALLOW = ['/', '/api/og', '/api/blog/rss']
const PRIVATE_DISALLOW = ['/api/', '/_next/', '/admin/']

const SEARCH_UAS = [
  'Googlebot',
  'Bingbot',
  'Slurp',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
]
const SOCIAL_UAS = ['Twitterbot', 'LinkedInBot', 'facebookexternalhit']
const AI_TRAINING_UAS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'meta-externalagent',
  'Meta-ExternalFetcher',
  'Bytespider',
  'TikTokSpider',
  'Amazonbot',
  'Diffbot',
  'AI2Bot',
  'AI2Bot-Dolma',
  'PanguBot',
  'ImagesiftBot',
  'Timpibot',
  'omgili',
  'omgilibot',
  'Kangaroo Bot',
  'webzio-extended',
  'VelenPublicWebCrawler',
  'PetalBot',
]
const SEO_SCRAPER_UAS = ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot']

describe('robots rules for crawlable groups', () => {
  for (const ua of [...SEARCH_UAS, ...SOCIAL_UAS, '*']) {
    it(`${ua} carries the private disallows and public allows`, () => {
      const rule = ruleFor(ua)
      expect(rule).toBeDefined()
      expect(list(rule?.disallow)).toEqual(PRIVATE_DISALLOW)
      expect(list(rule?.allow)).toEqual(PUBLIC_ALLOW)
    })
  }

  it('groups 1, 2 and 3 share identical allow and disallow arrays', () => {
    const [g1, g2, g3] = [ruleFor('Googlebot'), ruleFor('Twitterbot'), ruleFor('*')]
    expect(g1?.allow).toEqual(g2?.allow)
    expect(g2?.allow).toEqual(g3?.allow)
    expect(g1?.disallow).toEqual(g2?.disallow)
    expect(g2?.disallow).toEqual(g3?.disallow)
  })
})

describe('robots blocked groups', () => {
  it('AI-training user agents are unchanged and disallowed entirely', () => {
    const rule = ruleFor('GPTBot')
    expect(list(rule?.userAgent)).toEqual(AI_TRAINING_UAS)
    expect(list(rule?.disallow)).toEqual(['/'])
    expect(list(rule?.allow)).toEqual([])
  })

  it('SEO-scraper user agents are unchanged and disallowed entirely', () => {
    const rule = ruleFor('AhrefsBot')
    expect(list(rule?.userAgent)).toEqual(SEO_SCRAPER_UAS)
    expect(list(rule?.disallow)).toEqual(['/'])
    expect(list(rule?.allow)).toEqual([])
  })
})

describe('robots structure', () => {
  it('lists every user agent in exactly one rule', () => {
    const seen = rules.flatMap((r) => list(r.userAgent))
    expect(new Set(seen).size).toBe(seen.length)
  })

  it('points at the sitemap and sets no host', () => {
    const result = robots()
    expect(result.sitemap).toBe('https://richardwhudsonjr.com/sitemap.xml')
    expect(result).not.toHaveProperty('host')
  })
})
