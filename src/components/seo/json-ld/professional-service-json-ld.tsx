// Mirrors existing JSON-LD components — `safeJsonLdStringify` is the
// project's OWASP-compliant serializer. See src/lib/json-ld-utils.ts.
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { siteConfig } from '@/lib/site'

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Richard Hudson — Revenue Operations Professional',
    image: `${siteConfig.url}/images/richard.jpg`,
    url: siteConfig.url,
    email: 'contact@richardwhudsonjr.com',
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
    serviceType: [
      'Revenue Operations',
      'Sales Operations',
      'CRM Optimization',
      'Partnership Program Development',
      'Sales Process Automation',
      'Marketing Automation',
      'Business Intelligence',
    ],
    sameAs: [
      'https://www.linkedin.com/in/hudsor01',
      'https://github.com/hudsor01',
      'https://twitter.com/hudsor01',
    ],
    provider: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: siteConfig.url,
    },
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
