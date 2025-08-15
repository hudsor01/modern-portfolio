import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BlogPostData } from '@/types/shared-api';

/**
 * Individual Blog Post API Route Handler
 * GET /api/blog/[slug] - Get single blog post by slug
 * PUT /api/blog/[slug] - Update blog post by slug
 * DELETE /api/blog/[slug] - Delete blog post by slug
 * 
 * Follows existing API patterns from shared-api.ts and matches portfolio architecture
 */

// Import mock data from main route - in real implementation, use database
const mockBlogPosts: BlogPostData[] = [
  {
    id: '2',
    title: 'Building Effective Sales Dashboards with Real-Time Data',
    slug: 'building-effective-sales-dashboards-real-time-data',
    excerpt: 'Learn how to create compelling sales dashboards that drive decision-making and improve team performance.',
    content: `# Building Effective Sales Dashboards

Data visualization is crucial for modern sales teams. An effective dashboard provides real-time insights that drive decision-making and improve performance.

## Key Dashboard Components

### 1. Revenue Metrics
- Monthly Recurring Revenue (MRR)
- Year-over-year growth
- Pipeline velocity
- Win rates by stage

### 2. Activity Tracking
- Calls and meetings scheduled
- Emails sent and responses
- Lead generation metrics
- Follow-up activity

### 3. Performance Indicators
- Individual rep performance
- Team quotas and attainment
- Forecast accuracy
- Deal progression

## Best Practices

1. **Keep it Simple**: Focus on the most important metrics
2. **Real-time Updates**: Ensure data is current and accurate
3. **Mobile Friendly**: Design for various screen sizes
4. **Actionable Insights**: Include clear next steps
5. **Regular Reviews**: Schedule weekly dashboard reviews

## Implementation Tips

- Choose the right visualization tools
- Integrate with your CRM system
- Automate data collection where possible
- Train your team on dashboard usage
- Iterate based on user feedback

## Conclusion

Effective sales dashboards transform raw data into actionable insights. By focusing on key metrics and maintaining data quality, sales teams can make better decisions and drive improved performance.`,
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    // SEO fields
    metaTitle: 'Building Effective Sales Dashboards with Real-Time Data | Richard Hudson',
    metaDescription: 'Learn how to create compelling sales dashboards that drive decision-making and improve team performance.',
    keywords: ['sales dashboards', 'data visualization', 'real-time analytics', 'business intelligence'],
    
    // Content metadata
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'Sales Dashboard with Charts and KPIs',
    readingTime: 6,
    wordCount: 900,
    
    // Publishing
    publishedAt: '2024-01-20T14:30:00Z',
    
    // Timestamps
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    
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
    
    // Analytics
    viewCount: 1800,
    likeCount: 32,
    shareCount: 8,
    commentCount: 5
  },
  {
    id: '1',
    title: 'Revenue Operations Best Practices: A Complete Guide',
    slug: 'revenue-operations-best-practices-complete-guide',
    excerpt: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation.',
    content: `# Revenue Operations Best Practices: A Complete Guide

Revenue operations (RevOps) has become a critical function for modern businesses looking to optimize their sales, marketing, and customer success efforts. As organizations grow, the need for streamlined processes, accurate data, and aligned teams becomes paramount.

## What is Revenue Operations?

Revenue Operations is the strategic approach to aligning sales, marketing, and customer success operations across the entire customer lifecycle. It focuses on process optimization, technology implementation, and data-driven decision making.

## Key Components of Effective RevOps

### 1. Data Management and Analytics
- Centralized data repository
- Real-time reporting and dashboards  
- Advanced analytics and forecasting
- Data quality and governance

### 2. Process Optimization
- Lead routing and management
- Sales pipeline standardization
- Customer onboarding workflows
- Performance tracking and KPIs

### 3. Technology Stack Integration
- CRM optimization and customization
- Marketing automation platforms
- Sales enablement tools
- Analytics and BI platforms

### 4. Cross-Functional Alignment
- Regular team meetings and communication
- Shared goals and metrics
- Collaborative planning processes
- Unified customer experience

## Best Practices for Implementation

### Start with Data Foundation
Before implementing any new processes or tools, ensure your data infrastructure is solid. This includes:
- Data cleansing and standardization
- Establishing single sources of truth
- Creating comprehensive tracking mechanisms
- Implementing data governance policies

### Focus on Process Before Technology
While technology is important, processes should drive tool selection, not the other way around:
- Document existing workflows
- Identify inefficiencies and gaps
- Design optimal future state processes
- Select tools that support these processes

### Measure and Iterate
Continuous improvement is key to RevOps success:
- Define clear KPIs and success metrics
- Regular performance reviews
- Feedback loops from all stakeholders
- Agile approach to process refinement

## Common Challenges and Solutions

### Challenge: Data Silos
**Solution:** Implement integrated platforms and establish data sharing protocols

### Challenge: Process Misalignment
**Solution:** Cross-functional workshops and collaborative process design

### Challenge: Technology Complexity
**Solution:** Focus on integration and user experience rather than feature richness

### Challenge: Change Management
**Solution:** Strong leadership support and comprehensive training programs

## Conclusion

Effective revenue operations require a holistic approach that combines people, process, and technology. By focusing on data-driven decision making, process optimization, and cross-functional alignment, organizations can significantly improve their revenue generation capabilities.

The key is to start small, measure results, and continuously iterate based on what you learn. With proper implementation, RevOps can transform how your organization generates and manages revenue.`,
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
  }
];

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Find post by slug
    const post = mockBlogPosts.find(p => p.slug === slug);
    
    if (!post) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Increment view count (in real implementation, track this properly)
    post.viewCount += 1;
    
    const response: ApiResponse<BlogPostData> = {
      data: post,
      success: true
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5 minutes, CDN for 10 minutes
      }
    });
    
  } catch (error) {
    console.error('Blog Post API Error:', error);
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog post'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/blog/[slug] - Update blog post by slug
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    
    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Find post index by slug
    const postIndex = mockBlogPosts.findIndex(p => p.slug === slug);
    
    if (postIndex === -1) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Update post with new data - handle potential undefined
    const currentPost = mockBlogPosts[postIndex];
    if (!currentPost) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found after index lookup'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    const updatedPost: BlogPostData = {
      ...currentPost,
      ...body,
      id: currentPost.id, // Preserve ID
      slug: currentPost.slug, // Preserve slug
      updatedAt: new Date().toISOString(),
      // Update reading time and word count if content changed
      readingTime: body.content ? Math.ceil(body.content.split(' ').length / 200) : currentPost.readingTime,
      wordCount: body.content ? body.content.split(' ').length : currentPost.wordCount,
      // If status changed to published, set publishedAt
      publishedAt: body.status === 'PUBLISHED' && !currentPost.publishedAt 
        ? new Date().toISOString() 
        : body.publishedAt || currentPost.publishedAt
    };
    
    // Update in mock array
    mockBlogPosts[postIndex] = updatedPost;
    
    const response: ApiResponse<BlogPostData> = {
      data: updatedPost,
      success: true,
      message: 'Blog post updated successfully'
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Blog Post Update Error:', error);
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to update blog post'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/blog/[slug] - Delete blog post by slug
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Find post index by slug
    const postIndex = mockBlogPosts.findIndex(p => p.slug === slug);
    
    if (postIndex === -1) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Remove post from mock array
    mockBlogPosts.splice(postIndex, 1);
    
    const response: ApiResponse<{ success: boolean }> = {
      data: { success: true },
      success: true,
      message: 'Blog post deleted successfully'
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Blog Post Deletion Error:', error);
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to delete blog post'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}