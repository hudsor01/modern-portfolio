/**
 * SiteNavigationElement JSON-LD Schema
 * SEO structured data for main site navigation
 */
import { safeJsonLdStringify } from '@/lib/json-ld-utils'
import { navConfig } from '@/lib/site'
import { SITE_ORIGIN } from '@/lib/absolute-url'

export function NavigationJsonLd({ nonce }: { nonce?: string | null }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: navConfig.mainNav.map((item) => item.title),
    url: navConfig.mainNav.map((item) => `${SITE_ORIGIN}${item.href}`),
  }

  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated JSON-LD escaped by safeJsonLdStringify (</script breakout prevented); Next.js official JSON-LD pattern, no user input
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  )
}
