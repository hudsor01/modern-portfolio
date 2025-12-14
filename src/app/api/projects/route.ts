import { NextRequest, NextResponse } from 'next/server'
import { getProjects } from '@/lib/content/projects'
import { EnhancedRateLimiter } from '@/lib/security/enhanced-rate-limiter'

// Helper function to get client identifier
function getClientId(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') ||
         request.headers.get('x-real-ip') ||
         'unknown'
}

export async function GET(request: NextRequest) {
  const clientId = getClientId(request)

  // Rate limiting: 100 requests per minute for projects listing
  using rateLimiter = new EnhancedRateLimiter()

  const rateLimitResult = rateLimiter.checkLimit(clientId, {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 100,
    progressivePenalty: false,
    blockDuration: 0,
    adaptiveThreshold: true,
    antiAbuse: true,
    burstProtection: {
      enabled: true,
      burstWindow: 5 * 1000,
      maxBurstRequests: 120
    }
  }, {
    path: '/api/projects',
    method: 'GET'
  })

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.retryAfter || 0) / 1000)),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime || 0),
        }
      }
    )
  }

  try {
    const projects = await getProjects()
    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}