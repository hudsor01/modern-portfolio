'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useBlogPosts, useBlogCategories } from '@/hooks/use-api-queries'
import { TagFilter } from './tag-filter'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function BlogPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Fetch all posts
  const { data: postsData, isLoading: postsLoading } = useBlogPosts({
    filters: { published: true },
    sort: { field: 'publishedAt', order: 'desc' },
    page: 1,
    limit: 50,
  })

  // Fetch categories
  const { data: categories = [] } = useBlogCategories()

  // Build category list with "All" option
  const categoryTags = useMemo(() => {
    return ['All', ...categories.map((c) => c.name)]
  }, [categories])

  // Count posts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: postsData?.data?.length || 0 }
    postsData?.data?.forEach((post) => {
      if (post.category?.name) {
        counts[post.category.name] = (counts[post.category.name] || 0) + 1
      }
    })
    return counts
  }, [postsData?.data])

  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (!postsData?.data) return []
    if (selectedCategory === 'All') return postsData.data
    return postsData.data.filter((post) => post.category?.name === selectedCategory)
  }, [postsData?.data, selectedCategory])

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="portfolio-container portfolio-section">
      {/* Header */}
      <header className="mb-10">
        <h1 className="heading-page mb-2">Blog</h1>
        <p className="text-body-lg">
          Insights on revenue operations, data analytics, and business growth strategies.
        </p>
      </header>

      {/* Category Filter */}
      <div className="mb-10">
        <TagFilter
          tags={categoryTags}
          selectedTag={selectedCategory}
          tagCounts={categoryCounts}
          onTagChange={setSelectedCategory}
        />
      </div>

      {/* Posts Grid */}
      {postsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-card border border-border overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
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
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt || ''}</CardDescription>
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
          <p className="typography-muted">No posts found.</p>
        </div>
      )}
    </div>
  )
}
