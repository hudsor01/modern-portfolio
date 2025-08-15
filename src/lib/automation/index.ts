/**
 * Blog Automation System Entry Point
 * Initializes and exports all automation components
 */

// Core job queue and processing
import { jobQueue, JobUtils } from './job-queue';
import type { 
  Job, 
  JobHandler, 
  JobPayload, 
  JobType, 
  JobPriority, 
  JobStatus, 
  JobMetrics,
  JobQueueOptions,
  ProgressCallback,
  RetryConfig
} from './job-queue';

export { jobQueue, JobUtils };
export type { 
  Job, 
  JobHandler, 
  JobPayload, 
  JobType, 
  JobPriority, 
  JobStatus, 
  JobMetrics,
  JobQueueOptions,
  ProgressCallback,
  RetryConfig
};

// Blog automation service
import { blogAutomationService, BlogAutomationService } from './blog-automation-service';
import type { BlogAutomationConfig } from './blog-automation-service';

export { blogAutomationService, BlogAutomationService };
export type { BlogAutomationConfig };

// Job handlers
export { blogAutomationHandlers } from './blog-automation-handlers';
export type {
  SEOAnalysisPayload,
  ContentOptimizationPayload,
  SitemapGenerationPayload,
  SocialMediaPostingPayload,
  EmailNotificationPayload,
  AnalyticsProcessingPayload,
  ContentBackupPayload,
  LinkCheckingPayload,
  ImageOptimizationPayload,
  WebhookDeliveryPayload,
  ContentSchedulingPayload,
  KeywordRankingCheckPayload,
  PerformanceAuditPayload,
  DuplicateContentDetectionPayload
} from './blog-automation-handlers';

// Rate limiting
import { 
  rateLimiter, 
  rateLimitConfigs, 
  applyRateLimit, 
  withRateLimit 
} from './rate-limiter';
import type { 
  RateLimitConfig, 
  RateLimitResult 
} from './rate-limiter';

export { 
  rateLimiter, 
  rateLimitConfigs, 
  applyRateLimit, 
  withRateLimit 
};
export type { 
  RateLimitConfig, 
  RateLimitResult 
};

// Error monitoring
import { 
  errorMonitor, 
  logAPIError, 
  logJobError 
} from './error-monitoring';
import type {
  ErrorEvent,
  ErrorPattern,
  AlertChannel,
  ErrorMetrics
} from './error-monitoring';

export { 
  errorMonitor, 
  logAPIError, 
  logJobError 
};
export type {
  ErrorEvent,
  ErrorPattern,
  AlertChannel,
  ErrorMetrics
};

/**
 * Initialize the entire blog automation system
 * Call this in your application startup
 */
export async function initializeBlogAutomation(): Promise<void> {
  try {
    console.log('🚀 Initializing blog automation system...');
    
    // Initialize the blog automation service
    await blogAutomationService.initialize();
    
    console.log('✅ Blog automation system initialized successfully');
    // Queue configuration logging
    const queueOptions = jobQueue.getOptions();
    console.log(`📊 Queue concurrency: ${queueOptions.concurrency}`);
    console.log(`🔄 Max retries: ${queueOptions.maxRetries}`);
    console.log(`⏰ Default delay: ${queueOptions.defaultDelay}ms`);
    
    // Log system health
    const health = await blogAutomationService.getAutomationHealth();
    console.log(`💚 System health: ${health.status}`);
    
    if (health.issues.length > 0) {
      console.warn('⚠️  Health issues detected:', health.issues);
    }
    
  } catch (error) {
    console.error('❌ Failed to initialize blog automation system:', error);
    throw error;
  }
}

/**
 * Gracefully shutdown the automation system
 * Call this before application shutdown
 */
export async function shutdownBlogAutomation(): Promise<void> {
  try {
    console.log('🔄 Shutting down blog automation system...');
    
    // Drain the job queue
    await jobQueue.drain();
    
    // Shutdown the job queue
    await jobQueue.shutdown();
    
    // Destroy error monitor
    errorMonitor.destroy();
    
    // Destroy rate limiter
    rateLimiter.destroy();
    
    console.log('✅ Blog automation system shutdown complete');
    
  } catch (error) {
    console.error('❌ Error during automation system shutdown:', error);
    throw error;
  }
}

/**
 * Get comprehensive system status
 */
// System status interfaces
interface AutomationHealth {
  status: string;
  issues: string[];
  recommendations: string[];
}

interface QueueHealth {
  status: 'healthy' | 'unhealthy';
  issues: string[];
  metrics: JobMetrics;
}

interface ErrorMonitorHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  issues: string[];
  recommendations: string[];
}

interface RateLimiterStats {
  totalKeys: number;
  totalRequests: number;
  memoryUsage: number;
}

export async function getSystemStatus(): Promise<{
  automation: AutomationHealth;
  jobQueue: QueueHealth;
  errorMonitor: ErrorMonitorHealth;
  rateLimiter: RateLimiterStats;
}> {
  return {
    automation: await blogAutomationService.getAutomationHealth(),
    jobQueue: jobQueue.healthCheck(),
    errorMonitor: errorMonitor.getHealthStatus(),
    rateLimiter: rateLimiter.getStats()
  };
}

// Auto-initialize if in Node.js environment and not in test mode
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  // Initialize on next tick to allow module loading to complete
  setImmediate(() => {
    initializeBlogAutomation().catch(console.error);
  });
  
  // Graceful shutdown handlers
  const shutdown = async () => {
    try {
      await shutdownBlogAutomation();
      process.exit(0);
    } catch (error) {
      console.error('Shutdown error:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    errorMonitor.logError({
      level: 'critical',
      category: 'system',
      source: 'uncaught-exception',
      message: error.message,
      stack: error.stack
    });
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    errorMonitor.logError({
      level: 'critical',
      category: 'system',
      source: 'unhandled-rejection',
      message: String(reason),
      details: { promise: String(promise) }
    });
  });
}