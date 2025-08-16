'use client'

import { motion } from 'framer-motion'
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
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
          >
            {post.category.name}
          </Badge>
        )}
        {post.tags && post.tags.map(tag => (
          <Badge key={tag.id || tag.name} variant="outline">
            {typeof tag === 'object' && 'name' in tag ? tag.name : String(tag)}
          </Badge>
        ))}
        {post.featured && (
          <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
            Featured
          </Badge>
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        {post.title}
      </h1>

      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        {post.excerpt}
      </p>

      {/* Author and Meta Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author.name}</div>
            {post.author.title && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.author.title}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.publishedAt 
              ? formatDistanceToNow(post.publishedAt, { addSuffix: true })
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