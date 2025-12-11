import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BlogAnalyticsData, BlogPostData, BlogCategoryData, BlogTagData } from '@/types/shared-api';
import { createContextLogger } from '@/lib/monitoring/logger';
import { db } from '@/lib/db';

const logger = createContextLogger('AnalyticsAPI');

/**
 * Blog Analytics API Route Handler
 * GET /api/blog/analytics - Get comprehensive blog analytics data
 *
 * Uses Prisma database for production data
 */

// GET /api/blog/analytics - Get comprehensive blog analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d'; // 7d, 30d, 90d, 1y
    const includeDetails = searchParams.get('details') === 'true';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

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
      popularKeywordsRaw
    ] = await Promise.all([
      // Total posts count
      db.blogPost.count(),

      // Published posts count
      db.blogPost.count({
        where: { status: 'PUBLISHED' }
      }),

      // Draft posts count
      db.blogPost.count({
        where: { status: 'DRAFT' }
      }),

      // Aggregate views and interactions
      db.blogPost.aggregate({
        _sum: {
          viewCount: true,
          likeCount: true,
          shareCount: true,
          commentCount: true
        },
        _avg: {
          readingTime: true
        }
      }),

      // Top posts by views
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 5,
        include: {
          author: true,
          category: true,
          tags: { include: { tag: true } }
        }
      }),

      // Top categories by views
      db.category.findMany({
        orderBy: { totalViews: 'desc' },
        take: 5
      }),

      // Top tags by views
      db.tag.findMany({
        orderBy: { totalViews: 'desc' },
        take: 5
      }),

      // Monthly views from PostView table (if data exists)
      db.postView.groupBy({
        by: ['viewedAt'],
        _count: true,
        where: {
          viewedAt: { gte: startDate }
        },
        orderBy: { viewedAt: 'asc' }
      }),

      // Popular keywords from posts
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { keywords: true }
      })
    ]);

    // Transform top posts
    const topPosts: BlogPostData[] = topPostsRaw.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? undefined,
      content: includeDetails ? post.content : '',
      contentType: post.contentType,
      status: post.status,
      metaTitle: post.metaTitle ?? undefined,
      metaDescription: post.metaDescription ?? undefined,
      keywords: post.keywords,
      featuredImage: post.featuredImage ?? undefined,
      featuredImageAlt: post.featuredImageAlt ?? undefined,
      readingTime: post.readingTime ?? undefined,
      wordCount: post.wordCount ?? undefined,
      publishedAt: post.publishedAt?.toISOString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      authorId: post.authorId,
      author: post.author ? {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
        slug: post.author.slug,
        bio: post.author.bio ?? undefined,
        avatar: post.author.avatar ?? undefined,
        website: post.author.website ?? undefined,
        totalPosts: post.author.totalPosts,
        totalViews: post.author.totalViews,
        createdAt: post.author.createdAt.toISOString()
      } : undefined,
      categoryId: post.categoryId ?? undefined,
      category: post.category ? {
        id: post.category.id,
        name: post.category.name,
        slug: post.category.slug,
        description: post.category.description ?? undefined,
        color: post.category.color ?? undefined,
        icon: post.category.icon ?? undefined,
        postCount: post.category.postCount,
        totalViews: post.category.totalViews,
        createdAt: post.category.createdAt.toISOString()
      } : undefined,
      tags: post.tags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
        description: pt.tag.description ?? undefined,
        color: pt.tag.color ?? undefined,
        postCount: pt.tag.postCount,
        totalViews: pt.tag.totalViews,
        createdAt: pt.tag.createdAt.toISOString()
      })),
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      shareCount: post.shareCount,
      commentCount: post.commentCount
    }));

    // Transform top categories
    const topCategories: BlogCategoryData[] = topCategoriesRaw.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? undefined,
      color: cat.color ?? undefined,
      icon: cat.icon ?? undefined,
      postCount: cat.postCount,
      totalViews: cat.totalViews,
      createdAt: cat.createdAt.toISOString()
    }));

    // Transform top tags
    const topTags: BlogTagData[] = topTagsRaw.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description ?? undefined,
      color: tag.color ?? undefined,
      postCount: tag.postCount,
      totalViews: tag.totalViews,
      createdAt: tag.createdAt.toISOString()
    }));

    // Process monthly views (group by month)
    const monthlyViewsMap = new Map<string, number>();
    for (const view of monthlyViewsRaw) {
      const month = view.viewedAt.toISOString().slice(0, 7); // YYYY-MM format
      monthlyViewsMap.set(month, (monthlyViewsMap.get(month) || 0) + view._count);
    }
    const monthlyViews = Array.from(monthlyViewsMap.entries())
      .map(([month, views]) => ({ month, views }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Process popular keywords
    const keywordCounts = new Map<string, number>();
    for (const post of popularKeywordsRaw) {
      for (const keyword of post.keywords) {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
      }
    }
    const popularKeywords = Array.from(keywordCounts.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate totals
    const totalViews = viewsAndInteractions._sum.viewCount || 0;
    const totalInteractions =
      (viewsAndInteractions._sum.likeCount || 0) +
      (viewsAndInteractions._sum.shareCount || 0) +
      (viewsAndInteractions._sum.commentCount || 0);
    const avgReadingTime = viewsAndInteractions._avg.readingTime || 0;

    const analytics: BlogAnalyticsData = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalInteractions,
      avgReadingTime,
      topPosts,
      topCategories,
      topTags,
      monthlyViews,
      popularKeywords
    };

    const response: ApiResponse<BlogAnalyticsData> = {
      data: analytics,
      success: true
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=120', // Cache for 1 minute, CDN for 2 minutes
      }
    });

  } catch (error) {
    logger.error('Blog Analytics API Error:', error instanceof Error ? error : new Error(String(error)));

    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog analytics'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
