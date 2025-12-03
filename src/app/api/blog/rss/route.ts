import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, RSSFeedData } from '@/types/shared-api';
import { createContextLogger } from '@/lib/monitoring/logger';

const logger = createContextLogger('RssAPI');

/**
 * Blog RSS Feed API Route Handler
 * GET /api/blog/rss - Generate RSS feed for blog posts
 * 
 * Follows existing API patterns from shared-api.ts and matches portfolio architecture
 */

// GET /api/blog/rss - Generate RSS feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // 'json' or 'xml'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100); // Max 100 posts
    
    // Mock RSS data - in real implementation, fetch from database
    const mockRSSData: RSSFeedData = {
      title: 'Richard Hudson - Revenue Operations Blog',
      description: 'Expert insights on revenue operations, data analytics, and business process optimization from Richard Hudson, a seasoned RevOps professional.',
      link: 'https://richardhudson.dev/blog',
      lastBuildDate: new Date().toISOString(),
      language: 'en-us',
      posts: [
        {
          title: 'Revenue Operations Best Practices: A Complete Guide',
          link: 'https://richardhudson.dev/blog/revenue-operations-best-practices-complete-guide',
          description: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation. Learn how to align sales, marketing, and customer success teams for maximum revenue impact.',
          pubDate: '2024-01-15T10:00:00Z',
          author: 'Richard Hudson',
          category: 'Revenue Operations',
          guid: 'https://richardhudson.dev/blog/revenue-operations-best-practices-complete-guide'
        },
        {
          title: 'Building Effective Sales Dashboards with Real-Time Data',
          link: 'https://richardhudson.dev/blog/building-effective-sales-dashboards-real-time-data',
          description: 'Learn how to create compelling sales dashboards that drive decision-making and improve team performance. Includes practical examples and best practices for data visualization.',
          pubDate: '2024-01-20T14:30:00Z',
          author: 'Richard Hudson',
          category: 'Data Visualization',
          guid: 'https://richardhudson.dev/blog/building-effective-sales-dashboards-real-time-data'
        },
        {
          title: 'Advanced Customer Churn Analysis Techniques',
          link: 'https://richardhudson.dev/blog/advanced-customer-churn-analysis-techniques',
          description: 'Deep dive into predictive analytics for customer retention. Learn how to identify at-risk customers and implement proactive retention strategies.',
          pubDate: '2024-02-05T09:15:00Z',
          author: 'Richard Hudson',
          category: 'Analytics',
          guid: 'https://richardhudson.dev/blog/advanced-customer-churn-analysis-techniques'
        },
        {
          title: 'Automating Revenue Reporting with Modern Tools',
          link: 'https://richardhudson.dev/blog/automating-revenue-reporting-modern-tools',
          description: 'Streamline your revenue reporting process using automation tools and APIs. Reduce manual work and increase accuracy in your financial reporting.',
          pubDate: '2024-02-12T11:45:00Z',
          author: 'Richard Hudson',
          category: 'Automation',
          guid: 'https://richardhudson.dev/blog/automating-revenue-reporting-modern-tools'
        },
        {
          title: 'KPI Design Principles for Revenue Operations',
          link: 'https://richardhudson.dev/blog/kpi-design-principles-revenue-operations',
          description: 'Essential guidelines for designing effective KPIs that align with business objectives. Learn how to select, measure, and optimize key performance indicators.',
          pubDate: '2024-02-18T13:20:00Z',
          author: 'Richard Hudson',
          category: 'Revenue Operations',
          guid: 'https://richardhudson.dev/blog/kpi-design-principles-revenue-operations'
        }
      ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, limit)
    };
    
    if (format === 'xml') {
      // Generate XML RSS feed
      const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${mockRSSData.title}]]></title>
    <description><![CDATA[${mockRSSData.description}]]></description>
    <link>${mockRSSData.link}</link>
    <language>${mockRSSData.language}</language>
    <lastBuildDate>${mockRSSData.lastBuildDate}</lastBuildDate>
    <atom:link href="https://richardhudson.dev/api/blog/rss?format=xml" rel="self" type="application/rss+xml"/>
    <generator>Richard Hudson Portfolio Blog</generator>
    <webMaster>richard@richardhudson.dev (Richard Hudson)</webMaster>
    <managingEditor>richard@richardhudson.dev (Richard Hudson)</managingEditor>
    <copyright>© ${new Date().getFullYear()} Richard Hudson</copyright>
    <category>Revenue Operations</category>
    <category>Data Analytics</category>
    <category>Business Intelligence</category>
    
    ${mockRSSData.posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.link}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
      <author>richard@richardhudson.dev (${post.author})</author>
      <category><![CDATA[${post.category}]]></category>
      <guid isPermaLink="true">${post.guid}</guid>
    </item>`).join('')}
    
  </channel>
</rss>`;
      
      return new NextResponse(xmlFeed, {
        status: 200,
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=7200', // Cache for 1 hour, CDN for 2 hours
        }
      });
    }
    
    // Return JSON format (default)
    const response: ApiResponse<RSSFeedData> = {
      data: mockRSSData,
      success: true
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=7200', // Cache for 1 hour, CDN for 2 hours
      }
    });
    
  } catch (error) {
    logger.error('Blog RSS API Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to generate RSS feed'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}