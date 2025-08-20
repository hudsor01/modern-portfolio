'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { m as motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Tag,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { BlogContent } from './blog-content'
import { BlogMetadata } from './blog-metadata'
import { BlogShareButtons } from './blog-share-buttons'
import { cn } from '@/lib/utils'
import type { BlogPost, BlogPostSummary } from '@/types/blog'

interface BlogPostDetailProps {
  post: BlogPost
  relatedPosts?: BlogPostSummary[]
  previousPost?: BlogPostSummary
  nextPost?: BlogPostSummary
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onShare?: (postId: string) => void
  showRelated?: boolean
  showNavigation?: boolean
  className?: string
}

export function BlogPostDetail({
  post,
  relatedPosts = [],
  previousPost,
  nextPost,
  onLike,
  onBookmark,
  onShare,
  showRelated = true,
  showNavigation = true,
  className
}: Readonly<BlogPostDetailProps>) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(post.id)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(post.id)
  }

  const handleShare = () => {
    onShare?.(post.id)
  }


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.article
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('max-w-4xl mx-auto', className)}
    >
      {/* Header Section */}
      <motion.header variants={itemVariants} className="mb-8">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
            />
            {post.category && (
              <div className="absolute top-4 left-4">
                <Badge
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
                >
                  {post.category.name}
                </Badge>
              </div>
            )}
            {post.featured && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-500 text-yellow-900 border-0">
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Metadata */}
        <BlogMetadata
          author={post.author}
          publishedAt={post.publishedAt}
          readingTime={post.readingTime}
          viewCount={post.viewCount}
          commentCount={post.commentCount}
          className="mb-6"
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="opacity-20" />
      </motion.header>

      {/* Content Section */}
      <motion.div variants={itemVariants} className="mb-12">
        <BlogContent content={post.content} contentType={post.contentType} />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between py-6 border-y border-gray-200 dark:border-gray-700 mb-8"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={cn(
              'flex items-center gap-2',
              isLiked && 'text-red-600 border-red-300 bg-red-50 dark:bg-red-900/20'
            )}
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
            <span>{likeCount}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              'flex items-center gap-2',
              isBookmarked && 'text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-900/20'
            )}
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
            Bookmark
          </Button>

          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentCount || 0}</span>
          </Button>
        </div>

        <BlogShareButtons
          url={`/blog/${post.slug}`}
          title={post.title}
          excerpt={post.excerpt}
          onShare={handleShare}
        />
      </motion.div>

      {/* Author Bio */}
      {post.author && (
        <motion.div variants={itemVariants}>
          <Card className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl mb-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    About {post.author.name}
                  </h3>
                  {post.author.bio && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.author.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.author.totalPosts} posts</span>
                    <span>{post.author.totalViews} views</span>
                    {post.author.website && (
                      <a
                        href={post.author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      {showNavigation && (previousPost || nextPost) && (
        <motion.div variants={itemVariants} className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previousPost && (
              <Card className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <ArrowLeft className="w-4 h-4" />
                    Previous Post
                  </div>
                  <a
                    href={`/blog/${previousPost.slug}`}
                    className="block group"
                  >
                    <h4 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {previousPost.title}
                    </h4>
                    {previousPost.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {previousPost.excerpt}
                      </p>
                    )}
                  </a>
                </CardContent>
              </Card>
            )}

            {nextPost && (
              <Card className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mb-2">
                    Next Post
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <a
                    href={`/blog/${nextPost.slug}`}
                    className="block group text-right"
                  >
                    <h4 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                    {nextPost.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {nextPost.excerpt}
                      </p>
                    )}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      )}

      {/* Related Posts */}
      {showRelated && relatedPosts.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.slice(0, 3).map((relatedPost) => (
              <Card
                key={relatedPost.id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                <CardContent className="p-0">
                  {relatedPost.featuredImage && (
                    <div className="aspect-video w-full relative rounded-t-2xl overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <a
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <h4 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                        {relatedPost.title}
                      </h4>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {relatedPost.publishedAt
                              ? formatDistanceToNow(relatedPost.publishedAt, { addSuffix: true })
                              : 'Draft'
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{relatedPost.readingTime || 5} min</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.article>
  )
}