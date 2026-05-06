// Mirrors existing JSON-LD components — `safeJsonLdStringify` is the
// project's OWASP-compliant serializer. See src/lib/json-ld-utils.ts.
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { siteConfig } from '@/lib/site'

/**
 * Article JSON-LD for project case-study pages.
 *
 * Uses `@type: 'Article'` (was `CreativeWork`) for richer SERP eligibility.
 * Article rich results require headline + image + datePublished + author +
 * dateModified — the first three are always present, dates are optional and
 * caller-supplied so we don't fake them (per Mueller's lastmod guidance).
 */
export function ProjectJsonLd({
  title,
  description,
  slug,
  category = 'Data Analytics',
  tags = [],
  image,
  datePublished,
  dateModified,
  nonce,
}: {
  title: string
  description: string
  slug: string
  category?: string
  tags?: string[]
  image?: string
  datePublished?: string
  dateModified?: string
  nonce?: string | null
}) {
  const url = `${siteConfig.url}/projects/${slug}`
  const resolvedImage = image
    ? image.startsWith('http')
      ? image
      : `${siteConfig.url}${image}`
    : `${siteConfig.url}/images/richard.jpg`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    name: title,
    description,
    url,
    image: resolvedImage,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: siteConfig.url,
      sameAs: [
        'https://www.linkedin.com/in/hudsor01',
        'https://github.com/hudsor01',
        'https://twitter.com/hudsor01',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: siteConfig.url,
    },
    articleSection: category,
    keywords:
      tags.length > 0
        ? tags.join(', ')
        : 'Revenue Operations, Data Analytics, Business Intelligence',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
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
