'use client'

/**
 * Service JSON-LD Schema
 * SEO structured data for revenue operations services
 */
export function ServiceJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Revenue Operations Leadership',
    provider: {
      '@type': 'Person',
      name: 'Richard Hudson',
    },
    description: 'Senior Revenue Operations Specialist with proven track record in strategic sales optimization, marketing automation, and business intelligence solutions.',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Revenue Operations Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sales Operations Optimization',
            description: 'Streamline sales processes, implement CRM solutions, and improve conversion rates.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Marketing Automation',
            description: 'Implement and optimize marketing automation platforms for improved ROI.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Intelligence & Analytics',
            description: 'Build custom dashboards and reporting systems for data-driven decision making.',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
