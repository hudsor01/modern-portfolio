import { headers } from 'next/headers'

/**
 * Organization JSON-LD Schema
 * SEO structured data for Hudson Digital Solutions
 */
export async function OrganizationJsonLd() {
  const nonce = (await headers()).get('x-nonce')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hudson Digital Solutions',
    alternateName: 'Richard Hudson Senior Revenue Operations Specialist',
    description: 'Professional portfolio of Richard Hudson, Senior Revenue Operations Specialist serving Dallas-Fort Worth metroplex. Specializing in sales automation, strategic partnership program development, and data-driven growth strategies.',
    url: 'https://richardwhudsonjr.com',
    logo: 'https://richardwhudsonjr.com/images/logo.png',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face&q=80',
    email: 'contact@richardwhudsonjr.com',
    telephone: '+1-555-REVOPS',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plano Business District',
      addressLocality: 'Plano',
      addressRegion: 'TX',
      postalCode: '75023',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.0198,
      longitude: -96.6989,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Dallas',
        sameAs: 'https://en.wikipedia.org/wiki/Dallas',
      },
      {
        '@type': 'City',
        name: 'Fort Worth',
        sameAs: 'https://en.wikipedia.org/wiki/Fort_Worth,_Texas',
      },
      {
        '@type': 'City',
        name: 'Plano',
        sameAs: 'https://en.wikipedia.org/wiki/Plano,_Texas',
      },
      {
        '@type': 'City',
        name: 'Frisco',
        sameAs: 'https://en.wikipedia.org/wiki/Frisco,_Texas',
      },
    ],
    founder: {
      '@type': 'Person',
      name: 'Richard Hudson',
      jobTitle: 'Senior Revenue Operations Specialist',
    },
    foundingDate: '2014',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 1,
    },
    sameAs: [
      'https://www.linkedin.com/in/hudsor01',
      'https://github.com/hudsor01',
    ],
    serviceType: [
      'Revenue Operations Leadership',
      'Strategic Sales Automation',
      'Partnership Program Development',
      'CRM Implementation',
      'Strategic Business Intelligence',
      'Data Analytics',
    ],
    award: [
      '$4.8M+ Revenue Impact in Professional Roles',
      '432% Transaction Growth Achieved',
      'SalesLoft Admin Certified (Level 1 & 2)',
      'HubSpot Revenue Operations Certified',
    ],
  }

  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
