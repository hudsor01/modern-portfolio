'use client'

/**
 * Local Business JSON-LD Schema
 * SEO structured data for local business presence in Dallas-Fort Worth
 */
export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Richard Hudson - Senior Revenue Operations Specialist',
    alternateName: 'Senior Revenue Operations Professional',
    description: 'Senior Revenue Operations Specialist in Dallas-Fort Worth metroplex. Specializing in sales automation, CRM optimization, partnership program development, and data-driven growth strategies. Certified SalesLoft Admin and HubSpot RevOps professional.',
    url: 'https://richardwhudsonjr.com',
    telephone: '+1-555-REVOPS',
    email: 'contact@richardwhudsonjr.com',
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
      {
        '@type': 'City',
        name: 'Richardson',
        sameAs: 'https://en.wikipedia.org/wiki/Richardson,_Texas',
      },
      {
        '@type': 'City',
        name: 'McKinney',
        sameAs: 'https://en.wikipedia.org/wiki/McKinney,_Texas',
      },
      {
        '@type': 'City',
        name: 'Allen',
        sameAs: 'https://en.wikipedia.org/wiki/Allen,_Texas',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Dallas-Fort Worth Metroplex',
        sameAs: 'https://en.wikipedia.org/wiki/Dallas%E2%80%93Fort_Worth_metroplex',
      },
    ],
    serviceType: [
      'Revenue Operations Consulting',
      'Sales Operations Optimization',
      'CRM Implementation and Configuration',
      'Marketing Automation Setup',
      'Business Intelligence Dashboard Development',
      'Data Analytics and Reporting',
      'Partnership Program Development',
      'Sales Process Automation',
      'Revenue Forecasting',
      'Lead Attribution Analysis',
      'Customer Lifecycle Management',
      'Commission Structure Optimization',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Revenue Operations Services Dallas-Fort Worth',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Revenue Operations Consulting Dallas',
            description: 'Comprehensive RevOps strategy and implementation for Dallas businesses.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sales Automation Fort Worth',
            description: 'Sales process automation and CRM optimization for Fort Worth companies.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Partnership Program Development DFW',
            description: 'End-to-end partnership program setup and optimization for DFW businesses.',
          },
        },
      ],
    },
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Check, Credit Card, Invoice',
    openingHours: 'Mo-Fr 09:00-18:00',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '15',
      bestRating: '5',
      worstRating: '1',
    },
    founder: {
      '@type': 'Person',
      name: 'Richard Hudson',
      jobTitle: 'Senior Revenue Operations Specialist',
      worksFor: {
        '@type': 'Organization',
        name: 'Hudson Digital Solutions',
      },
    },
    keywords: [
      'Revenue Operations Consultant Dallas',
      'RevOps Expert Fort Worth',
      'Sales Automation Specialist Texas',
      'Partnership Program Developer DFW',
      'CRM Consultant Plano',
      'Business Intelligence Dallas',
      'Marketing Automation Fort Worth',
      'Sales Process Optimization Texas',
    ],
    knowsAbout: [
      'Revenue Operations',
      'Sales Operations',
      'Marketing Automation',
      'CRM Implementation',
      'Data Analytics',
      'Business Intelligence',
      'Partnership Programs',
      'Sales Process Optimization',
      'Commission Management',
      'Lead Attribution',
      'Customer Lifecycle Management',
      'Revenue Forecasting',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
