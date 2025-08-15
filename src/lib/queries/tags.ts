/**
 * Tag Query Utilities
 * CRUD operations and analytics for blog tags
 */

import { db } from '@/lib/db'
import type { 
  TagWithStats 
} from '@/types/blog-database'
import type {
  TagCreateInput,
  TagUpdateInput
} from '@/lib/validations/blog-schema'

// =======================
// CREATE OPERATIONS
// =======================

export async function createTag(data: TagCreateInput): Promise<TagWithStats> {
  const tag = await db.tag.create({
    data,
    include: {
      posts: {
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              viewCount: true,
              publishedAt: true
            }
          }
        },
        take: 5
      },
      _count: {
        select: { posts: true }
      }
    }
  })

  return tag as TagWithStats
}

// =======================
// READ OPERATIONS
// =======================

export async function getTagById(id: string): Promise<TagWithStats | null> {
  return db.tag.findUnique({
    where: { id },
    include: {
      posts: {
        where: {
          post: { status: 'PUBLISHED' }
        },
        include: {
          post: {
            include: {
              author: {
                select: { name: true, slug: true, avatar: true }
              }
            }
          }
        },
        orderBy: {
          post: { publishedAt: 'desc' }
        },
        take: 10
      },
      _count: {
        select: { posts: true }
      }
    }
  }) as Promise<TagWithStats | null>
}

export async function getTagBySlug(slug: string): Promise<TagWithStats | null> {
  return db.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          post: { status: 'PUBLISHED' }
        },
        include: {
          post: {
            include: {
              author: {
                select: { name: true, slug: true, avatar: true }
              }
            }
          }
        },
        orderBy: {
          post: { publishedAt: 'desc' }
        },
        take: 10
      },
      _count: {
        select: { posts: true }
      }
    }
  }) as Promise<TagWithStats | null>
}

export async function getAllTags(): Promise<TagWithStats[]> {
  return db.tag.findMany({
    include: {
      posts: {
        where: {
          post: { status: 'PUBLISHED' }
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              viewCount: true,
              publishedAt: true
            }
          }
        },
        orderBy: {
          post: { viewCount: 'desc' }
        },
        take: 5
      },
      _count: {
        select: { posts: true }
      }
    },
    orderBy: [
      { postCount: 'desc' },
      { name: 'asc' }
    ]
  }) as Promise<TagWithStats[]>
}

export async function getPopularTags(limit = 20): Promise<TagWithStats[]> {
  return db.tag.findMany({
    where: {
      postCount: { gt: 0 }
    },
    include: {
      posts: {
        where: {
          post: { status: 'PUBLISHED' }
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              viewCount: true
            }
          }
        },
        orderBy: {
          post: { viewCount: 'desc' }
        },
        take: 3
      },
      _count: {
        select: { posts: true }
      }
    },
    orderBy: [
      { totalViews: 'desc' },
      { postCount: 'desc' }
    ],
    take: limit
  }) as Promise<TagWithStats[]>
}

export async function getTagsWithPosts(
  tagSlugs: string[],
  limit = 10,
  offset = 0
) {
  const tags = await db.tag.findMany({
    where: {
      slug: { in: tagSlugs }
    },
    include: {
      posts: {
        where: {
          post: { status: 'PUBLISHED' }
        },
        include: {
          post: {
            include: {
              author: {
                select: { id: true, name: true, slug: true, avatar: true }
              },
              category: {
                select: { id: true, name: true, slug: true, color: true }
              },
              tags: {
                select: {
                  tag: {
                    select: { id: true, name: true, slug: true, color: true }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          post: { publishedAt: 'desc' }
        },
        skip: offset,
        take: limit
      },
      _count: {
        select: { posts: true }
      }
    }
  })

  // Flatten posts from all tags and remove duplicates
  const postMap = new Map()
  tags.forEach(tag => {
    tag.posts.forEach(({ post }) => {
      if (!postMap.has(post.id)) {
        postMap.set(post.id, post)
      }
    })
  })

  const posts = Array.from(postMap.values())
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())

  return {
    tags,
    posts: posts.slice(offset, offset + limit),
    totalPosts: posts.length
  }
}

export async function getRelatedTags(tagId: string, limit = 10): Promise<TagWithStats[]> {
  // Find tags that appear together with the given tag
  const relatedTagIds = await db.$queryRaw<{ tagId: string; count: number }[]>`
    SELECT pt2."tagId", COUNT(*) as count
    FROM "post_tags" pt1
    JOIN "post_tags" pt2 ON pt1."postId" = pt2."postId"
    JOIN "blog_posts" bp ON pt1."postId" = bp.id
    WHERE pt1."tagId" = ${tagId}
      AND pt2."tagId" != ${tagId}
      AND bp.status = 'PUBLISHED'
    GROUP BY pt2."tagId"
    ORDER BY count DESC
    LIMIT ${limit}
  `

  if (relatedTagIds.length === 0) return []

  return db.tag.findMany({
    where: {
      id: { in: relatedTagIds.map(r => r.tagId) }
    },
    include: {
      posts: {
        where: {
          post: { status: 'PUBLISHED' }
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              viewCount: true
            }
          }
        },
        orderBy: {
          post: { viewCount: 'desc' }
        },
        take: 3
      },
      _count: {
        select: { posts: true }
      }
    }
  }) as Promise<TagWithStats[]>
}

// =======================
// UPDATE OPERATIONS
// =======================

export async function updateTag(
  id: string,
  data: TagUpdateInput
): Promise<TagWithStats> {
  const tag = await db.tag.update({
    where: { id },
    data,
    include: {
      posts: {
        where: {
          post: { status: 'PUBLISHED' }
        },
        include: {
          post: {
            include: {
              author: {
                select: { name: true, slug: true, avatar: true }
              }
            }
          }
        },
        orderBy: {
          post: { publishedAt: 'desc' }
        },
        take: 10
      },
      _count: {
        select: { posts: true }
      }
    }
  })

  return tag as TagWithStats
}

// =======================
// DELETE OPERATIONS
// =======================

export async function deleteTag(id: string): Promise<void> {
  await db.$transaction(async (tx) => {
    // Remove tag associations from posts
    await tx.postTag.deleteMany({
      where: { tagId: id }
    })

    // Delete the tag
    await tx.tag.delete({
      where: { id }
    })
  })
}

export async function mergeTagsWithMaster(masterTagId: string, tagIdsToMerge: string[]): Promise<TagWithStats> {
  if (tagIdsToMerge.includes(masterTagId)) {
    throw new Error('Cannot merge master tag with itself')
  }

  await db.$transaction(async (tx) => {
    // Get all posts associated with tags to merge
    const postsToUpdate = await tx.postTag.findMany({
      where: { tagId: { in: tagIdsToMerge } },
      select: { postId: true }
    })

    const uniquePostIds = [...new Set(postsToUpdate.map(p => p.postId))]

    // Remove existing associations with tags to merge
    await tx.postTag.deleteMany({
      where: { tagId: { in: tagIdsToMerge } }
    })

    // Create associations with master tag (ignore duplicates)
    for (const postId of uniquePostIds) {
      await tx.postTag.upsert({
        where: {
          postId_tagId: {
            postId,
            tagId: masterTagId
          }
        },
        create: {
          postId,
          tagId: masterTagId
        },
        update: {} // Do nothing if already exists
      })
    }

    // Delete merged tags
    await tx.tag.deleteMany({
      where: { id: { in: tagIdsToMerge } }
    })
  })

  // Refresh stats for master tag
  await refreshTagStats(masterTagId)

  // Return updated master tag
  return getTagById(masterTagId) as Promise<TagWithStats>
}

// =======================
// ANALYTICS OPERATIONS
// =======================

export async function getTagAnalytics(tagId: string) {
  const [tag, analytics, monthlyUsage, relatedTags] = await Promise.all([
    db.tag.findUnique({
      where: { id: tagId },
      select: {
        id: true,
        name: true,
        slug: true,
        postCount: true,
        totalViews: true
      }
    }),

    db.postTag.aggregate({
      where: {
        tagId,
        post: { status: 'PUBLISHED' }
      },
      _count: { postId: true }
    }),

    db.postTag.groupBy({
      by: ['createdAt'],
      where: {
        tagId,
        post: { status: 'PUBLISHED' },
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      },
      _count: { postId: true }
    }),

    getRelatedTags(tagId, 5)
  ])

  if (!tag) return null

  // Get post analytics for this tag
  const postAnalytics = await db.blogPost.aggregate({
    where: {
      tags: { some: { tagId } },
      status: 'PUBLISHED'
    },
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
  })

  const totalInteractions = (postAnalytics._sum.likeCount || 0) + 
                           (postAnalytics._sum.shareCount || 0) + 
                           (postAnalytics._sum.commentCount || 0)

  const engagementRate = postAnalytics._sum.viewCount 
    ? (totalInteractions / postAnalytics._sum.viewCount) * 100
    : 0

  // Group monthly usage
  const monthlyActivity = monthlyUsage.reduce((acc, { createdAt, _count }) => {
    const month = createdAt.toISOString().substring(0, 7)
    acc[month] = (acc[month] || 0) + _count.postId
    return acc
  }, {} as Record<string, number>)

  return {
    tag,
    metrics: {
      totalPosts: analytics._count.postId,
      totalViews: postAnalytics._sum.viewCount || 0,
      totalInteractions,
      engagementRate: Math.round(engagementRate * 100) / 100,
      avgViewsPerPost: Math.round(postAnalytics._avg.viewCount || 0),
      avgReadingTime: Math.round(postAnalytics._avg.readingTime || 0)
    },
    monthlyActivity,
    relatedTags
  }
}

export async function refreshTagStats(tagId: string): Promise<void> {
  const [postStats, viewStats] = await Promise.all([
    db.postTag.aggregate({
      where: { 
        tagId,
        post: { status: 'PUBLISHED' }
      },
      _count: { postId: true }
    }),

    db.blogPost.aggregate({
      where: {
        tags: { some: { tagId } },
        status: 'PUBLISHED'
      },
      _sum: { viewCount: true }
    })
  ])

  await db.tag.update({
    where: { id: tagId },
    data: {
      postCount: postStats._count.postId,
      totalViews: viewStats._sum.viewCount || 0
    }
  })
}

export async function getTagCloud(minPostCount = 1, maxTags = 50) {
  const tags = await db.tag.findMany({
    where: {
      postCount: { gte: minPostCount }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      postCount: true,
      totalViews: true
    },
    orderBy: [
      { totalViews: 'desc' },
      { postCount: 'desc' }
    ],
    take: maxTags
  })

  // Calculate relative sizes (1-5 scale)
  const maxViews = Math.max(...tags.map(t => t.totalViews))
  const minViews = Math.min(...tags.map(t => t.totalViews))
  const viewRange = maxViews - minViews || 1

  return tags.map(tag => ({
    ...tag,
    size: Math.ceil(((tag.totalViews - minViews) / viewRange) * 4) + 1,
    weight: tag.totalViews / maxViews
  }))
}

// =======================
// UTILITY FUNCTIONS
// =======================

export async function generateTagSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let slug = baseSlug
  let counter = 1

  while (await db.tag.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export async function findOrCreateTags(tagNames: string[]): Promise<string[]> {
  const tagIds: string[] = []

  for (const name of tagNames) {
    const slug = await generateTagSlug(name)
    
    const tag = await db.tag.upsert({
      where: { slug },
      create: {
        name: name.trim(),
        slug
      },
      update: {}, // Do nothing if exists
      select: { id: true }
    })

    tagIds.push(tag.id)
  }

  return tagIds
}

export async function suggestTags(content: string, limit = 10): Promise<string[]> {
  // Simple keyword extraction - in production, you might use NLP libraries
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    
  const wordFreq = words.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1
    return freq
  }, {} as Record<string, number>)

  const keywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit * 2)
    .map(([word]) => word)

  // Find existing tags that match these keywords
  const existingTags = await db.tag.findMany({
    where: {
      OR: keywords.map(keyword => ({
        name: { contains: keyword, mode: 'insensitive' }
      }))
    },
    select: { name: true, postCount: true },
    orderBy: { postCount: 'desc' },
    take: limit
  })

  return existingTags.map(tag => tag.name)
}