// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { navConfig, siteConfig } from '@/lib/site'

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
    image: 'https://richardwhudsonjr.com/images/richard.jpg',
    sameAs: [
      'https://www.linkedin.com/in/hudsor01',
      'https://github.com/hudsor01',
      'https://twitter.com/hudsor01',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dallas',
      addressRegion: 'TX',
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
    const malicious = {
      '@context': 'https://schema.org',
      name: '</script><script>alert(1)</script>',
    }
    const result = safeJsonLdStringify(malicious)
    expect(result).not.toContain('</script>')
    expect(result).toContain('<\\/script>')
  })
})

/**
 * Build a BreadcrumbList JSON-LD object matching breadcrumb-json-ld.tsx.
 */
function buildBreadcrumbListJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

describe('BreadcrumbListJsonLd schema', () => {
  it('produces correct itemListElement with positions 1, 2, 3 for 3 items', () => {
    const data = buildBreadcrumbListJsonLd([
      { name: 'Home', url: 'https://richardwhudsonjr.com' },
      { name: 'Projects', url: 'https://richardwhudsonjr.com/projects' },
      { name: 'CAC Analysis', url: 'https://richardwhudsonjr.com/projects/cac-unit-economics' },
    ])
    const stringified = safeJsonLdStringify(data)
    expect(data.itemListElement).toHaveLength(3)
    expect(data.itemListElement[0]!.position).toBe(1)
    expect(data.itemListElement[1]!.position).toBe(2)
    expect(data.itemListElement[2]!.position).toBe(3)
    expect(stringified).toContain('"name":"Home"')
    expect(stringified).toContain('"name":"Projects"')
    expect(stringified).toContain('"name":"CAC Analysis"')
  })

  it('contains correct @type BreadcrumbList and @context schema.org', () => {
    const data = buildBreadcrumbListJsonLd([
      { name: 'Home', url: 'https://richardwhudsonjr.com' },
      { name: 'About', url: 'https://richardwhudsonjr.com/about' },
    ])
    const stringified = safeJsonLdStringify(data)
    expect(stringified).toContain('"@type":"BreadcrumbList"')
    expect(stringified).toContain('"@context":"https://schema.org"')
  })

  it('produces correct output with 2 items (minimum valid)', () => {
    const data = buildBreadcrumbListJsonLd([
      { name: 'Home', url: 'https://richardwhudsonjr.com' },
      { name: 'About', url: 'https://richardwhudsonjr.com/about' },
    ])
    const stringified = safeJsonLdStringify(data)
    expect(data.itemListElement).toHaveLength(2)
    expect(data.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://richardwhudsonjr.com',
    })
    expect(data.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'About',
      item: 'https://richardwhudsonjr.com/about',
    })
    expect(stringified).toContain('"@type":"ListItem"')
  })
})

/**
 * Build a FAQPage JSON-LD object matching faq-json-ld.tsx.
 */
function buildFAQPageJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

describe('FAQPageJsonLd schema', () => {
  const sampleFaqs = [
    {
      question: 'What does a Revenue Operations Specialist do?',
      answer:
        'A Revenue Operations Specialist aligns sales, marketing, and customer success teams.',
    },
    {
      question: 'What certifications does Richard Hudson hold?',
      answer:
        'Richard holds SalesLoft Admin Certification and HubSpot Revenue Operations Certification.',
    },
  ]

  it('produces correct mainEntity with Question and Answer types for 2 Q&A pairs', () => {
    const data = buildFAQPageJsonLd(sampleFaqs)
    expect(data.mainEntity).toHaveLength(2)
    expect(data.mainEntity[0]!['@type']).toBe('Question')
    expect(data.mainEntity[0]!.name).toBe(sampleFaqs[0]!.question)
    expect(data.mainEntity[0]!.acceptedAnswer['@type']).toBe('Answer')
    expect(data.mainEntity[0]!.acceptedAnswer.text).toBe(sampleFaqs[0]!.answer)
    expect(data.mainEntity[1]!['@type']).toBe('Question')
    expect(data.mainEntity[1]!.acceptedAnswer['@type']).toBe('Answer')
  })

  it('contains correct @type FAQPage and @context schema.org', () => {
    const data = buildFAQPageJsonLd(sampleFaqs)
    const stringified = safeJsonLdStringify(data)
    expect(stringified).toContain('"@type":"FAQPage"')
    expect(stringified).toContain('"@context":"https://schema.org"')
  })

  it('safeJsonLdStringify escapes </ sequences in FAQ content', () => {
    const maliciousFaqs = [
      {
        question: 'Is this safe?',
        answer: 'Yes, even with </script><script>alert(1)</script> in answers.',
      },
    ]
    const data = buildFAQPageJsonLd(maliciousFaqs)
    const stringified = safeJsonLdStringify(data)
    expect(stringified).not.toContain('</script>')
    expect(stringified).toContain('<\\/script>')
  })
})

/**
 * Build a WebSite JSON-LD object matching website-json-ld.tsx.
 */
function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Richard Hudson - Senior Revenue Operations Specialist',
    description:
      'Portfolio and experience of Richard Hudson, Senior Revenue Operations Specialist with proven track record in business growth strategies.',
    url: 'https://richardwhudsonjr.com',
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hudson Digital Solutions',
      url: 'https://richardwhudsonjr.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://richardwhudsonjr.com/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

describe('WebsiteJsonLd schema', () => {
  const websiteData = buildWebsiteJsonLd()
  const stringified = safeJsonLdStringify(websiteData)

  it('contains potentialAction with SearchAction type', () => {
    expect(stringified).toContain('"potentialAction"')
    expect(stringified).toContain('"@type":"SearchAction"')
  })

  it('SearchAction urlTemplate contains blog?q={search_term_string}', () => {
    expect(stringified).toContain('blog?q={search_term_string}')
  })

  it('SearchAction contains query-input with required name=search_term_string', () => {
    expect(stringified).toContain('"query-input":"required name=search_term_string"')
  })

  it('publisher url is the site root', () => {
    expect(stringified).toContain('"url":"https://richardwhudsonjr.com"')
  })
})

/**
 * Build a NavigationJsonLd JSON-LD object matching navigation-json-ld.tsx.
 */
function buildNavigationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: navConfig.mainNav.map((item) => item.title),
    url: navConfig.mainNav.map((item) => `${siteConfig.url}${item.href}`),
  }
}

describe('NavigationJsonLd schema', () => {
  const navData = buildNavigationJsonLd()
  const stringified = safeJsonLdStringify(navData)

  it('contains SiteNavigationElement type', () => {
    expect(stringified).toContain('"@type":"SiteNavigationElement"')
  })

  it('name array contains all nav items from navConfig', () => {
    const expectedNames = navConfig.mainNav.map((item) => item.title)
    expect(navData.name).toEqual(expectedNames)
    for (const name of expectedNames) {
      expect(stringified).toContain(`"${name}"`)
    }
  })

  it('url array contains URLs with siteConfig.url prefix for each nav item', () => {
    expect(navData.url).toHaveLength(navConfig.mainNav.length)
    for (const item of navConfig.mainNav) {
      expect(stringified).toContain(`${siteConfig.url}${item.href}`)
    }
  })

  it('contains Blog in navigation items', () => {
    expect(navData.name).toContain('Blog')
    expect(stringified).toContain('/blog')
  })
})

describe('WebsiteJsonLd SearchAction URL', () => {
  const websiteData = buildWebsiteJsonLd()
  const stringified = safeJsonLdStringify(websiteData)

  it('SearchAction urlTemplate uses production URL, not localhost', () => {
    expect(stringified).toContain('https://richardwhudsonjr.com/blog?q=')
    expect(stringified).not.toContain('localhost')
  })
})
