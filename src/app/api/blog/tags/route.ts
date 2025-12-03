import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BlogTagData } from '@/types/shared-api';
import { createContextLogger } from '@/lib/monitoring/logger';

const logger = createContextLogger('TagsAPI');

/**
 * Blog Tags API Route Handler
 * GET /api/blog/tags - List all blog tags
 * POST /api/blog/tags - Create new blog tag
 * 
 * Follows existing API patterns from shared-api.ts and matches portfolio architecture
 */

// Mock tags data
const mockTags: BlogTagData[] = [
  {
    id: 'analytics',
    name: 'Analytics',
    slug: 'analytics',
    description: 'Data analysis, metrics, and insights',
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
  },
  {
    id: 'kpis',
    name: 'KPIs',
    slug: 'kpis',
    description: 'Key Performance Indicators and metrics',
    color: '#EF4444',
    postCount: 6,
    totalViews: 4100,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'automation',
    name: 'Automation',
    slug: 'automation',
    description: 'Process automation and workflow optimization',
    color: '#8B5CF6',
    postCount: 4,
    totalViews: 2800,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'crm',
    name: 'CRM',
    slug: 'crm',
    description: 'Customer Relationship Management systems and strategies',
    color: '#3B82F6',
    postCount: 7,
    totalViews: 4500,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    slug: 'data-visualization',
    description: 'Charts, graphs, and visual data representation',
    color: '#06B6D4',
    postCount: 5,
    totalViews: 3600,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sales-ops',
    name: 'Sales Operations',
    slug: 'sales-ops',
    description: 'Sales operations strategy and execution',
    color: '#84CC16',
    postCount: 6,
    totalViews: 4200,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'reporting',
    name: 'Reporting',
    slug: 'reporting',
    description: 'Business reporting and insights',
    color: '#F97316',
    postCount: 4,
    totalViews: 2900,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// GET /api/blog/tags - List all blog tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const popular = searchParams.get('popular') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    
    let filteredTags = mockTags;
    
    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredTags = filteredTags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm) ||
        tag.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by popularity if requested
    if (popular) {
      filteredTags = [...filteredTags].sort((a, b) => 
        b.totalViews - a.totalViews || b.postCount - a.postCount
      );
    }
    
    // Apply limit
    if (limit && limit > 0) {
      filteredTags = filteredTags.slice(0, Math.min(limit, 50)); // Max 50 tags
    }
    
    const response: ApiResponse<BlogTagData[]> = {
      data: filteredTags,
      success: true
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5 minutes, CDN for 10 minutes
      }
    });
    
  } catch (error) {
    logger.error('Blog Tags API Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog tags'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/blog/tags - Create new blog tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Missing required field: name'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check if tag with this slug already exists
    if (mockTags.some(tag => tag.slug === slug)) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Tag with this name already exists'
      };
      
      return NextResponse.json(errorResponse, { status: 409 });
    }
    
    // Generate a random color if not provided
    const defaultColors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)];
    
    // Create new tag
    const newTag: BlogTagData = {
      id: `tag-${Date.now()}`, // In real implementation, use UUID
      name: body.name,
      slug,
      description: body.description,
      color: body.color || randomColor,
      postCount: 0, // Start with 0 posts
      totalViews: 0, // Start with 0 views
      createdAt: new Date().toISOString()
    };
    
    // Add to mock array
    mockTags.push(newTag);
    
    const response: ApiResponse<BlogTagData> = {
      data: newTag,
      success: true,
      message: 'Blog tag created successfully'
    };
    
    return NextResponse.json(response, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    logger.error('Blog Tag Creation Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to create blog tag'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}