/**
 * Error Monitoring and Alerting System
 * Comprehensive error tracking and notification system for blog automation
 */

import { jobQueue, Job } from './job-queue';

export interface ErrorEvent {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'critical';
  category: 'job' | 'api' | 'webhook' | 'system';
  source: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  jobId?: string;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorPattern {
  id: string;
  name: string;
  pattern: RegExp | string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threshold: number; // Number of occurrences to trigger alert
  timeWindow: number; // Time window in milliseconds
  lastTriggered?: Date;
  totalOccurrences: number;
}

export interface AlertChannel {
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms';
  config: {
    recipients?: string[];
    url?: string;
    headers?: Record<string, string>;
    template?: string;
  };
  enabled: boolean;
  filters?: {
    levels?: string[];
    categories?: string[];
    patterns?: string[];
  };
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByLevel: Record<string, number>;
  errorsByCategory: Record<string, number>;
  errorsBySource: Record<string, number>;
  errorRate: number;
  avgErrorsPerHour: number;
  topErrorPatterns: Array<{
    pattern: string;
    count: number;
    lastOccurrence: Date;
  }>;
  recentErrors: ErrorEvent[];
}

class ErrorMonitor {
  private events: ErrorEvent[] = [];
  private patterns: Map<string, ErrorPattern> = new Map();
  private alertChannels: Map<string, AlertChannel> = new Map();
  private maxEvents = 10000; // Keep last 10k events in memory
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.initializeDefaultPatterns();
    this.initializeDefaultAlertChannels();
    
    // Clean up old events every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);

    // Monitor job queue for failures
    this.monitorJobQueue();
  }

  /**
   * Log an error event
   */
  logError(error: Partial<ErrorEvent>): ErrorEvent {
    const event: ErrorEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      level: error.level || 'error',
      category: error.category || 'system',
      source: error.source || 'unknown',
      message: error.message || 'Unknown error',
      details: error.details,
      stack: error.stack,
      jobId: error.jobId,
      requestId: error.requestId,
      userId: error.userId,
      metadata: error.metadata
    };

    this.events.push(event);

    // Trim events if we exceed max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Check patterns and trigger alerts
    this.checkPatternsAndAlert(event);

    return event;
  }

  /**
   * Register an error pattern for monitoring
   */
  registerPattern(pattern: Omit<ErrorPattern, 'id' | 'totalOccurrences'>): void {
    const id = this.generateId();
    this.patterns.set(id, {
      id,
      totalOccurrences: 0,
      ...pattern
    });
  }

  /**
   * Register an alert channel
   */
  registerAlertChannel(channel: AlertChannel): void {
    this.alertChannels.set(channel.name, channel);
  }

  /**
   * Get error metrics for a time period
   */
  getMetrics(timeWindow: number = 24 * 60 * 60 * 1000): ErrorMetrics {
    const cutoff = new Date(Date.now() - timeWindow);
    const recentEvents = this.events.filter(event => event.timestamp > cutoff);

    const errorsByLevel = recentEvents.reduce((acc, event) => {
      acc[event.level] = (acc[event.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsByCategory = recentEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySource = recentEvents.reduce((acc, event) => {
      acc[event.source] = (acc[event.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate error rate (errors per hour)
    const hoursInWindow = timeWindow / (60 * 60 * 1000);
    const errorRate = recentEvents.length / hoursInWindow;

    // Get top error patterns
    const patternCounts = new Map<string, { count: number; lastOccurrence: Date }>();
    
    for (const event of recentEvents) {
      for (const pattern of this.patterns.values()) {
        if (this.matchesPattern(event, pattern)) {
          const existing = patternCounts.get(pattern.name);
          if (!existing || event.timestamp > existing.lastOccurrence) {
            patternCounts.set(pattern.name, {
              count: (existing?.count || 0) + 1,
              lastOccurrence: event.timestamp
            });
          }
        }
      }
    }

    const topErrorPatterns = Array.from(patternCounts.entries())
      .map(([pattern, data]) => ({ pattern, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors: recentEvents.length,
      errorsByLevel,
      errorsByCategory,
      errorsBySource,
      errorRate,
      avgErrorsPerHour: errorRate,
      topErrorPatterns,
      recentErrors: recentEvents.slice(-50) // Last 50 errors
    };
  }

  /**
   * Get error events with filtering
   */
  getErrors(options: {
    limit?: number;
    offset?: number;
    level?: string;
    category?: string;
    source?: string;
    timeWindow?: number;
    search?: string;
  } = {}): {
    events: ErrorEvent[];
    total: number;
    hasMore: boolean;
  } {
    const {
      limit = 50,
      offset = 0,
      level,
      category,
      source,
      timeWindow,
      search
    } = options;

    let filteredEvents = [...this.events];

    // Apply time window filter
    if (timeWindow) {
      const cutoff = new Date(Date.now() - timeWindow);
      filteredEvents = filteredEvents.filter(event => event.timestamp > cutoff);
    }

    // Apply level filter
    if (level) {
      filteredEvents = filteredEvents.filter(event => event.level === level);
    }

    // Apply category filter
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }

    // Apply source filter
    if (source) {
      filteredEvents = filteredEvents.filter(event => event.source === source);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.message.toLowerCase().includes(searchLower) ||
        event.source.toLowerCase().includes(searchLower) ||
        (event.stack && event.stack.toLowerCase().includes(searchLower))
      );
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = filteredEvents.length;
    const paginatedEvents = filteredEvents.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      events: paginatedEvents,
      total,
      hasMore
    };
  }

  /**
   * Clear all errors (for testing/maintenance)
   */
  clearErrors(): void {
    this.events = [];
    // Reset pattern counts
    for (const pattern of this.patterns.values()) {
      pattern.totalOccurrences = 0;
      pattern.lastTriggered = undefined;
    }
  }

  /**
   * Get health status based on error patterns
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    const recentMetrics = this.getMetrics(60 * 60 * 1000); // Last hour

    // Check error rate
    if (recentMetrics.errorRate > 50) {
      issues.push(`High error rate: ${recentMetrics.errorRate.toFixed(1)} errors/hour`);
      recommendations.push('Investigate and fix recurring errors');
    }

    // Check critical errors
    const criticalErrors = recentMetrics.errorsByLevel['critical'] || 0;
    if (criticalErrors > 0) {
      issues.push(`${criticalErrors} critical errors in the last hour`);
      recommendations.push('Address critical errors immediately');
    }

    // Check error patterns
    for (const pattern of this.patterns.values()) {
      if (pattern.severity === 'critical' && pattern.totalOccurrences > 0) {
        const recentOccurrences = this.events.filter(event =>
          this.matchesPattern(event, pattern) &&
          event.timestamp > new Date(Date.now() - 60 * 60 * 1000)
        ).length;
        
        if (recentOccurrences >= pattern.threshold) {
          issues.push(`Critical pattern "${pattern.name}" triggered ${recentOccurrences} times`);
          recommendations.push(`Address root cause of ${pattern.name}`);
        }
      }
    }

    const status = issues.length === 0 ? 'healthy' :
                  issues.length <= 2 ? 'degraded' : 'unhealthy';

    return { status, issues, recommendations };
  }

  private initializeDefaultPatterns(): void {
    const defaultPatterns = [
      {
        name: 'Job Timeout',
        pattern: /timeout|timed out/i,
        category: 'job',
        severity: 'high' as const,
        threshold: 3,
        timeWindow: 30 * 60 * 1000 // 30 minutes
      },
      {
        name: 'Database Connection Error',
        pattern: /database|connection|ECONNREFUSED/i,
        category: 'system',
        severity: 'critical' as const,
        threshold: 2,
        timeWindow: 15 * 60 * 1000 // 15 minutes
      },
      {
        name: 'API Rate Limit',
        pattern: /rate limit|429|too many requests/i,
        category: 'api',
        severity: 'medium' as const,
        threshold: 10,
        timeWindow: 60 * 60 * 1000 // 1 hour
      },
      {
        name: 'Memory Error',
        pattern: /out of memory|heap|memory/i,
        category: 'system',
        severity: 'critical' as const,
        threshold: 1,
        timeWindow: 60 * 60 * 1000 // 1 hour
      },
      {
        name: 'Webhook Delivery Failure',
        pattern: /webhook.*failed|delivery.*failed/i,
        category: 'webhook',
        severity: 'medium' as const,
        threshold: 5,
        timeWindow: 30 * 60 * 1000 // 30 minutes
      }
    ];

    defaultPatterns.forEach(pattern => this.registerPattern(pattern));
  }

  private initializeDefaultAlertChannels(): void {
    // Email alerts for critical errors
    if (process.env.ADMIN_EMAIL) {
      this.registerAlertChannel({
        name: 'admin-email',
        type: 'email',
        config: {
          recipients: [process.env.ADMIN_EMAIL]
        },
        enabled: true,
        filters: {
          levels: ['critical', 'error']
        }
      });
    }

    // Slack alerts
    if (process.env.SLACK_WEBHOOK_URL) {
      this.registerAlertChannel({
        name: 'slack-alerts',
        type: 'slack',
        config: {
          url: process.env.SLACK_WEBHOOK_URL
        },
        enabled: true,
        filters: {
          levels: ['critical']
        }
      });
    }
  }

  private checkPatternsAndAlert(event: ErrorEvent): void {
    for (const pattern of this.patterns.values()) {
      if (this.matchesPattern(event, pattern)) {
        pattern.totalOccurrences++;
        
        // Check if we should trigger an alert
        const recentMatches = this.events.filter(e =>
          this.matchesPattern(e, pattern) &&
          e.timestamp > new Date(Date.now() - pattern.timeWindow)
        ).length;

        if (recentMatches >= pattern.threshold) {
          const timeSinceLastTrigger = pattern.lastTriggered ? 
            Date.now() - pattern.lastTriggered.getTime() : Infinity;
          
          // Don't spam alerts - wait at least 15 minutes between same pattern alerts
          if (timeSinceLastTrigger > 15 * 60 * 1000) {
            this.triggerAlert(pattern, event, recentMatches);
            pattern.lastTriggered = new Date();
          }
        }
      }
    }
  }

  private matchesPattern(event: ErrorEvent, pattern: ErrorPattern): boolean {
    const text = `${event.message} ${event.stack || ''}`;
    
    if (pattern.pattern instanceof RegExp) {
      return pattern.pattern.test(text);
    } else {
      return text.toLowerCase().includes(pattern.pattern.toLowerCase());
    }
  }

  private async triggerAlert(pattern: ErrorPattern, event: ErrorEvent, occurrences: number): Promise<void> {
    const alertMessage = this.formatAlertMessage(pattern, event, occurrences);
    
    for (const channel of this.alertChannels.values()) {
      if (!channel.enabled) continue;
      
      // Check filters
      if (channel.filters) {
        if (channel.filters.levels && !channel.filters.levels.includes(event.level)) {
          continue;
        }
        if (channel.filters.categories && !channel.filters.categories.includes(event.category)) {
          continue;
        }
      }

      try {
        await this.sendAlert(channel, alertMessage, event);
      } catch (error) {
        console.error(`Failed to send alert via ${channel.name}:`, error);
      }
    }
  }

  private formatAlertMessage(pattern: ErrorPattern, event: ErrorEvent, occurrences: number): string {
    return `🚨 **Alert: ${pattern.name}**
    
**Pattern:** ${pattern.name} (${pattern.severity})
**Occurrences:** ${occurrences} times in ${Math.round(pattern.timeWindow / 60000)} minutes
**Latest Error:** ${event.message}
**Source:** ${event.source}
**Time:** ${event.timestamp.toISOString()}
${event.jobId ? `**Job ID:** ${event.jobId}` : ''}

**Details:** ${JSON.stringify(event.details || {}, null, 2)}`;
  }

  private async sendAlert(channel: AlertChannel, message: string, event: ErrorEvent): Promise<void> {
    switch (channel.type) {
      case 'slack':
        if (channel.config.url) {
          await fetch(channel.config.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: message,
              username: 'Blog Automation Monitor',
              icon_emoji: ':warning:'
            })
          });
        }
        break;
        
      case 'webhook':
        if (channel.config.url) {
          await fetch(channel.config.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...channel.config.headers
            },
            body: JSON.stringify({
              alert: message,
              event,
              timestamp: new Date().toISOString()
            })
          });
        }
        break;
        
      case 'email':
        // In a real implementation, integrate with your email service
        }`);
        break;
    }
  }

  private monitorJobQueue(): void {
    // This would integrate with job queue events in a real implementation
    // For now, we'll poll for failed jobs
    setInterval(() => {
      const failedJobs = jobQueue.getJobsByStatus('failed');
      
      for (const job of failedJobs) {
        if (job.failedAt && job.failedAt > new Date(Date.now() - 60000)) { // Last minute
          this.logError({
            level: 'error',
            category: 'job',
            source: 'job-queue',
            message: `Job ${job.type} failed: ${job.lastError}`,
            jobId: job.id,
            details: {
              jobType: job.type,
              attempts: job.attempts,
              maxRetries: job.maxRetries,
              payload: job.payload
            }
          });
        }
      }
    }, 60000); // Check every minute
  }

  private cleanup(): void {
    // Remove events older than 7 days
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoff);
  }

  private generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton instance
export const errorMonitor = new ErrorMonitor();

// Helper function for API error logging
export function logAPIError(error: Error | unknown, context: {
  endpoint: string;
  method: string;
  requestId?: string;
  userId?: string;
  payload?: unknown;
}): ErrorEvent {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  return errorMonitor.logError({
    level: 'error',
    category: 'api',
    source: `api:${context.endpoint}`,
    message: errorObj.message,
    stack: errorObj.stack,
    requestId: context.requestId,
    userId: context.userId,
    details: {
      method: context.method,
      payload: context.payload
    }
  });
}

// Helper function for job error logging
export function logJobError(error: Error | unknown, job: Job): ErrorEvent {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  return errorMonitor.logError({
    level: 'error',
    category: 'job',
    source: `job:${job.type}`,
    message: errorObj.message,
    stack: errorObj.stack,
    jobId: job.id,
    details: {
      jobType: job.type,
      attempts: job.attempts,
      payload: job.payload
    }
  });
}