import type { MetadataRoute } from 'next'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('Sitemap')

// Revalidate sitemap every hour to include new blog posts from n8n automation
export const revalidate = 3600

// Captured at module load (i.e. deploy time / process start), NOT per
// request. If we used `new Date()` inside the handler, every hourly
// revalidation would mark every static page as "freshly modified" — Google
// downweights sitemaps that lie about lastmod (Mueller, 2025). This pins
// static-page lastmod to the deploy commit's author date when available
// (Vercel-injected env var), falling back to process start.
const STATIC_LAST_MODIFIED = process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE || new Date().toISOString()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://richardwhudsonjr.com'
  // fallback only for blog posts with null timestamps
  const fallbackDate = STATIC_LAST_MODIFIED
  const staticLastModified = STATIC_LAST_MODIFIED

  // Main navigation pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: staticLastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // All project pages (complete list)
  const projectPages: MetadataRoute.Sitemap = [
    'revenue-kpi',
    'revenue-operations-center',
    'commission-optimization',
    'multi-channel-attribution',
    'partnership-program-implementation',
    'customer-lifetime-value',
    'partner-performance',
    'deal-funnel',
    'churn-retention',
    'lead-attribution',
    'cac-unit-economics',
    'forecast-pipeline-intelligence',
    'quota-territory-management',
    'sales-enablement',
  ].map((project) => ({
    url: `${baseUrl}/projects/${project}`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // During build, skip DB — blog posts are added on first ISR revalidation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [...mainPages, ...projectPages]
  }

  // Dynamic blog posts from database
  let blogPages: MetadataRoute.Sitemap
  try {
    const { db } = await import('@/lib/db')
    const posts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    })

    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified:
        post.updatedAt?.toISOString() || post.publishedAt?.toISOString() || fallbackDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    // Sitemap degrades gracefully to static pages — surface as warn so we
    // notice the regression without paging anyone.
    logger.warn('Sitemap blog query failed; returning static pages only', {
      error: error instanceof Error ? error.message : String(error),
    })
    blogPages = []
  }

  return [...mainPages, ...projectPages, ...blogPages]
}
