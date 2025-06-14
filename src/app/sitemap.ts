import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://richardwhudsonjr.com'
  
  // Define static routes
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/resume',
    '/contact',
  ]

  // Define project routes
  const projectSlugs = [
    'churn-retention',
    'deal-funnel', 
    'lead-attribution',
    'revenue-kpi'
  ]

  // Create static pages
  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Create project pages
  const projectPages = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Add resume view page
  const additionalPages = [
    {
      url: `${baseUrl}/resume/view`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ]

  return [...staticPages, ...projectPages, ...additionalPages]
}