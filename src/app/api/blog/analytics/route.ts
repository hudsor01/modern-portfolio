import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { and, asc, avg, count, desc, eq, gte, isNull, sum } from 'drizzle-orm'
import type { ApiResponse, BlogAnalyticsData } from '@/types/api'
import { createContextLogger } from '@/lib/logger'
import { db } from '@/lib/db'
import { isAdminRequest } from '@/lib/api-admin-auth'
import { blogPosts, categories, postViews, tags } from '@/db/schema'
import {
  transformToBlogPostData,
  transformToCategoryData,
  transformToTagData,
  createErrorResponse,
} from '@/lib/api-blog'
import { BLOG_POST_COLUMNS } from '@/lib/blog-columns'

// Enum must stay in lockstep with getStartDate's switch cases below.
const timeRangeSchema = z.enum(['7d', '30d', '90d', '1y']).default('30d')

const logger = createContextLogger('AnalyticsAPI')

/**
 * Blog Analytics API Route Handler
 * GET /api/blog/analytics - Get comprehensive blog analytics data
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
    const timeRangeParam = searchParams.get('timeRange')
    const timeRangeResult = timeRangeSchema.safeParse(timeRangeParam ?? undefined)
    if (!timeRangeResult.success) {
      return NextResponse.json(
        createErrorResponse('Invalid timeRange; must be one of 7d, 30d, 90d, 1y'),
        { status: 400 }
      )
    }
    const timeRange = timeRangeResult.data
    const includeDetails = searchParams.get('details') === 'true'
    const startDate = getStartDate(timeRange)
    const isAdmin = isAdminRequest(request)
    // The public gate every other blog surface applies. Without the deletedAt
    // half, a soft-deleted post would count as published and, once it ranked
    // in the top 5, `?details=true` would return its full content.
    const isPublicPost = and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt))

    const [
      totalPostsRows,
      publishedPostsRows,
      draftPostsRows,
      viewsAndInteractionsRows,
      topPostsRaw,
      topCategoriesRaw,
      topTagsRaw,
      monthlyViewsRaw,
      popularKeywordsRaw,
    ] = await Promise.all([
      db.select({ value: count() }).from(blogPosts),
      db.select({ value: count() }).from(blogPosts).where(isPublicPost),
      db.select({ value: count() }).from(blogPosts).where(eq(blogPosts.status, 'DRAFT')),
      db
        .select({
          totalViews: sum(blogPosts.viewCount).mapWith(Number),
          totalLikes: sum(blogPosts.likeCount).mapWith(Number),
          totalShares: sum(blogPosts.shareCount).mapWith(Number),
          totalComments: sum(blogPosts.commentCount).mapWith(Number),
          avgReadingTime: avg(blogPosts.readingTime).mapWith(Number),
        })
        .from(blogPosts),
      db.query.blogPosts.findMany({
        where: isPublicPost,
        orderBy: desc(blogPosts.viewCount),
        limit: 5,
        columns: BLOG_POST_COLUMNS,
        with: {
          author: true,
          category: true,
          tags: { with: { tag: true } },
        },
      }),
      db.select().from(categories).orderBy(desc(categories.totalViews)).limit(5),
      db.select().from(tags).orderBy(desc(tags.totalViews)).limit(5),
      db
        .select({ viewedAt: postViews.viewedAt, count: count() })
        .from(postViews)
        .where(gte(postViews.viewedAt, startDate))
        .groupBy(postViews.viewedAt)
        .orderBy(asc(postViews.viewedAt)),
      db.select({ keywords: blogPosts.keywords }).from(blogPosts).where(isPublicPost),
    ])

    const totalPosts = totalPostsRows[0]?.value ?? 0
    const publishedPosts = publishedPostsRows[0]?.value ?? 0
    const draftPosts = draftPostsRows[0]?.value ?? 0
    const aggregates = viewsAndInteractionsRows[0]

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

    // Group views by month
    const monthlyViewsMap = new Map<string, number>()
    for (const view of monthlyViewsRaw) {
      const month = view.viewedAt.toISOString().slice(0, 7)
      monthlyViewsMap.set(month, (monthlyViewsMap.get(month) || 0) + view.count)
    }
    const monthlyViews = Array.from(monthlyViewsMap.entries())
      .map(([month, views]) => ({ month, views }))
      .sort((a, b) => a.month.localeCompare(b.month))

    const keywordCounts = new Map<string, number>()
    for (const post of popularKeywordsRaw) {
      for (const keyword of post.keywords ?? []) {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1)
      }
    }
    const popularKeywords = Array.from(keywordCounts.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const totalViews = aggregates?.totalViews ?? 0
    const totalInteractions =
      (aggregates?.totalLikes ?? 0) +
      (aggregates?.totalShares ?? 0) +
      (aggregates?.totalComments ?? 0)

    const analytics: BlogAnalyticsData = {
      // Total and draft counts reveal that unpublished posts exist (and how
      // many), so only admin-token holders get them. Both queries still run,
      // keeping the query set identical for every caller.
      ...(isAdmin ? { totalPosts, draftPosts } : {}),
      publishedPosts,
      totalViews,
      totalInteractions,
      avgReadingTime: aggregates?.avgReadingTime ?? 0,
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
        // Admin responses carry the unpublished counts, so they must never
        // enter a shared/CDN cache (same split as GET /api/blog).
        'Cache-Control': isAdmin
          ? 'private, no-store, max-age=0, must-revalidate'
          : 'public, max-age=60, s-maxage=120',
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
