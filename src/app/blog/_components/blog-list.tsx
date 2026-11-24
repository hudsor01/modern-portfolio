'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { debounce, useQueryState } from 'nuqs'
import type { BlogListPost } from '@/types/blog'
import { ALL_CATEGORIES, blogIndexHref, paginationItems } from '@/lib/blog-pagination'
import { BlogTagFilter } from './blog-tag-filter'
import { InlineMarkdown } from './inline-markdown'
import { BlogFeaturedImage } from '@/components/blog/blog-featured-image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { CATEGORY_CHIP_CLASSES, getCategoryChipLabel } from '@/lib/blog-list'
import { formatDate } from '@/lib/data-formatters'

interface BlogListProps {
  /** The posts on this page, already searched, filtered and paged by the server. */
  posts: BlogListPost[]
  categoryNames: string[]
  categoryCounts: Record<string, number>
  /** Posts matching the current search + category across all pages. */
  total: number
  page: number
  totalPages: number
  /** The `q` and `category` the server rendered with. */
  query: string
  selectedCategory: string
}

/**
 * Client Component with server-provided data. No client-side fetching.
 *
 * Search (`q`), category and page are all applied on the server. `q` and
 * `category` use `shallow: false`, so nuqs re-runs the server component with
 * the new search params (a Next.js RSC navigation, not a fetch from here).
 * Search runs in Postgres (see getSearchListing in ../page.tsx), which lets a
 * query match a post's full body text without that text reaching the browser.
 * Category moved server-side with pagination: filtering one page in place
 * would hide every match on the other pages.
 *
 * Pages are plain links (`/blog?page=2`) so crawlers can reach every post.
 */
export function BlogList({
  posts,
  categoryNames,
  categoryCounts,
  total,
  page,
  totalPages,
  query,
  selectedCategory,
}: BlogListProps) {
  // `isPending` drives the subtle busy state below. Without a transition the
  // list would simply freeze on the old results while the server responds.
  const [isPending, startTransition] = useTransition()

  // The chip highlight follows the URL immediately; the cards follow the server.
  const [category, setCategory] = useQueryState('category', {
    defaultValue: ALL_CATEGORIES,
    shallow: false,
    startTransition,
  })
  const [, setPage] = useQueryState('page', { shallow: false, startTransition })
  const [searchQuery, setSearchQuery] = useQueryState('q', {
    defaultValue: '',
    shallow: false,
    // DEBOUNCE, not throttle. Both cap the update rate, but throttle fires
    // every 300ms *during* typing — so a 20-character query issued a burst of
    // mid-word server renders, each re-running the blog index queries for a
    // prefix nobody wanted results for. Debounce waits until typing stops, so
    // one query means one render. (`throttleMs` is also deprecated in nuqs
    // 2.8.9 in favour of `limitUrlUpdates`.)
    //
    // nuqs still updates the returned value immediately either way, so the
    // input itself stays responsive regardless.
    limitUrlUpdates: debounce(300),
    startTransition,
  })

  // A new search or category starts again at page 1.
  function resetPage() {
    if (page > 1) void setPage(null)
  }

  const categoryTags = [ALL_CATEGORIES, ...categoryNames]

  function formatPublishedDate(dateString: string | undefined): string {
    if (!dateString) return ''
    return formatDate(dateString, { month: 'long' })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="mb-4">Blog</h1>
        <p className="max-w-2xl mx-auto">
          Insights on revenue operations, data analytics, and business growth strategies.
        </p>
      </header>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="search"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => {
              resetPage()
              void setSearchQuery(e.target.value || null)
            }}
            aria-label="Search blog posts"
            aria-busy={isPending}
            className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {/* Inside the field so the grid never shifts when it appears.
              aria-hidden because aria-busy on the input already announces it. */}
          {isPending && (
            <span
              aria-hidden="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin motion-reduce:animate-none"
            />
          )}
        </div>
        {/* Screen readers get the result count once the server responds, since
            the visual change (a different set of cards) is not announced. With a
            category filter active, name it too, so an empty grid isn't blamed on
            the search alone. */}
        <p aria-live="polite" className="sr-only">
          {isPending
            ? 'Searching'
            : query
              ? `${total} ${total === 1 ? 'post' : 'posts'} found for ${query}${
                  selectedCategory === ALL_CATEGORIES ? '' : `, filtered to ${selectedCategory}`
                }`
              : ''}
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-10">
        <BlogTagFilter
          tags={categoryTags}
          selectedTag={category}
          tagCounts={categoryCounts}
          onTagChange={(tag) => {
            resetPage()
            void setCategory(tag === ALL_CATEGORIES ? null : tag)
          }}
        />
      </div>

      <p className="mb-6" data-testid="blog-result-count">
        {total} {total === 1 ? 'post' : 'posts'}
        {totalPages > 1 ? `, page ${page} of ${totalPages}` : ''}
      </p>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <Card
                className={`hover-lift hover:border-primary/50 transition-all h-full overflow-hidden ${
                  post.featuredImage ? 'pt-0' : ''
                }`}
              >
                {post.featuredImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BlogFeaturedImage
                      src={post.featuredImage}
                      alt={post.title}
                      postTitle={post.title}
                      postCategory={post.categoryName ?? undefined}
                      fallbackVariant="card"
                      fill
                      className="object-cover object-left transition-transform duration-300 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <span className={`${CATEGORY_CHIP_CLASSES} mb-2`}>
                    {getCategoryChipLabel(post)}
                  </span>
                  <CardTitle as="h2" className="line-clamp-3 transition-colors">
                    <InlineMarkdown value={post.title} />
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt ? <InlineMarkdown value={post.excerpt} /> : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <time
                    className="typography-small text-muted-foreground"
                    dateTime={post.publishedAt ?? undefined}
                  >
                    {formatPublishedDate(post.publishedAt ?? undefined)}
                  </time>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="typography-muted">No posts found matching your filters.</p>
          <button
            type="button"
            onClick={() => {
              void setPage(null)
              void setSearchQuery(null)
              void setCategory(null)
            }}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            Clear search
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <BlogPagination
          page={page}
          totalPages={totalPages}
          query={query}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  )
}

const PAGE_LINK =
  'inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-lg border text-sm font-normal transition-colors'

function BlogPagination({
  page,
  totalPages,
  query,
  selectedCategory,
}: {
  page: number
  totalPages: number
  query: string
  selectedCategory: string
}) {
  const href = (target: number) =>
    blogIndexHref({ page: target, query, category: selectedCategory })

  return (
    <nav aria-label="Blog pages" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          rel="prev"
          className={`${PAGE_LINK} gap-1 border-border text-foreground hover:border-primary/50 hover:text-primary`}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Link>
      )}
      {paginationItems(page, totalPages).map((item, index) =>
        item === 'gap' ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`${PAGE_LINK} ${
              item === page
                ? 'border-primary/30 bg-primary/20 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary'
            }`}
          >
            {item}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link
          href={href(page + 1)}
          rel="next"
          className={`${PAGE_LINK} gap-1 border-border text-foreground hover:border-primary/50 hover:text-primary`}
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}
