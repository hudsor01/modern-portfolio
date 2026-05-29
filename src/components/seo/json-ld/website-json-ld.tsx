/**
 * Website JSON-LD Schema
 * SEO structured data for the main website
 */
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { SITE_ORIGIN } from '@/lib/absolute-url'

export function WebsiteJsonLd({ nonce }: { nonce?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Richard Hudson - Senior Revenue Operations Specialist',
    description:
      'Portfolio and experience of Richard Hudson, Senior Revenue Operations Specialist with proven track record in business growth strategies.',
    url: SITE_ORIGIN,
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hudson Digital Solutions',
      url: SITE_ORIGIN,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_ORIGIN}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
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
