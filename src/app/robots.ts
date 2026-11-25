import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/absolute-url'

/**
 * robots.txt policy.
 *
 * Authoritative since `public/robots.txt` was deleted (avoiding the dual-file
 * footgun). Five groups:
 *
 *  1. Search-index allow-list — every major search/AI crawler that surfaces
 *     pages in human-facing results (Googlebot, Bingbot, OAI-SearchBot,
 *     Claude-SearchBot, PerplexityBot, ...). These drive traffic.
 *
 *  2. Social-preview allow-list — Twitterbot/LinkedInBot/facebookexternalhit
 *     need /api/og.
 *
 *  3. Default (`*`) — everyone not named elsewhere.
 *
 *  4. AI training opt-out — block bots that scrape for model training but
 *     don't drive traffic (GPTBot, ClaudeBot, Google-Extended,
 *     Applebot-Extended, CCBot, Bytespider). Blocking these has zero ranking
 *     impact and prevents Richard's writing from being ingested as training
 *     data without attribution.
 *
 *  5. SEO scrapers — block (no value, just bandwidth cost).
 *
 * Groups 1-3 share one allow/disallow source. A crawler obeys only its most
 * specific matching group (RFC 9309), so the `*` disallows never reach
 * Googlebot or Bingbot; every named group must repeat them. `/api/og` and
 * `/api/blog/rss` stay crawlable because the longest matching rule wins and
 * both are longer than `/api/`.
 */
const PUBLIC_ALLOW = ['/', '/api/og', '/api/blog/rss']
const PRIVATE_DISALLOW = ['/api/', '/_next/', '/admin/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Search/AI search crawlers: public pages, no private paths.
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          'OAI-SearchBot',
          'Claude-SearchBot',
          'PerplexityBot',
        ],
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },

      // 2. Social previews: need /api/og for OG image fetches.
      {
        userAgent: ['Twitterbot', 'LinkedInBot', 'facebookexternalhit'],
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },

      // 3. Default: same rules as the named groups above.
      {
        userAgent: '*',
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },

      // 4. AI training crawlers: opt out. These don't drive traffic; blocking
      //    is purely a training-data policy choice.
      {
        userAgent: [
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
        ],
        disallow: '/',
      },

      // 5. SEO/scraping bots: block.
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot'],
        disallow: '/',
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    // No `host` field — Google deprecated it in 2018; only Yandex still
    // honors it, and the canonical hostname is already enforced via the
    // sitemap URL above plus `alternates.canonical` on every page.
  }
}
