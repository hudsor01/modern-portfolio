import { safeJsonLdStringify } from '@/lib/json-ld-utils'

export function BreadcrumbListJsonLd({
  items,
  nonce,
}: {
  items: Array<{ name: string; url: string }>
  nonce?: string | null
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
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
