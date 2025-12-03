'use client'

import { m as motion } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import { MotionVariant } from '@/types/ui'

interface PostRelatedPostsProps {
  post: BlogPostData
  itemVariants: MotionVariant
  show?: boolean
}

export function PostRelatedPosts({ post, itemVariants, show = true }: PostRelatedPostsProps) {
  if (!show || !post.relatedPosts || post.relatedPosts.length === 0) return null

  return (
    <motion.section 
      className="mt-16"
      variants={itemVariants}
    >
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Related Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {post.relatedPosts.slice(0, 3).map((relatedPost) => (
            <div key={relatedPost.id} className="space-y-3">
              <h4 className="font-semibold hover:text-primary transition-colors">
                <a href={`/blog/${relatedPost.slug}`}>
                  {relatedPost.title}
                </a>
              </h4>
              {relatedPost.excerpt && (
                <p className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2">
                  {relatedPost.excerpt}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}