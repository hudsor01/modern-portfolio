import { canonicalUrl } from '@/lib/absolute-url'
import { featuredImageSchema } from '@/lib/schemas'

export interface SafeFeaturedImage {
  url: string
  /**
   * `true` when the returned URL is the branded `/api/og?title=…` card
   * (the stored value was null/empty or failed re-validation). Callers
   * use this to decide whether to emit the URL into Google's image
   * sitemap (`<image:loc>`) — fallback cards are placeholders, not
   * indexable per-post imagery, and polluting the image sitemap with
   * /api/og URLs dilutes image-search ranking. Also lets `<img alt>`
   * adapt: when the fallback card is served, the stored alt text
   * describes the absent hero image, not the placeholder card.
   */
  isFallback: boolean
}

/**
 * Options for the OG fallback card when the stored featuredImage is
 * missing/invalid. All three params flow into the `/api/og` route's
 * query string and drive its visual layout:
 *   - `title`: required, rendered as the card headline (truncated 120ch)
 *   - `subtitle`: optional, rendered as gray body text (truncated 80ch)
 *   - `category`: optional, rendered as a bronze uppercase badge above
 *     the title (truncated 40ch)
 *
 * Required signature (no defaulted `subtitle`) so the call site
 * documents intent. A previous version defaulted subtitle to
 * `'Blog Post'`, which silently leaked blog-domain copy into the
 * project-OG path when callers forgot to override.
 */
export interface FallbackOgParams {
  title: string
  subtitle?: string
  category?: string
}

/**
 * Re-validate a stored `featuredImage` value against `featuredImageSchema`
 * and return either its canonical URL (`isFallback: false`) or a
 * branded `/api/og?title=…[&subtitle=…][&category=…]` fallback
 * (`isFallback: true`).
 *
 * Used by sitemap + BlogPostJsonLd + per-page generateMetadata + any
 * future surface that emits a featured image. Lives in its own module
 * so `absolute-url.ts` stays a pure URL primitive with zero
 * schema/zod dependencies (layering: schemas → featured-image-url →
 * absolute-url, never the reverse).
 *
 * Re-validation is necessary because legacy/Prisma-era rows never
 * went through `featuredImageSchema` on the write path; a bad value
 * (`//evil.com/x`, traversal token, off-allowlist host) would
 * otherwise ship verbatim into JSON-LD `image` and sitemap
 * `<image:loc>` output.
 */
export function safeFeaturedImageUrl(
  stored: string | null | undefined,
  fallback: FallbackOgParams
): SafeFeaturedImage {
  const parsed = stored ? featuredImageSchema.safeParse(stored) : null
  if (parsed?.success && parsed.data) {
    return { url: canonicalUrl(parsed.data), isFallback: false }
  }
  const params = new URLSearchParams({ title: fallback.title })
  if (fallback.subtitle) params.set('subtitle', fallback.subtitle)
  if (fallback.category) params.set('category', fallback.category)
  return { url: canonicalUrl(`/api/og?${params.toString()}`), isFallback: true }
}
