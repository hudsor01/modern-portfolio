'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import { BlogComment } from '@/types/blog'
import { BlogShareButtons } from '@/components/blog/blog-share-buttons'
import { BlogContent } from '@/components/blog/blog-content'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { 
  Calendar, 
  Clock, 
  Eye, 
  MessageCircle, 
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Printer,
  Heart
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface BlogPostLayoutProps {
  post: BlogPostData
  comments?: BlogComment[]
  className?: string
  showComments?: boolean
  showRelatedPosts?: boolean
  showAuthorBio?: boolean
  showSocialShare?: boolean
}

export function BlogPostLayout({
  post,
  comments = [],
  className,
  showComments = true,
  showRelatedPosts = true,
  showAuthorBio = true,
  showSocialShare = true
}: BlogPostLayoutProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [tableOfContents, setTableOfContents] = useState<{
    id: string
    text: string
    level: number
  }[]>([])

  // Extract table of contents from content
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const toc = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`
      heading.id = id
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      }
    })
    setTableOfContents(toc)
  }, [post.content])

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${post.id}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setIsBookmarked(!isBookmarked)
      }
    } catch (error) {
      console.error('Failed to bookmark post:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.article
      className={cn('min-h-screen', className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ReadingProgress />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <motion.div variants={itemVariants}>
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              {post.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/blog/category/${post.category.slug}`}>
                      {post.category.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Post Header */}
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

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div 
            className="mb-12"
            variants={itemVariants}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
            {post.featuredImage.caption && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                {post.featuredImage.caption}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.main 
            className="lg:col-span-3"
            variants={itemVariants}
          >
            {/* Social Actions */}
            <div className="flex items-center justify-between mb-8 p-4 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    "flex items-center gap-2",
                    isLiked && "text-red-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                  {likeCount}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={cn(
                    "flex items-center gap-2",
                    isBookmarked && "text-blue-500"
                  )}
                >
                  <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>

              {showSocialShare && (
                <BlogShareButtons
                  url={`https://richardwhudsonjr.com/blog/${post.slug}`}
                  title={post.title}
                  description={post.excerpt || ''}
                />
              )}
            </div>

            {/* Content */}
            <BlogContent 
              content={post.content}
              contentType={post.contentType}
              className="mb-8"
            />

            <Separator className="my-12" />

            {/* Author Bio */}
            {showAuthorBio && post.author && (
              <motion.div variants={itemVariants} className="mb-8">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>
                        {post.author.name?.split(' ').map(n => n[0]).join('') || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{post.author.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {post.author.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Post Navigation */}
            {(post.previousPost || post.nextPost) && (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
                variants={itemVariants}
              >
                {post.previousPost && (
                  <a
                    href={`/blog/${post.previousPost.slug}`}
                    className="group p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <ChevronLeft className="h-4 w-4" />
                      Previous Post
                    </div>
                    <h3 className="font-semibold group-hover:text-blue-500 transition-colors">
                      {post.previousPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {post.previousPost.excerpt}
                    </p>
                  </a>
                )}

                {post.nextPost && (
                  <a
                    href={`/blog/${post.nextPost.slug}`}
                    className="group p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-right"
                  >
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Next Post
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold group-hover:text-blue-500 transition-colors">
                      {post.nextPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {post.nextPost.excerpt}
                    </p>
                  </a>
                )}
              </motion.div>
            )}

            {/* Comments */}
            {showComments && (
              <motion.div variants={itemVariants}>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comments ({comments?.length || 0})
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Comments system is coming soon.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.main>

          {/* Sidebar */}
          <motion.aside 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="sticky top-8">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={cn(
                          "block w-full text-left text-sm hover:text-blue-500 transition-colors",
                          `ml-${(item.level - 1) * 4}`,
                          item.level === 1 && "font-medium",
                          item.level > 1 && "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </motion.aside>
        </div>

        {/* Related Posts */}
        {showRelatedPosts && post.relatedPosts && post.relatedPosts.length > 0 && (
          <motion.section 
            className="mt-16"
            variants={itemVariants}
          >
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Related Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {post.relatedPosts.slice(0, 3).map((relatedPost) => (
                  <div key={relatedPost.relatedPost?.id} className="space-y-3">
                    <h4 className="font-semibold hover:text-blue-500 transition-colors">
                      <a href={`/blog/${relatedPost.relatedPost?.slug}`}>
                        {relatedPost.relatedPost?.title}
                      </a>
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {relatedPost.relatedPost?.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </motion.article>
  )
}