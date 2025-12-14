'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import type { BlogPostData, BlogCategoryData } from '@/types/shared-api'

interface BlogPostsResponse {
  data: BlogPostData[]
  success: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
import { TagFilter } from './tag-filter'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function BlogPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Fetch all posts - direct TanStack Query usage
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['blog', 'posts', { published: true }, { field: 'publishedAt', order: 'desc' }, 1, 50],
    queryFn: async (): Promise<BlogPostsResponse> => {
      const searchParams = new URLSearchParams()
      searchParams.append('page', '1')
      searchParams.append('limit', '50')
      searchParams.append('sortBy', 'publishedAt')
      searchParams.append('sortOrder', 'desc')
      searchParams.append('published', 'true')
      
      const response = await fetch(`/api/blog?${searchParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  // Fetch categories - direct TanStack Query usage
  const { data: categories = [] } = useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: async (): Promise<BlogCategoryData[]> => {
      const response = await fetch('/api/blog/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const result = await response.json()
      return result.success ? result.data : result
    },
    staleTime: 15 * 60 * 1000,
  })

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
