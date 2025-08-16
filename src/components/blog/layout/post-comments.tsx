'use client'

import { motion } from 'framer-motion'
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
  )
}