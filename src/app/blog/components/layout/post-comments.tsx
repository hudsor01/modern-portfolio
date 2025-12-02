'use client'

import { m as motion } from 'framer-motion'
import { BlogComment } from '@/types/blog'
import { MessageCircle } from 'lucide-react'
import { MotionVariant } from '@/types/ui'

interface PostCommentsProps {
  comments?: BlogComment[]
  itemVariants: MotionVariant
  show?: boolean
}

export function PostComments({ comments = [], itemVariants, show = true }: PostCommentsProps) {
  if (!show) return null

  return (
    <motion.div variants={itemVariants}>
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments?.length || 0})
        </h3>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Comments system is coming soon.
        </p>
      </div>
    </motion.div>
  )
}