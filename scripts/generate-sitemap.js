import fs from 'fs';
import path from 'path';

const baseUrl = process.env.SITE_URL || 'https://richardwhudsonjr.com';
const today = new Date().toISOString().split('T')[0];

// Define all routes with their metadata
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/resume', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects/partnership-program-implementation', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/revenue-kpi', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/deal-funnel', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/churn-retention', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/lead-attribution', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/cac-unit-economics', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/partner-performance', priority: '0.7', changefreq: 'monthly' }
];

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write sitemap to public directory
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
console.log(`📅 Last modified: ${today}`);
console.log(`🔗 ${routes.length} URLs included`);