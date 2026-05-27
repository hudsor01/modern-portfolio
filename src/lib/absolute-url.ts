/**
 * Site origin used in canonical URLs, OG cards, JSON-LD `image`/`url`,
 * sitemap entries, etc. Hardcoded because it's also embedded in
 * `src/lib/csp-edge.ts` and several Sentry/analytics configs — pulling
 * it from `NEXT_PUBLIC_SITE_URL` env at runtime would mean canonical
 * URLs vary by deploy environment, which breaks the "production
 * canonical is the production URL" invariant Search Console requires.
 */
export const SITE_ORIGIN = 'https://richardwhudsonjr.com'

/**
 * Coerce a value into an absolute URL rooted at `SITE_ORIGIN`. Idempotent:
 * an already-absolute `http://` or `https://` URL passes through unchanged.
 * Anything else is appended to the origin verbatim, so callers should pass
 * either a full URL or a path that already starts with `/`.
 *
 * Named `canonicalUrl` rather than `absoluteUrl` to avoid the name
 * collision with `absoluteUrl()` in `src/lib/utils.ts` — that one is
 * env-aware (uses window.location.origin in the browser,
 * NEXT_PUBLIC_SITE_URL on the server) for client-side link building.
 * This one is intentionally pinned to the prod origin because it feeds
 * SEO surfaces (canonical, OG, JSON-LD, sitemap) where Search Console
 * requires the production URL even on preview deploys.
 *
 * Use this anywhere a value of mixed provenance (DB field, function
 * argument, config) is rendered into JSON-LD, OG `url`, sitemap `<loc>`,
 * or canonical links. Without it, the JSON-LD double-prefix bug
 * (`https://richardwhudsonjr.comhttps://images.unsplash.com/...`) recurs
 * any time the value source switches from relative to absolute.
 */
export function canonicalUrl(pathOrUrl: string): string {
  return /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${SITE_ORIGIN}${pathOrUrl}`
}
