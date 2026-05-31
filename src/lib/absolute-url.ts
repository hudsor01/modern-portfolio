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
