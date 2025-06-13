import { NextRequest, NextResponse } from 'next/server';
import { webVitalsService, checkAnalyticsRateLimit } from '@/lib/analytics/web-vitals-service';
import { v4 } from 'uuid'; // Changed import and removed alias

/**
 * Production-Ready Web Vitals API Route
 * 
 * Collects Core Web Vitals metrics with proper validation, rate limiting,
 * and storage for performance monitoring and analysis.
 */
export async function POST(request: NextRequest) {
  try {
    // Get client information
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    // Rate limiting
    if (!checkAnalyticsRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    // Parse the request body
    const body: VitalsRequestBody = await request.json(); // Typed the body
    
    // Generate or extract session ID
    const sessionId = request.cookies.get('session-id')?.value || v4(); // Use v4 directly
    
    // Extract viewport from body if available
    const viewport = body.viewport || { width: 1920, height: 1080 };
    
    // Collect the Web Vitals data
    const result = await webVitalsService.collect(body, {
      userAgent,
      url: referer,
      sessionId,
      viewport,
      // userId can be added here if you have user authentication
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    // Set session cookie if it's new
    const response = NextResponse.json({ success: true });
    if (!request.cookies.get('session-id')) {
      response.cookies.set('session-id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error processing Web Vitals:', error);
    
    return NextResponse.json(
      { error: 'Failed to process Web Vitals data' },
      { status: 500 }
    );
  }
}

interface VitalsRequestBody {
  // Fields from WebVitalsSchema can be listed here as optional if needed for stricter typing
  // but Zod will handle validation. We mainly care about 'viewport' here for direct access.
  viewport?: { width: number; height: number };
  [key: string]: unknown; // Allows any other properties, which Zod will parse
}

/**
 * Get Web Vitals Analytics (for admin/monitoring dashboard)
 */
export async function GET(request: NextRequest) {
  try {
    // In production, you'd want authentication here
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('range') || '24h';
    const page = searchParams.get('page');
    const metric = searchParams.get('metric') as string | null;
    
    // Calculate time range
    const now = new Date();
    const start = new Date();
    switch (timeRange) {
      case '1h':
        start.setHours(now.getHours() - 1);
        break;
      case '24h':
        start.setHours(now.getHours() - 24);
        break;
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
      default:
        start.setHours(now.getHours() - 24);
    }
    
    // Get analytics data
    const analytics = await webVitalsService.getAggregatedAnalytics(
      { start, end: now }
    );
    
    const allowedMetrics = ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'] as const;
    type MetricType = typeof allowedMetrics[number];

    const recentMetrics = await webVitalsService.getAnalytics({
      startDate: start,
      endDate: now,
      page: page || undefined,
      metric: allowedMetrics.includes(metric as MetricType) ? (metric as MetricType) : undefined,
      limit: 100,
    });
    
    const realtimeData = await webVitalsService.getRealtimeMetrics();
    
    return NextResponse.json({
      timeRange,
      analytics,
      recentMetrics,
      realtime: realtimeData,
    });
  } catch (error) {
    console.error('Error fetching Web Vitals analytics:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
