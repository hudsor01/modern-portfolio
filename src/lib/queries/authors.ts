/**
 * Author Query Utilities
 * CRUD operations and analytics for blog authors
 */

import { db } from '@/lib/db'
import type { 
  AuthorWithStats 
} from '@/types/blog-database'
import type {
  AuthorCreateInput,
  AuthorUpdateInput
} from '@/lib/validations/blog-schema'

// =======================
// CREATE OPERATIONS
// =======================

export async function createAuthor(data: AuthorCreateInput): Promise<AuthorWithStats> {
  const author = await db.author.create({
    data,
    include: {
      posts: true,
      _count: {
        select: {
          posts: true,
          postVersions: true
        }
      }
    }
  })

  return author as AuthorWithStats
}

// =======================
// READ OPERATIONS
// =======================

export async function getAuthorById(id: string): Promise<AuthorWithStats | null> {
  return db.author.findUnique({
    where: { id },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          posts: true,
          postVersions: true
        }
      }
    }
  }) as Promise<AuthorWithStats | null>
}

export async function getAuthorBySlug(slug: string): Promise<AuthorWithStats | null> {
  return db.author.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          posts: true,
          postVersions: true
        }
      }
    }
  }) as Promise<AuthorWithStats | null>
}

export async function getAuthorByEmail(email: string): Promise<AuthorWithStats | null> {
  return db.author.findUnique({
    where: { email },
    include: {
      posts: true,
      _count: {
        select: {
          posts: true,
          postVersions: true
        }
      }
    }
  }) as Promise<AuthorWithStats | null>
}

export async function getAllAuthors(): Promise<AuthorWithStats[]> {
  return db.author.findMany({
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' }
      },
      _count: {
        select: {
          posts: true,
          postVersions: true
        }
      }
    },
    orderBy: { totalPosts: 'desc' }
  }) as Promise<AuthorWithStats[]>
}

export async function getTopAuthors(limit = 10): Promise<AuthorWithStats[]> {
  return db.author.findMany({
    where: {
      totalPosts: { gt: 0 }
    },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 5
      },
      _count: {
        select: {
          posts: true,
          postVersions: true
        }
      }
    },
    orderBy: [
      { totalViews: 'desc' },
      { totalPosts: 'desc' }
    ],
    take: limit
  }) as Promise<AuthorWithStats[]>
}

// =======================
// UPDATE OPERATIONS
// =======================

export async function updateAuthor(
  id: string,
  data: AuthorUpdateInput
): Promise<AuthorWithStats> {
  const author = await db.author.update({
    where: { id },
    data,
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          posts: true,
          postVersions: true
        }
      }
    }
  })

  return author as AuthorWithStats
}

// =======================
// DELETE OPERATIONS
// =======================

export async function deleteAuthor(id: string): Promise<void> {
  // Check if author has posts
  const postCount = await db.blogPost.count({
    where: { authorId: id }
  })

  if (postCount > 0) {
    throw new Error('Cannot delete author with existing posts. Please reassign or delete posts first.')
  }

  await db.author.delete({
    where: { id }
  })
}

// =======================
// ANALYTICS OPERATIONS
// =======================

export async function getAuthorAnalytics(authorId: string) {
  const [author, posts, analytics] = await Promise.all([
    db.author.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
        slug: true,
        totalPosts: true,
        totalViews: true
      }
    }),
    
    db.blogPost.findMany({
      where: { 
        authorId,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        likeCount: true,
        shareCount: true,
        commentCount: true,
        publishedAt: true,
        readingTime: true
      },
      orderBy: { viewCount: 'desc' }
    }),

    db.blogPost.aggregate({
      where: { 
        authorId,
        status: 'PUBLISHED'
      },
      _count: { id: true },
      _sum: { 
        viewCount: true,
        likeCount: true,
        shareCount: true,
        commentCount: true,
        readingTime: true
      },
      _avg: {
        viewCount: true,
        readingTime: true
      }
    })
  ])

  if (!author) return null

  // Calculate engagement metrics
  const totalInteractions = (analytics._sum.likeCount || 0) + 
                           (analytics._sum.shareCount || 0) + 
                           (analytics._sum.commentCount || 0)
  
  const engagementRate = analytics._sum.viewCount 
    ? (totalInteractions / analytics._sum.viewCount) * 100
    : 0

  // Get monthly posting activity
  const monthlyActivity = await db.blogPost.groupBy({
    by: ['publishedAt'],
    where: {
      authorId,
      status: 'PUBLISHED',
      publishedAt: {
        gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
      }
    },
    _count: { id: true }
  })

  // Group by month
  const monthlyPosts = monthlyActivity.reduce((acc, { publishedAt, _count }) => {
    if (publishedAt) {
      const month = publishedAt.toISOString().substring(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + _count.id
    }
    return acc
  }, {} as Record<string, number>)

  return {
    author,
    metrics: {
      totalPosts: analytics._count.id,
      totalViews: analytics._sum.viewCount || 0,
      totalInteractions,
      engagementRate: Math.round(engagementRate * 100) / 100,
      avgViewsPerPost: Math.round(analytics._avg.viewCount || 0),
      avgReadingTime: Math.round(analytics._avg.readingTime || 0),
      totalReadingTime: analytics._sum.readingTime || 0
    },
    popularPosts: posts.slice(0, 5),
    recentPosts: posts
      .sort((a, b) => 
        new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
      )
      .slice(0, 10),
    monthlyActivity: monthlyPosts
  }
}

export async function refreshAuthorStats(authorId: string): Promise<void> {
  const stats = await db.blogPost.aggregate({
    where: { 
      authorId,
      status: 'PUBLISHED'
    },
    _count: { id: true },
    _sum: { viewCount: true }
  })

  await db.author.update({
    where: { id: authorId },
    data: {
      totalPosts: stats._count.id,
      totalViews: stats._sum.viewCount || 0
    }
  })
}

// =======================
// UTILITY FUNCTIONS
// =======================

export async function generateAuthorSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let slug = baseSlug
  let counter = 1

  // Check for existing slugs and increment if necessary
  while (await db.author.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export async function validateAuthorEmail(email: string, excludeId?: string): Promise<boolean> {
  const existing = await db.author.findUnique({
    where: { email },
    select: { id: true }
  })

  if (!existing) return true
  if (excludeId && existing.id === excludeId) return true
  return false
}