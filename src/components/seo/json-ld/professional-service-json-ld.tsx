// Mirrors existing JSON-LD components — `safeJsonLdStringify` is the
// project's OWASP-compliant serializer. See src/lib/json-ld-utils.ts.
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { CONTACT, SERVICE_AREA_PLACES } from '@/lib/contact-info'
import { PERSON_ID, PERSON_SAME_AS } from './person-json-ld'

/**
 * ProfessionalService JSON-LD — local SEO signal for the home metro.
 *
 * Schema.org `ProfessionalService` is the appropriate subtype for a solo
 * RevOps consultant: more specific than `LocalBusiness`, less misleading
 * than `Organization`. `areaServed` enumerates the cities and metro region
 * Richard works in (SERVICE_AREA_PLACES, the same list /contact names), which
 * is what unlocks local-pack eligibility for "revenue operations consultant
 * <city>" queries.
 */
export function ProfessionalServiceJsonLd({ nonce }: { nonce?: string | null }) {
  // Extracted so each Service.provider in makesOffer references the same
  // object literal — the serializer will emit it inline 7 times either way,
  // but the source-side dedupe keeps the JSON-LD definition readable.
  const serviceProvider = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Richard Hudson',
    url: SITE_ORIGIN,
  } as const

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Richard Hudson — Revenue Operations Professional',
    image: `${SITE_ORIGIN}/images/richard.jpg`,
    url: SITE_ORIGIN,
    email: CONTACT.email,
    telephone: CONTACT.phone.international,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.location.city,
      addressRegion: CONTACT.location.region,
      addressCountry: CONTACT.location.country,
    },
    areaServed: SERVICE_AREA_PLACES.map((place) => ({ ...place })),
    // serviceType is invalid on ProfessionalService (inherits LocalBusiness,
    // not Service). Express services via makesOffer → Offer → itemOffered →
    // Service, with provider attached to each Service (where it's valid).
    // Verified 0-warning at validator.schema.org.
    makesOffer: [
      'Revenue Operations',
      'Sales Operations',
      'CRM Optimization',
      'Partnership Program Development',
      'Sales Process Automation',
      'Marketing Automation',
      'Business Intelligence',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name,
        serviceType: name,
        provider: serviceProvider,
      },
    })),
    sameAs: [...PERSON_SAME_AS],
  }

  const html = safeJsonLdStringify(jsonLd)

  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated JSON-LD escaped by safeJsonLdStringify (</script breakout prevented); Next.js official JSON-LD pattern, no user input
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
