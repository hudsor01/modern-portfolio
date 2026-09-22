import type { Metadata } from 'next'
import { cache } from 'react'
import { headers } from 'next/headers'
import { Navbar } from '@/components/layout/navbar'
import { BlogList } from './_components/blog-list'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { ItemListJsonLd } from '@/components/seo/json-ld/item-list-json-ld'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { withDbRetry } from '@/lib/db-retry'
import { blogPosts, categories as categoriesTable } from '@/db/schema'
import { transformToBlogPostData } from '@/lib/api-blog'
import { searchBlogPosts } from '@/lib/search'
import { createContextLogger } from '@/lib/logger'
import type { BlogPostData, BlogCategoryData } from '@/types/api'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

const logger = createContextLogger('BlogIndex')

const BLOG_INDEX_OG_IMAGE_URL = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Blog | Richard Hudson',
    subtitle: 'Revenue Operations Insights',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Blog - Revenue Operations Insights',
  description: 'Insights on revenue operations, data analytics, and business growth strategies.',
  keywords: ['revenue operations', 'data analytics', 'business intelligence', 'revops'],
  openGraph: {
    title: 'Blog | Richard Hudson',
    description: 'Insights on revenue operations, data analytics, and business growth strategies.',
    url: canonicalUrl('/blog'),
    type: 'website',
    images: [
      {
        url: BLOG_INDEX_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Richard Hudson Blog - Revenue Operations Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@hudsor01',
    title: 'Blog | Richard Hudson',
    description: 'Insights on revenue operations, data analytics, and business growth strategies.',
    images: [BLOG_INDEX_OG_IMAGE_URL],
  },
  alternates: {
    canonical: canonicalUrl('/blog'),
  },
}

// Official Next.js 16 Pattern: React cache() for database queries
// Gracefully handle missing database (CI builds)
const getBlogPosts = cache(async (): Promise<BlogPostData[]> => {
  // During build, skip DB — blog content populates on first ISR revalidation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return []
  }

  try {
    const posts = await withDbRetry(() =>
      db.query.blogPosts.findMany({
        // Exclude soft-deleted posts so retired/consolidated dupes (which
        // 308-redirect at the detail level) don't still render as index cards.
        where: and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)),
        with: {
          author: true,
          category: true,
          tags: { with: { tag: true } },
        },
        orderBy: desc(blogPosts.publishedAt),
        limit: 50,
      })
    )

    return posts.map(transformToBlogPostData)
  } catch (error) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      logger.error(
        'Blog index posts query failed',
        error instanceof Error ? error : new Error(String(error))
      )
    }
    return []
  }
})

const getCategories = cache(async (): Promise<BlogCategoryData[]> => {
  // During build, skip DB — categories populate on first ISR revalidation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return []
  }

  try {
    const categories = await withDbRetry(() =>
      db.query.categories.findMany({
        orderBy: desc(categoriesTable.totalViews),
      })
    )

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? undefined,
      color: cat.color ?? undefined,
      icon: cat.icon ?? undefined,
      postCount: cat.postCount,
      totalViews: cat.totalViews,
      createdAt: cat.createdAt.toISOString(),
    }))
  } catch (error) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      logger.error(
        'Blog categories query failed',
        error instanceof Error ? error : new Error(String(error))
      )
    }
    return []
  }
})

/**
 * Apply the `?q=` full-text search on the server.
 *
 * The search runs in Postgres (src/lib/search.ts) against the generated
 * `search_vector` column, so it ranks by relevance, tolerates typos, and — the
 * part the old client-side filter structurally could not do — searches each
 * post's full `content`, which is never shipped to the browser.
 *
 * Hits are re-fetched by id rather than intersected with the already-loaded
 * index. Intersecting is tempting (no second query) but silently wrong: the
 * index is the 50 most recent posts by `publishedAt`, while the search covers
 * every row. Once the blog passes 50 published posts, an older post matching
 * the query would rank correctly in Postgres and then be dropped on the way
 * out, with no error — the search would just quietly stop finding old work.
 * There are 23 published posts today, so this is latent rather than live, but
 * it is the kind of bug that only shows up long after the cause is forgotten.
 *
 * The re-fetch repeats the PUBLISHED + not-soft-deleted predicate rather than
 * trusting the search's `statusFilter`, so a search can still never surface a
 * draft or a soft-deleted post — `searchBlogPosts` has no `deletedAt` concept.
 */
async function getPostsByIds(ids: string[]): Promise<BlogPostData[]> {
  if (ids.length === 0) return []
  const posts = await withDbRetry(() =>
    db.query.blogPosts.findMany({
      where: and(
        inArray(blogPosts.id, ids),
        eq(blogPosts.status, 'PUBLISHED'),
        isNull(blogPosts.deletedAt)
      ),
      with: { author: true, category: true, tags: { with: { tag: true } } },
    })
  )
  return posts.map(transformToBlogPostData)
}

/**
 * Returns the ranked matches, or `null` if the search itself failed.
 *
 * `null` and `[]` mean different things and the caller must distinguish them:
 * `[]` is "searched, nothing matched" (show the empty state), `null` is
 * "search broke" (fall back to the full index rather than telling the reader
 * there are no posts).
 */
async function applySearch(query: string): Promise<BlogPostData[] | null> {
  try {
    const hits = await searchBlogPosts(query, { limit: 50, statusFilter: ['PUBLISHED'] })
    if (hits.length === 0) return []

    const rankById = new Map(hits.map((hit, position) => [hit.id, position]))
    const posts = await getPostsByIds(hits.map((hit) => hit.id))
    // Postgres returns the re-fetch in arbitrary order; restore relevance rank.
    return posts.sort((a, b) => (rankById.get(a.id) ?? 0) - (rankById.get(b.id) ?? 0))
  } catch (error) {
    logger.error(
      'Blog search failed; falling back to unfiltered index',
      error instanceof Error ? error : new Error(String(error))
    )
    return null
  }
}

/** Longest accepted `?q=`. Past this a query is noise, not a search. */
const MAX_QUERY_LENGTH = 128

/**
 * Normalise `?q=` into a single bounded string.
 *
 * Next resolves a repeated key (`/blog?q=a&q=b`) to `string[]`, not `string`.
 * Typing the param as `{ q?: string }` and calling `q.trim()` therefore threw a
 * TypeError and returned HTTP 500 for any such URL — trivially reachable by
 * hand, and crawlers do generate them. Take the first value, the same thing a
 * single-input form means.
 *
 * The length cap is separate: without it an arbitrarily long string reached
 * `plainto_tsquery` and two `word_similarity()` calls per row.
 */
function normalizeQuery(q: string | string[] | undefined): string {
  const raw = Array.isArray(q) ? q[0] : q
  return (raw ?? '').trim().slice(0, MAX_QUERY_LENGTH)
}

export default async function BlogHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  // Independent queries — parallelize so cold-CDN TTFB is a single Neon
  // roundtrip, not two. Especially important now that the global
  // loading.tsx is removed; the user sees the previous page until both
  // resolve.
  const [allPosts, categories, { q }, nonce] = await Promise.all([
    getBlogPosts(),
    getCategories(),
    searchParams,
    headers().then((h) => h.get('x-nonce')),
  ])

  const query = normalizeQuery(q)
  // `?? allPosts` only fires when applySearch returns null (it threw). An empty
  // array is a real "no matches" result and must be preserved.
  const posts = query ? ((await applySearch(query)) ?? allPosts) : allPosts

  return (
    <>
      <BlogJsonLd nonce={nonce} />
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Blog', url: canonicalUrl('/blog') },
        ]}
      />
      {/* Always the full index, never the `?q=` subset — this describes the
          /blog collection itself, and emitting a search-dependent item list
          would hand crawlers a different collection per query string. */}
      <ItemListJsonLd
        nonce={nonce}
        name="Blog posts by Richard Hudson"
        items={allPosts.map((post) => ({
          name: post.title,
          url: canonicalUrl(`/blog/${post.slug}`),
        }))}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

          <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
            <BlogList initialPosts={posts} initialCategories={categories} />
          </div>
        </main>
      </div>
    </>
  )
}
