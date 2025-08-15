import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BlogCategoryData } from '@/types/shared-api';
import { db } from '@/lib/db';

/**
 * Blog Categories API Route Handler
 * GET /api/blog/categories - List all blog categories
 * POST /api/blog/categories - Create new blog category
 * 
 * Uses Prisma database integration for real data storage
 */

// GET /api/blog/categories - List all blog categories
export async function GET(_request: NextRequest) {
  try {
    const categories = await db.category.findMany({
      orderBy: [
        { postCount: 'desc' },
        { name: 'asc' }
      ]
    });
    
    const formattedCategories: BlogCategoryData[] = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon,
      postCount: category.postCount,
      totalViews: category.totalViews,
      createdAt: category.createdAt.toISOString()
    }));
    
    const response: ApiResponse<BlogCategoryData[]> = {
      data: formattedCategories,
      success: true
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5 minutes, CDN for 10 minutes
      }
    });
    
  } catch (error) {
    console.error('Blog Categories API Error:', error);
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog categories'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/blog/categories - Create new blog category
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
    
    // Check if category with this slug already exists
    const existingCategory = await db.category.findUnique({
      where: { slug }
    });
    
    if (existingCategory) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Category with this name already exists'
      };
      
      return NextResponse.json(errorResponse, { status: 409 });
    }
    
    // Create new category in database
    const newCategory = await db.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        color: body.color || '#6B7280', // Default gray color
        icon: body.icon,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords || [],
        postCount: 0, // Start with 0 posts
        totalViews: 0, // Start with 0 views
      }
    });
    
    const formattedCategory: BlogCategoryData = {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description,
      color: newCategory.color,
      icon: newCategory.icon,
      postCount: newCategory.postCount,
      totalViews: newCategory.totalViews,
      createdAt: newCategory.createdAt.toISOString()
    };
    
    const response: ApiResponse<BlogCategoryData> = {
      data: formattedCategory,
      success: true,
      message: 'Blog category created successfully'
    };
    
    return NextResponse.json(response, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Blog Category Creation Error:', error);
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to create blog category'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}