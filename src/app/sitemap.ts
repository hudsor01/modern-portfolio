import { MetadataRoute } from 'next'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('Sitemap')

// Revalidate sitemap every hour to include new blog posts from n8n automation
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://richardwhudsonjr.com'
  // fallback only for blog posts with null timestamps
  const fallbackDate = new Date().toISOString()

  // Main navigation pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: '2026-04-09T22:27:05.000Z',
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2026-04-09T17:18:26.000Z',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: '2026-04-09T17:18:26.000Z',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2026-04-09T17:18:26.000Z',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: '2026-04-09T17:18:26.000Z',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: '2026-04-09T22:27:05.000Z',
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
  ].map(project => ({
    url: `${baseUrl}/projects/${project}`,
    lastModified: '2026-04-09T22:31:02.000Z',
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

    blogPages = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt?.toISOString() || post.publishedAt?.toISOString() || fallbackDate,
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
