import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BlogAnalyticsData } from '@/types/shared-api';
import { createContextLogger } from '@/lib/monitoring/logger';

const logger = createContextLogger('AnalyticsAPI');

/**
 * Blog Analytics API Route Handler
 * GET /api/blog/analytics - Get comprehensive blog analytics data
 * 
 * Follows existing API patterns from shared-api.ts and matches portfolio architecture
 */

// GET /api/blog/analytics - Get comprehensive blog analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d'; // 7d, 30d, 90d, 1y
    const includeDetails = searchParams.get('details') === 'true';
    
    // Mock analytics data - in real implementation, calculate from database
    const mockAnalytics: BlogAnalyticsData = {
      totalPosts: 24,
      publishedPosts: 18,
      draftPosts: 6,
      totalViews: 15420,
      totalInteractions: 342,
      avgReadingTime: 4.2,
      
      topPosts: [
        {
          id: '1',
          title: 'Revenue Operations Best Practices: A Complete Guide',
          slug: 'revenue-operations-best-practices-complete-guide',
          excerpt: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation.',
          content: '',
          contentType: 'MARKDOWN',
          status: 'PUBLISHED',
          metaTitle: 'Revenue Operations Best Practices: A Complete Guide | Richard Hudson',
          metaDescription: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation.',
          keywords: ['revenue operations', 'revops', 'data analytics'],
          featuredImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center&q=80',
          featuredImageAlt: 'Revenue Operations Dashboard',
          readingTime: 8,
          wordCount: 1200,
          publishedAt: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          authorId: 'richard-hudson',
          categoryId: 'revenue-operations',
          viewCount: 2500,
          likeCount: 45,
          shareCount: 12,
          commentCount: 8
        },
        {
          id: '2',
          title: 'Building Effective Sales Dashboards with Real-Time Data',
          slug: 'building-effective-sales-dashboards-real-time-data',
          excerpt: 'Learn how to create compelling sales dashboards that drive decision-making.',
          content: '',
          contentType: 'MARKDOWN',
          status: 'PUBLISHED',
          metaTitle: 'Building Effective Sales Dashboards | Richard Hudson',
          metaDescription: 'Learn how to create compelling sales dashboards that drive decision-making.',
          keywords: ['sales dashboards', 'data visualization'],
          featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80',
          featuredImageAlt: 'Sales Dashboard Interface',
          readingTime: 6,
          wordCount: 900,
          publishedAt: '2024-01-20T14:30:00Z',
          createdAt: '2024-01-18T11:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          authorId: 'richard-hudson',
          categoryId: 'data-visualization',
          viewCount: 1800,
          likeCount: 32,
          shareCount: 8,
          commentCount: 5
        }
      ],
      
      topCategories: [
        {
          id: 'revenue-operations',
          name: 'Revenue Operations',
          slug: 'revenue-operations',
          description: 'Insights and strategies for revenue operations professionals',
          color: '#3B82F6',
          icon: '📊',
          postCount: 5,
          totalViews: 8000,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'data-visualization',
          name: 'Data Visualization',
          slug: 'data-visualization',
          description: 'Techniques and best practices for effective data visualization',
          color: '#8B5CF6',
          icon: '📈',
          postCount: 3,
          totalViews: 4500,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      
      topTags: [
        {
          id: 'analytics',
          name: 'Analytics',
          slug: 'analytics',
          description: 'Data analysis and insights',
          color: '#10B981',
          postCount: 8,
          totalViews: 5000,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'dashboards',
          name: 'Dashboards',
          slug: 'dashboards',
          description: 'Dashboard design and development',
          color: '#F59E0B',
          postCount: 5,
          totalViews: 3200,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      
      monthlyViews: [
        { month: '2024-01', views: 3200 },
        { month: '2024-02', views: 4100 },
        { month: '2024-03', views: 3800 },
        { month: '2024-04', views: 4500 },
        { month: '2024-05', views: 5200 },
        { month: '2024-06', views: 4900 }
      ],
      
      popularKeywords: [
        { keyword: 'revenue operations', count: 125 },
        { keyword: 'data analytics', count: 98 },
        { keyword: 'sales dashboards', count: 87 },
        { keyword: 'process automation', count: 76 },
        { keyword: 'kpis', count: 65 },
        { keyword: 'crm optimization', count: 58 },
        { keyword: 'data visualization', count: 54 },
        { keyword: 'reporting', count: 45 }
      ]
    };
    
    // Filter data based on time range (in real implementation)
    let filteredAnalytics = mockAnalytics;
    
    switch (timeRange) {
      case '7d':
        // Filter to last 7 days data
        filteredAnalytics = {
          ...mockAnalytics,
          totalViews: Math.floor(mockAnalytics.totalViews * 0.25),
          totalInteractions: Math.floor(mockAnalytics.totalInteractions * 0.25),
          monthlyViews: mockAnalytics.monthlyViews.slice(-1).map(item => ({
            ...item,
            views: Math.floor(item.views * 0.25)
          }))
        };
        break;
      case '90d':
        // Extend to 90 days
        filteredAnalytics = {
          ...mockAnalytics,
          totalViews: Math.floor(mockAnalytics.totalViews * 1.5),
          totalInteractions: Math.floor(mockAnalytics.totalInteractions * 1.5)
        };
        break;
      case '1y':
        // Full year data
        filteredAnalytics = {
          ...mockAnalytics,
          totalViews: Math.floor(mockAnalytics.totalViews * 2.5),
          totalInteractions: Math.floor(mockAnalytics.totalInteractions * 2.5),
          monthlyViews: [
            ...mockAnalytics.monthlyViews,
            { month: '2024-07', views: 5400 },
            { month: '2024-08', views: 5800 },
            { month: '2024-09', views: 6200 },
            { month: '2024-10', views: 5900 },
            { month: '2024-11', views: 6500 },
            { month: '2024-12', views: 7100 }
          ]
        };
        break;
    }
    
    // Remove detailed post content if not requested
    if (!includeDetails) {
      filteredAnalytics.topPosts = filteredAnalytics.topPosts.map(post => ({
        ...post,
        content: '' // Remove content to reduce payload size
      }));
    }
    
    const response: ApiResponse<BlogAnalyticsData> = {
      data: filteredAnalytics,
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