import type { MetadataRoute } from 'next'
import { createContextLogger } from '@/lib/logger'
import { SITE_ORIGIN, canonicalUrl } from '@/lib/absolute-url'
import { featuredImageSchema } from '@/lib/schemas'

const logger = createContextLogger('Sitemap')

// Force dynamic rendering at request time. The previous setup (revalidate
// = 3600 only) caused Next.js to statically prerender the sitemap during
// `next build` — which always took the NEXT_PHASE === 'phase-production-build'
// short-circuit branch (no DB query). Result: blog/category URLs never
// appeared in production sitemap until a non-build trigger forced ISR
// regen, and Vercel often served the static artifact indefinitely.
//
// With force-dynamic, the sitemap renders at runtime on every request,
// guaranteeing blog/category URLs are always fresh from the DB.
// `revalidate = 3600` still applies as a CDN cache hint.
export const dynamic = 'force-dynamic'
export const revalidate = 3600

// Captured at module load (i.e. deploy time / process start), NOT per
// request. If we used `new Date()` inside the handler, every hourly
// revalidation would mark every static page as "freshly modified" — Google
// downweights sitemaps that lie about lastmod (Mueller, 2025). This pins
// static-page lastmod to the deploy commit's author date when available
// (Vercel-injected env var), falling back to process start.
const STATIC_LAST_MODIFIED = process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE || new Date().toISOString()

// Next.js's MetadataRoute.Sitemap serializer does NOT XML-escape `&` in the
// `images[]` URL strings before emitting them inside <image:loc>. URLs that
// contain query strings (?title=X&subtitle=Y) ship to Google with literal
// ampersands, and Google's strict XML parser rejects the whole sitemap
// ("Parsing error" → Discovered URLs = 0). Pre-escape ourselves; Next.js
// emits the string as-is into the XML element value.
const xmlSafeUrl = (url: string): string => url.replace(/&/g, '&amp;')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_ORIGIN
  // fallback only for blog posts with null timestamps
  const fallbackDate = STATIC_LAST_MODIFIED
  const staticLastModified = STATIC_LAST_MODIFIED

  // Main navigation pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: staticLastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // All project pages (complete list).
  // Each entry includes the OG image URL via the `images` field — Next.js
  // emits this as <image:image><image:loc> per Google's image-sitemap spec.
  // Only the URL is allowed in MetadataRoute.Sitemap['images']; deprecated
  // sub-tags (caption/title/license/geo_location) were dropped by Google
  // in May 2022.
  const projectPages: MetadataRoute.Sitemap = [
    { slug: 'revenue-kpi', title: 'Revenue Operations Dashboard' },
    { slug: 'revenue-operations-center', title: 'Revenue Operations Command Center' },
    { slug: 'commission-optimization', title: 'Commission & Incentive Optimization' },
    { slug: 'multi-channel-attribution', title: 'Multi-Channel Attribution Analytics' },
    {
      slug: 'partnership-program-implementation',
      title: 'Partnership Program Implementation',
    },
    { slug: 'customer-lifetime-value', title: 'Customer Lifetime Value Analytics' },
    { slug: 'partner-performance', title: 'Partner Performance Intelligence' },
    { slug: 'deal-funnel', title: 'Sales Funnel Optimization' },
    { slug: 'churn-retention', title: 'Customer Churn Prediction Model' },
    { slug: 'lead-attribution', title: 'Marketing Attribution Platform' },
    { slug: 'cac-unit-economics', title: 'Customer Acquisition Cost Optimization' },
    { slug: 'forecast-pipeline-intelligence', title: 'Forecast & Pipeline Intelligence' },
    { slug: 'quota-territory-management', title: 'Quota & Territory Management' },
    { slug: 'sales-enablement', title: 'Sales Enablement Platform' },
  ].map(({ slug, title }) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    images: [
      xmlSafeUrl(
        `${baseUrl}/api/og?${new URLSearchParams({
          title,
          subtitle: 'Revenue Operations Project',
        }).toString()}`
      ),
    ],
  }))

  // During build, skip DB — blog posts are added on first ISR revalidation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [...mainPages, ...projectPages]
  }

  // Dynamic blog posts from database
  let blogPages: MetadataRoute.Sitemap
  try {
    const { db } = await import('@/lib/db')
    const { blogPosts } = await import('@/db/schema')
    const { and, desc, eq, isNull } = await import('drizzle-orm')
    const posts = await db
      .select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        updatedAt: blogPosts.updatedAt,
        publishedAt: blogPosts.publishedAt,
        featuredImage: blogPosts.featuredImage,
      })
      .from(blogPosts)
      // Exclude soft-deleted posts. Without isNull(deletedAt), the sitemap
      // would advertise URLs that runtime getBlogPost now rejects with
      // notFound() → HTTP 404, which Search Console upgrades to
      // "Submitted URL not found (404)" — a stricter verdict.
      .where(and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)))
      .orderBy(desc(blogPosts.publishedAt))

    blogPages = posts.map((post) => {
      // Re-validate featuredImage at read time. The schema guards the
      // write path (POST/PUT), but legacy Prisma-era rows or imports
      // never went through it — a bad value (`//evil.com/x`, garbage
      // CDN host, traversal token) would otherwise be emitted verbatim
      // into <image:loc> and indexed by Google. Fall back to the OG
      // route on parse failure so the sitemap entry is always valid.
      const validFeatured =
        post.featuredImage && featuredImageSchema.safeParse(post.featuredImage).success
          ? canonicalUrl(post.featuredImage)
          : canonicalUrl(
              `/api/og?${new URLSearchParams({ title: post.title, subtitle: 'Blog Post' }).toString()}`
            )

      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified:
          post.updatedAt?.toISOString() || post.publishedAt?.toISOString() || fallbackDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        images: [xmlSafeUrl(validFeatured)],
      }
    })
  } catch (error) {
    // Sitemap degrades gracefully to static pages — surface as warn so we
    // notice the regression without paging anyone.
    logger.warn('Sitemap blog query failed; returning static pages only', {
      error: error instanceof Error ? error.message : String(error),
    })
    blogPages = []
  }

  // Blog category pages — only those with at least one published, non-deleted post.
  let categoryPages: MetadataRoute.Sitemap
  try {
    const { db } = await import('@/lib/db')
    const { categories: categoriesTable, blogPosts } = await import('@/db/schema')
    const { sql } = await import('drizzle-orm')
    const categories = await db
      .select({ slug: categoriesTable.slug, updatedAt: categoriesTable.updatedAt })
      .from(categoriesTable)
      .where(
        sql`EXISTS (SELECT 1 FROM ${blogPosts} WHERE ${blogPosts.categoryId} = ${categoriesTable.id} AND ${blogPosts.status} = 'PUBLISHED' AND ${blogPosts.deletedAt} IS NULL)`
      )
    categoryPages = categories.map((cat) => ({
      url: `${baseUrl}/blog/category/${cat.slug}`,
      lastModified: cat.updatedAt?.toISOString() || fallbackDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    logger.warn('Sitemap category query failed; skipping category entries', {
      error: error instanceof Error ? error.message : String(error),
    })
    categoryPages = []
  }

  return [...mainPages, ...projectPages, ...blogPages, ...categoryPages]
}
