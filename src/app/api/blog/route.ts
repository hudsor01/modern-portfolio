import { NextRequest, NextResponse } from 'next/server';
import { createContextLogger } from '@/lib/monitoring/logger';

const logger = createContextLogger('BlogAPI');
import { 
  PaginatedResponse, 
  BlogPostData, 
  ApiResponse,
  BlogPostFilters,
  BlogPostSort
} from '@/types/shared-api';

/**
 * Blog API Route Handler
 * GET /api/blog - List blog posts with filtering and pagination
 * POST /api/blog - Create new blog post
 * 
 * Follows existing API patterns from shared-api.ts and matches portfolio architecture
 */

// Temporary mock data - replace with actual data source integration
const mockBlogPosts: BlogPostData[] = [
  {
    id: '1',
    title: 'Revenue Operations Best Practices: A Complete Guide',
    slug: 'revenue-operations-best-practices-complete-guide',
    excerpt: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation.',
    content: '# Revenue Operations Best Practices\n\nRevenue operations (RevOps) has become a critical...',
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    // SEO fields
    metaTitle: 'Revenue Operations Best Practices: A Complete Guide | Richard Hudson',
    metaDescription: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation. Expert insights from a RevOps professional.',
    keywords: ['revenue operations', 'revops', 'data analytics', 'process automation', 'sales ops'],
    
    // Content metadata
    featuredImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'Revenue Operations Dashboard Analytics',
    readingTime: 8,
    wordCount: 1200,
    
    // Publishing
    publishedAt: '2024-01-15T10:00:00Z',
    
    // Timestamps
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    
    // Relationships
    authorId: 'richard-hudson',
    author: {
      id: 'richard-hudson',
      name: 'Richard Hudson',
      email: 'richard@example.com',
      slug: 'richard-hudson',
      bio: 'Revenue Operations Professional with 8+ years of experience in data analytics and process optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
      totalPosts: 10,
      totalViews: 15000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    categoryId: 'revenue-operations',
    category: {
      id: 'revenue-operations',
      name: 'Revenue Operations',
      slug: 'revenue-operations',
      description: 'Insights and strategies for revenue operations professionals',
      color: '#3B82F6',
      postCount: 5,
      totalViews: 8000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    tags: [
      {
        id: 'analytics',
        name: 'Analytics',
        slug: 'analytics',
        color: '#10B981',
        postCount: 8,
        totalViews: 5000,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    
    // Analytics
    viewCount: 2500,
    likeCount: 45,
    shareCount: 12,
    commentCount: 8
  },
  {
    id: '2',
    title: 'Building Effective Sales Dashboards with Real-Time Data',
    slug: 'building-effective-sales-dashboards-real-time-data',
    excerpt: 'Learn how to create compelling sales dashboards that drive decision-making and improve team performance.',
    content: '# Building Effective Sales Dashboards\n\nData visualization is crucial...',
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    metaTitle: 'Building Effective Sales Dashboards with Real-Time Data | Richard Hudson',
    metaDescription: 'Learn how to create compelling sales dashboards that drive decision-making and improve team performance.',
    keywords: ['sales dashboards', 'data visualization', 'real-time analytics', 'business intelligence'],
    
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'Sales Dashboard with Charts and KPIs',
    readingTime: 6,
    wordCount: 900,
    
    publishedAt: '2024-01-20T14:30:00Z',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    
    authorId: 'richard-hudson',
    author: {
      id: 'richard-hudson',
      name: 'Richard Hudson',
      email: 'richard@example.com',
      slug: 'richard-hudson',
      bio: 'Revenue Operations Professional with 8+ years of experience in data analytics and process optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
      totalPosts: 10,
      totalViews: 15000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    categoryId: 'data-visualization',
    category: {
      id: 'data-visualization',
      name: 'Data Visualization',
      slug: 'data-visualization',
      description: 'Techniques and best practices for effective data visualization',
      color: '#8B5CF6',
      postCount: 3,
      totalViews: 4500,
      createdAt: '2024-01-01T00:00:00Z'
    },
    tags: [
      {
        id: 'dashboards',
        name: 'Dashboards',
        slug: 'dashboards',
        color: '#F59E0B',
        postCount: 5,
        totalViews: 3200,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    
    viewCount: 1800,
    likeCount: 32,
    shareCount: 8,
    commentCount: 5
  }
];

// Note: mockCategories and mockTags are available if needed for future features

// Apply filters to blog posts
function applyFilters(posts: BlogPostData[], filters?: BlogPostFilters): BlogPostData[] {
  if (!filters) return posts;
  
  let filtered = posts;
  
  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
    filtered = filtered.filter(post => statuses.includes(post.status));
  }
  
  if (filters.authorId) {
    filtered = filtered.filter(post => post.authorId === filters.authorId);
  }
  
  if (filters.categoryId) {
    filtered = filtered.filter(post => post.categoryId === filters.categoryId);
  }
  
  if (filters.tagIds && filters.tagIds.length > 0) {
    filtered = filtered.filter(post => 
      post.tags?.some(tag => filters.tagIds!.includes(tag.id))
    );
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt?.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }
  
  if (filters.dateRange) {
    const { from, to } = filters.dateRange;
    filtered = filtered.filter(post => {
      const publishedAt = new Date(post.publishedAt || post.createdAt);
      return publishedAt >= new Date(from) && publishedAt <= new Date(to);
    });
  }
  
  if (filters.published !== undefined) {
    filtered = filtered.filter(post => 
      filters.published ? post.status === 'PUBLISHED' : post.status !== 'PUBLISHED'
    );
  }
  
  return filtered;
}

// Apply sorting to blog posts
function applySorting(posts: BlogPostData[], sort?: BlogPostSort): BlogPostData[] {
  if (!sort) {
    // Default sort by publishedAt desc
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  return [...posts].sort((a, b) => {
    let valueA: unknown;
    let valueB: unknown;
    
    switch (sort.field) {
      case 'title':
        valueA = a.title;
        valueB = b.title;
        break;
      case 'createdAt':
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
      case 'updatedAt':
        valueA = new Date(a.updatedAt);
        valueB = new Date(b.updatedAt);
        break;
      case 'publishedAt':
        valueA = new Date(a.publishedAt || a.createdAt);
        valueB = new Date(b.publishedAt || b.createdAt);
        break;
      case 'viewCount':
        valueA = a.viewCount;
        valueB = b.viewCount;
        break;
      case 'likeCount':
        valueA = a.likeCount;
        valueB = b.likeCount;
        break;
      default:
        return 0;
    }
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sort.order === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    if (valueA instanceof Date && valueB instanceof Date) {
      return sort.order === 'asc'
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sort.order === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    }
    
    // Fallback for incomparable types
    return 0;
  });
}

// GET /api/blog - List blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50); // Max 50 per page
    const offset = (page - 1) * limit;
    
    // Parse filters
    const filters: BlogPostFilters = {};
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')!;
    }
    if (searchParams.get('authorId')) {
      filters.authorId = searchParams.get('authorId')!;
    }
    if (searchParams.get('categoryId')) {
      filters.categoryId = searchParams.get('categoryId')!;
    }
    if (searchParams.get('tagIds')) {
      filters.tagIds = searchParams.get('tagIds')!.split(',');
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!;
    }
    if (searchParams.get('published')) {
      filters.published = searchParams.get('published') === 'true';
    }
    
    // Date range filter
    if (searchParams.get('dateFrom') && searchParams.get('dateTo')) {
      filters.dateRange = {
        from: searchParams.get('dateFrom')!,
        to: searchParams.get('dateTo')!
      };
    }
    
    // Parse sorting
    let sort: BlogPostSort | undefined;
    if (searchParams.get('sortBy')) {
      sort = {
        field: searchParams.get('sortBy') as BlogPostSort['field'],
        order: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
      };
    }
    
    // Apply filters and sorting
    let filteredPosts = applyFilters(mockBlogPosts, filters);
    filteredPosts = applySorting(filteredPosts, sort);
    
    // Apply pagination
    const total = filteredPosts.length;
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);
    
    const response: PaginatedResponse<BlogPostData> = {
      data: paginatedPosts,
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrev: page > 1
      }
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300', // Cache for 1 minute, CDN for 5 minutes
      }
    });
    
  } catch (error) {
    logger.error('Blog API Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog posts'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.authorId) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Missing required fields: title, content, authorId'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Create new blog post
    const newPost: BlogPostData = {
      id: `post-${Date.now()}`, // In real implementation, use UUID
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      contentType: body.contentType || 'MARKDOWN',
      status: body.status || 'DRAFT',
      
      // SEO fields
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      keywords: body.keywords || [],
      canonicalUrl: body.canonicalUrl,
      
      // Content metadata
      featuredImage: body.featuredImage,
      featuredImageAlt: body.featuredImageAlt,
      readingTime: body.readingTime || Math.ceil(body.content.split(' ').length / 200), // ~200 WPM
      wordCount: body.content.split(' ').length,
      
      // Publishing
      publishedAt: body.status === 'PUBLISHED' ? new Date().toISOString() : body.publishedAt,
      scheduledAt: body.scheduledAt,
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // Relationships
      authorId: body.authorId,
      categoryId: body.categoryId,
      
      // Analytics (start at 0)
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      commentCount: 0
    };
    
    // In real implementation, save to database
    mockBlogPosts.push(newPost);
    
    const response: ApiResponse<BlogPostData> = {
      data: newPost,
      success: true,
      message: 'Blog post created successfully'
    };
    
    return NextResponse.json(response, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    logger.error('Blog Creation Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to create blog post'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}