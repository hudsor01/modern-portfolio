// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock env-validation to control METRICS_API_TOKEN
vi.mock('@/lib/env-validation', () => ({
  env: {
    METRICS_API_TOKEN: undefined,
  },
}))

// Mock rate-limiter store
vi.mock('@/lib/rate-limiter/store', () => ({
  getRateLimiter: vi.fn(() => ({
    exportMetrics: vi.fn(() => ({
      timestamp: 1700000000000,
      metrics: {
        totalRequests: 100,
        blockedRequests: 5,
        uniqueClients: 20,
        avgRequestsPerClient: 5,
        suspiciousActivities: 1,
        topClients: [],
        trends: { hourly: new Array(24).fill(0), daily: new Array(7).fill(0) },
      },
      systemLoad: 0.3,
      activeClients: 20,
    })),
  })),
}))

import { env } from '@/lib/env-validation'

describe('GET /api/security/metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset to no token configured
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = undefined
  })

  it('Test 1: returns 403 when METRICS_API_TOKEN env is not set', async () => {
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = undefined
    const { GET } = await import('@/app/api/security/metrics/route')
    const { NextRequest } = await import('next/server')
    const request = new NextRequest('http://localhost/api/security/metrics')
    const response = await GET(request)
    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  it('Test 2: returns 403 when no X-Metrics-Token header provided', async () => {
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = 'a'.repeat(32)
    const { GET } = await import('@/app/api/security/metrics/route')
    const { NextRequest } = await import('next/server')
    const request = new NextRequest('http://localhost/api/security/metrics')
    const response = await GET(request)
    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body).toHaveProperty('error', 'Unauthorized')
  })

  it('Test 3: returns 403 when wrong token provided', async () => {
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = 'a'.repeat(32)
    const { GET } = await import('@/app/api/security/metrics/route')
    const { NextRequest } = await import('next/server')
    const request = new NextRequest('http://localhost/api/security/metrics', {
      headers: { 'X-Metrics-Token': 'b'.repeat(32) },
    })
    const response = await GET(request)
    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body).toHaveProperty('error', 'Unauthorized')
  })

  it('Test 4: returns 403 when token has different length (timingSafeEqual length check)', async () => {
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = 'a'.repeat(32)
    const { GET } = await import('@/app/api/security/metrics/route')
    const { NextRequest } = await import('next/server')
    const request = new NextRequest('http://localhost/api/security/metrics', {
      headers: { 'X-Metrics-Token': 'a'.repeat(16) },
    })
    const response = await GET(request)
    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body).toHaveProperty('error', 'Unauthorized')
  })

  it('Test 5: returns 200 with metrics JSON when correct token provided', async () => {
    const correctToken = 'a'.repeat(32)
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = correctToken
    const { GET } = await import('@/app/api/security/metrics/route')
    const { NextRequest } = await import('next/server')
    const request = new NextRequest('http://localhost/api/security/metrics', {
      headers: { 'X-Metrics-Token': correctToken },
    })
    const response = await GET(request)
    expect(response.status).toBe(200)
  })

  it('Test 6: response includes Cache-Control: no-cache, no-store, must-revalidate header', async () => {
    const correctToken = 'a'.repeat(32)
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = correctToken
    const { GET } = await import('@/app/api/security/metrics/route')
    const { NextRequest } = await import('next/server')
    const request = new NextRequest('http://localhost/api/security/metrics', {
      headers: { 'X-Metrics-Token': correctToken },
    })
    const response = await GET(request)
    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
  })

  it('Test 7: response contains expected metric fields (timestamp, metrics, systemLoad, activeClients)', async () => {
    const correctToken = 'a'.repeat(32)
    ;(env as Record<string, unknown>).METRICS_API_TOKEN = correctToken
    const { GET } = await import('@/app/api/security/metrics/route')
    const { NextRequest } = await import('next/server')
    const request = new NextRequest('http://localhost/api/security/metrics', {
      headers: { 'X-Metrics-Token': correctToken },
    })
    const response = await GET(request)
    const body = await response.json()
    expect(body).toHaveProperty('timestamp')
    expect(body).toHaveProperty('metrics')
    expect(body).toHaveProperty('systemLoad')
    expect(body).toHaveProperty('activeClients')
  })
})
