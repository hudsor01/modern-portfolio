'use client'

import { m as motion } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Clock, Eye, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { MotionVariant } from '@/types/ui'

interface PostHeaderProps {
  post: BlogPostData
  itemVariants: MotionVariant
}

export function PostHeader({ post, itemVariants }: PostHeaderProps) {
  return (
    <motion.header 
      className="mb-12"
      variants={itemVariants}
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {post.category && (
          <Badge 
            variant="secondary"
            className="gradient-cta text-white"
          >
            {post.category.name}
          </Badge>
        )}
        {post.tags && post.tags.map(tag => (
          <Badge key={tag.id || tag.name} variant="outline">
            {typeof tag === 'object' && 'name' in tag ? tag.name : String(tag)}
          </Badge>
        ))}
        {'featured' in post && post.featured && (
          <Badge className="bg-warning/20 text-warning dark:text-warning">
            Featured
          </Badge>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        {post.title}
      </h1>

      <p className="text-xl text-muted-foreground dark:text-muted-foreground mb-8 leading-relaxed">
        {post.excerpt}
      </p>

      {/* Author and Meta Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {post.author && (
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.author.name}</div>
              {post.author.bio && (
                <div className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-1">
                  {post.author.bio}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground dark:text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.publishedAt
              ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
              : 'Draft'
            }
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime} min read
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.viewCount.toLocaleString()} views
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.commentCount} comments
          </div>
        </div>
      </div>
    </motion.header>
  )
}