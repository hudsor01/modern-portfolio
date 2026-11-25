/**
 * Person JSON-LD Schema
 * SEO structured data for Richard Hudson's personal profile
 */
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { STAT_LABELS, STAT_VALUES } from '@/lib/stats'

/** Stable node id, so other JSON-LD (ProfilePage on /about) can reference this Person. */
export const PERSON_ID = `${SITE_ORIGIN}/#person`

/** Current role and employer (matches the résumé), shared by every Person node. */
export const PERSON_JOB_TITLE = 'Data Analyst'
export const PERSON_EMPLOYER = {
  '@type': 'Organization',
  name: 'HomeVestors of America, Inc.',
  url: 'https://www.homevestors.com',
} as const

/** External profiles, shared with the /about ProfilePage. */
export const PERSON_SAME_AS = [
  'https://www.linkedin.com/in/hudsor01',
  'https://github.com/hudsor01',
  'https://twitter.com/hudsor01',
] as const

export function PersonJsonLd({ nonce }: { nonce?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Richard Hudson',
    alternateName: 'Richard W. Hudson Jr.',
    jobTitle: PERSON_JOB_TITLE,
    description: `Data Analyst at HomeVestors of America in Dallas-Fort Worth, with a background in revenue operations, sales automation and partnership program development. Salesloft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified. ${STAT_VALUES.revenue} revenue impact, ${STAT_VALUES['transaction-growth']} transaction growth.`,
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/images/richard.jpg`,
    sameAs: [...PERSON_SAME_AS],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    email: 'hudsor01@icloud.com',
    telephone: '+1-214-566-0279',
    workLocation: {
      '@type': 'Place',
      name: 'Dallas-Fort Worth Metroplex',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dallas-Fort Worth',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
    },
    worksFor: { ...PERSON_EMPLOYER },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Salesloft Admin Certification Level 1',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Salesloft',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Salesloft Admin Certification Level 2',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Salesloft',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'HubSpot Revenue Operations Certification',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'HubSpot Academy',
        },
      },
    ],
    knowsAbout: [
      'Revenue Operations',
      'Sales Operations',
      'Marketing Automation',
      'Business Intelligence',
      'Data Analytics',
      'CRM Optimization',
      'Partnership Program Development',
      'Sales Process Automation',
      'Commission Management',
      'Lead Attribution Analysis',
      'Customer Lifecycle Management',
      'Revenue Forecasting',
      'Salesforce Administration',
      'HubSpot Implementation',
      'Salesloft Configuration',
      'Process Automation',
      'Business Intelligence Dashboards',
      'Data Visualization',
      'Sales Analytics',
      'Marketing Attribution',
    ],
    award: (['revenue', 'transaction-growth', 'network-growth'] as const).map(
      (key) => `${STAT_VALUES[key]} ${STAT_LABELS[key]}`
    ),
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'The University of Texas at Dallas',
        url: 'https://www.utdallas.edu',
      },
    ],
    memberOf: [
      {
        '@type': 'ProfessionalService',
        name: 'Revenue Operations Community',
      },
      {
        '@type': 'ProfessionalService',
        name: 'Sales Operations Society',
      },
    ],
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
