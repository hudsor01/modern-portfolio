import type { Metadata } from 'next'
import { cache } from 'react'
import { headers } from 'next/headers'
import { Navbar } from '@/components/layout/navbar'
import { BlogList } from './_components/blog-list'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { ItemListJsonLd } from '@/components/seo/json-ld/item-list-json-ld'
import { and, desc, eq, isNull } from 'drizzle-orm'
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
 * Results are intersected with the already-fetched index rather than rendered
 * from the search rows directly. Two reasons: the search projection has no
 * author/category/tag/image data the cards need, and `getBlogPosts()` is the
 * single place the PUBLISHED + not-soft-deleted rules live. Intersecting means
 * a search can only ever narrow that set, never surface a draft or a
 * soft-deleted post, even though `searchBlogPosts` has no `deletedAt` concept.
 */
async function applySearch(posts: BlogPostData[], query: string): Promise<BlogPostData[]> {
  try {
    const hits = await searchBlogPosts(query, { limit: 50, statusFilter: ['PUBLISHED'] })
    const rankById = new Map(hits.map((hit, position) => [hit.id, position]))
    return posts
      .filter((post) => rankById.has(post.id))
      .sort((a, b) => (rankById.get(a.id) ?? 0) - (rankById.get(b.id) ?? 0))
  } catch (error) {
    // Never let search failure blank the index — fall back to the unfiltered
    // list. searchBlogPosts already swallows query errors, so reaching here
    // means something further out went wrong.
    logger.error(
      'Blog search failed; falling back to unfiltered index',
      error instanceof Error ? error : new Error(String(error))
    )
    return posts
  }
}

export default async function BlogHomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
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

  const query = q?.trim() ?? ''
  const posts = query ? await applySearch(allPosts, query) : allPosts

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
