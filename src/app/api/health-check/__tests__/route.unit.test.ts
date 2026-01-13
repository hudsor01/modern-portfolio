import { describe, it, expect, mock, afterAll } from 'vitest'

// Mock next/server with a proper NextResponse constructor
mock.module('next/server', () => {
  class MockNextResponse {
    private body: string | null
    status: number
    headers: Map<string, string>

    constructor(body: string | null, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body
      this.status = init?.status || 200
      this.headers = new Map(Object.entries(init?.headers || {}))
    }

    async text() {
      return this.body || ''
    }

    async json() {
      return this.body ? JSON.parse(this.body) : null
    }

    get ok() {
      return this.status < 400
    }

    static json(data: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(JSON.stringify(data), init)
    }
  }

  return {
    NextResponse: MockNextResponse,
    NextRequest: class NextRequest {
      url: string
      constructor(url: string) { this.url = url }
    },
  }
})

// Import after mock
import { GET, HEAD } from '../route'

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/health-check', () => {
  describe('GET', () => {
    it('should return OK status', async () => {
      const response = await GET()

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('OK')
    })

    it('should return correct headers', async () => {
      const response = await GET()

      expect(response.headers.get('Content-Type')).toBe('text/plain')
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })

  describe('HEAD', () => {
    it('should return 200 status with no body', async () => {
      const response = await HEAD()

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('')
    })

    it('should return correct headers', async () => {
      const response = await HEAD()

      expect(response.headers.get('Content-Type')).toBe('text/plain')
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })
})
