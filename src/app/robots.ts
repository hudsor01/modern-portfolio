import type { MetadataRoute } from 'next'

/**
 * robots.txt policy.
 *
 * Authoritative since `public/robots.txt` was deleted (avoiding the dual-file
 * footgun). Three layers:
 *
 *  1. Search-index allow-list — every major search/AI crawler that surfaces
 *     pages in human-facing results gets full access (Googlebot, Bingbot,
 *     OAI-SearchBot, Claude-SearchBot, PerplexityBot). These drive traffic.
 *
 *  2. Social-preview allow-list — Twitterbot/LinkedInBot/facebookexternalhit
 *     need /api/og.
 *
 *  3. AI training opt-out — block bots that scrape for model training but
 *     don't drive traffic (GPTBot, ClaudeBot, Google-Extended,
 *     Applebot-Extended, CCBot, Bytespider). Blocking these has zero ranking
 *     impact and prevents Richard's writing from being ingested as training
 *     data without attribution.
 *
 *  4. SEO scrapers — block (no value, just bandwidth cost).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Search/AI search crawlers: full access.
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
        allow: '/',
      },

      // 2. Social previews: need /api/og for OG image fetches.
      {
        userAgent: ['Twitterbot', 'LinkedInBot', 'facebookexternalhit'],
        allow: ['/', '/api/og'],
        disallow: [],
      },

      // 3. Default: allow public pages, block /api and internals (with /api/og
      //    explicitly allowed for any other crawler).
      {
        userAgent: '*',
        allow: ['/', '/api/og', '/api/blog/rss'],
        disallow: ['/api/', '/_next/', '/admin/'],
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
    sitemap: 'https://richardwhudsonjr.com/sitemap.xml',
    // No `host` field — Google deprecated it in 2018; only Yandex still
    // honors it, and the canonical hostname is already enforced via the
    // sitemap URL above plus `alternates.canonical` on every page.
  }
}
