// Mirrors existing JSON-LD components — `safeJsonLdStringify` is the
// project's OWASP-compliant serializer. See src/lib/json-ld-utils.ts.
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { SITE_ORIGIN } from '@/lib/absolute-url'

/**
 * ProfessionalService JSON-LD — Dallas-targeted local SEO signal.
 *
 * Schema.org `ProfessionalService` is the appropriate subtype for a solo
 * RevOps consultant: more specific than `LocalBusiness`, less misleading
 * than `Organization`. `areaServed` enumerates the DFW cities Richard works
 * in, which is what unlocks local-pack eligibility for queries like
 * "revenue operations consultant Dallas".
 */
export function ProfessionalServiceJsonLd({ nonce }: { nonce?: string | null }) {
  // Extracted so each Service.provider in makesOffer references the same
  // object literal — the serializer will emit it inline 7 times either way,
  // but the source-side dedupe keeps the JSON-LD definition readable.
  const serviceProvider = {
    '@type': 'Person',
    name: 'Richard Hudson',
    url: SITE_ORIGIN,
  } as const

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Richard Hudson — Revenue Operations Professional',
    image: `${SITE_ORIGIN}/images/richard.jpg`,
    url: SITE_ORIGIN,
    email: 'hudsor01@icloud.com',
    telephone: '+1-214-566-0279',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    areaServed: [
      { '@type': 'City', name: 'Dallas' },
      { '@type': 'City', name: 'Fort Worth' },
      { '@type': 'City', name: 'Frisco' },
      { '@type': 'AdministrativeArea', name: 'Dallas-Fort Worth Metroplex' },
    ],
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
    sameAs: [
      'https://www.linkedin.com/in/hudsor01',
      'https://github.com/hudsor01',
      'https://twitter.com/hudsor01',
    ],
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
