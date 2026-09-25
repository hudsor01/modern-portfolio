'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { debounce, useQueryState } from 'nuqs'
import type { BlogPostData, BlogCategoryData } from '@/types/api'
import { BlogTagFilter } from './blog-tag-filter'
import { InlineMarkdown } from './inline-markdown'
import { BlogFeaturedImage } from '@/components/blog/blog-featured-image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/data-formatters'

interface BlogListProps {
  initialPosts: BlogPostData[]
  initialCategories: BlogCategoryData[]
}

/**
 * Official Next.js 16 / React 19 Pattern: Client Component with Server-Provided Data
 *
 * Data is fetched on the server and passed as props. Still no client-side
 * fetching: `category` filters in place, and `q` is handled by the server.
 *
 * `q` uses `shallow: false`, so nuqs re-runs the server component with the new
 * search param instead of only rewriting the URL. That is a Next.js RSC
 * navigation, not a fetch from this component — the "no client-side fetching"
 * property above still holds. The work happens in Postgres (see applySearch in
 * ../page.tsx), which is what lets a query match against a post's full body
 * text; that content is never sent to the browser, so the substring filter this
 * replaced could only ever see titles and excerpts.
 */
export function BlogList({ initialPosts, initialCategories }: BlogListProps) {
  // Category stays client-side: the data is already here, so filtering it in
  // place is instant and a round-trip would buy nothing.
  const [selectedCategory, setSelectedCategory] = useQueryState('category', { defaultValue: 'All' })

  // `isPending` drives the subtle busy state below. Without a transition the
  // list would simply freeze on the old results while the server responds.
  const [isPending, startTransition] = useTransition()
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

  // Build category list with "All" option
  const categoryTags = ['All', ...initialCategories.map((c) => c.name)]

  // Count posts per category
  const categoryCounts = initialPosts.reduce<Record<string, number>>(
    (counts, post) => {
      const categoryName = post.category?.name
      if (categoryName) {
        counts[categoryName] = (counts[categoryName] || 0) + 1
      }
      return counts
    },
    { All: initialPosts.length }
  )

  // Category only — `initialPosts` has already been narrowed to the search hits
  // by the server. Re-applying a substring filter here would undo that: a post
  // matched on its body text has no guarantee of containing the term in its
  // title or excerpt, so the client filter would discard the very results
  // full-text search exists to find.
  const filteredPosts = initialPosts.filter(
    (post) => selectedCategory === 'All' || post.category?.name === selectedCategory
  )

  function formatPublishedDate(dateString: string | undefined): string {
    if (!dateString) return ''
    return formatDate(dateString, { month: 'long' })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
            onChange={(e) => setSearchQuery(e.target.value || null)}
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
            the visual change (a different set of cards) is not announced.

            When a category filter is also active, `filteredPosts` is the search
            hits narrowed further by category — announcing that number alone as
            "N posts found for <query>" blamed the search for an empty grid the
            category caused. Name both filters in that case. */}
        <p aria-live="polite" className="sr-only">
          {isPending
            ? 'Searching'
            : searchQuery
              ? selectedCategory === 'All'
                ? `${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'} found for ${searchQuery}`
                : `${filteredPosts.length} of ${initialPosts.length} ${initialPosts.length === 1 ? 'post' : 'posts'} found for ${searchQuery}, filtered to ${selectedCategory}`
              : ''}
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-10">
        <BlogTagFilter
          tags={categoryTags}
          selectedTag={selectedCategory}
          tagCounts={categoryCounts}
          onTagChange={(tag) => setSelectedCategory(tag === 'All' ? null : tag)}
        />
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <Card className="hover-lift hover:border-primary/50 transition-all h-full overflow-hidden">
                {post.featuredImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <BlogFeaturedImage
                      src={post.featuredImage}
                      alt={post.title}
                      postTitle={post.title}
                      postCategory={post.category?.name}
                      fill
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {post.tags.slice(0, 3).map((tag: { id: string; name: string }) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <CardTitle
                    as="h2"
                    className="text-xl line-clamp-2 group-hover:text-primary transition-colors"
                  >
                    <InlineMarkdown value={post.title} />
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt ? <InlineMarkdown value={post.excerpt} /> : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <time className="typography-small text-muted-foreground">
                    {formatPublishedDate(post.publishedAt)}
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
              setSearchQuery(null)
              setSelectedCategory(null)
            }}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
