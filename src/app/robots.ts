import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Social crawlers need /api/og access for OG image previews
      {
        userAgent: ['Twitterbot', 'LinkedInBot', 'facebookexternalhit'],
        allow: ['/api/og', '/'],
        disallow: [],
      },
      // Good bots: full access
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: '/',
      },
      // Default: allow public pages, block api and internals
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      // SEO scrapers: block entirely
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'Bytespider', 'PetalBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://richardwhudsonjr.com/sitemap.xml',
    host: 'https://richardwhudsonjr.com',
  }
}
