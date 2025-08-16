import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: '/',
      },
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'Bytespider', 'PetalBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://richardwhudsonjr.com/sitemap.xml',
    host: 'https://richardwhudsonjr.com',
  }
}