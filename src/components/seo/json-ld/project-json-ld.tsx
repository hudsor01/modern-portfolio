import { headers } from 'next/headers'

/**
 * Project JSON-LD Schema
 * SEO structured data for project showcase pages
 */
export async function ProjectJsonLd({
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
  const nonce = (await headers()).get('x-nonce')
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
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
