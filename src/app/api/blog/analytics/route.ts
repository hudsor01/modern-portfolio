import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, BlogAnalyticsData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import {
  transformToBlogPostData,
  transformToCategoryData,
  transformToTagData,
  createErrorResponse,
} from '@/lib/api-blog'

const logger = createContextLogger('AnalyticsAPI')

/**
 * Blog Analytics API Route Handler
 * GET /api/blog/analytics - Get comprehensive blog analytics data
 *
 * Uses Prisma database for production data
 */

function getStartDate(timeRange: string): Date {
  const now = new Date()
  const msPerDay = 24 * 60 * 60 * 1000

  switch (timeRange) {
    case '7d':
      return new Date(now.getTime() - 7 * msPerDay)
    case '90d':
      return new Date(now.getTime() - 90 * msPerDay)
    case '1y':
      return new Date(now.getTime() - 365 * msPerDay)
    default:
      return new Date(now.getTime() - 30 * msPerDay)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    const includeDetails = searchParams.get('details') === 'true'
    const startDate = getStartDate(timeRange)

    // Execute parallel queries for efficiency
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      viewsAndInteractions,
      topPostsRaw,
      topCategoriesRaw,
      topTagsRaw,
      monthlyViewsRaw,
      popularKeywordsRaw,
    ] = await Promise.all([
      db.blogPost.count(),
      db.blogPost.count({ where: { status: 'PUBLISHED' } }),
      db.blogPost.count({ where: { status: 'DRAFT' } }),
      db.blogPost.aggregate({
        _sum: { viewCount: true, likeCount: true, shareCount: true, commentCount: true },
        _avg: { readingTime: true },
      }),
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 5,
        include: { author: true, category: true, tags: { include: { tag: true } } },
      }),
      db.category.findMany({ orderBy: { totalViews: 'desc' }, take: 5 }),
      db.tag.findMany({ orderBy: { totalViews: 'desc' }, take: 5 }),
      db.postView.groupBy({
        by: ['viewedAt'],
        _count: true,
        where: { viewedAt: { gte: startDate } },
        orderBy: { viewedAt: 'asc' },
      }),
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { keywords: true },
      }),
    ])

    // Transform using shared helpers (removes ~60 lines of duplication)
    const topPosts = topPostsRaw.map((post) => {
      const transformed = transformToBlogPostData(post)
      // Optionally exclude content for summary views
      if (!includeDetails) {
        transformed.content = ''
      }
      return transformed
    })

    const topCategories = topCategoriesRaw.map(transformToCategoryData)
    const topTags = topTagsRaw.map(transformToTagData)

    // Process monthly views (group by month)
    const monthlyViewsMap = new Map<string, number>()
    for (const view of monthlyViewsRaw) {
      const month = view.viewedAt.toISOString().slice(0, 7)
      monthlyViewsMap.set(month, (monthlyViewsMap.get(month) || 0) + view._count)
    }
    const monthlyViews = Array.from(monthlyViewsMap.entries())
      .map(([month, views]) => ({ month, views }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Process popular keywords
    const keywordCounts = new Map<string, number>()
    for (const post of popularKeywordsRaw) {
      for (const keyword of post.keywords) {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1)
      }
    }
    const popularKeywords = Array.from(keywordCounts.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate totals
    const sums = viewsAndInteractions._sum
    const totalViews = sums.viewCount || 0
    const totalInteractions =
      (sums.likeCount || 0) + (sums.shareCount || 0) + (sums.commentCount || 0)

    const analytics: BlogAnalyticsData = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalInteractions,
      avgReadingTime: viewsAndInteractions._avg.readingTime || 0,
      topPosts,
      topCategories,
      topTags,
      monthlyViews,
      popularKeywords,
    }

    const response: ApiResponse<BlogAnalyticsData> = {
      data: analytics,
      success: true,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120',
      },
    })
  } catch (error) {
    logger.error(
      'Blog Analytics API Error:',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(createErrorResponse('Failed to fetch blog analytics'), {
      status: 500,
    })
  }
}
