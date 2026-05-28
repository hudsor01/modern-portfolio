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
   * /api/og URLs dilutes image-search ranking.
   */
  isFallback: boolean
}

/**
 * Re-validate a stored `featuredImage` value against `featuredImageSchema`
 * and return either its canonical URL (`isFallback: false`) or a
 * branded `/api/og?title=…&subtitle=…` fallback (`isFallback: true`).
 *
 * Used by sitemap + BlogPostJsonLd + any future surface that emits a
 * featured image. Lives in its own module so `absolute-url.ts` stays
 * a pure URL primitive with zero schema/zod dependencies (layering:
 * schemas → featured-image-url → absolute-url, never the reverse).
 *
 * Re-validation is necessary because legacy/Prisma-era rows never
 * went through `featuredImageSchema` on the write path; a bad value
 * (`//evil.com/x`, traversal token, off-allowlist host) would
 * otherwise ship verbatim into JSON-LD `image` and sitemap
 * `<image:loc>` output.
 */
export function safeFeaturedImageUrl(
  stored: string | null | undefined,
  fallbackTitle: string,
  fallbackSubtitle: string = 'Blog Post'
): SafeFeaturedImage {
  const parsed = stored ? featuredImageSchema.safeParse(stored) : null
  if (parsed?.success && parsed.data) {
    return { url: canonicalUrl(parsed.data), isFallback: false }
  }
  const params = new URLSearchParams({ title: fallbackTitle, subtitle: fallbackSubtitle })
  return { url: canonicalUrl(`/api/og?${params.toString()}`), isFallback: true }
}
