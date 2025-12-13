/**
 * Data Access Layer (DAL)
 * Centralizes all data access
 *
 * This is the ONLY place in the application that should:
 * 1. Access the database directly
 * 2. Handle data validation and sanitization
 *
 * @see https://nextjs.org/docs/app/guides/data-fetching
 */
import 'server-only'
import { cache } from 'react'
import { db } from '@/lib/db'
import { createContextLogger } from '@/lib/monitoring/logger'
import { ProjectDataManager } from '@/lib/server/project-data-manager'
import type { Project } from '@/types/project'

const logger = createContextLogger('DAL')

// For portfolio site, direct access is acceptable as all data is publicly accessible
// No authentication required for public-facing portfolio

// ============================================================================
// Project Data Access
// ============================================================================

/**
 * Get all projects
 * Public access - no auth required
 * Uses existing ProjectDataManager for consistency
 */
export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    return await ProjectDataManager.getProjects()
  } catch (error) {
    logger.error('Failed to get projects', error instanceof Error ? error : new Error(String(error)))
    return []
  }
})

/**
 * Get a single project by slug
 */
export const getProject = cache(async (slug: string): Promise<Project | null> => {
  try {
    return await ProjectDataManager.getProjectBySlug(slug)
  } catch (error) {
    logger.error(`Failed to get project ${slug}`, { error: error instanceof Error ? error.message : String(error) })
    return null
  }
})

/**
 * Get project slugs for static generation
 */
export const getProjectSlugs = cache(async (): Promise<string[]> => {
  try {
    const projects = await ProjectDataManager.getProjects()
    return projects.map(p => p.slug).filter((s): s is string => s !== undefined)
  } catch (error) {
    logger.error('Failed to get project slugs', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
})

// ============================================================================
// Blog Data Access
// ============================================================================

export interface BlogPostData {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  author: string
  category?: string
  tags?: string[]
  publishedAt?: string
  updatedAt?: string
  readingTime?: number
}

/**
 * Get all published blog posts
 */
export const getBlogPosts = cache(async (): Promise<BlogPostData[]> => {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        authorId: true,
        categoryId: true,
        category: {
          select: { name: true }
        },
        tags: {
          select: {
            tag: {
              select: { name: true }
            }
          }
        },
        publishedAt: true,
        updatedAt: true,
        readingTime: true,
      },
      orderBy: { publishedAt: 'desc' },
    })

    return posts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? undefined,
      content: p.content,
      author: p.authorId || 'Richard Hudson',
      category: p.category?.name ?? undefined,
      tags: p.tags.map(t => t.tag.name),
      publishedAt: p.publishedAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
      readingTime: p.readingTime ?? undefined,
    }))
  } catch (error) {
    // Return empty array if database unavailable
    logger.warn('Database unavailable for blog posts', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
})

/**
 * Get a single blog post by slug
 */
export const getBlogPost = cache(async (slug: string): Promise<BlogPostData | null> => {
  try {
    const post = await db.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        authorId: true,
        categoryId: true,
        category: {
          select: { name: true }
        },
        tags: {
          select: {
            tag: {
              select: { name: true }
            }
          }
        },
        publishedAt: true,
        updatedAt: true,
        readingTime: true,
      },
    })

    if (!post) return null

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? undefined,
      content: post.content,
      author: post.authorId || 'Richard Hudson',
      category: post.category?.name ?? undefined,
      tags: post.tags.map(t => t.tag.name),
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      readingTime: post.readingTime ?? undefined,
    }
  } catch (error) {
    logger.warn(`Database unavailable for blog post ${slug}`, { error: error instanceof Error ? error.message : String(error) })
    return null
  }
})

/**
 * Get blog post slugs for static generation
 */
export const getBlogSlugs = cache(async (): Promise<string[]> => {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    })
    return posts.map(p => p.slug)
  } catch {
    return []
  }
})

// ============================================================================
// Contact Form
// ============================================================================

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
  company?: string
  phone?: string
  budget?: string
  timeline?: string
}

/**
 * Submit contact form
 * Rate-limited at API layer, this just handles data
 * Note: ContactSubmission model doesn't exist in Prisma -
 * this is handled by Resend email service directly
 */
export const submitContact = async (data: ContactSubmission): Promise<{ success: boolean }> => {
  // Contact form submissions are handled by Resend email service
  // This DAL function is a placeholder for potential future database storage
  logger.info('Contact submission received', {
    name: data.name,
    email: data.email,
    subject: data.subject
  })
  return { success: true }
}

// ============================================================================
// Analytics (Admin Only)
// ============================================================================

/**
 * Get analytics data
 * For portfolio analytics (removed admin requirement)
 */
export const getAnalytics = cache(async () => {
  try {
    const views = await db.postView.count()

    return {
      totalViews: views,
    }
  } catch (error) {
    logger.error('Failed to get analytics', error instanceof Error ? error : new Error(String(error)))
    return { totalViews: 0 }
  }
})

// Re-export types for convenience
export type { Project }
