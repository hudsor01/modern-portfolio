import Script from 'next/script'

interface PersonSchemaProps {
  name: string
  title: string
  email: string
  location: string
  bio: string
  skills: string[]
  certifications: Array<{
    name: string
    issuer: string
  }>
}

export function PersonSchema({
  name,
  title,
  email,
  bio,
  skills,
  certifications
}: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: title,
    email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Plano',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    description: bio.split('\n\n')[0], // First paragraph
    knowsAbout: skills,
    hasCredential: certifications.map((cert) => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: 'Certificate',
      issuedBy: {
        '@type': 'Organization',
        name: cert.issuer,
      },
    })),
    sameAs: [
      'https://www.linkedin.com/in/richardwhudsonjr',
      'https://github.com/hudsor01',
    ],
    url: 'https://richardwhudsonjr.com/about',
    worksFor: {
      '@type': 'Organization',
      name: 'Revenue Operations Professional',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dallas-Fort Worth',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
    },
  }

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
