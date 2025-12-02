'use client'

import { m as motion } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MotionVariant } from '@/types/ui'

interface PostAuthorBioProps {
  post: BlogPostData
  itemVariants: MotionVariant
  show?: boolean
}

export function PostAuthorBio({ post, itemVariants, show = true }: PostAuthorBioProps) {
  if (!show || !post.author) return null

  return (
    <motion.div variants={itemVariants} className="mb-8">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name?.split(' ').map(n => n[0]).join('') || 'A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{post.author.name}</h3>
            <p className="text-muted-foreground dark:text-muted-foreground">
              {post.author.bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}