export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Richard Hudson',
    jobTitle: 'Revenue Operations Consultant',
    description: 'Expert Revenue Operations Consultant specializing in sales optimization, marketing automation, and data-driven business growth strategies.',
    url: 'https://richardwhudsonjr.com',
    image: 'https://richardwhudsonjr.com/images/richard.jpg',
    sameAs: [
      'https://www.linkedin.com/in/hudsor01',
      'https://github.com/hudsor01',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    email: 'contact@richardwhudsonjr.com',
    knowsAbout: [
      'Revenue Operations',
      'Sales Operations',
      'Marketing Automation',
      'Business Intelligence',
      'Data Analytics',
      'CRM Optimization',
      'Salesforce',
      'HubSpot',
      'Process Automation',
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

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Richard Hudson - Revenue Operations Consultant',
    description: 'Portfolio and services of Richard Hudson, Revenue Operations Consultant specializing in business growth strategies.',
    url: 'https://richardwhudsonjr.com',
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hudson Digital Solutions',
      url: 'https://hudsondigitalsolutions.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function ServiceJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Revenue Operations Consulting',
    provider: {
      '@type': 'Person',
      name: 'Richard Hudson',
    },
    description: 'Professional revenue operations consulting services including sales optimization, marketing automation, and business intelligence solutions.',
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

export function ProjectJsonLd({ 
  title, 
  description, 
  slug,
  category = "Data Analytics",
  tags = []
}: {
  title: string
  description: string
  slug: string
  category?: string
  tags?: string[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description,
    url: `https://richardwhudsonjr.com/projects/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: 'https://richardwhudsonjr.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hudson Digital Solutions',
      url: 'https://hudsondigitalsolutions.com',
    },
    genre: category,
    keywords: tags.length > 0 ? tags.join(', ') : 'Revenue Operations, Data Analytics, Business Intelligence',
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    educationalUse: 'Professional Development',
    typicalAgeRange: '25-65',
    audience: {
      '@type': 'Audience',
      audienceType: 'Business Professionals',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function FAQJsonLd({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Richard Hudson - Revenue Operations Consulting',
    description: 'Professional Revenue Operations consulting services specializing in sales optimization, CRM implementation, and business intelligence solutions.',
    url: 'https://richardwhudsonjr.com',
    telephone: '+1-555-0123',
    email: 'contact@richardwhudsonjr.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.7767,
      longitude: -96.7970,
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Dallas',
      },
      {
        '@type': 'City', 
        name: 'Fort Worth',
      },
      {
        '@type': 'City',
        name: 'Plano',
      },
      {
        '@type': 'City',
        name: 'Frisco',
      },
    ],
    serviceType: [
      'Revenue Operations Consulting',
      'Sales Operations Optimization',
      'CRM Implementation',
      'Marketing Automation',
      'Business Intelligence',
      'Data Analytics',
    ],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '15',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}