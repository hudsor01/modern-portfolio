// Mirrors existing JSON-LD components — `safeJsonLdStringify` is the
// project's OWASP-compliant serializer. See src/lib/json-ld-utils.ts.
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { PERSON_ID, PERSON_SAME_AS } from './person-json-ld'

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
  const url = canonicalUrl(`/projects/${slug}`)
  const resolvedImage = canonicalUrl(image ?? '/images/richard.jpg')

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
    // The sitewide Person by @id; the author URL is the /about ProfilePage.
    author: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Richard Hudson',
      url: `${SITE_ORIGIN}/about`,
      sameAs: [...PERSON_SAME_AS],
    },
    publisher: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Richard Hudson',
      url: SITE_ORIGIN,
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
      // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated JSON-LD escaped by safeJsonLdStringify (</script breakout prevented); Next.js official JSON-LD pattern, no user input
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  )
}
