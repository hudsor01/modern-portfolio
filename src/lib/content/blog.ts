import { cache } from 'react'
import { db } from '@/lib/db'
import { transformToBlogPostData } from '@/lib/api/blog-transformers'
import type { BlogPostData } from '@/types/shared-api'

/**
 * Server-side blog content fetchers
 * Uses React cache for deduplication within a single render
 */

// Get single blog post by slug
export const getBlogPost = cache(async (slug: string): Promise<BlogPostData | null> => {
  try {
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!post) {
      return null
    }

    return transformToBlogPostData(post)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
})

// Get all published blog posts
export const getBlogPosts = cache(async (): Promise<BlogPostData[]> => {
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    })

    return posts.map(transformToBlogPostData)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
})
