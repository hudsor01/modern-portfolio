'use client'

import { m as motion } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MotionVariant } from '@/types/ui'

interface PostNavigationProps {
  post: BlogPostData
  itemVariants: MotionVariant
}

export function PostNavigation({ post, itemVariants }: PostNavigationProps) {
  if (!post.previousPost && !post.nextPost) return null

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
      variants={itemVariants}
    >
      {post.previousPost && (
        <a
          href={`/blog/${post.previousPost.slug}`}
          className="group p-6 glass rounded-2xl hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground mb-2">
            <ChevronLeft className="h-4 w-4" />
            Previous Post
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {post.previousPost.title}
          </h3>
        </a>
      )}

      {post.nextPost && (
        <a
          href={`/blog/${post.nextPost.slug}`}
          className="group p-6 glass rounded-2xl hover:bg-white/10 transition-colors text-right"
        >
          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground dark:text-muted-foreground mb-2">
            Next Post
            <ChevronRight className="h-4 w-4" />
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {post.nextPost.title}
          </h3>
        </a>
      )}
    </motion.div>
  )
}