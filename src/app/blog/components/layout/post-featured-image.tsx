'use client'

import { m as motion } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import Image from 'next/image'
import { MotionVariant } from '@/types/ui'

interface PostFeaturedImageProps {
  post: BlogPostData
  itemVariants: MotionVariant
}

export function PostFeaturedImage({ post, itemVariants }: PostFeaturedImageProps) {
  if (!post.featuredImage) return null

  return (
    <motion.div
      className="mb-12"
      variants={itemVariants}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted dark:bg-card">
        <Image
          src={post.featuredImage}
          alt={post.featuredImageAlt || post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
    </motion.div>
  )
}