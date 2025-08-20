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
  )
}