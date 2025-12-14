import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../route'

// Mock the data layer
vi.mock('@/lib/content/projects', () => ({
  getProject: vi.fn()
}))

// Mock the logger
vi.mock('@/lib/monitoring/logger', () => ({
  createContextLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }))
}))

const createMockRequest = () => {
  return new NextRequest('http://localhost:3000/api/projects/test-project', {
    method: 'GET',
  })
}

describe('/api/projects/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return project when found', async () => {
      const { getProject } = await import('@/lib/content/projects')
      const mockProject = {
        id: '1',
        title: 'Test Project',
        slug: 'test-project',
        description: 'A test project',
        image: 'https://example.com/image.jpg',
        category: 'Analytics',
        viewCount: 0,
        clickCount: 0
      }
      vi.mocked(getProject).mockResolvedValueOnce(mockProject)

      const response = await GET(createMockRequest(), { params: { slug: 'test-project' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProject)
      expect(getProject).toHaveBeenCalledWith('test-project')
    })

    it('should return 404 when project not found', async () => {
      const { getProject } = await import('@/lib/content/projects')
      vi.mocked(getProject).mockResolvedValueOnce(null)

      const response = await GET(createMockRequest(), { params: { slug: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Project not found')
    })

    it('should validate slug format', async () => {
      const response = await GET(createMockRequest(), { params: { slug: 'invalid slug!' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should reject empty slug', async () => {
      const response = await GET(createMockRequest(), { params: { slug: '' } })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should handle database errors', async () => {
      const { getProject } = await import('@/lib/content/projects')
      vi.mocked(getProject).mockRejectedValueOnce(new Error('Database error'))

      const response = await GET(createMockRequest(), { params: { slug: 'test-project' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch project')
    })
  })
})
