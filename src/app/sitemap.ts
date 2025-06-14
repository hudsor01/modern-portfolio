import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://richardwhudsonjr.com'
  
  // Define static routes with proper priorities
  const staticRoutes = [
    { path: '', priority: 1.0 },
    { path: '/about', priority: 0.9 },
    { path: '/projects', priority: 0.9 },
    { path: '/resume', priority: 0.8 },
    { path: '/contact', priority: 0.8 },
  ]

  // Define all project routes including new ones
  const projectSlugs = [
    // Featured projects
    { slug: 'revenue-kpi', priority: 0.8 },
    { slug: 'churn-retention', priority: 0.8 },
    { slug: 'lead-attribution', priority: 0.8 },
    { slug: 'deal-funnel', priority: 0.7 },
    
    // Additional projects
    { slug: 'cac-unit-economics', priority: 0.7 },
    { slug: 'partner-performance', priority: 0.7 },
    { slug: 'revenue-operations-center', priority: 0.7 },
    { slug: 'commission-optimization', priority: 0.6 },
    { slug: 'customer-lifetime-value', priority: 0.6 },
    { slug: 'multi-channel-attribution', priority: 0.6 },
  ]

  // Create static pages with enhanced metadata
  const staticPages = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.path === '' ? 'weekly' as const : 'monthly' as const,
    priority: route.priority,
  }))

  // Create project pages with better metadata
  const projectPages = projectSlugs.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: project.priority,
  }))

  // Add additional pages
  const additionalPages = [
    {
      url: `${baseUrl}/resume/view`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ]

  // Generate alternate language versions if needed (for international SEO)
  const allPages = [...staticPages, ...projectPages, ...additionalPages]
  
  // Add image sitemap references for better image indexing
  const pagesWithImages = allPages.map(page => ({
    ...page,
    images: getImagesForPage(page.url),
  }))

  return pagesWithImages
}

// Helper function to define images for each page
function getImagesForPage(url: string): string[] {
  const baseUrl = 'https://richardwhudsonjr.com'
  
  // Define images for specific pages
  const imageMap: Record<string, string[]> = {
    [`${baseUrl}`]: [
      '/images/richard.jpg',
      '/images/projects/revenue-kpi.jpg',
    ],
    [`${baseUrl}/about`]: [
      '/images/richard.jpg',
    ],
    [`${baseUrl}/projects`]: [
      '/images/projects/revenue-kpi.jpg',
      '/images/projects/churn-retention.jpg',
      '/images/projects/deal-funnel.jpg',
      '/images/projects/lead-attribution.jpg',
    ],
    [`${baseUrl}/projects/revenue-kpi`]: [
      '/images/projects/revenue-kpi.jpg',
    ],
    [`${baseUrl}/projects/churn-retention`]: [
      '/images/projects/churn-retention.jpg',
    ],
    [`${baseUrl}/projects/deal-funnel`]: [
      '/images/projects/deal-funnel.jpg',
    ],
    [`${baseUrl}/projects/lead-attribution`]: [
      '/images/projects/lead-attribution.jpg',
    ],
  }

  return imageMap[url] || []
}