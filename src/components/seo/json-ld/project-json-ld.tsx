import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { siteConfig } from '@/lib/site'

export function ProjectJsonLd({
  title,
  description,
  slug,
  category = "Data Analytics",
  tags = [],
  nonce,
}: {
  title: string
  description: string
  slug: string
  category?: string
  tags?: string[]
  nonce?: string | null
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description,
    url: `${siteConfig.url}/projects/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hudson Digital Solutions',
      url: siteConfig.url,
    },
    genre: category,
    keywords: tags.length > 0 ? tags.join(', ') : 'Revenue Operations, Data Analytics, Business Intelligence',
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
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  )
}
