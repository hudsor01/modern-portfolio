import { featuredImageSchema } from '@/lib/schemas'

/**
 * Site origin used in SEO surfaces: canonical URLs, OG cards, JSON-LD
 * `image`/`url`, sitemap entries. Hardcoded to the production origin
 * because Search Console expects the production URL in `<link
 * rel="canonical">` even on preview deploys — varying by environment
 * would break the canonical contract.
 */
export const SITE_ORIGIN = 'https://richardwhudsonjr.com'

/**
 * Coerce a value into an absolute URL rooted at `SITE_ORIGIN`. Idempotent:
 * already-absolute `http://` or `https://` URLs pass through unchanged.
 *
 * Named `canonicalUrl` (not `absoluteUrl`) to avoid colliding with the
 * env-aware `absoluteUrl()` in `src/lib/utils.ts`, which exists for
 * client-side link building and uses `window.location.origin` /
 * `NEXT_PUBLIC_SITE_URL`. This one is pinned to prod by design.
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
 * Return a canonical absolute URL for a stored `featuredImage` value,
 * falling back to the branded `/api/og?title=…` card if the stored
 * value fails `featuredImageSchema` validation. Used by sitemap +
 * BlogPostJsonLd + any future surface that emits a featured image —
 * legacy/imported rows never went through the write-path validator,
 * so re-validating at read time is the only thing standing between a
 * `//evil.com/x` value and Google indexing it.
 *
 * Lives here (not in schemas.ts) so callers don't have to import the
 * schema directly to get the safe URL.
 */
export function safeFeaturedImageUrl(
  stored: string | null | undefined,
  fallbackTitle: string,
  fallbackSubtitle?: string
): string {
  const parsed = stored ? featuredImageSchema.safeParse(stored) : null
  if (parsed?.success && parsed.data) return canonicalUrl(parsed.data)
  const params = new URLSearchParams({ title: fallbackTitle })
  if (fallbackSubtitle) params.set('subtitle', fallbackSubtitle)
  return canonicalUrl(`/api/og?${params.toString()}`)
}
