/**
 * Category Query Utilities
 * CRUD operations and hierarchy management for blog categories
 */

import { db } from '@/lib/db'
import type { 
  CategoryWithHierarchy,
  BlogPostWithAnalytics
} from '@/types/blog-database'
import type {
  CategoryCreateInput,
  CategoryUpdateInput
} from '@/lib/validations/blog-schema'

// =======================
// CREATE OPERATIONS
// =======================

export async function createCategory(data: CategoryCreateInput): Promise<CategoryWithHierarchy> {
  // Validate parent category exists if provided
  if (data.parentId) {
    const parent = await db.category.findUnique({
      where: { id: data.parentId },
      select: { id: true }
    })
    if (!parent) {
      throw new Error('Parent category not found')
    }
  }

  const category = await db.category.create({
    data,
    include: {
      parent: true,
      children: true,
      posts: {
        where: { status: 'PUBLISHED' },
        take: 5,
        orderBy: { publishedAt: 'desc' }
      },
      _count: {
        select: {
          posts: true,
          children: true
        }
      }
    }
  })

  return category
}

// =======================
// READ OPERATIONS
// =======================

export async function getCategoryById(id: string): Promise<CategoryWithHierarchy | null> {
  const category = await db.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: { name: 'asc' }
      },
      posts: {
        where: { status: 'PUBLISHED' },
        include: {
          author: {
            select: { name: true, slug: true, avatar: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          posts: true,
          children: true
        }
      }
    }
  })

  if (!category) return null

  return {
    ...category,
    depth: await getCategoryDepth(category.id),
    breadcrumb: await getCategoryBreadcrumb(category.id),
    isLeaf: category._count.children === 0
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithHierarchy | null> {
  const category = await db.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: { name: 'asc' }
      },
      posts: {
        where: { status: 'PUBLISHED' },
        include: {
          author: {
            select: { name: true, slug: true, avatar: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          posts: true,
          children: true
        }
      }
    }
  })

  if (!category) return null

  return {
    ...category,
    depth: await getCategoryDepth(category.id),
    breadcrumb: await getCategoryBreadcrumb(category.id),
    isLeaf: category._count.children === 0
  }
}

export async function getAllCategories(includeHierarchy = false): Promise<CategoryWithHierarchy[]> {
  const categories = await db.category.findMany({
    include: {
      parent: true,
      children: includeHierarchy ? {
        include: {
          children: true,
          _count: { select: { posts: true } }
        },
        orderBy: { name: 'asc' }
      } : true,
      posts: {
        where: { status: 'PUBLISHED' },
        take: 5,
        orderBy: { viewCount: 'desc' }
      },
      _count: {
        select: {
          posts: true,
          children: true
        }
      }
    },
    orderBy: [
      { parentId: { sort: 'asc', nulls: 'first' } },
      { name: 'asc' }
    ]
  })

  if (includeHierarchy) {
    return Promise.all(
      categories.map(async (category) => ({
        ...category,
        depth: await getCategoryDepth(category.id),
        breadcrumb: await getCategoryBreadcrumb(category.id),
        isLeaf: category._count.children === 0
      }))
    )
  }

  return categories
}

export async function getRootCategories(): Promise<CategoryWithHierarchy[]> {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { posts: true } }
        },
        orderBy: { name: 'asc' }
      },
      posts: {
        where: { status: 'PUBLISHED' },
        take: 5,
        orderBy: { publishedAt: 'desc' }
      },
      _count: {
        select: {
          posts: true,
          children: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return categories.map(category => ({
    ...category,
    parent: null,
    depth: 0,
    breadcrumb: [category.name],
    isLeaf: category._count.children === 0
  }))
}

export async function getCategoryTree(): Promise<CategoryWithHierarchy[]> {
  const allCategories = await db.category.findMany({
    include: {
      _count: {
        select: { posts: true, children: true }
      }
    }
  })

  const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]))
  const roots: CategoryWithHierarchy[] = []

  for (const category of allCategories) {
    const categoryWithMeta = {
      ...category,
      parent: category.parentId ? categoryMap.get(category.parentId) || null : null,
      children: [] as CategoryWithHierarchy[],
      posts: [],
      depth: 0,
      breadcrumb: [] as string[],
      isLeaf: category._count.children === 0
    }

    if (!category.parentId) {
      roots.push(categoryWithMeta)
    } else {
      const parent = categoryMap.get(category.parentId)
      if (parent && 'children' in parent) {
        (parent as CategoryWithHierarchy).children.push(categoryWithMeta)
      }
    }
  }

  // Calculate depths and breadcrumbs
  const setDepthAndBreadcrumb = (categories: CategoryWithHierarchy[], depth = 0, breadcrumb: string[] = []): void => {
    categories.forEach(category => {
      category.depth = depth
      category.breadcrumb = [...breadcrumb, category.name]
      if (category.children.length > 0) {
        setDepthAndBreadcrumb(category.children, depth + 1, category.breadcrumb)
      }
    })
  }

  setDepthAndBreadcrumb(roots)
  return roots
}

export async function getCategoryWithPosts(
  slug: string,
  limit = 10,
  offset = 0
): Promise<(CategoryWithHierarchy & { posts: BlogPostWithAnalytics[] }) | null> {
  const category = await getCategoryBySlug(slug)
  if (!category) return null

  // Get posts from this category and all subcategories
  const categoryIds = [category.id]
  const collectChildIds = (cats: CategoryWithHierarchy[]) => {
    cats.forEach(cat => {
      categoryIds.push(cat.id)
      if (cat.children.length > 0) {
        collectChildIds(cat.children)
      }
    })
  }
  collectChildIds(category.children)

  const posts = await db.blogPost.findMany({
    where: {
      categoryId: { in: categoryIds },
      status: 'PUBLISHED'
    },
    include: {
      author: {
        select: { id: true, name: true, slug: true, avatar: true }
      },
      tags: {
        select: {
          tag: {
            select: { id: true, name: true, slug: true, color: true }
          }
        }
      },
      _count: {
        select: { views: true, interactions: true }
      }
    },
    orderBy: { publishedAt: 'desc' },
    skip: offset,
    take: limit
  })

  return {
    ...category,
    posts
  }
}

// =======================
// UPDATE OPERATIONS
// =======================

export async function updateCategory(
  id: string,
  data: CategoryUpdateInput
): Promise<CategoryWithHierarchy> {
  // Validate parent category if being updated
  if (data.parentId !== undefined) {
    if (data.parentId) {
      const parent = await db.category.findUnique({
        where: { id: data.parentId },
        select: { id: true }
      })
      if (!parent) {
        throw new Error('Parent category not found')
      }
      
      // Prevent circular references
      if (await wouldCreateCircularReference(id, data.parentId)) {
        throw new Error('Cannot create circular reference in category hierarchy')
      }
    }
  }

  const category = await db.category.update({
    where: { id },
    data,
    include: {
      parent: true,
      children: {
        include: {
          _count: { select: { posts: true } }
        }
      },
      posts: {
        where: { status: 'PUBLISHED' },
        take: 10,
        orderBy: { publishedAt: 'desc' }
      },
      _count: {
        select: {
          posts: true,
          children: true
        }
      }
    }
  })

  return {
    ...category,
    depth: await getCategoryDepth(category.id),
    breadcrumb: await getCategoryBreadcrumb(category.id),
    isLeaf: category._count.children === 0
  }
}

// =======================
// DELETE OPERATIONS
// =======================

export async function deleteCategory(id: string, reassignPostsTo?: string): Promise<void> {
  const category = await db.category.findUnique({
    where: { id },
    include: {
      children: { select: { id: true } },
      _count: { select: { posts: true } }
    }
  })

  if (!category) {
    throw new Error('Category not found')
  }

  if (category.children.length > 0) {
    throw new Error('Cannot delete category with subcategories. Please move or delete subcategories first.')
  }

  await db.$transaction(async (tx) => {
    // Reassign posts if requested
    if (reassignPostsTo && category._count.posts > 0) {
      await tx.blogPost.updateMany({
        where: { categoryId: id },
        data: { categoryId: reassignPostsTo }
      })
    } else if (category._count.posts > 0) {
      // Set posts to no category
      await tx.blogPost.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
      })
    }

    // Delete the category
    await tx.category.delete({
      where: { id }
    })
  })
}

// =======================
// ANALYTICS OPERATIONS
// =======================

export async function getCategoryAnalytics(categoryId: string) {
  const [category, analytics, monthlyPosts] = await Promise.all([
    db.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        slug: true,
        postCount: true,
        totalViews: true
      }
    }),

    db.blogPost.aggregate({
      where: {
        categoryId,
        status: 'PUBLISHED'
      },
      _count: { id: true },
      _sum: {
        viewCount: true,
        likeCount: true,
        shareCount: true,
        commentCount: true
      },
      _avg: {
        viewCount: true,
        readingTime: true
      }
    }),

    db.blogPost.groupBy({
      by: ['publishedAt'],
      where: {
        categoryId,
        status: 'PUBLISHED',
        publishedAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      },
      _count: { id: true }
    })
  ])

  if (!category) return null

  const totalInteractions = (analytics._sum.likeCount || 0) + 
                           (analytics._sum.shareCount || 0) + 
                           (analytics._sum.commentCount || 0)

  const engagementRate = analytics._sum.viewCount 
    ? (totalInteractions / analytics._sum.viewCount) * 100
    : 0

  // Group monthly posts
  const monthlyActivity = monthlyPosts.reduce((acc, { publishedAt, _count }) => {
    if (publishedAt) {
      const month = publishedAt.toISOString().substring(0, 7)
      acc[month] = (acc[month] || 0) + _count.id
    }
    return acc
  }, {} as Record<string, number>)

  return {
    category,
    metrics: {
      totalPosts: analytics._count.id,
      totalViews: analytics._sum.viewCount || 0,
      totalInteractions,
      engagementRate: Math.round(engagementRate * 100) / 100,
      avgViewsPerPost: Math.round(analytics._avg.viewCount || 0),
      avgReadingTime: Math.round(analytics._avg.readingTime || 0)
    },
    monthlyActivity
  }
}

export async function refreshCategoryStats(categoryId: string): Promise<void> {
  const stats = await db.blogPost.aggregate({
    where: { 
      categoryId,
      status: 'PUBLISHED'
    },
    _count: { id: true },
    _sum: { viewCount: true }
  })

  await db.category.update({
    where: { id: categoryId },
    data: {
      postCount: stats._count.id,
      totalViews: stats._sum.viewCount || 0
    }
  })
}

// =======================
// UTILITY FUNCTIONS
// =======================

async function getCategoryDepth(categoryId: string): Promise<number> {
  let depth = 0
  let currentId = categoryId

  while (currentId) {
    const category = await db.category.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    })

    if (!category || !category.parentId) break
    
    currentId = category.parentId
    depth++
  }

  return depth
}

async function getCategoryBreadcrumb(categoryId: string): Promise<string[]> {
  const breadcrumb: string[] = []
  let currentId = categoryId

  while (currentId) {
    const category = await db.category.findUnique({
      where: { id: currentId },
      select: { name: true, parentId: true }
    })

    if (!category) break
    
    breadcrumb.unshift(category.name)
    currentId = category.parentId
  }

  return breadcrumb
}

async function wouldCreateCircularReference(categoryId: string, newParentId: string): Promise<boolean> {
  let currentId = newParentId

  while (currentId) {
    if (currentId === categoryId) return true
    
    const category = await db.category.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    })

    if (!category || !category.parentId) break
    currentId = category.parentId
  }

  return false
}

export async function generateCategorySlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let slug = baseSlug
  let counter = 1

  while (await db.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}