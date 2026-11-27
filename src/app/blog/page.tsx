import type { Metadata } from 'next'
import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound, permanentRedirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { BlogList } from './_components/blog-list'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { ItemListJsonLd } from '@/components/seo/json-ld/item-list-json-ld'
import { and, count, desc, eq, inArray, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { withDbRetry } from '@/lib/db-retry'
import { blogPosts, categories as categoriesTable } from '@/db/schema'
import { searchBlogPosts } from '@/lib/search'
import { createContextLogger } from '@/lib/logger'
import type { BlogCategoryData } from '@/types/api'
import type { BlogListPost } from '@/types/blog'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { brandTitle } from '@/lib/brand'
import {
  ALL_CATEGORIES,
  BLOG_PAGE_SIZE,
  blogIndexHref,
  pageCount,
  pageParamRedirect,
  pageSlice,
  parseCategoryParam,
  parsePageParam,
} from '@/lib/blog-pagination'
import { resolveExcerpt } from '@/lib/blog-excerpt'
import { CONTACT } from '@/lib/contact-info'
import { getCategoryChipLabel, resolveListCovers } from '@/lib/blog-list'
import { BLOG_CONTENT_HEAD_EXTRAS } from '@/lib/blog-content-head'
import { displayPostTitle } from '@/lib/brand'
import { DecorativeBlob } from '@/components/ui/decorative-blob'

const logger = createContextLogger('BlogIndex')

const BLOG_INDEX_OG_IMAGE_URL = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Blog | Richard Hudson',
    subtitle: 'Revenue Operations Insights',
  }).toString()}`
)

const BLOG_DESCRIPTION =
  'Practical revenue operations guides on forecasting, pipeline health, Salesloft and CRM automation, attribution and SDR performance, by Richard Hudson.'

interface BlogIndexSearchParams {
  q?: string | string[]
  page?: string | string[]
  category?: string | string[]
  [key: string]: string | string[] | undefined
}

/**
 * Pages 2..n of the unfiltered index are distinct documents, so each one is
 * self-canonical (Google's guidance for paginated series). A category filter
 * (`?category=<name>`, no search) lists the same posts as that category's own
 * page, so it canonicalizes there rather than to /blog, whose content differs.
 * Search renders (and unknown categories) point at /blog.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<BlogIndexSearchParams>
}): Promise<Metadata> {
  const { q, page: rawPage, category } = await searchParams
  const page = parsePageParam(rawPage)
  const selectedCategory = parseCategoryParam(category)
  const searching = Boolean(normalizeQuery(q))
  const unfiltered = !searching && selectedCategory === ALL_CATEGORIES
  // Request-deduplicated with the page render (getCategories is React cache()).
  const categorySlug =
    !searching && !unfiltered
      ? (await getCategories()).find((c) => c.name === selectedCategory)?.slug
      : undefined
  const canonical = canonicalUrl(
    unfiltered ? blogIndexHref({ page }) : categorySlug ? `/blog/category/${categorySlug}` : '/blog'
  )
  const title =
    unfiltered && page > 1
      ? `Blog: Revenue Operations Insights (Page ${page})`
      : 'Blog: Revenue Operations Insights'

  return {
    title,
    description: BLOG_DESCRIPTION,
    openGraph: {
      title: brandTitle(title),
      description: BLOG_DESCRIPTION,
      url: canonical,
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
      creator: CONTACT.twitter.handle,
      title: brandTitle(title),
      description: BLOG_DESCRIPTION,
      images: [BLOG_INDEX_OG_IMAGE_URL],
    },
    alternates: { canonical },
  }
}

/** Published and not soft-deleted: the only posts the public index may show. */
const PUBLIC_POSTS = and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt))

/**
 * Only the columns a card renders. Never `content` (the post body) or the
 * author relation (it carries the author's email): both used to be serialized
 * into the page's RSC payload for every listed post.
 */
const CARD_COLUMNS = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  featuredImage: true,
  publishedAt: true,
} as const

const CARD_RELATIONS = {
  category: { columns: { name: true } },
  tags: { columns: {}, with: { tag: { columns: { id: true, name: true } } } },
} as const

interface CardRow {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: Date | null
  /** Bounded body prefix (server-only); never copied into the list post. */
  contentHead?: string | null
  category: { name: string } | null
  tags: Array<{ tag: { id: string; name: string } }>
}

function toListPost(row: CardRow): BlogListPost {
  return {
    id: row.id,
    slug: row.slug,
    // A stored brand suffix never shows on a visible title.
    title: displayPostTitle(row.title),
    excerpt: resolveExcerpt({ excerpt: row.excerpt, content: row.contentHead }) || null,
    featuredImage: row.featuredImage,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    categoryName: row.category?.name ?? null,
    tags: row.tags.map(({ tag }) => ({ id: tag.id, name: tag.name })),
  }
}

/** One page of the index plus what the filter and pagination controls need. */
interface Listing {
  posts: BlogListPost[]
  /** Posts matching the current search + category, across all pages. */
  total: number
  /** Posts per category name (plus `All`) for the current search, before the category filter. */
  categoryCounts: Record<string, number>
}

const EMPTY_LISTING: Listing = { posts: [], total: 0, categoryCounts: { [ALL_CATEGORIES]: 0 } }

/**
 * One page of the unfiltered (or category-filtered) index, paged in Postgres.
 *
 * Until this existed the index fetched the newest 50 posts with no way to reach
 * the rest, while the sitemap listed every published post. Errors degrade to an
 * empty listing (logged), as before; during `next build` the DB is skipped.
 */
async function getIndexListing(
  categories: BlogCategoryData[],
  selectedCategory: string,
  page: number
): Promise<Listing> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return EMPTY_LISTING
  }

  const category =
    selectedCategory === ALL_CATEGORIES ? null : categories.find((c) => c.name === selectedCategory)

  try {
    // Counts and the page of posts are independent: one round trip, not two.
    // An unknown ?category= matches nothing (as the old client filter did), so
    // its posts query is skipped.
    const [countRows, rows] = await Promise.all([
      withDbRetry(() =>
        db
          .select({ categoryId: blogPosts.categoryId, posts: count() })
          .from(blogPosts)
          .where(PUBLIC_POSTS)
          .groupBy(blogPosts.categoryId)
      ),
      category === undefined
        ? Promise.resolve([])
        : withDbRetry(() =>
            db.query.blogPosts.findMany({
              where: category
                ? and(PUBLIC_POSTS, eq(blogPosts.categoryId, category.id))
                : PUBLIC_POSTS,
              columns: CARD_COLUMNS,
              extras: BLOG_CONTENT_HEAD_EXTRAS,
              with: CARD_RELATIONS,
              // `id` breaks publishedAt ties so LIMIT/OFFSET pages never overlap.
              orderBy: [desc(blogPosts.publishedAt), desc(blogPosts.id)],
              limit: BLOG_PAGE_SIZE,
              offset: (page - 1) * BLOG_PAGE_SIZE,
            })
          ),
    ])

    const nameById = new Map(categories.map((c) => [c.id, c.name]))
    const categoryCounts: Record<string, number> = { [ALL_CATEGORIES]: 0 }
    for (const row of countRows) {
      categoryCounts[ALL_CATEGORIES] = (categoryCounts[ALL_CATEGORIES] ?? 0) + row.posts
      const name = row.categoryId ? nameById.get(row.categoryId) : undefined
      if (name) categoryCounts[name] = row.posts
    }

    const total =
      category === undefined ? 0 : (categoryCounts[category ? category.name : ALL_CATEGORIES] ?? 0)

    return {
      posts: resolveListCovers(rows.map(toListPost), getCategoryChipLabel),
      total,
      categoryCounts,
    }
  } catch (error) {
    logger.error(
      'Blog index posts query failed',
      error instanceof Error ? error : new Error(String(error))
    )
    return EMPTY_LISTING
  }
}

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
 * `search_vector` column, so it ranks by relevance, tolerates typos, and
 * searches each post's full `content`, which is never shipped to the browser.
 *
 * Hits are re-fetched by id (card columns only) rather than intersected with a
 * page of the index: the index is paged by `publishedAt`, the search ranks
 * every row, and intersecting would silently drop older matches.
 *
 * The re-fetch repeats the PUBLISHED + not-soft-deleted predicate rather than
 * trusting the search's `statusFilter`, so a search can still never surface a
 * draft or a soft-deleted post — `searchBlogPosts` has no `deletedAt` concept.
 */
async function getPostsByIds(ids: string[]): Promise<BlogListPost[]> {
  if (ids.length === 0) return []
  const rows = await withDbRetry(() =>
    db.query.blogPosts.findMany({
      where: and(inArray(blogPosts.id, ids), PUBLIC_POSTS),
      columns: CARD_COLUMNS,
      extras: BLOG_CONTENT_HEAD_EXTRAS,
      with: CARD_RELATIONS,
    })
  )
  return rows.map(toListPost)
}

/**
 * The search results as a `Listing`, or `null` if the search itself failed.
 *
 * `null` and an empty listing mean different things and the caller must
 * distinguish them: empty is "searched, nothing matched" (show the empty
 * state), `null` is "search broke" (fall back to the index rather than telling
 * the reader there are no posts).
 *
 * The search returns at most 50 ranked hits, so category counts, the category
 * filter and paging are applied in memory.
 */
async function getSearchListing(
  query: string,
  selectedCategory: string,
  page: number
): Promise<Listing | null> {
  try {
    const hits = await searchBlogPosts(query, { limit: 50, statusFilter: ['PUBLISHED'] })
    if (hits.length === 0) return EMPTY_LISTING

    const rankById = new Map(hits.map((hit, position) => [hit.id, position]))
    const posts = await getPostsByIds(hits.map((hit) => hit.id))
    // Postgres returns the re-fetch in arbitrary order; restore relevance rank.
    posts.sort((a, b) => (rankById.get(a.id) ?? 0) - (rankById.get(b.id) ?? 0))

    const categoryCounts: Record<string, number> = { [ALL_CATEGORIES]: posts.length }
    for (const post of posts) {
      if (post.categoryName) {
        categoryCounts[post.categoryName] = (categoryCounts[post.categoryName] ?? 0) + 1
      }
    }

    const matching =
      selectedCategory === ALL_CATEGORIES
        ? posts
        : posts.filter((post) => post.categoryName === selectedCategory)

    return {
      posts: resolveListCovers(pageSlice(matching, page), getCategoryChipLabel),
      total: matching.length,
      categoryCounts,
    }
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
  searchParams: Promise<BlogIndexSearchParams>
}) {
  const params = await searchParams
  // Redirect before any await on data so the response is a real 308 rather than
  // a streamed meta-refresh (see permanentRedirect.md in the Next docs).
  const redirectTo = pageParamRedirect(params)
  if (redirectTo) permanentRedirect(redirectTo)

  const { q, page: rawPage, category: rawCategory } = params
  const [categories, nonce] = await Promise.all([
    getCategories(),
    headers().then((h) => h.get('x-nonce')),
  ])

  const query = normalizeQuery(q)
  const page = parsePageParam(rawPage)
  const selectedCategory = parseCategoryParam(rawCategory)

  // `??` only falls back when the search threw (null); an empty listing is a
  // real "no matches" result and must be preserved.
  const listing =
    (query ? await getSearchListing(query, selectedCategory, page) : null) ??
    (await getIndexListing(categories, selectedCategory, page))

  const totalPages = pageCount(listing.total)
  // A page past the end is a real 404, not an empty 200. Only when there are
  // posts: an empty listing can mean the database is briefly unreachable, and
  // a 404 for /blog?page=2 then would be cached by the CDN.
  if (listing.total > 0 && page > totalPages) {
    notFound()
  }

  const isUnfiltered = !query && selectedCategory === ALL_CATEGORIES

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
      {/* Emitted only on the unfiltered index, listing exactly the posts this
          page shows. Structured data has to describe what the page actually
          shows: emitting the full index on a search render meant
          `/blog?q=photosynthesis` shipped an ItemList naming every post while
          the visible page said "No posts found". Search and category renders
          get no ItemList, rather than a different "collection" per query. */}
      {isUnfiltered && listing.posts.length > 0 && (
        <ItemListJsonLd
          nonce={nonce}
          name="Blog posts by Richard Hudson"
          items={listing.posts.map((post) => ({
            name: displayPostTitle(post.title),
            url: canonicalUrl(`/blog/${post.slug}`),
          }))}
        />
      )}
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="relative overflow-x-clip">
          {/* Decorative background elements */}
          <DecorativeBlob position="top-right" />
          <DecorativeBlob position="bottom-left" />

          <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
            <BlogList
              posts={listing.posts}
              categoryNames={categories.map((c) => c.name)}
              categoryCounts={listing.categoryCounts}
              total={listing.total}
              page={page}
              totalPages={totalPages}
              query={query}
              selectedCategory={selectedCategory}
            />
          </div>
        </main>
      </div>
    </>
  )
}
