/**
 * Site origin used in SEO surfaces: canonical URLs, OG cards, JSON-LD
 * `image`/`url`, sitemap entries. Hardcoded to the production origin
 * because Search Console expects the production URL in `<link
 * rel="canonical">` even on preview deploys — varying by environment
 * would break the canonical contract.
 *
 * This module is deliberately a leaf — pure URL primitives with NO
 * schema or validation imports. The composed validate-then-build
 * helper (`safeFeaturedImageUrl`) lives in
 * `src/lib/featured-image-url.ts` so adding it never inverts the
 * dependency layering or drags `zod`/schemas into any new client
 * surface that just needs `SITE_ORIGIN`/`canonicalUrl()`.
 */
export const SITE_ORIGIN = 'https://richardwhudsonjr.com'

/**
 * Coerce a value into an absolute URL rooted at `SITE_ORIGIN`. Idempotent:
 * already-absolute `http://` or `https://` URLs pass through unchanged.
 *
 * Named `canonicalUrl` to distinguish it from the env-aware
 * `absoluteUrlTestable()` in `src/lib/utils.ts`, which builds client-side
 * links from `window.location.origin` / `NEXT_PUBLIC_SITE_URL`. This one is
 * pinned to prod (`SITE_ORIGIN`) by design.
 *
 * Use this anywhere a value of mixed provenance (DB field, function
 * argument) is rendered into JSON-LD, OG `url`, sitemap `<loc>`, or
 * `<link rel="canonical">`. Without it, naked template-literal
 * interpolation (``${SITE_ORIGIN}${url}``) produces double-prefix bugs
 * the moment the value source switches from relative path to absolute
 * URL — exactly what produced the `https://richardwhudsonjr.comhttps://images.unsplash.com/...`
 * regression in BlogPosting structured data.
 */
export function canonicalUrl(pathOrUrl: string): string {
  return /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${SITE_ORIGIN}${pathOrUrl}`
}

/**
 * Canonical OG/Twitter card dimensions. Single source for the `width`/`height`
 * declared in every page's `openGraph.images[]` and the `/api/og` ImageResponse,
 * so resizing the card can never leave the declared metadata lying about the
 * served image.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

/**
 * Build the absolute URL for a dynamic OG card. Centralizes the
 * `canonicalUrl('/api/og?' + URLSearchParams(...))` construction that was
 * copy-pasted across every project and tool page.
 */
export function ogImageUrl(params: {
  title: string
  subtitle?: string
  category?: string
}): string {
  const q = new URLSearchParams()
  q.set('title', params.title)
  if (params.subtitle) q.set('subtitle', params.subtitle)
  if (params.category) q.set('category', params.category)
  return canonicalUrl(`/api/og?${q.toString()}`)
}
