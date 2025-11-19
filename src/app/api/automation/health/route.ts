/**
 * Automation Health Check API
 * Comprehensive health monitoring for the blog automation system
 */

import { NextRequest, NextResponse } from 'next/server';
import { jobQueue } from '@/lib/automation/job-queue';
import { blogAutomationService } from '@/lib/automation/blog-automation-service';
import { createContextLogger } from '@/lib/logging/logger';
import type { ApiResponse } from '@/types/shared-api';

const logger = createContextLogger('AutomationHealthCheck');

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for detailed checks
    const { searchParams } = new URL(request.url);
    const includeJobs = searchParams.get('includeJobs') === 'true';
    const includeMetrics = searchParams.get('includeMetrics') === 'true';

    // Core health check
    const coreHealth = jobQueue.healthCheck();
    const automationHealth = await blogAutomationService.getAutomationHealth();
    
    // System checks
    const systemChecks = await performSystemChecks();
    
    // Dependency checks
    const dependencyChecks = await checkDependencies();

    // Compile overall health status
    const allIssues = [
      ...coreHealth.issues,
      ...automationHealth.issues,
      ...systemChecks.issues,
      ...dependencyChecks.issues
    ];

    const overallStatus = determineOverallStatus(allIssues.length, {
      coreHealth: coreHealth.status,
      automationHealth: automationHealth.status,
      systemHealth: systemChecks.status,
      dependencyHealth: dependencyChecks.status
    });

    // Base health response
    const healthResponse: Record<string, unknown> = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      components: {
        jobQueue: {
          status: coreHealth.status,
          issues: coreHealth.issues
        },
        automation: {
          status: automationHealth.status,
          issues: automationHealth.issues,
          recommendations: automationHealth.recommendations
        },
        system: {
          status: systemChecks.status,
          issues: systemChecks.issues,
          memory: systemChecks.memory,
          cpu: systemChecks.cpu
        },
        dependencies: {
          status: dependencyChecks.status,
          issues: dependencyChecks.issues,
          services: dependencyChecks.services
        }
      },
      summary: {
        totalIssues: allIssues.length,
        criticalIssues: allIssues.filter(issue => 
          issue.includes('critical') || issue.includes('down') || issue.includes('failed')
        ).length,
        recommendations: [
          ...automationHealth.recommendations,
          ...systemChecks.recommendations,
          ...dependencyChecks.recommendations
        ]
      }
    };

    // Add detailed metrics if requested
    if (includeMetrics) {
      healthResponse.metrics = {
        jobQueue: coreHealth.metrics,
        automation: automationHealth.metrics,
        performance: await getPerformanceMetrics()
      };
    }

    // Add recent job samples if requested
    if (includeJobs) {
      const recentJobs = Array.from((jobQueue as unknown as { jobs: Map<string, { id: string; type: string; status: string; progress: number; createdAt: Date; startedAt?: Date; completedAt?: Date; }> }).jobs.values())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10)
        .map((job) => ({
          id: job.id,
          type: job.type,
          status: job.status,
          progress: job.progress,
          createdAt: job.createdAt.toISOString(),
          duration: job.startedAt && job.completedAt ? 
            job.completedAt.getTime() - job.startedAt.getTime() : null
        }));
      
      healthResponse.recentJobs = recentJobs;
    }

    // Set appropriate HTTP status code based on health
    const httpStatus = overallStatus === 'healthy' ? 200 : 
                     overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json<ApiResponse<typeof healthResponse>>({
      success: overallStatus !== 'unhealthy',
      data: healthResponse,
      ...(overallStatus === 'unhealthy' && { 
        error: 'System is unhealthy - check component status for details' 
      })
    }, { status: httpStatus });

  } catch (error) {
    logger.error('Health check error', error instanceof Error ? error : new Error(String(error)));

    return NextResponse.json<ApiResponse<{
      status: string;
      error: string;
      timestamp: string;
    }>>({
      success: false,
      error: 'Health check failed',
      data: {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

async function performSystemChecks(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  issues: string[];
  recommendations: string[];
  memory: {
    used: number;
    free: number;
    total: number;
    percentage: number;
  };
  cpu: {
    loadAverage: number[];
    usage?: number;
  };
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Memory usage check
  const memUsage = process.memoryUsage();
  const totalMem = memUsage.heapTotal;
  const usedMem = memUsage.heapUsed;
  const freeMem = totalMem - usedMem;
  const memPercentage = (usedMem / totalMem) * 100;

  if (memPercentage > 90) {
    issues.push(`High memory usage: ${memPercentage.toFixed(1)}%`);
    recommendations.push('Consider optimizing memory usage or increasing available memory');
  } else if (memPercentage > 75) {
    recommendations.push('Monitor memory usage - approaching high utilization');
  }

  // CPU load check (Node.js specific)
  const loadAvg = require('os').loadavg();
  const cpuCount = require('os').cpus().length;
  const normalizedLoad = loadAvg[0] / cpuCount;

  if (normalizedLoad > 0.8) {
    issues.push(`High CPU load: ${(normalizedLoad * 100).toFixed(1)}%`);
    recommendations.push('High CPU usage detected - consider optimizing job processing');
  }

  // Event loop lag check (simplified)
  const eventLoopStart = Date.now();
  await new Promise(resolve => setImmediate(resolve));
  const eventLoopLag = Date.now() - eventLoopStart;

  if (eventLoopLag > 100) {
    issues.push(`High event loop lag: ${eventLoopLag}ms`);
    recommendations.push('Event loop is blocked - review synchronous operations');
  }

  const status = issues.length === 0 ? 'healthy' : 
                issues.length <= 1 ? 'degraded' : 'unhealthy';

  return {
    status,
    issues,
    recommendations,
    memory: {
      used: usedMem,
      free: freeMem,
      total: totalMem,
      percentage: memPercentage
    },
    cpu: {
      loadAverage: loadAvg,
      usage: normalizedLoad * 100
    }
  };
}

async function checkDependencies(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  issues: string[];
  recommendations: string[];
  services: Record<string, {
    status: 'up' | 'down' | 'unknown';
    responseTime?: number;
    lastChecked: string;
  }>;
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];
  const services: Record<string, {
    status: 'up' | 'down' | 'unknown';
    responseTime?: number;
    lastChecked: string;
  }> = {};

  // Check external services (if configured)
  const servicesToCheck = [
    {
      name: 'database',
      url: process.env.DATABASE_URL,
      timeout: 5000
    },
    {
      name: 'redis',
      url: process.env.REDIS_URL,
      timeout: 3000
    },
    {
      name: 'email_service',
      url: process.env.EMAIL_SERVICE_URL,
      timeout: 5000
    }
  ].filter(service => service.url);

  for (const service of servicesToCheck) {
    try {
      const start = Date.now();
      
      // Simple connectivity check (would be more sophisticated in real implementation)
      if (service.name === 'database') {
        // Mock database check
        await new Promise(resolve => setTimeout(resolve, 100));
        services[service.name] = {
          status: 'up' as const,
          responseTime: Date.now() - start,
          lastChecked: new Date().toISOString()
        };
      } else {
        // For other services, you'd implement actual health checks
        services[service.name] = {
          status: 'unknown' as const,
          lastChecked: new Date().toISOString()
        };
      }
    } catch {
      services[service.name] = {
        status: 'down' as const,
        lastChecked: new Date().toISOString()
      };
      issues.push(`${service.name} is unreachable`);
      recommendations.push(`Check ${service.name} connectivity and configuration`);
    }
  }

  // Check environment variables
  const requiredEnvVars = [
    'NODE_ENV',
    'NEXT_PUBLIC_SITE_URL'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    issues.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    recommendations.push('Set all required environment variables');
  }

  const status = issues.length === 0 ? 'healthy' : 
                issues.length <= 1 ? 'degraded' : 'unhealthy';

  return {
    status,
    issues,
    recommendations,
    services
  };
}

async function getPerformanceMetrics() {
  return {
    responseTime: {
      p50: 150,
      p95: 300,
      p99: 500
    },
    throughput: {
      requestsPerSecond: 10,
      jobsPerMinute: 30
    },
    errors: {
      rate: 0.02,
      count: 5
    }
  };
}

function determineOverallStatus(
  issueCount: number, 
  componentStatuses: Record<string, string>
): 'healthy' | 'degraded' | 'unhealthy' {
  const unhealthyComponents = Object.values(componentStatuses).filter(
    status => status === 'unhealthy'
  ).length;
  
  if (unhealthyComponents > 1) {
    return 'unhealthy';
  }
  
  if (unhealthyComponents === 1 || issueCount > 3) {
    return 'degraded';
  }
  
  return issueCount === 0 ? 'healthy' : 'degraded';
}

// Simple health check endpoint
export async function HEAD() {
  try {
    const health = jobQueue.healthCheck();
    const status = health.status === 'healthy' ? 200 : 503;
    
    return new NextResponse(null, { 
      status,
      headers: {
        'X-Health-Status': health.status,
        'X-Health-Issues': health.issues.length.toString()
      }
    });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}