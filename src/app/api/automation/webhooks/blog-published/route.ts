/**
 * Blog Published Webhook Handler
 * Triggers automation workflows when a blog post is published
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue } from '@/lib/automation/job-queue';
import { z } from 'zod';
import type { ApiResponse } from '@/types/shared-api';

// Webhook payload validation schema
const BlogPublishedWebhookSchema = z.object({
  post: z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    publishedAt: z.string(),
    authorId: z.string(),
    categoryId: z.string().optional(),
    featuredImage: z.string().optional(),
    status: z.literal('PUBLISHED')
  }),
  trigger: z.object({
    event: z.literal('blog.published'),
    timestamp: z.string(),
    source: z.string().default('blog-cms')
  }),
  metadata: z.object({
    version: z.string().default('1.0'),
    correlationId: z.string().optional()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (in production, implement proper HMAC verification)
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');
    
    if (!signature || !timestamp) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Missing required webhook headers',
        data: null
      }, { status: 401 });
    }

    // Parse and validate webhook payload
    const body = await request.json();
    const webhookData = BlogPublishedWebhookSchema.parse(body);
    
    const { post, trigger } = webhookData;
    const baseUrl = new URL(request.url).origin;
    const postUrl = `${baseUrl}/blog/${post.slug}`;

    // Create idempotency key to prevent duplicate processing
    const idempotencyKey = `blog-published:${post.id}:${trigger.timestamp}`;

    // Queue SEO Analysis Job
    const seoAnalysisJob = await jobQueue.addJob('seo-analysis', {
      postId: post.id,
      content: post.content,
      title: post.title,
      description: post.excerpt,
      keywords: post.keywords,
      targetUrl: postUrl
    }, {
      priority: 'high',
      idempotencyKey: `seo-analysis:${idempotencyKey}`,
      tags: ['blog-published', 'seo', post.id]
    });

    // Queue Content Optimization Job
    const contentOptimizationJob = await jobQueue.addJob('content-optimization', {
      postId: post.id,
      content: post.content,
      targetKeywords: post.keywords,
      optimizationLevel: 'comprehensive' as const
    }, {
      priority: 'normal',
      idempotencyKey: `content-opt:${idempotencyKey}`,
      tags: ['blog-published', 'optimization', post.id]
    });

    // Queue Social Media Posting Job (delayed by 5 minutes for review)
    const socialMediaJob = await jobQueue.addJob('social-media-posting', {
      postId: post.id,
      platforms: ['twitter', 'linkedin'] as const,
      content: {
        title: post.title,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        url: postUrl,
        imageUrl: post.featuredImage,
        hashtags: ['blog', 'automation', ...post.keywords.slice(0, 3)]
      }
    }, {
      priority: 'normal',
      delay: 300000, // 5 minutes delay
      idempotencyKey: `social:${idempotencyKey}`,
      tags: ['blog-published', 'social-media', post.id]
    });

    // Queue Sitemap Update Job
    const sitemapJob = await jobQueue.addJob('sitemap-generation', {
      includeBlogPosts: true,
      includePages: true,
      lastModified: post.publishedAt
    }, {
      priority: 'low',
      idempotencyKey: `sitemap:${idempotencyKey}`,
      tags: ['blog-published', 'sitemap']
    });

    // Queue Analytics Processing Job
    const analyticsJob = await jobQueue.addJob('analytics-processing', {
      postId: post.id,
      dateRange: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days tracking
      },
      metrics: ['pageviews', 'engagement', 'seo']
    }, {
      priority: 'low',
      delay: 3600000, // 1 hour delay to allow for initial traffic
      idempotencyKey: `analytics:${idempotencyKey}`,
      tags: ['blog-published', 'analytics', post.id]
    });

    // Send notification webhooks to external services
    const notificationWebhooks = [
      {
        url: process.env.SLACK_WEBHOOK_URL,
        method: 'POST' as const,
        headers: { 'Content-Type': 'application/json' },
        body: {
          text: `📝 New blog post published: "${post.title}"`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*New Blog Post Published*\n*Title:* ${post.title}\n*URL:* ${postUrl}\n*Author:* ${post.authorId}`
              }
            }
          ]
        }
      }
    ].filter(webhook => webhook.url);

    const webhookJobs = [];
    for (const webhook of notificationWebhooks) {
      if (webhook.url) {
        const webhookJob = await jobQueue.addJob('webhook-delivery', {
          url: webhook.url,
          method: webhook.method,
          headers: webhook.headers,
          body: webhook.body,
          retryPolicy: {
            maxRetries: 3,
            backoffDelay: 2000
          }
        }, {
          priority: 'normal',
          tags: ['blog-published', 'notification', post.id]
        });
        webhookJobs.push(webhookJob);
      }
    }

    // Return success response with job IDs
    return NextResponse.json<ApiResponse<{
      jobs: Array<{ type: string; id: string }>;
      post: { id: string; title: string; url: string };
    }>>({
      success: true,
      message: `Blog automation triggered for post: ${post.title}`,
      data: {
        jobs: [
          { type: 'seo-analysis', id: seoAnalysisJob.id },
          { type: 'content-optimization', id: contentOptimizationJob.id },
          { type: 'social-media-posting', id: socialMediaJob.id },
          { type: 'sitemap-generation', id: sitemapJob.id },
          { type: 'analytics-processing', id: analyticsJob.id },
          ...webhookJobs.map(job => ({ type: 'webhook-delivery', id: job.id }))
        ],
        post: {
          id: post.id,
          title: post.title,
          url: postUrl
        }
      }
    });

  } catch (error) {
    console.error('Blog published webhook error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid webhook payload',
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
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
      webhook: 'blog-published'
    }
  });
}