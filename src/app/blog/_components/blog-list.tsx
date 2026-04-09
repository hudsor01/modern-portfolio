'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useQueryState } from 'nuqs'
import type { BlogPostData, BlogCategoryData } from '@/types/api'
import { BlogTagFilter } from './blog-tag-filter'
import { InlineMarkdown } from './inline-markdown'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BlogListProps {
  initialPosts: BlogPostData[]
  initialCategories: BlogCategoryData[]
}

/**
 * Official Next.js 16 / React 19 Pattern: Client Component with Server-Provided Data
 *
 * Data is fetched on the server and passed as props.
 * This component only handles client-side filtering via URL state.
 * No client-side fetching - zero cost, instant load.
 */
export function BlogList({ initialPosts, initialCategories }: BlogListProps) {
  // URL state management with nuqs - shareable category links
  const [selectedCategory, setSelectedCategory] = useQueryState('category', { defaultValue: 'All' })

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

  // Filter posts by selected category
  const filteredPosts = selectedCategory === 'All'
    ? initialPosts
    : initialPosts.filter((post) => post.category?.name === selectedCategory)

  function formatDate(dateString: string | undefined): string {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
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
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    <InlineMarkdown value={post.title} />
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt ? <InlineMarkdown value={post.excerpt} /> : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <time className="typography-small text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </time>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="typography-muted">No posts found in this category.</p>
        </div>
      )}
    </div>
  )
}
