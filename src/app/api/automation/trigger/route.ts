/**
 * Blog Automation Trigger API
 * Manual and programmatic triggers for blog automation workflows
 */

import { NextRequest, NextResponse } from 'next/server';
import { blogAutomationService } from '@/lib/automation/blog-automation-service';
import { jobQueue } from '@/lib/automation/job-queue';
import { z } from 'zod';
import type { ApiResponse } from '@/types/shared-api';

// Validation schemas for different trigger types
const BlogPublishedTriggerSchema = z.object({
  type: z.literal('blog-published'),
  data: z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    excerpt: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    slug: z.string(),
    publishedAt: z.string(),
    featuredImage: z.string().optional(),
    authorId: z.string().optional(),
    categoryId: z.string().optional()
  })
});

const SEOAnalysisTriggerSchema = z.object({
  type: z.literal('seo-analysis'),
  data: z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    url: z.string()
  })
});

const ContentOptimizationTriggerSchema = z.object({
  type: z.literal('content-optimization'),
  data: z.object({
    id: z.string(),
    content: z.string(),
    keywords: z.array(z.string()),
    level: z.enum(['basic', 'advanced', 'comprehensive']).optional()
  })
});

const ScheduledPublishingTriggerSchema = z.object({
  type: z.literal('scheduled-publishing'),
  data: z.object({
    id: z.string(),
    publishAt: z.string().datetime(),
    autoTriggerWorkflow: z.boolean().default(true)
  })
});

const BatchOptimizationTriggerSchema = z.object({
  type: z.literal('batch-optimization'),
  data: z.object({
    postIds: z.array(z.string()),
    operations: z.array(z.enum(['seo-analysis', 'content-optimization', 'sitemap-update'])),
    batchSize: z.number().min(1).max(50).default(10),
    delayBetweenBatches: z.number().min(0).default(5000)
  })
});

const TriggerRequestSchema = z.discriminatedUnion('type', [
  BlogPublishedTriggerSchema,
  SEOAnalysisTriggerSchema,
  ContentOptimizationTriggerSchema,
  ScheduledPublishingTriggerSchema,
  BatchOptimizationTriggerSchema
]);

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const triggerRequest = TriggerRequestSchema.parse(body);

    // Check authorization (in production, implement proper auth)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isValidApiKey(authHeader)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Unauthorized - valid API key required',
        data: null
      }, { status: 401 });
    }

    // Handle different trigger types
    switch (triggerRequest.type) {
      case 'blog-published':
        return await handleBlogPublishedTrigger(triggerRequest.data);
      
      case 'seo-analysis':
        return await handleSEOAnalysisTrigger(triggerRequest.data);
      
      case 'content-optimization':
        return await handleContentOptimizationTrigger(triggerRequest.data);
      
      case 'scheduled-publishing':
        return await handleScheduledPublishingTrigger(triggerRequest.data);
      
      case 'batch-optimization':
        return await handleBatchOptimizationTrigger(triggerRequest.data);
      
      default:
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Unknown trigger type',
          data: null
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Automation trigger error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Invalid request body: ${error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
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

async function handleBlogPublishedTrigger(data: z.infer<typeof BlogPublishedTriggerSchema>['data']) {
  try {
    const result = await blogAutomationService.triggerBlogPublishedWorkflow(data);
    
    return NextResponse.json<ApiResponse<{
      workflowId: string;
      triggeredJobs: Array<{ type: string; id: string; priority: string }>;
      postId: string;
    }>>({
      success: true,
      message: `Blog published workflow triggered for "${data.title}"`,
      data: {
        workflowId: result.workflowId,
        triggeredJobs: result.jobs,
        postId: data.id
      }
    });

  } catch (error) {
    throw new Error(`Failed to trigger blog published workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleSEOAnalysisTrigger(data: z.infer<typeof SEOAnalysisTriggerSchema>['data']) {
  try {
    const result = await blogAutomationService.triggerSEOAnalysis(data);
    
    return NextResponse.json<ApiResponse<{
      jobId: string;
      postId: string;
      estimatedCompletion: string;
    }>>({
      success: true,
      message: `SEO analysis triggered for post ${data.id}`,
      data: {
        jobId: result.jobId,
        postId: data.id,
        estimatedCompletion: new Date(Date.now() + 120000).toISOString() // 2 minutes estimate
      }
    });

  } catch (error) {
    throw new Error(`Failed to trigger SEO analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleContentOptimizationTrigger(data: z.infer<typeof ContentOptimizationTriggerSchema>['data']) {
  try {
    const result = await blogAutomationService.triggerContentOptimization(data);
    
    return NextResponse.json<ApiResponse<{
      jobId: string;
      postId: string;
      optimizationLevel: string;
      estimatedCompletion: string;
    }>>({
      success: true,
      message: `Content optimization triggered for post ${data.id}`,
      data: {
        jobId: result.jobId,
        postId: data.id,
        optimizationLevel: data.level || 'advanced',
        estimatedCompletion: new Date(Date.now() + 300000).toISOString() // 5 minutes estimate
      }
    });

  } catch (error) {
    throw new Error(`Failed to trigger content optimization: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleScheduledPublishingTrigger(data: z.infer<typeof ScheduledPublishingTriggerSchema>['data']) {
  try {
    const publishAt = new Date(data.publishAt);
    const result = await blogAutomationService.scheduleContentPublishing({
      id: data.id,
      publishAt,
      autoTriggerWorkflow: data.autoTriggerWorkflow
    });
    
    return NextResponse.json<ApiResponse<{
      jobId: string;
      postId: string;
      scheduledFor: string;
      autoTriggerWorkflow: boolean;
    }>>({
      success: true,
      message: `Content publishing scheduled for ${publishAt.toISOString()}`,
      data: {
        jobId: result.jobId,
        postId: data.id,
        scheduledFor: publishAt.toISOString(),
        autoTriggerWorkflow: data.autoTriggerWorkflow
      }
    });

  } catch (error) {
    throw new Error(`Failed to schedule content publishing: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleBatchOptimizationTrigger(data: z.infer<typeof BatchOptimizationTriggerSchema>['data']) {
  try {
    const { postIds, operations, batchSize, delayBetweenBatches } = data;
    const batchResults = [];
    
    // Process posts in batches to avoid overwhelming the system
    for (let i = 0; i < postIds.length; i += batchSize) {
      const batch = postIds.slice(i, i + batchSize);
      const batchJobs = [];
      
      for (const postId of batch) {
        for (const operation of operations) {
          let job;
          
          switch (operation) {
            case 'seo-analysis':
              job = await jobQueue.addJob('seo-analysis', {
                postId,
                content: '', // Would fetch from database in real implementation
                title: `Post ${postId}`,
                keywords: [],
                targetUrl: `/blog/${postId}`
              }, {
                priority: 'normal',
                delay: i * delayBetweenBatches,
                tags: ['batch-optimization', postId, operation]
              });
              break;
              
            case 'content-optimization':
              job = await jobQueue.addJob('content-optimization', {
                postId,
                content: '', // Would fetch from database
                targetKeywords: [],
                optimizationLevel: 'advanced' as const
              }, {
                priority: 'normal',
                delay: i * delayBetweenBatches,
                tags: ['batch-optimization', postId, operation]
              });
              break;
              
            case 'sitemap-update':
              // Only add one sitemap job per batch
              if (i === 0) {
                job = await jobQueue.addJob('sitemap-generation', {
                  includeBlogPosts: true,
                  includePages: true
                }, {
                  priority: 'low',
                  delay: i * delayBetweenBatches,
                  tags: ['batch-optimization', 'sitemap-update']
                });
              }
              break;
          }
          
          if (job) {
            batchJobs.push({
              postId,
              operation,
              jobId: job.id
            });
          }
        }
      }
      
      batchResults.push({
        batchNumber: Math.floor(i / batchSize) + 1,
        postIds: batch,
        jobs: batchJobs,
        scheduledFor: new Date(Date.now() + i * delayBetweenBatches).toISOString()
      });
    }
    
    return NextResponse.json<ApiResponse<{
      totalPosts: number;
      totalBatches: number;
      totalJobs: number;
      batches: typeof batchResults;
    }>>({
      success: true,
      message: `Batch optimization triggered for ${postIds.length} posts across ${batchResults.length} batches`,
      data: {
        totalPosts: postIds.length,
        totalBatches: batchResults.length,
        totalJobs: batchResults.reduce((sum, batch) => sum + batch.jobs.length, 0),
        batches: batchResults
      }
    });

  } catch (error) {
    throw new Error(`Failed to trigger batch optimization: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function isValidApiKey(authHeader: string): boolean {
  // In production, implement proper API key validation
  const expectedKey = process.env.AUTOMATION_API_KEY || 'dev-key-12345';
  const providedKey = authHeader.replace('Bearer ', '');
  return providedKey === expectedKey;
}

// GET endpoint to retrieve available trigger types and their schemas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeExamples = searchParams.get('examples') === 'true';

    const triggerTypes = {
      'blog-published': {
        description: 'Trigger full automation workflow when a blog post is published',
        priority: 'high',
        estimatedDuration: '2-5 minutes',
        triggeredJobs: ['seo-analysis', 'content-optimization', 'social-media-posting', 'sitemap-generation', 'analytics-processing']
      },
      'seo-analysis': {
        description: 'Run SEO analysis on existing content',
        priority: 'high',
        estimatedDuration: '1-2 minutes',
        triggeredJobs: ['seo-analysis']
      },
      'content-optimization': {
        description: 'Optimize content based on SEO best practices',
        priority: 'normal',
        estimatedDuration: '3-5 minutes',
        triggeredJobs: ['content-optimization']
      },
      'scheduled-publishing': {
        description: 'Schedule content to be published at a future time',
        priority: 'high',
        estimatedDuration: 'varies',
        triggeredJobs: ['content-scheduling', 'blog-published (optional)']
      },
      'batch-optimization': {
        description: 'Run optimization operations on multiple posts',
        priority: 'normal',
        estimatedDuration: 'varies by batch size',
        triggeredJobs: ['varies by operations selected']
      }
    };

    const response: Record<string, unknown> = {
      available: triggerTypes,
      authentication: {
        required: true,
        type: 'Bearer token',
        header: 'Authorization'
      },
      rateLimit: {
        requests: 100,
        window: '1 hour',
        burstLimit: 10
      }
    };

    if (includeExamples) {
      response.examples = {
        'blog-published': {
          type: 'blog-published',
          data: {
            id: 'post-123',
            title: 'How to Optimize Your Content for SEO',
            content: 'This is the full content of the blog post...',
            excerpt: 'Learn the best practices for SEO optimization...',
            keywords: ['SEO', 'content optimization', 'blog'],
            slug: 'optimize-content-seo',
            publishedAt: new Date().toISOString(),
            featuredImage: 'https://example.com/featured-image.jpg'
          }
        },
        'seo-analysis': {
          type: 'seo-analysis',
          data: {
            id: 'post-456',
            title: 'Existing Blog Post',
            content: 'Content to analyze...',
            keywords: ['keyword1', 'keyword2'],
            url: '/blog/existing-post'
          }
        },
        'batch-optimization': {
          type: 'batch-optimization',
          data: {
            postIds: ['post-1', 'post-2', 'post-3'],
            operations: ['seo-analysis', 'content-optimization'],
            batchSize: 5,
            delayBetweenBatches: 10000
          }
        }
      };
    }

    return NextResponse.json<ApiResponse<typeof response>>({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Get trigger types error:', error);

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to retrieve trigger information',
      data: null
    }, { status: 500 });
  }
}