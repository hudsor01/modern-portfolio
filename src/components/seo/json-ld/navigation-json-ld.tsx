/**
 * SiteNavigationElement JSON-LD Schema
 * SEO structured data for main site navigation
 */
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { navConfig, siteConfig } from '@/lib/site'

export function NavigationJsonLd({ nonce }: { nonce?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: navConfig.mainNav.map((item) => item.title),
    url: navConfig.mainNav.map((item) => `${siteConfig.url}${item.href}`),
  }

  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  )
}
