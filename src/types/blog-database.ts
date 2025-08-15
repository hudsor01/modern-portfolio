/**
 * Database-specific type definitions for the blog system
 * Extends Prisma types with additional computed fields and relations
 */

import type { 
  BlogPost,
  Author,
  Category,
  Tag,
  PostSeries,
  PostView,
  PostInteraction,
  SEOEvent,
  SEOKeyword,
  SitemapEntry,
  PostTag,
  SeriesPost,
  PostRelation,
  PostVersion,
  PostStatus,
  ContentType,
  RelationType,
  ChangeType,
  InteractionType,
  SEOEventType,
  SEOSeverity,
  ChangeFrequency,
  Prisma
} from '@prisma/client'

// =======================
// ENHANCED ENTITY TYPES
// =======================

// Blog Post with all relations and computed fields
export type BlogPostWithRelations = BlogPost & {
  author: Author
  category?: Category | null
  tags: Array<Tag & { posts: PostTag[] }>
  seriesPosts: Array<SeriesPost & { series: PostSeries }>
  views: PostView[]
  interactions: PostInteraction[]
  seoEvents: SEOEvent[]
  seoKeywords: SEOKeyword[]
  versions: PostVersion[]
  relatedPosts: Array<PostRelation & { relatedPost: BlogPost }>
  relatedToPosts: Array<PostRelation & { originalPost: BlogPost }>
}

// Blog Post with computed analytics
export type BlogPostWithAnalytics = BlogPost & {
  author: Pick<Author, 'id' | 'name' | 'slug' | 'avatar'>
  category?: Pick<Category, 'id' | 'name' | 'slug' | 'color'> | null
  tags: Array<Pick<Tag, 'id' | 'name' | 'slug' | 'color'>>
  _count: {
    views: number
    interactions: number
    tags: number
    seriesPosts: number
  }
  // Computed fields
  avgReadingTime?: number
  engagementRate?: number
  isPopular?: boolean
  isTrending?: boolean
}

// Author with stats
export type AuthorWithStats = Author & {
  posts: BlogPost[]
  _count: {
    posts: number
    postVersions: number
  }
  // Computed analytics
  averageViews?: number
  totalEngagement?: number
  popularPosts?: BlogPost[]
  recentActivity?: PostVersion[]
}

// Category with usage stats  
export type CategoryWithStats = Category & {
  posts: BlogPost[]
  _count: {
    posts: number
  }
  // Analytics
  usageGrowth?: number
  relatedCategories?: Category[]
  popularPosts?: BlogPost[]
  totalViews?: number
}

// Category with hierarchy and stats
export type CategoryWithHierarchy = Category & {
  parent?: Category | null
  children: Category[]
  posts: BlogPost[]
  _count: {
    posts: number
    children: number
  }
  // Computed fields
  depth?: number
  breadcrumb?: string[]
  isLeaf?: boolean
}

// Tag with usage stats
export type TagWithStats = Tag & {
  posts: Array<PostTag & { post: BlogPost }>
  _count: {
    posts: number
  }
  // Analytics
  usageGrowth?: number
  relatedTags?: Tag[]
  popularPosts?: BlogPost[]
}

// Post Series with order and progress
export type PostSeriesWithPosts = PostSeries & {
  posts: Array<SeriesPost & { post: BlogPost }>
  _count: {
    posts: number
  }
  // Computed fields
  nextPost?: BlogPost
  prevPost?: BlogPost
  completionRate?: number
  estimatedReadTime?: number
}

// =======================
// ANALYTICS TYPES
// =======================

export interface BlogAnalyticsSummary {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  scheduledPosts: number
  archivedPosts: number
  totalViews: number
  totalInteractions: number
  totalAuthors: number
  totalCategories: number
  totalTags: number
  avgReadingTime: number
  avgViewsPerPost: number
  engagementRate: number
  topCategories: CategoryWithStats[]
  topTags: TagWithStats[]
  topAuthors: AuthorWithStats[]
  recentPosts: BlogPostWithAnalytics[]
  trendingPosts: BlogPostWithAnalytics[]
}

export interface PostAnalytics {
  postId: string
  views: number
  uniqueViews: number
  interactions: number
  shares: number
  likes: number
  comments: number
  bookmarks: number
  avgReadingTime: number
  bounceRate: number
  engagementRate: number
  conversionRate: number
  topCountries: Array<{ country: string; views: number }>
  topReferrers: Array<{ referrer: string; views: number }>
  dailyViews: Array<{ date: string; views: number }>
  weeklyViews: Array<{ week: string; views: number }>
  monthlyViews: Array<{ month: string; views: number }>
}

export interface SEOAnalytics {
  postId?: string
  seoScore: number
  keywordCount: number
  topKeywords: Array<{ 
    keyword: string
    position: number
    impressions: number
    clicks: number
    ctr: number
  }>
  technicalIssues: SEOEvent[]
  opportunities: SEOEvent[]
  improvements: Array<{
    area: string
    current: number
    target: number
    impact: 'low' | 'medium' | 'high'
    recommendations: string[]
  }>
}

// =======================
// QUERY RESULT TYPES
// =======================

export interface BlogPostListResult {
  posts: BlogPostWithAnalytics[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: {
    status?: PostStatus | PostStatus[]
    authorId?: string
    categoryId?: string
    tagIds?: string[]
    search?: string
    dateRange?: { from: Date; to: Date }
  }
  aggregations: {
    totalViews: number
    avgReadingTime: number
    statusCounts: Record<PostStatus, number>
    categoryCounts: Array<{ category: string; count: number }>
    tagCounts: Array<{ tag: string; count: number }>
  }
}

export interface BlogSearchResult {
  posts: Array<BlogPost & {
    author: Pick<Author, 'name' | 'slug'>
    category?: Pick<Category, 'name' | 'slug'> | null
    tags: Array<Pick<Tag, 'name' | 'slug'>>
    highlight?: {
      title?: string
      content?: string
      excerpt?: string
    }
    score?: number
  }>
  facets: {
    categories: Array<{ name: string; count: number }>
    tags: Array<{ name: string; count: number }>
    authors: Array<{ name: string; count: number }>
    years: Array<{ year: number; count: number }>
  }
  suggestions?: string[]
}

// =======================
// MUTATION TYPES
// =======================

export type CreateBlogPostData = Omit<
  BlogPost, 
  'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount' | 'shareCount' | 'commentCount' | 'seoScore' | 'readingTime' | 'wordCount'
> & {
  tagIds?: string[]
  seriesId?: string
  relatedPostIds?: string[]
}

export type UpdateBlogPostData = Partial<CreateBlogPostData> & {
  id: string
}

export type CreateAuthorData = Omit<Author, 'id' | 'createdAt' | 'updatedAt' | 'totalViews' | 'totalPosts'>

export type UpdateAuthorData = Partial<CreateAuthorData> & {
  id: string
}

export type CreateCategoryData = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'postCount' | 'totalViews'>

export type UpdateCategoryData = Partial<CreateCategoryData> & {
  id: string
}

export type CreateTagData = Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'postCount' | 'totalViews'>

export type UpdateTagData = Partial<CreateTagData> & {
  id: string
}

// =======================
// PRISMA QUERY HELPERS
// =======================

// Common include patterns
export const blogPostIncludes = {
  minimal: {
    author: {
      select: {
        id: true,
        name: true,
        slug: true,
        avatar: true
      }
    },
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
        color: true
      }
    },
    tags: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      }
    }
  },
  
  withRelations: {
    author: true,
    category: true,
    tags: {
      include: {
        tag: true
      }
    },
    seriesPosts: {
      include: {
        series: true
      },
      orderBy: {
        order: 'asc' as const
      }
    },
    relatedPosts: {
      include: {
        relatedPost: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true,
            readingTime: true
          }
        }
      }
    }
  },
  
  withAnalytics: {
    author: {
      select: {
        id: true,
        name: true,
        slug: true,
        avatar: true
      }
    },
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
        color: true
      }
    },
    tags: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        }
      }
    },
    _count: {
      select: {
        views: true,
        interactions: true,
        tags: true,
        seriesPosts: true
      }
    }
  }
} as const

// Common where clauses
export const blogPostFilters = {
  published: {
    status: 'PUBLISHED' as const,
    publishedAt: {
      lte: new Date()
    }
  },
  
  draft: {
    status: 'DRAFT' as const
  },
  
  scheduled: {
    status: 'SCHEDULED' as const,
    scheduledAt: {
      gte: new Date()
    }
  },
  
  byAuthor: (authorId: string) => ({
    authorId
  }),
  
  byCategory: (categoryId: string) => ({
    categoryId
  }),
  
  byTags: (tagIds: string[]) => ({
    tags: {
      some: {
        tagId: {
          in: tagIds
        }
      }
    }
  }),
  
  search: (query: string) => ({
    OR: [
      {
        title: {
          contains: query,
          mode: 'insensitive' as const
        }
      },
      {
        content: {
          contains: query,
          mode: 'insensitive' as const
        }
      },
      {
        excerpt: {
          contains: query,
          mode: 'insensitive' as const
        }
      }
    ]
  })
} as const

// Common order by clauses
export const blogPostSorts = {
  latest: { createdAt: 'desc' as const },
  oldest: { createdAt: 'asc' as const },
  published: { publishedAt: 'desc' as const },
  popular: { viewCount: 'desc' as const },
  trending: { 
    interactions: {
      _count: 'desc' as const
    }
  },
  alphabetical: { title: 'asc' as const }
} as const

// Export all Prisma client types for convenience
export type {
  BlogPost,
  Author,
  Category,
  Tag,
  PostSeries,
  PostView,
  PostInteraction,
  SEOEvent,
  SEOKeyword,
  SitemapEntry,
  PostTag,
  SeriesPost,
  PostRelation,
  PostVersion,
  PostStatus,
  ContentType,
  RelationType,
  ChangeType,
  InteractionType,
  SEOEventType,
  SEOSeverity,
  ChangeFrequency,
  Prisma
}