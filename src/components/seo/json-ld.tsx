export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Richard Hudson',
    alternateName: 'Richard W. Hudson Jr.',
    jobTitle: 'Senior Revenue Operations Specialist',
    description: 'Senior Revenue Operations Specialist in Dallas-Fort Worth with proven expertise in sales automation, partnership program development, and data-driven growth strategies. SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified. $4.8M+ revenue generated, 432% transaction growth achieved.',
    url: 'https://richardwhudsonjr.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80',
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
    telephone: '+1-555-REVOPS',
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
    name: 'Richard Hudson - Senior Revenue Operations Specialist',
    description: 'Portfolio and experience of Richard Hudson, Senior Revenue Operations Specialist with proven track record in business growth strategies.',
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

export function OrganizationJsonLd() {
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

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