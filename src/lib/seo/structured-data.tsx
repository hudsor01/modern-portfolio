import type { Project } from '@/types/project' // Changed import path

export function generateProjectStructuredData(project: Project, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    image: project.image,
    url: url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: 'https://richardwhudsonjr.com',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Richard Hudson',
    jobTitle: 'Revenue Operations Professional',
    url: 'https://richardwhudsonjr.com',
    sameAs: [
      'https://github.com/hudsonr01',
      'https://linkedin.com/in/hudsonr01'
    ],
  }
}
