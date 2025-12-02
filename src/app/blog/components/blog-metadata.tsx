'use client'

import React from 'react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  Calendar, 
  Clock, 
  Eye, 
  MessageCircle, 
 
  Heart,
  Share2,
  Edit
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { BlogAuthor } from '@/types/blog'

interface BlogMetadataProps {
  author?: BlogAuthor
  publishedAt?: Date
  updatedAt?: Date
  readingTime?: number
  viewCount?: number
  commentCount?: number
  likeCount?: number
  shareCount?: number
  category?: {
    name: string
    slug: string
    color?: string
  }
  tags?: Array<{
    name: string
    slug: string
    color?: string
  }>
  showAuthor?: boolean
  showStats?: boolean
  showCategory?: boolean
  showTags?: boolean
  showUpdatedDate?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  orientation?: 'horizontal' | 'vertical'
  className?: string
  onAuthorClick?: (authorSlug: string) => void
  onCategoryClick?: (categorySlug: string) => void
  onTagClick?: (tagSlug: string) => void
}

export function BlogMetadata({
  author,
  publishedAt,
  updatedAt,
  readingTime = 5,
  viewCount = 0,
  commentCount = 0,
  likeCount = 0,
  shareCount = 0,
  category,
  tags = [],
  showAuthor = true,
  showStats = true,
  showCategory = false,
  showTags = false,
  showUpdatedDate = false,
  variant = 'default',
  orientation = 'horizontal',
  className,
  onAuthorClick,
  onCategoryClick,
  onTagClick
}: BlogMetadataProps) {
  const formatDate = (date: Date, relative: boolean = true) => {
    if (relative) {
      return formatDistanceToNow(date, { addSuffix: true })
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }

  const statsItems = [
    { icon: Eye, value: viewCount, label: 'views', color: 'text-primary' },
    { icon: Heart, value: likeCount, label: 'likes', color: 'text-destructive' },
    { icon: MessageCircle, value: commentCount, label: 'comments', color: 'text-success' },
    { icon: Share2, value: shareCount, label: 'shares', color: 'text-purple-600' }
  ]

  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn('flex items-center gap-3 text-sm text-muted-foreground dark:text-muted-foreground', className)}
      >
        {showAuthor && author && (
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="text-xs">
                {getAuthorInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{author.name}</span>
          </motion.div>
        )}
        
        {publishedAt && (
          <motion.div variants={itemVariants} className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <time dateTime={publishedAt.toISOString()}>
              {formatDate(publishedAt)}
            </time>
          </motion.div>
        )}
        
        <motion.div variants={itemVariants} className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{readingTime} min read</span>
        </motion.div>
      </motion.div>
    )
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'space-y-6',
          orientation === 'horizontal' && 'md:space-y-0 md:grid md:grid-cols-2 md:gap-8',
          className
        )}
      >
        {/* Author Section */}
        {showAuthor && author && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>
                  {getAuthorInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-foreground dark:text-white">
                  {author.name}
                </h4>
                {author.bio && (
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1 line-clamp-2">
                    {author.bio}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{author.totalPosts} posts</span>
                  <span>{author.totalViews.toLocaleString()} views</span>
                  {author.website && (
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-primary"
                      onClick={() => onAuthorClick?.(author.slug)}
                    >
                      <Link href={`/blog/author/${author.slug}`}>
                        View Profile
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Metadata Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {publishedAt && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Published</div>
                  <time dateTime={publishedAt.toISOString()} className="text-muted-foreground dark:text-muted-foreground">
                    {formatDate(publishedAt, false)}
                  </time>
                </div>
              </div>
            )}
            
            {showUpdatedDate && updatedAt && publishedAt && updatedAt > publishedAt && (
              <div className="flex items-center gap-2 text-sm">
                <Edit className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Updated</div>
                  <time dateTime={updatedAt.toISOString()} className="text-muted-foreground dark:text-muted-foreground">
                    {formatDate(updatedAt, false)}
                  </time>
                </div>
              </div>
            )}
          </div>

          {showStats && (
            <div className="flex flex-wrap gap-4">
              {statsItems.map(({ icon: Icon, value, label, color }) => (
                value > 0 && (
                  <div key={label} className="flex items-center gap-1 text-sm">
                    <Icon className={cn('w-4 h-4', color)} />
                    <span className="font-medium">{value.toLocaleString()}</span>
                    <span className="text-muted-foreground dark:text-muted-foreground">{label}</span>
                  </div>
                )
              ))}
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="font-medium">{readingTime}</span>
                <span className="text-muted-foreground dark:text-muted-foreground">min read</span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-wrap items-center gap-4',
        orientation === 'vertical' && 'flex-col items-start gap-3',
        className
      )}
    >
      {/* Author */}
      {showAuthor && author && (
        <motion.div variants={itemVariants}>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={() => onAuthorClick?.(author.slug)}
          >
            <Link href={`/blog/author/${author.slug}`} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>
                  {getAuthorInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-medium text-foreground dark:text-white">
                  {author.name}
                </div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                  {author.totalPosts} posts
                </div>
              </div>
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Separator */}
      {showAuthor && author && (publishedAt || showStats) && (
        <Separator orientation="vertical" className="h-12 opacity-30" />
      )}

      {/* Date & Reading Time */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm text-muted-foreground dark:text-muted-foreground">
        {publishedAt && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={publishedAt.toISOString()}>
              {formatDate(publishedAt)}
            </time>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{readingTime} min read</span>
        </div>
      </motion.div>

      {/* Stats */}
      {showStats && (
        <motion.div variants={itemVariants} className="flex items-center gap-3 text-sm text-muted-foreground dark:text-muted-foreground">
          {viewCount > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{viewCount.toLocaleString()}</span>
            </div>
          )}
          {commentCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{commentCount}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Category */}
      {showCategory && category && (
        <motion.div variants={itemVariants}>
          <Button
            asChild
            variant="outline"
            size="sm"
            onClick={() => onCategoryClick?.(category.slug)}
          >
            <Link href={`/blog/category/${category.slug}`}>
              <Badge
                style={{ backgroundColor: category.color }}
                className="text-white border-0"
              >
                {category.name}
              </Badge>
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Tags */}
      {showTags && tags.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Button
              key={tag.slug}
              asChild
              variant="outline"
              size="sm"
              onClick={() => onTagClick?.(tag.slug)}
            >
              <Link href={`/blog/tag/${tag.slug}`}>
                <Badge variant="secondary" className="hover:bg-muted dark:hover:bg-muted">
                  {tag.name}
                </Badge>
              </Link>
            </Button>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}