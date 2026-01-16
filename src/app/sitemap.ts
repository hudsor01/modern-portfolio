import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://richardwhudsonjr.com'
  const currentDate = new Date().toISOString()

  // Main navigation pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
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
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dynamic blog posts from database
  let blogPages: MetadataRoute.Sitemap = []
  try {
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
      lastModified: post.updatedAt?.toISOString() || post.publishedAt?.toISOString() || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // Database not available during build - return empty blog pages
    blogPages = []
  }

  return [...mainPages, ...projectPages, ...blogPages]
}