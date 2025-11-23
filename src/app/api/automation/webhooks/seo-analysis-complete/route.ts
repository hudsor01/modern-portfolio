/**
 * SEO Analysis Complete Webhook Handler
 * Handles completion of SEO analysis jobs and triggers follow-up actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue } from '@/lib/automation/job-queue';
import { z } from 'zod';
import type { ApiResponse } from '@/types/shared-api';
import { createContextLogger } from '@/lib/logging/logger';

const logger = createContextLogger('SeoanalysiscompleteAPI');

// Webhook payload validation schema
const SEOAnalysisCompleteWebhookSchema = z.object({
  analysis: z.object({
    postId: z.string(),
    jobId: z.string(),
    seoScore: z.object({
      overall: z.number().min(0).max(100),
      title: z.number().min(0).max(100),
      description: z.number().min(0).max(100),
      keywords: z.number().min(0).max(100),
      content: z.number().min(0).max(100)
    }),
    recommendations: z.array(z.object({
      type: z.string(),
      message: z.string(),
      priority: z.enum(['high', 'medium', 'low'])
    })),
    optimization: z.object({
      optimizedTitle: z.string(),
      optimizedDescription: z.string(),
      extractedKeywords: z.array(z.string())
    }),
    completedAt: z.string()
  }),
  trigger: z.object({
    event: z.literal('seo.analysis.complete'),
    timestamp: z.string(),
    source: z.string().default('job-queue')
  }),
  metadata: z.object({
    correlationId: z.string().optional(),
    parentJobId: z.string().optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate webhook payload
    const body = await request.json();
    const webhookData = SEOAnalysisCompleteWebhookSchema.parse(body);
    
    const { analysis, trigger } = webhookData;
    const { seoScore, recommendations, postId } = analysis;

    // Create idempotency key
    const idempotencyKey = `seo-complete:${analysis.jobId}:${trigger.timestamp}`;

    const followUpJobs = [];

    // If SEO score is below threshold, trigger content optimization
    if (seoScore.overall < 70) {
      const contentOptJob = await jobQueue.addJob('content-optimization', {
        postId,
        content: '', // Would fetch from database
        targetKeywords: analysis.optimization.extractedKeywords,
        optimizationLevel: 'advanced' as const
      }, {
        priority: 'high',
        idempotencyKey: `auto-opt:${idempotencyKey}`,
        tags: ['seo-triggered', 'auto-optimization', postId]
      });
      followUpJobs.push({ type: 'content-optimization', id: contentOptJob.id });
    }

    // If there are high-priority recommendations, send notification
    const highPriorityRecommendations = recommendations.filter(r => r.priority === 'high');
    if (highPriorityRecommendations.length > 0) {
      const notificationJob = await jobQueue.addJob('email-notification', {
        type: 'seo-analysis-complete' as const,
        recipients: [process.env.ADMIN_EMAIL || 'admin@example.com'],
        subject: `SEO Analysis Alert: High Priority Issues Found`,
        content: `
          <h2>SEO Analysis Results for Post ${postId}</h2>
          <p><strong>Overall Score:</strong> ${seoScore.overall}/100</p>
          
          <h3>High Priority Recommendations:</h3>
          <ul>
            ${highPriorityRecommendations.map(r => `<li><strong>${r.type}:</strong> ${r.message}</li>`).join('')}
          </ul>
          
          <h3>Optimized Suggestions:</h3>
          <p><strong>Title:</strong> ${analysis.optimization.optimizedTitle}</p>
          <p><strong>Description:</strong> ${analysis.optimization.optimizedDescription}</p>
          <p><strong>Keywords:</strong> ${analysis.optimization.extractedKeywords.join(', ')}</p>
          
          <p>Analysis completed at: ${analysis.completedAt}</p>
        `
      }, {
        priority: 'normal',
        tags: ['seo-notification', postId]
      });
      followUpJobs.push({ type: 'email-notification', id: notificationJob.id });
    }

    // If score is good (>80), schedule social media promotion
    if (seoScore.overall > 80) {
      const socialJob = await jobQueue.addJob('social-media-posting', {
        postId,
        platforms: ['twitter', 'linkedin'] as const,
        content: {
          title: analysis.optimization.optimizedTitle,
          excerpt: analysis.optimization.optimizedDescription,
          url: `/blog/${postId}`, // Would use actual slug
          hashtags: ['SEO', 'OptimizedContent', ...analysis.optimization.extractedKeywords.slice(0, 2)]
        }
      }, {
        priority: 'normal',
        delay: 1800000, // 30 minutes delay
        tags: ['seo-triggered', 'promotion', postId]
      });
      followUpJobs.push({ type: 'social-media-posting', id: socialJob.id });
    }

    // Always update sitemap after SEO analysis
    const sitemapJob = await jobQueue.addJob('sitemap-generation', {
      includeBlogPosts: true,
      includePages: false
    }, {
      priority: 'low',
      idempotencyKey: `sitemap-seo:${idempotencyKey}`,
      tags: ['seo-triggered', 'sitemap-update']
    });
    followUpJobs.push({ type: 'sitemap-generation', id: sitemapJob.id });

    // Send webhook notifications to external monitoring services
    const monitoringWebhooks = [];
    
    // Google Analytics notification (if configured)
    if (process.env.GA_WEBHOOK_URL) {
      monitoringWebhooks.push({
        url: process.env.GA_WEBHOOK_URL,
        method: 'POST' as const,
        headers: { 'Content-Type': 'application/json' },
        body: {
          event: 'seo_analysis_complete',
          postId,
          score: seoScore.overall,
          recommendations: recommendations.length,
          timestamp: analysis.completedAt
        }
      });
    }

    // SEO monitoring service notification
    if (process.env.SEO_MONITORING_WEBHOOK_URL) {
      monitoringWebhooks.push({
        url: process.env.SEO_MONITORING_WEBHOOK_URL,
        method: 'POST' as const,
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': process.env.SEO_MONITORING_API_KEY || ''
        },
        body: {
          postId,
          seoMetrics: seoScore,
          recommendations,
          keywords: analysis.optimization.extractedKeywords,
          analysisDate: analysis.completedAt
        }
      });
    }

    // Queue webhook delivery jobs
    for (const webhook of monitoringWebhooks) {
      const webhookJob = await jobQueue.addJob('webhook-delivery', {
        url: webhook.url,
        method: webhook.method,
        headers: webhook.headers,
        body: webhook.body,
        retryPolicy: {
          maxRetries: 3,
          backoffDelay: 5000
        },
        signatureSecret: process.env.WEBHOOK_SECRET
      }, {
        priority: 'normal',
        tags: ['seo-webhook', 'monitoring', postId]
      });
      followUpJobs.push({ type: 'webhook-delivery', id: webhookJob.id });
    }

    // Return success response
    return NextResponse.json<ApiResponse<{
      triggeredJobs: Array<{ type: string; id: string }>;
      seoScore: typeof seoScore;
      recommendations: number;
    }>>({
      success: true,
      message: `SEO analysis webhook processed for post ${postId}`,
      data: {
        triggeredJobs: followUpJobs,
        seoScore,
        recommendations: recommendations.length
      }
    });

  } catch (error) {
    logger.error('SEO analysis complete webhook error:', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Invalid webhook payload: ${error.issues.map((e) => e.message).join(', ')}`,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error processing SEO analysis webhook',
      data: null
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json<ApiResponse<{
    status: string;
    timestamp: string;
    webhook: string;
  }>>({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      webhook: 'seo-analysis-complete'
    }
  });
}