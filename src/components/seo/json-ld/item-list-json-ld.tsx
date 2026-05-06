// Mirrors existing JSON-LD components — `safeJsonLdStringify` is the
// project's OWASP-compliant serializer (escapes </ sequences). See
// src/lib/json-ld-utils.ts. Same pattern used in person-json-ld,
// breadcrumb-json-ld, etc.
import { safeJsonLdStringify } from '@/lib/json-ld-utils'

/**
 * ItemList JSON-LD — surfaces a curated list of pages (blog posts, projects)
 * to Google + AI search engines. Improves index coverage and AI Overview
 * citation rate for index pages.
 */
export function ItemListJsonLd({
  items,
  name,
  description,
  nonce,
}: {
  items: Array<{ name: string; url: string }>
  name: string
  description?: string
  nonce?: string | null
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description && { description }),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }

  const html = safeJsonLdStringify(jsonLd)

  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
