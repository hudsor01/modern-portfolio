// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { safeJsonLdStringify } from '@/lib/json-ld-utils'

/**
 * Build the Person JSON-LD object matching person-json-ld.tsx.
 * Extracted here so we can test the schema data directly without
 * rendering React server components.
 */
function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Richard Hudson',
    alternateName: 'Richard W. Hudson Jr.',
    jobTitle: 'Senior Revenue Operations Specialist',
    description:
      'Senior Revenue Operations Specialist in Dallas-Fort Worth with proven expertise in sales automation, partnership program development, and data-driven growth strategies. SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified. $4.8M+ revenue generated, 432% transaction growth achieved.',
    url: 'https://richardwhudsonjr.com',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80',
    sameAs: [
      'https://www.linkedin.com/in/hudsor01',
      'https://github.com/hudsor01',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plano Business District',
      addressLocality: 'Plano',
      addressRegion: 'TX',
      postalCode: '75023',
      addressCountry: 'US',
    },
    email: 'contact@richardwhudsonjr.com',
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
    worksFor: {
      '@type': 'Organization',
      name: 'Hudson Digital Solutions',
      url: 'https://richardwhudsonjr.com',
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'SalesLoft Admin Certification Level 1',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'SalesLoft',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'SalesLoft Admin Certification Level 2',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'SalesLoft',
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
      'SalesLoft Configuration',
      'Process Automation',
      'Business Intelligence Dashboards',
      'Data Visualization',
      'Sales Analytics',
      'Marketing Attribution',
    ],
    award: [
      '$4.8M+ Revenue Generated',
      '432% Transaction Growth Achieved',
      '2,217% Network Expansion',
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
}

describe('PersonJsonLd schema', () => {
  const personData = buildPersonJsonLd()
  const stringified = safeJsonLdStringify(personData)

  it('contains the real phone number +1-214-566-0279', () => {
    expect(stringified).toContain('"telephone":"+1-214-566-0279"')
  })

  it('contains correct @type Person and @context schema.org', () => {
    expect(stringified).toContain('"@type":"Person"')
    expect(stringified).toContain('"@context":"https://schema.org"')
  })

  it('contains all three awards', () => {
    expect(stringified).toContain('$4.8M+ Revenue Generated')
    expect(stringified).toContain('432% Transaction Growth Achieved')
    expect(stringified).toContain('2,217% Network Expansion')
  })

  it('contains all three credentials', () => {
    expect(stringified).toContain('SalesLoft Admin Certification Level 1')
    expect(stringified).toContain('SalesLoft Admin Certification Level 2')
    expect(stringified).toContain('HubSpot Revenue Operations Certification')
  })

  it('does NOT contain the placeholder phone number +1-555-REVOPS', () => {
    expect(stringified).not.toContain('+1-555-REVOPS')
  })

  it('safeJsonLdStringify escapes </script> sequences', () => {
    const malicious = { '@context': 'https://schema.org', name: '</script><script>alert(1)</script>' }
    const result = safeJsonLdStringify(malicious)
    expect(result).not.toContain('</script>')
    expect(result).toContain('<\\/script>')
  })
})
