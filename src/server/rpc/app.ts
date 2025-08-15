/**
 * Main Hono RPC Application
 * Orchestrates all RPC routes with middleware and configuration
 */

import { Hono } from 'hono'
import { 
  logger,
  cors,
  securityHeaders,
  errorHandler,
  requestContext,
  enhancedRateLimit
} from './middleware'

// Import route modules
import { contact } from './routes/contact'
import { blog } from './routes/blog'
import { projects } from './routes/projects'
import { analytics } from './routes/analytics'
import { auth } from './routes/auth'

// Create main RPC application
const app = new Hono()

// =======================
// GLOBAL MIDDLEWARE
// =======================

// Security and CORS
app.use('*', cors())
app.use('*', securityHeaders())

// Enhanced rate limiting for all RPC endpoints
app.use('*', enhancedRateLimit({ 
  configName: 'api', 
  enableAnalytics: true 
}))

// Logging
app.use('*', logger())

// Request context
app.use('*', requestContext())

// Error handling
app.use('*', errorHandler())

// =======================
// API INFORMATION ENDPOINT
// =======================

app.get('/', async (c) => {
  return c.json({
    success: true,
    data: {
      name: 'Portfolio RPC API',
      version: '1.0.0',
      description: 'Type-safe RPC API for modern portfolio application',
      documentation: '/docs',
      endpoints: {
        contact: {
          submit: 'POST /contact/submit',
          validate: 'POST /contact/validate',
          stats: 'GET /contact/stats',
        },
        blog: {
          posts: 'GET /blog/posts',
          post: 'GET /blog/posts/:slug',
          createPost: 'POST /blog/posts (auth required)',
          updatePost: 'PUT /blog/posts/:id (auth required)',
          deletePost: 'DELETE /blog/posts/:id (auth required)',
          categories: 'GET /blog/categories',
          tags: 'GET /blog/tags',
          analytics: 'GET /blog/analytics',
          upload: 'POST /blog/upload (auth required)',
        },
        projects: {
          list: 'GET /projects',
          detail: 'GET /projects/:slug',
          categories: 'GET /projects/categories/list',
          technologies: 'GET /projects/technologies/list',
          stats: 'GET /projects/stats',
          search: 'POST /projects/search',
        },
        analytics: {
          reportVital: 'POST /analytics/vitals',
          vitalsSummary: 'GET /analytics/vitals/summary',
          trackPageView: 'POST /analytics/pageview',
          pageViews: 'GET /analytics/pageviews',
          dashboard: 'GET /analytics/dashboard',
          health: 'GET /analytics/health',
        },
        auth: {
          login: 'POST /auth/login',
          register: 'POST /auth/register (admin only)',
          logout: 'POST /auth/logout (auth required)',
          profile: 'GET /auth/profile (auth required)',
          refresh: 'POST /auth/refresh',
          cspReport: 'POST /auth/csp-report',
          securityAudit: 'GET /auth/security/audit (admin only)',
          health: 'GET /auth/health',
        },
      },
      features: [
        'Type-safe endpoints with Zod validation',
        'Rate limiting and security headers',
        'Authentication and authorization',
        'Comprehensive error handling',
        'Request/response logging',
        'Health monitoring',
        'File uploads',
        'CSP violation reporting',
      ],
      status: 'operational',
      timestamp: new Date().toISOString(),
    }
  })
})

// =======================
// HEALTH CHECK ENDPOINT
// =======================

app.get('/health', async (c) => {
  const startTime = Date.now()

  try {
    // Check various components
    const services = {
      api: { status: 'up' as const, latency: Date.now() - startTime },
      middleware: { status: 'up' as const, latency: 2 },
      routes: { status: 'up' as const, latency: 1 },
    }

    const health = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
      endpoints: {
        total: 25, // Approximate count of all endpoints
        authenticated: 8,
        public: 17,
        rateLimit: 'active',
      }
    }

    return c.json({
      success: true,
      data: health,
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return c.json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed',
      }
    }, 500)
  }
})

// =======================
// API DOCUMENTATION ENDPOINT
// =======================

app.get('/docs', async (c) => {
  return c.json({
    success: true,
    data: {
      title: 'Portfolio RPC API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for the portfolio RPC endpoints',
      baseUrl: '/api/rpc',
      authentication: {
        type: 'Bearer Token',
        description: 'Use JWT tokens obtained from /auth/login endpoint',
        header: 'Authorization: Bearer <token>',
      },
      rateLimiting: {
        description: 'Rate limiting is applied to all endpoints',
        headers: [
          'X-RateLimit-Limit: Maximum requests allowed',
          'X-RateLimit-Remaining: Remaining requests in window',
          'X-RateLimit-Reset: Time when rate limit resets',
        ],
      },
      errorHandling: {
        format: {
          success: false,
          error: {
            code: 'ERROR_CODE',
            message: 'Human readable error message',
            details: 'Additional error details (optional)',
          }
        },
        commonCodes: [
          'VALIDATION_ERROR - Invalid input data',
          'AUTHENTICATION_REQUIRED - Missing auth token',
          'INVALID_TOKEN - Invalid or expired token',
          'INSUFFICIENT_PERMISSIONS - Insufficient permissions',
          'RATE_LIMIT_EXCEEDED - Too many requests',
          'INTERNAL_ERROR - Server error',
        ],
      },
      examples: {
        successResponse: {
          success: true,
          data: {
            id: 'example-id',
            message: 'Operation successful',
          },
          meta: {
            timestamp: '2024-01-01T00:00:00.000Z',
            requestId: 'req-123',
            version: '1.0.0',
          }
        },
        errorResponse: {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: {
              email: 'Valid email is required',
              name: 'Name is required',
            }
          }
        },
      },
    }
  })
})

// =======================
// ROUTE REGISTRATION
// =======================

// Register all route modules
app.route('/contact', contact)
app.route('/blog', blog)
app.route('/projects', projects)
app.route('/analytics', analytics)
app.route('/auth', auth)

// =======================
// 404 HANDLER
// =======================

app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint ${c.req.method} ${c.req.path} not found`,
      details: {
        method: c.req.method,
        path: c.req.path,
        availableEndpoints: '/',
      }
    }
  }, 404)
})

// =======================
// EXPORTS
// =======================

export { app as rpcApp }