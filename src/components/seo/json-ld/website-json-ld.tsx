import { headers } from 'next/headers'

/**
 * Website JSON-LD Schema
 * SEO structured data for the main website
 */
export async function WebsiteJsonLd() {
  const nonce = (await headers()).get('x-nonce')
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
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
