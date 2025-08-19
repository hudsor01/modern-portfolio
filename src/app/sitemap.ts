import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://richardwhudsonjr.com'
  const currentDate = new Date().toISOString()
  
  // Main navigation pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]
  
  // Location-based SEO metadata (important for local search visibility)
  // These help with "Revenue Operations Dallas", "RevOps Fort Worth", etc. searches
  const locationPages = [
    'locations',
    'locations/dallas',
    'locations/fort-worth',
    'locations/plano',
    'locations/frisco',
  ].map(location => ({
    url: `${baseUrl}/${location}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: location === 'locations' ? 0.9 : 0.85,
  }))
  
  // Project dashboard pages
  const projectPages = [
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
  ].map(project => ({
    url: `${baseUrl}/projects/${project}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))
  
  // Blog posts
  const blogPosts = [
    {
      url: `${baseUrl}/blog/revenue-operations-best-practices-complete-guide`,
      lastModified: '2024-01-15',
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/building-effective-sales-dashboards-real-time-data`,
      lastModified: '2024-01-20',
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
  ]
  
  return [...mainPages, ...locationPages, ...projectPages, ...blogPosts]
}