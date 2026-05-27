import { canonicalUrl } from '@/lib/absolute-url'
import { featuredImageSchema } from '@/lib/schemas'

const BLOG_OG_SUBTITLE = 'Blog Post'

/**
 * Return a canonical absolute URL for a stored `featuredImage` value,
 * re-validating against `featuredImageSchema` first and falling back
 * to the branded `/api/og?title=…` card if validation fails or the
 * column is null/empty. Used by sitemap + BlogPostJsonLd + any future
 * surface that emits a featured image.
 *
 * Lives in its own module (rather than absolute-url.ts) so that
 * absolute-url.ts stays a pure URL primitive with zero schema/zod
 * dependencies — keeps the dependency graph layered (schemas →
 * featured-image-url → absolute-url) and avoids a backwards import
 * that would invite future circulars.
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
  fallbackSubtitle: string = BLOG_OG_SUBTITLE
): string {
  const parsed = stored ? featuredImageSchema.safeParse(stored) : null
  if (parsed?.success && parsed.data) return canonicalUrl(parsed.data)
  const params = new URLSearchParams({ title: fallbackTitle, subtitle: fallbackSubtitle })
  return canonicalUrl(`/api/og?${params.toString()}`)
}
