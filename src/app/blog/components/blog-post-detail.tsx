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
                  className="gradient-cta text-foreground border-0"
                >
                  {post.category.name}
                </Badge>
              </div>
            )}
            {post.featured && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-warning text-warning border-0">
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-muted-foreground dark:text-muted-foreground mb-8 leading-relaxed">
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
                className="hover:bg-primary/5 hover:border-primary/30 hover:text-primary dark:hover:bg-primary/20/20 transition-colors cursor-pointer"
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
        className="flex items-center justify-between py-6 border-y border-border dark:border-border mb-8"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={cn(
              'flex items-center gap-2',
              isLiked && 'text-destructive border-destructive/30 bg-destructive/5 dark:bg-destructive/20/20'
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
              isBookmarked && 'text-primary border-primary/30 bg-primary/5 dark:bg-primary/20/20'
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
          <Card className="glass rounded-2xl mb-12">
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
                    <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                      {post.author.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.author.totalPosts} posts</span>
                    <span>{post.author.totalViews} views</span>
                    {post.author.website && (
                      <a
                        href={post.author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary transition-colors"
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
              <Card className="glass rounded-2xl hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="w-4 h-4" />
                    Previous Post
                  </div>
                  <a
                    href={`/blog/${previousPost.slug}`}
                    className="block group"
                  >
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {previousPost.title}
                    </h4>
                    {previousPost.excerpt && (
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2 line-clamp-2">
                        {previousPost.excerpt}
                      </p>
                    )}
                  </a>
                </CardContent>
              </Card>
            )}

            {nextPost && (
              <Card className="glass rounded-2xl hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                    Next Post
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <a
                    href={`/blog/${nextPost.slug}`}
                    className="block group text-right"
                  >
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                    {nextPost.excerpt && (
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2 line-clamp-2">
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
                className="glass rounded-2xl hover:scale-105 transition-transform duration-300"
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
                      <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {relatedPost.title}
                      </h4>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2 mb-3">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
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