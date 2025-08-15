'use client'

import Image from 'next/image'
import { Calendar, Clock, Tag, Edit, Trash2, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { BlogPostSummary } from '@/types/blog'
import type { BlogPostData } from '@/types/shared-api'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  post: BlogPostData | BlogPostSummary
  onClick?: (post: BlogPostData | BlogPostSummary) => void
  onEdit?: (post: BlogPostData | BlogPostSummary) => void
  onDelete?: (post: BlogPostData | BlogPostSummary) => void
  showActions?: boolean
  variant?: 'default' | 'compact'
}

export function BlogCard({ 
  post, 
  onClick, 
  onEdit, 
  onDelete, 
  showActions = false,
  variant = 'default'
}: BlogCardProps) {
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when action buttons are clicked
    if ((e.target as HTMLElement).closest('[data-action-button]')) {
      return
    }
    onClick?.(post)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(post)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(post)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(post)
  }

  const truncateExcerpt = (text: string, maxLength: number = 160) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }


  const formatPublishedDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date'
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  return (
    <Card
      data-testid="blog-card"
      className={cn(
        'group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg',
        'bg-white/5 backdrop-blur border border-white/10 rounded-3xl',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        variant === 'compact' && 'blog-card--compact'
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Blog post: ${post.title}`}
    >
      <CardHeader className="p-0">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onLoad={() => {}}
              data-testid="next-image"
            />
          ) : (
            <div 
              data-testid="image-placeholder"
              className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              <Tag className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Featured Badge */}
          {post.featured && (
            <Badge
              data-testid="featured-badge"
              className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
            >
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="absolute top-3 left-3 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleEdit}
                data-action-button
                aria-label="Edit post"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                data-action-button
                aria-label="Delete post"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600 dark:text-gray-400">
          {post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category.name}
            </Badge>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{post.publishedAt ? formatPublishedDate(post.publishedAt) : 'Draft'}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          data-testid="blog-card-title"
          className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2"
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p 
            data-testid="blog-excerpt"
            className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
          >
            {truncateExcerpt(post.excerpt)}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="text-xs px-2 py-1"
            >
              {tag.name}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-1"
            >
              +{post.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{post.readingTime || 5} min read</span>
        </div>
      </CardContent>
    </Card>
  )
}