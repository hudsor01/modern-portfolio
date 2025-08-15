/**
 * Analytics Query Utilities
 * Comprehensive analytics and reporting for the blog system
 */

import { db } from '@/lib/db'
import type { 
  BlogAnalyticsSummary,
  PostAnalytics,
  SEOAnalytics,
  CategoryWithStats,
  TagWithStats,
  AuthorWithStats,
  BlogPostWithAnalytics
} from '@/types/blog-database'

// =======================
// DASHBOARD ANALYTICS
// =======================

export async function getBlogAnalyticsSummary(
  dateRange?: { from: Date; to: Date }
): Promise<BlogAnalyticsSummary> {
  const dateFilter = dateRange ? {
    publishedAt: {
      gte: dateRange.from,
      lte: dateRange.to
    }
  } : {}

  const [
    postCounts,
    totalStats,
    entityCounts,
    topCategories,
    topTags,
    topAuthors,
    recentPosts,
    trendingPosts
  ] = await Promise.all([
    // Post counts by status
    db.blogPost.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { status: true }
    }),

    // Overall statistics
    db.blogPost.aggregate({
      where: { ...dateFilter, status: 'PUBLISHED' },
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
    }),

    // Entity counts
    Promise.all([
      db.author.count(),
      db.category.count(),
      db.tag.count()
    ]),

    // Top categories
    db.category.findMany({
      where: { postCount: { gt: 0 } },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        postCount: true,
        totalViews: true,
        _count: { select: { posts: true } }
      },
      orderBy: [
        { totalViews: 'desc' },
        { postCount: 'desc' }
      ],
      take: 10
    }),

    // Top tags
    db.tag.findMany({
      where: { postCount: { gt: 0 } },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        postCount: true,
        totalViews: true,
        _count: { select: { posts: true } }
      },
      orderBy: [
        { totalViews: 'desc' },
        { postCount: 'desc' }
      ],
      take: 10
    }),

    // Top authors
    db.author.findMany({
      where: { totalPosts: { gt: 0 } },
      select: {
        id: true,
        name: true,
        slug: true,
        avatar: true,
        totalPosts: true,
        totalViews: true,
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
      take: 10
    }),

    // Recent posts
    db.blogPost.findMany({
      where: { 
        status: 'PUBLISHED',
        ...dateFilter
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        likeCount: true,
        shareCount: true,
        commentCount: true,
        readingTime: true,
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
          },
          take: 3
        },
        _count: {
          select: {
            views: true,
            interactions: true,
            tags: true,
            seriesPosts: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 10
    }),

    // Trending posts (high engagement in recent period)
    db.blogPost.findMany({
      where: { 
        status: 'PUBLISHED',
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        viewCount: true,
        likeCount: true,
        shareCount: true,
        commentCount: true,
        readingTime: true,
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
          },
          take: 3
        },
        _count: {
          select: {
            views: true,
            interactions: true,
            tags: true,
            seriesPosts: true
          }
        }
      },
      orderBy: [
        { likeCount: 'desc' },
        { shareCount: 'desc' },
        { viewCount: 'desc' }
      ],
      take: 10
    })
  ])

  const [totalAuthors, totalCategories, totalTags] = entityCounts

  const statusCounts = postCounts.reduce((acc, { status, _count }) => {
    acc[status] = _count.status
    return acc
  }, {
    DRAFT: 0,
    REVIEW: 0,
    SCHEDULED: 0,
    PUBLISHED: 0,
    ARCHIVED: 0,
    DELETED: 0
  })

  const totalInteractions = (totalStats._sum.likeCount || 0) + 
                           (totalStats._sum.shareCount || 0) + 
                           (totalStats._sum.commentCount || 0)

  const engagementRate = totalStats._sum.viewCount 
    ? (totalInteractions / totalStats._sum.viewCount) * 100
    : 0

  return {
    totalPosts: totalStats._count.id,
    publishedPosts: statusCounts.PUBLISHED,
    draftPosts: statusCounts.DRAFT,
    scheduledPosts: statusCounts.SCHEDULED,
    archivedPosts: statusCounts.ARCHIVED,
    totalViews: totalStats._sum.viewCount || 0,
    totalInteractions,
    totalAuthors,
    totalCategories,
    totalTags,
    avgReadingTime: Math.round(totalStats._avg.readingTime || 0),
    avgViewsPerPost: Math.round(totalStats._avg.viewCount || 0),
    engagementRate: Math.round(engagementRate * 100) / 100,
    topCategories: topCategories.map(cat => ({
      ...cat,
      posts: [],
      _count: cat._count,
      usageGrowth: 0,
      relatedCategories: [],
      popularPosts: []
    })) as CategoryWithStats[],
    topTags: topTags.map(tag => ({
      ...tag,
      posts: [],
      _count: tag._count,
      usageGrowth: 0,
      relatedTags: [],
      popularPosts: []
    })) as TagWithStats[],
    topAuthors: topAuthors.map(author => ({
      ...author,
      posts: [],
      _count: author._count,
      averageViews: author.totalPosts > 0 ? Math.round((author.totalViews || 0) / author.totalPosts) : 0,
      totalEngagement: 0,
      popularPosts: [],
      recentActivity: []
    })) as AuthorWithStats[],
    recentPosts: recentPosts.map(post => ({
      ...post,
      tags: post.tags.map(pt => pt.tag),
      avgReadingTime: post.readingTime || 0,
      engagementRate: post.viewCount > 0 ? 
        ((post.likeCount + post.shareCount + post.commentCount) / post.viewCount) * 100 : 0,
      isPopular: post.viewCount > (totalStats._avg.viewCount || 0),
      isTrending: post.publishedAt && 
        new Date(post.publishedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    })) as BlogPostWithAnalytics[],
    trendingPosts: trendingPosts.map(post => ({
      ...post,
      tags: post.tags.map(pt => pt.tag),
      avgReadingTime: post.readingTime || 0,
      engagementRate: post.viewCount > 0 ? 
        ((post.likeCount + post.shareCount + post.commentCount) / post.viewCount) * 100 : 0,
      isPopular: true,
      isTrending: true
    })) as BlogPostWithAnalytics[]
  }
}

// =======================
// POST ANALYTICS
// =======================

export async function getPostAnalytics(postId: string): Promise<PostAnalytics | null> {
  const [post, viewStats, interactionStats, geographicStats, referrerStats, timeSeriesData] = await Promise.all([
    // Basic post info
    db.blogPost.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        viewCount: true,
        likeCount: true,
        shareCount: true,
        commentCount: true,
        publishedAt: true
      }
    }),

    // View statistics
    db.postView.aggregate({
      where: { postId },
      _count: { id: true },
      _avg: { 
        readingTime: true,
        scrollDepth: true
      }
    }),

    // Interaction statistics  
    db.postInteraction.groupBy({
      by: ['type'],
      where: { postId },
      _count: { type: true }
    }),

    // Geographic distribution
    db.postView.groupBy({
      by: ['country'],
      where: { 
        postId,
        country: { not: null }
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10
    }),

    // Top referrers
    db.postView.groupBy({
      by: ['referer'],
      where: { 
        postId,
        referer: { not: null }
      },
      _count: { referer: true },
      orderBy: { _count: { referer: 'desc' } },
      take: 10
    }),

    // Time series data for the last 30 days
    db.$queryRaw<{ date: string; views: number }[]>`
      SELECT 
        DATE(viewed_at) as date,
        COUNT(*) as views
      FROM post_views 
      WHERE post_id = ${postId}
        AND viewed_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(viewed_at)
      ORDER BY date DESC
    `
  ])

  if (!post) return null

  // Calculate unique views (approximate)
  const uniqueViewsResult = await db.postView.groupBy({
    by: ['visitorId'],
    where: { 
      postId,
      visitorId: { not: null }
    },
    _count: { visitorId: true }
  })

  const uniqueViews = uniqueViewsResult.length

  // Calculate interaction counts
  const interactions: Record<string, number> = interactionStats.reduce((acc, { type, _count }) => {
    acc[type.toLowerCase()] = _count.type
    return acc
  }, {
    like: 0,
    share: 0,
    comment: 0,
    bookmark: 0,
    subscribe: 0,
    download: 0
  } as Record<string, number>)

  const totalInteractions = post.likeCount + post.shareCount + post.commentCount
  const engagementRate = post.viewCount > 0 ? (totalInteractions / post.viewCount) * 100 : 0
  const bounceRate = viewStats._avg.scrollDepth ? (1 - viewStats._avg.scrollDepth) * 100 : 0

  // Generate weekly and monthly aggregations
  const weeklyViews: { week: string; views: number }[] = []
  const monthlyViews: { month: string; views: number }[] = []

  // Group daily data into weeks and months
  timeSeriesData.forEach(({ date, views }) => {
    const dateObj = new Date(date)
    const weekStart = new Date(dateObj.setDate(dateObj.getDate() - dateObj.getDay()))
    const weekKey = weekStart.toISOString().substring(0, 10)
    const monthKey = date.substring(0, 7) // YYYY-MM

    // Weekly aggregation
    const existingWeek = weeklyViews.find(w => w.week === weekKey)
    if (existingWeek) {
      existingWeek.views += views
    } else {
      weeklyViews.push({ week: weekKey, views })
    }

    // Monthly aggregation
    const existingMonth = monthlyViews.find(m => m.month === monthKey)
    if (existingMonth) {
      existingMonth.views += views
    } else {
      monthlyViews.push({ month: monthKey, views })
    }
  })

  return {
    postId,
    views: post.viewCount,
    uniqueViews,
    interactions: totalInteractions,
    shares: post.shareCount,
    likes: post.likeCount,
    comments: post.commentCount,
    bookmarks: interactions.bookmark,
    avgReadingTime: Math.round(viewStats._avg.readingTime || 0),
    bounceRate: Math.round(bounceRate * 100) / 100,
    engagementRate: Math.round(engagementRate * 100) / 100,
    conversionRate: 0, // Would need additional tracking for conversions
    topCountries: geographicStats.map(({ country, _count }) => ({
      country: country || 'Unknown',
      views: _count.country
    })),
    topReferrers: referrerStats.map(({ referer, _count }) => ({
      referrer: referer || 'Direct',
      views: _count.referer
    })),
    dailyViews: timeSeriesData.map(({ date, views }) => ({ date, views })),
    weeklyViews: weeklyViews.sort((a, b) => a.week.localeCompare(b.week)),
    monthlyViews: monthlyViews.sort((a, b) => a.month.localeCompare(b.month))
  }
}

// =======================
// SEO ANALYTICS
// =======================

export async function getSEOAnalytics(postId?: string): Promise<SEOAnalytics> {
  const whereClause = postId ? { postId } : {}

  const [seoEvents, keywords, seoScores] = await Promise.all([
    // SEO events
    db.sEOEvent.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100
    }),

    // SEO keywords
    db.sEOKeyword.findMany({
      where: {
        ...whereClause,
        position: { not: null }
      },
      orderBy: [
        { clicks: 'desc' },
        { impressions: 'desc' }
      ],
      take: 20
    }),

    // SEO scores
    postId ? 
      db.blogPost.findUnique({
        where: { id: postId },
        select: { seoScore: true }
      }) :
      db.blogPost.aggregate({
        where: { status: 'PUBLISHED' },
        _avg: { seoScore: true }
      })
  ])

  const technicalIssues = seoEvents.filter(e => 
    e.severity === 'HIGH' || e.severity === 'CRITICAL'
  )

  const opportunities = seoEvents.filter(e => 
    e.type === 'OPPORTUNITY'
  )

  const topKeywords = keywords.map(k => ({
    keyword: k.keyword,
    position: k.position || 0,
    impressions: k.impressions,
    clicks: k.clicks,
    ctr: k.ctr || 0
  }))

  const currentSeoScore = postId ? 
    (seoScores as {seoScore?: number})?.seoScore || 0 :
    (seoScores as {_avg?: {seoScore?: number}})._avg?.seoScore || 0

  return {
    postId,
    seoScore: Math.round(currentSeoScore * 100) / 100,
    keywordCount: keywords.length,
    topKeywords,
    technicalIssues,
    opportunities,
    improvements: [
      {
        area: 'Title Optimization',
        current: topKeywords.filter(k => k.position <= 10).length,
        target: Math.min(topKeywords.length, 10),
        impact: 'high' as const,
        recommendations: [
          'Include primary keywords in title',
          'Keep titles under 60 characters',
          'Use compelling, clickable language'
        ]
      },
      {
        area: 'Content Quality',
        current: Math.round(currentSeoScore / 10),
        target: 10,
        impact: 'medium' as const,
        recommendations: [
          'Increase content depth and authority',
          'Add relevant internal links',
          'Improve readability score'
        ]
      },
      {
        area: 'Technical SEO',
        current: technicalIssues.length === 0 ? 10 : Math.max(0, 10 - technicalIssues.length),
        target: 10,
        impact: technicalIssues.length > 0 ? 'high' as const : 'low' as const,
        recommendations: [
          'Fix technical issues',
          'Optimize page load speed',
          'Ensure mobile compatibility'
        ]
      }
    ]
  }
}

// =======================
// PERFORMANCE TRACKING
// =======================

export async function getPerformanceMetrics(dateRange?: { from: Date; to: Date }) {
  const viewDateFilter = dateRange ? {
    viewedAt: {
      gte: dateRange.from,
      lte: dateRange.to
    }
  } : {
    viewedAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  }

  const interactionDateFilter = dateRange ? {
    createdAt: {
      gte: dateRange.from,
      lte: dateRange.to
    }
  } : {
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  }

  const postDateFilter = dateRange ? {
    createdAt: {
      gte: dateRange.from,
      lte: dateRange.to
    }
  } : {
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  }

  const [viewTrends, interactionTrends, contentMetrics] = await Promise.all([
    // View trends
    db.postView.groupBy({
      by: ['viewedAt'],
      where: viewDateFilter,
      _count: { id: true },
      orderBy: { viewedAt: 'desc' }
    }),

    // Interaction trends
    db.postInteraction.groupBy({
      by: ['createdAt', 'type'],
      where: interactionDateFilter,
      _count: { id: true },
      orderBy: { createdAt: 'desc' }
    }),

    // Content creation metrics
    db.blogPost.groupBy({
      by: ['createdAt'],
      where: {
        ...postDateFilter,
        status: 'PUBLISHED'
      },
      _count: { id: true },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return {
    viewTrends: viewTrends.slice(0, 30).map(({ viewedAt, _count }) => ({
      date: viewedAt.toISOString().split('T')[0],
      views: _count.id
    })),
    
    interactionTrends: Object.values(interactionTrends.reduce((acc, { createdAt, type, _count }) => {
      const date = createdAt.toISOString().split('T')[0]
      if (!acc[date]) acc[date] = { date, likes: 0, shares: 0, comments: 0, total: 0 }
      
      const typeKey = type.toLowerCase() as 'likes' | 'shares' | 'comments'
      if (typeKey in acc[date]) {
        (acc[date] as Record<string, number>)[typeKey] += _count.id
      }
      acc[date].total += _count.id
      
      return acc
    }, {} as Record<string, {date: string, likes: number, shares: number, comments: number, total: number}>)),
    
    contentMetrics: contentMetrics.slice(0, 30).map(({ createdAt, _count }) => ({
      date: createdAt.toISOString().split('T')[0],
      posts: _count.id
    }))
  }
}

// =======================
// EXPORT FUNCTIONS
// =======================

export async function exportAnalyticsData(
  format: 'json' | 'csv',
  dateRange?: { from: Date; to: Date }
) {
  const summary = await getBlogAnalyticsSummary(dateRange)
  
  if (format === 'json') {
    return JSON.stringify(summary, null, 2)
  }

  // Convert to CSV format
  const csvRows = [
    'Metric,Value',
    `Total Posts,${summary.totalPosts}`,
    `Published Posts,${summary.publishedPosts}`,
    `Draft Posts,${summary.draftPosts}`,
    `Total Views,${summary.totalViews}`,
    `Total Interactions,${summary.totalInteractions}`,
    `Engagement Rate,${summary.engagementRate}%`,
    `Average Reading Time,${summary.avgReadingTime} minutes`,
    `Average Views Per Post,${summary.avgViewsPerPost}`
  ]

  return csvRows.join('\n')
}

// =======================
// CLEANUP OPERATIONS
// =======================

export async function cleanupOldAnalytics(olderThanDays = 365) {
  const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)

  const [deletedViews, deletedInteractions] = await Promise.all([
    db.postView.deleteMany({
      where: {
        viewedAt: { lt: cutoffDate }
      }
    }),

    db.postInteraction.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    })
  ])

  return {
    deletedViews: deletedViews.count,
    deletedInteractions: deletedInteractions.count,
    cleanupDate: new Date().toISOString()
  }
}