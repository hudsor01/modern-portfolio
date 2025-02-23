"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: {
    id: string
    title: string
    excerpt?: string
    date: string
    slug: string
  }
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-lg border p-6 hover:shadow-md"
    >
      <div className="flex flex-col space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}
        <time dateTime={post.date} className="text-sm text-muted-foreground">
          {formatDate(post.date)}
        </time>
      </div>
    </motion.div>
  )
}

