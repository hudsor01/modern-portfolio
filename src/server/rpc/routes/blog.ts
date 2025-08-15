/**
 * Blog CRUD RPC Routes
 * Handles blog post operations with Prisma integration and file uploads
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { 
  BlogPostSchema,
  BlogPostCreateSchema,
  BlogPostUpdateSchema,
  BlogPostFiltersSchema,
  BlogCategorySchema,
  BlogTagSchema,
  PaginationSchema,
  PaginatedResponse,
  RPCResponse,
  RPCContext,
  FileUploadSchema,
  UploadedFileSchema
} from '../types'
import { auth, rateLimit, requestContext } from '../middleware'
import { PrismaClient } from '@prisma/client'

const blog = new Hono()
const prisma = new PrismaClient()

// =======================
// BLOG POST CRUD OPERATIONS
// =======================

// Get all blog posts with filtering and pagination
blog.get(
  '/posts',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 60 }), // 60 requests per minute
  requestContext(),
  zValidator('query', BlogPostFiltersSchema.merge(PaginationSchema)),
  async (c) => {
    try {
      const filters = c.req.valid('query')
      const { page, limit, ...filterOptions } = filters

      const skip = (page - 1) * limit

      // Build where clause based on filters
      const where: any = {}

      if (filterOptions.status) {
        if (Array.isArray(filterOptions.status)) {
          where.status = { in: filterOptions.status }
        } else {
          where.status = filterOptions.status
        }
      }

      if (filterOptions.authorId) {
        where.authorId = filterOptions.authorId
      }

      if (filterOptions.categoryId) {
        where.categoryId = filterOptions.categoryId
      }

      if (filterOptions.search) {
        where.OR = [
          { title: { contains: filterOptions.search, mode: 'insensitive' } },
          { content: { contains: filterOptions.search, mode: 'insensitive' } },
          { excerpt: { contains: filterOptions.search, mode: 'insensitive' } },
        ]
      }

      if (filterOptions.published) {
        where.status = 'PUBLISHED'
        where.publishedAt = { not: null }
      }

      if (filterOptions.dateRange) {
        where.createdAt = {
          gte: new Date(filterOptions.dateRange.from),
          lte: new Date(filterOptions.dateRange.to),
        }
      }

      // Get posts with related data
      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                slug: true,
                avatar: true,
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              }
            },
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    color: true,
                  }
                }
              }
            }
          }
        }),
        prisma.blogPost.count({ where })
      ])

      // Transform data to match schema
      const transformedPosts = posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        publishedAt: post.publishedAt?.toISOString(),
        scheduledAt: post.scheduledAt?.toISOString(),
        author: post.author,
        category: post.category,
        tags: post.tags.map(pt => pt.tag),
      }))

      const response: PaginatedResponse<any> = {
        data: transformedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        }
      }

      return c.json<RPCResponse<PaginatedResponse<any>>>({
        success: true,
        data: response,
      })

    } catch (error) {
      console.error('Error fetching blog posts:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch blog posts',
        }
      }, 500)
    }
  }
)

// Get single blog post by slug
blog.get(
  '/posts/:slug',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 100 }),
  async (c) => {
    try {
      const slug = c.req.param('slug')

      const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
          author: true,
          category: true,
          tags: {
            include: { tag: true }
          },
          views: {
            select: { id: true },
            take: 1
          }
        }
      })

      if (!post) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'POST_NOT_FOUND',
            message: 'Blog post not found',
          }
        }, 404)
      }

      // Increment view count
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } }
      })

      const transformedPost = {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        publishedAt: post.publishedAt?.toISOString(),
        scheduledAt: post.scheduledAt?.toISOString(),
        tags: post.tags.map(pt => pt.tag),
      }

      return c.json<RPCResponse<any>>({
        success: true,
        data: transformedPost,
      })

    } catch (error) {
      console.error('Error fetching blog post:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch blog post',
        }
      }, 500)
    }
  }
)

// Create new blog post
blog.post(
  '/posts',
  auth({ required: true, roles: ['admin'] }),
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }),
  requestContext(),
  zValidator('json', BlogPostCreateSchema),
  async (c) => {
    try {
      const postData = c.req.valid('json')
      const context = c.get('rpcContext') as RPCContext

      // Generate slug if not provided
      if (!postData.slug) {
        postData.slug = generateSlug(postData.title)
      }

      // Ensure slug is unique
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: postData.slug }
      })

      if (existingPost) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'SLUG_EXISTS',
            message: 'A post with this slug already exists',
          }
        }, 400)
      }

      // Calculate reading time and word count
      const wordCount = countWords(postData.content)
      const readingTime = Math.ceil(wordCount / 200) // Average reading speed

      const post = await prisma.blogPost.create({
        data: {
          ...postData,
          wordCount,
          readingTime,
          publishedAt: postData.status === 'PUBLISHED' ? new Date() : undefined,
        },
        include: {
          author: true,
          category: true,
        }
      })

      const transformedPost = {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        publishedAt: post.publishedAt?.toISOString(),
        scheduledAt: post.scheduledAt?.toISOString(),
      }

      return c.json<RPCResponse<any>>({
        success: true,
        data: transformedPost,
      })

    } catch (error) {
      console.error('Error creating blog post:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'Failed to create blog post',
        }
      }, 500)
    }
  }
)

// Update blog post
blog.put(
  '/posts/:id',
  auth({ required: true, roles: ['admin'] }),
  rateLimit({ windowMs: 60 * 1000, maxRequests: 20 }),
  requestContext(),
  zValidator('json', BlogPostUpdateSchema),
  async (c) => {
    try {
      const postId = c.req.param('id')
      const updateData = c.req.valid('json')

      const existingPost = await prisma.blogPost.findUnique({
        where: { id: postId }
      })

      if (!existingPost) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'POST_NOT_FOUND',
            message: 'Blog post not found',
          }
        }, 404)
      }

      // Update reading time if content changed
      if (updateData.content) {
        updateData.wordCount = countWords(updateData.content)
        updateData.readingTime = Math.ceil(updateData.wordCount / 200)
      }

      // Set publishedAt if status changed to PUBLISHED
      if (updateData.status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date().toISOString()
      }

      const post = await prisma.blogPost.update({
        where: { id: postId },
        data: updateData,
        include: {
          author: true,
          category: true,
        }
      })

      const transformedPost = {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        publishedAt: post.publishedAt?.toISOString(),
        scheduledAt: post.scheduledAt?.toISOString(),
      }

      return c.json<RPCResponse<any>>({
        success: true,
        data: transformedPost,
      })

    } catch (error) {
      console.error('Error updating blog post:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to update blog post',
        }
      }, 500)
    }
  }
)

// Delete blog post
blog.delete(
  '/posts/:id',
  auth({ required: true, roles: ['admin'] }),
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }),
  async (c) => {
    try {
      const postId = c.req.param('id')

      const existingPost = await prisma.blogPost.findUnique({
        where: { id: postId }
      })

      if (!existingPost) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'POST_NOT_FOUND',
            message: 'Blog post not found',
          }
        }, 404)
      }

      await prisma.blogPost.delete({
        where: { id: postId }
      })

      return c.json<RPCResponse<{ success: boolean }>>({
        success: true,
        data: { success: true },
      })

    } catch (error) {
      console.error('Error deleting blog post:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'Failed to delete blog post',
        }
      }, 500)
    }
  }
)

// =======================
// CATEGORIES
// =======================

blog.get('/categories', async (c) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    const transformedCategories = categories.map(category => ({
      ...category,
      createdAt: category.createdAt.toISOString(),
      postCount: category._count.posts,
    }))

    return c.json<RPCResponse<any[]>>({
      success: true,
      data: transformedCategories,
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch categories',
      }
    }, 500)
  }
})

// =======================
// TAGS
// =======================

blog.get('/tags', async (c) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    const transformedTags = tags.map(tag => ({
      ...tag,
      createdAt: tag.createdAt.toISOString(),
      postCount: tag._count.posts,
    }))

    return c.json<RPCResponse<any[]>>({
      success: true,
      data: transformedTags,
    })

  } catch (error) {
    console.error('Error fetching tags:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch tags',
      }
    }, 500)
  }
})

// =======================
// BLOG ANALYTICS
// =======================

blog.get('/analytics', async (c) => {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      topPosts
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.blogPost.aggregate({ _sum: { viewCount: true } }),
      prisma.blogPost.findMany({
        take: 10,
        orderBy: { viewCount: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          publishedAt: true,
        }
      })
    ])

    const analytics = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews._sum.viewCount || 0,
      avgReadingTime: 3.5, // Mock data
      topPosts: topPosts.map(post => ({
        ...post,
        publishedAt: post.publishedAt?.toISOString(),
      })),
      monthlyViews: [], // Would be calculated from PostView table
      popularKeywords: [], // Would be calculated from SEOKeyword table
    }

    return c.json<RPCResponse<typeof analytics>>({
      success: true,
      data: analytics,
    })

  } catch (error) {
    console.error('Error fetching blog analytics:', error)
    return c.json<RPCResponse>({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch blog analytics',
      }
    }, 500)
  }
})

// =======================
// FILE UPLOAD
// =======================

blog.post(
  '/upload',
  auth({ required: true, roles: ['admin'] }),
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }),
  async (c) => {
    try {
      const body = await c.req.parseBody()
      const file = body.file as File

      if (!file) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file provided',
          }
        }, 400)
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only image files are allowed',
          }
        }, 400)
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size must be less than 5MB',
          }
        }, 400)
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2)
      const extension = file.name.split('.').pop()
      const filename = `blog_${timestamp}_${randomString}.${extension}`

      // In a real implementation, you would upload to a cloud storage service
      // For now, we'll return a mock response
      const uploadedFile = {
        id: `upload_${timestamp}_${randomString}`,
        url: `/api/uploads/blog/${filename}`,
        filename,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }

      return c.json<RPCResponse<typeof uploadedFile>>({
        success: true,
        data: uploadedFile,
      })

    } catch (error) {
      console.error('Error uploading file:', error)
      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload file',
        }
      }, 500)
    }
  }
)

// =======================
// UTILITY FUNCTIONS
// =======================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

export { blog }