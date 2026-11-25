/**
 * ProfilePage JSON-LD for /about.
 *
 * Google's profile-page structured data: a page whose primary focus is one
 * person affiliated with the site (an "About Me" page qualifies). `mainEntity`
 * is the sitewide Person by `@id`, restated with the fields Google lists so the
 * node stands on its own (name required; alternateName, image, sameAs
 * recommended). No dateCreated/dateModified: the page has no tracked edit date,
 * and an invented one would misstate it.
 */
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { PERSON_ID, PERSON_SAME_AS } from './person-json-ld'

export function ProfilePageJsonLd({ nonce }: { nonce?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: canonicalUrl('/about'),
    name: 'About Richard Hudson',
    mainEntity: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Richard Hudson',
      alternateName: 'Richard W. Hudson Jr.',
      url: SITE_ORIGIN,
      image: `${SITE_ORIGIN}/images/richard.jpg`,
      sameAs: [...PERSON_SAME_AS],
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
