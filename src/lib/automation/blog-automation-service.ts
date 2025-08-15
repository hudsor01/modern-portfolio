/**
 * Blog Automation Service
 * Central service for initializing and managing blog automation workflows
 */

import { jobQueue, JobHandler, JobPayload, JobType } from './job-queue';
import {
  blogAutomationHandlers,
  SEOAnalysisPayload,
  ContentOptimizationPayload,
  SitemapGenerationPayload,
  SocialMediaPostingPayload,
  WebhookDeliveryPayload
} from './blog-automation-handlers';

export interface BlogAutomationConfig {
  enableAutoSEO: boolean;
  enableContentOptimization: boolean;
  enableSocialPosting: boolean;
  enableSitemapUpdates: boolean;
  enableAnalytics: boolean;
  socialPlatforms: ('twitter' | 'linkedin' | 'facebook')[];
  seoAnalysisThreshold: number;
  contentOptimizationLevel: 'basic' | 'advanced' | 'comprehensive';
  notificationWebhooks: {
    slack?: string;
    discord?: string;
    email?: string[];
  };
}

export class BlogAutomationService {
  private isInitialized = false;
  private readonly config: BlogAutomationConfig;

  constructor(config: BlogAutomationConfig) {
    this.config = config;
  }

  /**
   * Initialize the blog automation service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Register all job handlers
    Object.entries(blogAutomationHandlers).forEach(([type, handler]) => {
      jobQueue.registerHandler(type as JobType, handler as JobHandler<JobPayload>);
    });

    // Register additional handlers for email notifications, analytics, etc.
    this.registerAdditionalHandlers();

    this.isInitialized = true;
    }

  /**
   * Trigger full automation workflow for a published blog post
   */
  async triggerBlogPublishedWorkflow(postData: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    keywords: string[];
    slug: string;
    publishedAt: string;
    featuredImage?: string;
  }): Promise<{
    jobs: Array<{ type: string; id: string; priority: string }>;
    workflowId: string;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const workflowId = `blog-workflow-${postData.id}-${Date.now()}`;
    const jobs = [];

    // 1. SEO Analysis Job (High Priority)
    if (this.config.enableAutoSEO) {
      const seoJob = await jobQueue.addJob('seo-analysis', {
        postId: postData.id,
        content: postData.content,
        title: postData.title,
        description: postData.excerpt,
        keywords: postData.keywords,
        targetUrl: `/blog/${postData.slug}`
      } satisfies SEOAnalysisPayload, {
        priority: 'high',
        idempotencyKey: `seo-${postData.id}`,
        tags: ['blog-published', 'seo', postData.id, workflowId]
      });

      jobs.push({ type: 'seo-analysis', id: seoJob.id, priority: 'high' });
    }

    // 2. Content Optimization Job (Normal Priority)
    if (this.config.enableContentOptimization) {
      const optimizationJob = await jobQueue.addJob('content-optimization', {
        postId: postData.id,
        content: postData.content,
        targetKeywords: postData.keywords,
        optimizationLevel: this.config.contentOptimizationLevel
      } satisfies ContentOptimizationPayload, {
        priority: 'normal',
        idempotencyKey: `optimization-${postData.id}`,
        tags: ['blog-published', 'optimization', postData.id, workflowId]
      });

      jobs.push({ type: 'content-optimization', id: optimizationJob.id, priority: 'normal' });
    }

    // 3. Social Media Posting Job (Delayed)
    if (this.config.enableSocialPosting && this.config.socialPlatforms.length > 0) {
      const socialJob = await jobQueue.addJob('social-media-posting', {
        postId: postData.id,
        platforms: this.config.socialPlatforms,
        content: {
          title: postData.title,
          excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
          url: `/blog/${postData.slug}`,
          imageUrl: postData.featuredImage,
          hashtags: ['blog', ...postData.keywords.slice(0, 3)]
        }
      } satisfies SocialMediaPostingPayload, {
        priority: 'normal',
        delay: 600000, // 10 minutes delay
        idempotencyKey: `social-${postData.id}`,
        tags: ['blog-published', 'social', postData.id, workflowId]
      });

      jobs.push({ type: 'social-media-posting', id: socialJob.id, priority: 'normal' });
    }

    // 4. Sitemap Update Job (Low Priority)
    if (this.config.enableSitemapUpdates) {
      const sitemapJob = await jobQueue.addJob('sitemap-generation', {
        includeBlogPosts: true,
        includePages: true,
        lastModified: postData.publishedAt
      } satisfies SitemapGenerationPayload, {
        priority: 'low',
        delay: 300000, // 5 minutes delay
        idempotencyKey: `sitemap-${Date.now()}`,
        tags: ['blog-published', 'sitemap', workflowId]
      });

      jobs.push({ type: 'sitemap-generation', id: sitemapJob.id, priority: 'low' });
    }

    // 5. Analytics Tracking Job (Low Priority, Delayed)
    if (this.config.enableAnalytics) {
      const analyticsJob = await jobQueue.addJob('analytics-processing', {
        postId: postData.id,
        dateRange: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        },
        metrics: ['pageviews', 'engagement', 'seo']
      }, {
        priority: 'low',
        delay: 3600000, // 1 hour delay
        idempotencyKey: `analytics-${postData.id}`,
        tags: ['blog-published', 'analytics', postData.id, workflowId]
      });

      jobs.push({ type: 'analytics-processing', id: analyticsJob.id, priority: 'low' });
    }

    // 6. Notification Webhooks
    await this.sendNotificationWebhooks(postData, workflowId);

    return { jobs, workflowId };
  }

  /**
   * Trigger SEO analysis for existing content
   */
  async triggerSEOAnalysis(postData: {
    id: string;
    title: string;
    content: string;
    description?: string;
    keywords: string[];
    url: string;
  }): Promise<{ jobId: string }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const seoJob = await jobQueue.addJob('seo-analysis', {
      postId: postData.id,
      content: postData.content,
      title: postData.title,
      description: postData.description,
      keywords: postData.keywords,
      targetUrl: postData.url
    } satisfies SEOAnalysisPayload, {
      priority: 'high',
      idempotencyKey: `manual-seo-${postData.id}-${Date.now()}`,
      tags: ['manual-trigger', 'seo', postData.id]
    });

    return { jobId: seoJob.id };
  }

  /**
   * Trigger content optimization for existing content
   */
  async triggerContentOptimization(postData: {
    id: string;
    content: string;
    keywords: string[];
    level?: 'basic' | 'advanced' | 'comprehensive';
  }): Promise<{ jobId: string }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const optimizationJob = await jobQueue.addJob('content-optimization', {
      postId: postData.id,
      content: postData.content,
      targetKeywords: postData.keywords,
      optimizationLevel: postData.level || this.config.contentOptimizationLevel
    } satisfies ContentOptimizationPayload, {
      priority: 'normal',
      idempotencyKey: `manual-opt-${postData.id}-${Date.now()}`,
      tags: ['manual-trigger', 'optimization', postData.id]
    });

    return { jobId: optimizationJob.id };
  }

  /**
   * Schedule content publishing with automation
   */
  async scheduleContentPublishing(postData: {
    id: string;
    publishAt: Date;
    autoTriggerWorkflow: boolean;
  }): Promise<{ jobId: string }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const schedulingJob = await jobQueue.addJob('content-scheduling', {
      postId: postData.id,
      publishAt: postData.publishAt,
      actions: [
        { type: 'publish', config: { updateStatus: 'PUBLISHED' } },
        ...(postData.autoTriggerWorkflow ? [
          { type: 'trigger-workflow', config: { workflowType: 'blog-published' } }
        ] : [])
      ]
    }, {
      priority: 'high',
      scheduledFor: postData.publishAt,
      idempotencyKey: `scheduled-${postData.id}`,
      tags: ['scheduled', 'publish', postData.id]
    });

    return { jobId: schedulingJob.id };
  }

  /**
   * Get automation status for a blog post
   */
  async getPostAutomationStatus(postId: string): Promise<{
    jobs: Array<{
      id: string;
      type: string;
      status: string;
      progress: number;
      createdAt: string;
      completedAt?: string;
    }>;
    summary: {
      total: number;
      completed: number;
      failed: number;
      active: number;
    };
  }> {
    const allJobs = jobQueue.getAllJobs();
    const postJobs = allJobs.filter(job =>
      job.tags?.includes(postId)
    );

    const summary = {
      total: postJobs.length,
      completed: postJobs.filter(j => j.status === 'completed').length,
      failed: postJobs.filter(j => j.status === 'failed').length,
      active: postJobs.filter(j => j.status === 'active').length
    };

    const jobs = postJobs.map(job => ({
      id: job.id,
      type: job.type,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt.toISOString(),
      completedAt: job.completedAt?.toISOString()
    }));

    return { jobs, summary };
  }

  /**
   * Get overall automation health and metrics
   */
  async getAutomationHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: Record<string, unknown>;
    issues: string[];
    recommendations: string[];
  }> {
    const healthCheck = jobQueue.healthCheck();
    const metrics = jobQueue.getMetrics();

    const issues = [...healthCheck.issues];
    const recommendations = [];

    // Add service-specific health checks
    if (metrics.errorRate > 0.05) {
      issues.push('High error rate in automation jobs');
      recommendations.push('Review failed jobs and fix common issues');
    }

    if (metrics.queueLatency > 60000) {
      issues.push('High queue latency detected');
      recommendations.push('Consider increasing concurrency or optimizing job handlers');
    }

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (issues.length === 0) {
      status = 'healthy';
    } else if (issues.length <= 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      metrics: metrics as unknown as Record<string, unknown>,
      issues,
      recommendations
    };
  }

  private async sendNotificationWebhooks(postData: Record<string, unknown>, workflowId: string): Promise<void> {
    const notifications = [];

    // Slack notification
    if (this.config.notificationWebhooks.slack) {
      notifications.push({
        url: this.config.notificationWebhooks.slack,
        method: 'POST' as const,
        headers: { 'Content-Type': 'application/json' },
        body: {
          text: `📝 Blog automation triggered for: "${postData.title}"`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Blog Post Published*\n*Title:* ${postData.title}\n*Workflow ID:* ${workflowId}\n*Post ID:* ${postData.id}`
              }
            }
          ]
        }
      });
    }

    // Discord notification
    if (this.config.notificationWebhooks.discord) {
      notifications.push({
        url: this.config.notificationWebhooks.discord,
        method: 'POST' as const,
        headers: { 'Content-Type': 'application/json' },
        body: {
          content: `📝 **Blog automation triggered**\n**Title:** ${postData.title}\n**Workflow ID:** ${workflowId}`
        }
      });
    }

    // Queue webhook delivery jobs
    for (const notification of notifications) {
      await jobQueue.addJob('webhook-delivery', {
        url: notification.url,
        method: notification.method,
        headers: notification.headers,
        body: notification.body,
        retryPolicy: {
          maxRetries: 3,
          backoffDelay: 2000
        }
      } satisfies WebhookDeliveryPayload, {
        priority: 'normal',
        tags: ['notification', workflowId]
      });
    }
  }

  private registerAdditionalHandlers(): void {
    // Register email notification handler
    jobQueue.registerHandler('email-notification', {
      async process(job, progress) {
        progress(10);

        // Mock email sending - integrate with your email service
        // Simulate email delivery
        await new Promise(resolve => setTimeout(resolve, 2000));

        progress(100);
        return { sent: true, timestamp: new Date().toISOString() };
      }
    });

    // Register analytics processing handler
    jobQueue.registerHandler('analytics-processing', {
      async process(job, progress) {
        progress(10);

        // Mock analytics processing - integrate with your analytics service
        // Simulate analytics processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        progress(100);
        return { processed: true, timestamp: new Date().toISOString() };
      }
    });

    // Register content scheduling handler
    jobQueue.registerHandler('content-scheduling', {
      async process(job, progress) {
        progress(10);

        // Mock content scheduling - integrate with your CMS
        // Simulate content publishing
        await new Promise(resolve => setTimeout(resolve, 1000));

        progress(100);
        return { published: true, timestamp: new Date().toISOString() };
      }
    });

    // Register additional automation handlers as needed
  }
}

// Create singleton instance with default configuration
export const blogAutomationService = new BlogAutomationService({
  enableAutoSEO: true,
  enableContentOptimization: true,
  enableSocialPosting: false, // Disabled by default for safety
  enableSitemapUpdates: true,
  enableAnalytics: true,
  socialPlatforms: ['twitter', 'linkedin'],
  seoAnalysisThreshold: 70,
  contentOptimizationLevel: 'advanced',
  notificationWebhooks: {
    slack: process.env.SLACK_WEBHOOK_URL,
    discord: process.env.DISCORD_WEBHOOK_URL,
    email: process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL] : []
  }
});

// Auto-initialize on import
blogAutomationService.initialize().catch(console.error);
