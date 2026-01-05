import fs from 'fs';
import path from 'path';

const baseUrl = process.env.SITE_URL || 'https://richardwhudsonjr.com';
const today = new Date().toISOString().split('T')[0];

// Define all routes with their metadata
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/resume', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.9', changefreq: 'monthly' },
  // Location pages for local SEO
  { path: '/locations', priority: '0.9', changefreq: 'monthly' },
  { path: '/locations/dallas', priority: '0.85', changefreq: 'monthly' },
  { path: '/locations/fort-worth', priority: '0.85', changefreq: 'monthly' },
  { path: '/locations/plano', priority: '0.85', changefreq: 'monthly' },
  { path: '/locations/frisco', priority: '0.85', changefreq: 'monthly' },
  // Project pages
  { path: '/projects/partnership-program-implementation', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects/revenue-kpi', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects/revenue-operations-center', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects/commission-optimization', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects/multi-channel-attribution', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects/customer-lifetime-value', priority: '0.75', changefreq: 'monthly' },
  { path: '/projects/partner-performance', priority: '0.75', changefreq: 'monthly' },
  { path: '/projects/deal-funnel', priority: '0.75', changefreq: 'monthly' },
  { path: '/projects/churn-retention', priority: '0.75', changefreq: 'monthly' },
  { path: '/projects/lead-attribution', priority: '0.75', changefreq: 'monthly' },
  { path: '/projects/cac-unit-economics', priority: '0.75', changefreq: 'monthly' }
];

// Define blog post routes
const blogPosts = [
  { 
    slug: 'revenue-operations-best-practices-complete-guide',
    publishedAt: '2024-01-15',
    priority: '0.8'
  },
  { 
    slug: 'building-effective-sales-dashboards-real-time-data',
    publishedAt: '2024-01-20',
    priority: '0.8'
  },
  { 
    slug: 'advanced-customer-churn-analysis-techniques',
    publishedAt: '2024-02-05',
    priority: '0.7'
  },
  { 
    slug: 'automating-revenue-reporting-modern-tools',
    publishedAt: '2024-02-12',
    priority: '0.7'
  },
  { 
    slug: 'kpi-design-principles-revenue-operations',
    publishedAt: '2024-02-18',
    priority: '0.7'
  }
];

// Add blog posts to routes
blogPosts.forEach(post => {
  routes.push({
    path: `/blog/${post.slug}`,
    priority: post.priority,
    changefreq: 'monthly',
    lastmod: post.publishedAt
  });
});

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Write sitemap to public directory
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Sitemap generated successfully at ${sitemapPath}`);
console.log(`Last modified: ${today}`);
console.log(`${routes.length} URLs included`);