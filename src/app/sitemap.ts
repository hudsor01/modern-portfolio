import type { MetadataRoute } from 'next'
import { createContextLogger } from '@/lib/logger'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { safeFeaturedImageUrl } from '@/lib/featured-image-url'
import { showcaseProjects } from '@/data/projects'

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

// Slugs retired in the blog de-cannibalization cleanup. Each 308-redirects to
// its canonical keeper in next.config.js, so they must NOT appear in the
// sitemap — a sitemap URL that redirects is flagged "Page with redirect" in
// Search Console. Keep in sync with next.config.js `redirects()`.
const RETIRED_BLOG_SLUGS = new Set<string>([
  'stop-guessing-how-we-crushed-forecasting-errors-by-34-in-one-quarter',
  'stop-guessing-how-to-slash-forecast-variance-by-60-in-90-days',
  'the-4-2m-you-left-on-the-table-why-your-closed-lost-deals-are-actually-sleeping-',
  'stop-ignoring-your-dead-opportunities-how-we-revived-4-2m-in-lost-revenue-with-o',
])

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
    {
      url: `${baseUrl}/tools/pipeline-coverage-calculator`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/revops-maturity-scorecard`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // All project pages, single-sourced from the project catalog so this list
  // can never drift from the actual /projects/<slug> routes.
  //
  // No `images` field — static project pages don't have stored featuredImage
  // values to validate; emitting the branded /api/og card as <image:loc> would
  // pollute Google's image sitemap with identical placeholder URLs for 14
  // distinct project pages, diluting per-project image-search ranking. Same
  // rationale as the blog branch below for failed re-validation.
  const projectPages: MetadataRoute.Sitemap = showcaseProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: staticLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
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

    // Aggregate content-quality signals into one warn-per-build
    // instead of one-per-post-per-build. Sentry routes warn →
    // captureMessage; without aggregation a backlog of N stale
    // featuredImage rows would emit N events per sitemap render,
    // and the sitemap revalidates hourly — that's N×24 events/day
    // for the same set of bad rows, drowning real signal.
    const rejectedFeaturedImages: Array<{ slug: string; stored: string }> = []

    blogPages = posts
      .filter((post) => !RETIRED_BLOG_SLUGS.has(post.slug))
      .map((post) => {
        // safeFeaturedImageUrl re-validates at read time. Shared with
        // BlogPostJsonLd so sitemap and JSON-LD can never diverge on
        // what's considered a "safe" image URL for a given post.
        //
        // Omit `images` entirely when isFallback=true: the `/api/og`
        // card is a brand placeholder, not indexable per-post imagery.
        // Including it in <image:loc> would dilute image-search ranking
        // (Google indexes the placeholder as the "real" blog image and
        // serves it for image-search queries that bounce on click).
        const featured = safeFeaturedImageUrl(post.featuredImage, {
          title: post.title,
          subtitle: 'Blog Post',
        })

        if (featured.isFallback && post.featuredImage) {
          rejectedFeaturedImages.push({ slug: post.slug, stored: post.featuredImage })
        }

        return {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified:
            post.updatedAt?.toISOString() || post.publishedAt?.toISOString() || fallbackDate,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          ...(featured.isFallback ? {} : { images: [xmlSafeUrl(featured.url)] }),
        }
      })

    // Distinguish 'never had a featured image' (null stored, silent
    // skip) from 'had one but it failed schema re-validation'
    // (non-null stored, fallback returned). The latter is a
    // content-quality signal — silent drop would let bad imports
    // rot undetected. One warn per sitemap build covers all rejects.
    if (rejectedFeaturedImages.length > 0) {
      logger.warn(
        `${rejectedFeaturedImages.length} blog post(s) failed sitemap featuredImage re-validation; omitted from <image:loc>`,
        { rejected: rejectedFeaturedImages }
      )
    }
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
