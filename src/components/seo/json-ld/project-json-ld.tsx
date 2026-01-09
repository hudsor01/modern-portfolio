'use client'

/**
 * Project JSON-LD Schema
 * SEO structured data for project showcase pages
 *
 * Note: This component remains a Client Component because it's used in Client Component pages.
 * Nonces for JSON-LD scripts in Client Components will be handled separately if needed.
 */
export function ProjectJsonLd({
  title,
  description,
  slug,
  category = "Data Analytics",
  tags = []
}: {
  title: string
  description: string
  slug: string
  category?: string
  tags?: string[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description,
    url: `https://richardwhudsonjr.com/projects/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: 'https://richardwhudsonjr.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hudson Digital Solutions',
      url: 'https://hudsondigitalsolutions.com',
    },
    genre: category,
    keywords: tags.length > 0 ? tags.join(', ') : 'Revenue Operations, Data Analytics, Business Intelligence',
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    educationalUse: 'Professional Development',
    typicalAgeRange: '25-65',
    audience: {
      '@type': 'Audience',
      audienceType: 'Business Professionals',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
