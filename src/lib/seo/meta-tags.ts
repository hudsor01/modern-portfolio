import { siteConfig } from '../config/site'

interface MetaConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
  publishedAt?: string
  modifiedAt?: string
  author?: string
  section?: string
  canonical?: string
}

export function generateMetaTags(config: MetaConfig) {
  const tags = {
    // Basic Meta Tags
    title: `${config.title} | ${siteConfig.name}`,
    description: config.description,
    keywords: config.keywords?.join(', ') || '',

    // Open Graph
    'og:title': config.title,
    'og:description': config.description,
    'og:type': config.type || 'website',
    'og:image': config.image || siteConfig.ogImage,
    'og:url': siteConfig.url,
    'og:site_name': siteConfig.name,

    // Article Specific
    ...(config.type === 'article' && {
      'article:published_time': config.publishedAt,
      'article:modified_time': config.modifiedAt,
      'article:author': config.author || siteConfig.author?.name,
      'article:section': config.section,
    }),
  }

  return tags
}

export function generateStructuredData(config: MetaConfig) {
  if (config.type === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.title,
      description: config.description,
      image: config.image || siteConfig.ogImage,
      datePublished: config.publishedAt,
      dateModified: config.modifiedAt,
      author: {
        '@type': 'Person',
        name: config.author || siteConfig.author.name,
        url: siteConfig.url,
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&q=80',
        },
      },
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      name: siteConfig.author?.name,
      url: siteConfig.url,
    },
    sameAs: [siteConfig.links.github],
  }
}
