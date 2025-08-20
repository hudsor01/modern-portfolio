'use client'

import { m } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import { BlogComment } from '@/types/blog'
import { BlogContent } from '@/components/blog/blog-content'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { usePageAnalytics } from '@/hooks/use-page-analytics'

// Layout components
import { PostBreadcrumb } from './layout/post-breadcrumb'
import { PostHeader } from './layout/post-header'
import { PostFeaturedImage } from './layout/post-featured-image'
import { PostSocialActions } from './layout/post-social-actions'
import { PostAuthorBio } from './layout/post-author-bio'
import { PostNavigation } from './layout/post-navigation'
import { PostComments } from './layout/post-comments'
import { PostTableOfContents } from './layout/post-table-of-contents'
import { PostRelatedPosts } from './layout/post-related-posts'

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
  // Track page analytics
  usePageAnalytics({
    type: 'blog',
    slug: post.slug,
    trackReadingTime: true,
    trackScrollDepth: true
  })
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
    <m.article
      className={cn('min-h-screen', className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ReadingProgress />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PostBreadcrumb post={post} itemVariants={itemVariants} />
        <PostHeader post={post} itemVariants={itemVariants} />
        <PostFeaturedImage post={post} itemVariants={itemVariants} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <m.main 
            className="lg:col-span-3"
            variants={itemVariants}
          >
            <PostSocialActions post={post} showSocialShare={showSocialShare} />

            <BlogContent 
              content={post.content}
              contentType={post.contentType}
              className="mb-8"
            />

            <Separator className="my-12" />

            <PostAuthorBio post={post} itemVariants={itemVariants} show={showAuthorBio} />
            <PostNavigation post={post} itemVariants={itemVariants} />
            <PostComments comments={comments} itemVariants={itemVariants} show={showComments} />
          </m.main>

          <m.aside 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <PostTableOfContents content={post.content} />
          </m.aside>
        </div>

        <PostRelatedPosts post={post} itemVariants={itemVariants} show={showRelatedPosts} />
      </div>
    </m.article>
  )
}