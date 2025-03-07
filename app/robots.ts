import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/dashboard/*'], // Add paths you don't want crawled
    },
    sitemap: 'https://yourdomain.com/sitemap.xml', // Update with your actual domain
  };
}
