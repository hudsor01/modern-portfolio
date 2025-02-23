"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useSearchParams } from "next/navigation"
import { BlogCard } from "@/components/blog/blog-card"
import type { BlogPost } from "@/types/blog"

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const tag = searchParams.get("tag")
  const search = searchParams.get("search")

  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      if (category && !post.categories.includes(category)) {
        return false
      }
      if (tag && !post.tags.includes(tag)) {
        return false
      }
      if (search) {
        const searchLower = search.toLowerCase()
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          post.categories.some((cat) => cat.toLowerCase().includes(searchLower)) ||
          post.tags.some((t) => t.toLowerCase().includes(searchLower))
        )
      }
      return true
    })
  }, [posts, category, tag, search])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-6 sm:grid-cols-2"
    >
      {filteredPosts.map((post, index) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <BlogCard post={post} />
        </motion.div>
      ))}
      {filteredPosts.length === 0 && (
        <div className="col-span-full text-center">
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      )}
    </motion.div>
  )
}

