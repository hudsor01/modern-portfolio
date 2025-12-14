import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../route'

// Mock the data layer
vi.mock('@/lib/content/projects', () => ({
  getProjects: vi.fn()
}))

// Helper to create mock NextRequest
function createMockRequest(): NextRequest {
  return new NextRequest('http://localhost:3000/api/projects', {
    method: 'GET',
  })
}

describe('/api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return projects successfully', async () => {
      const { getProjects } = await import('@/lib/content/projects')
      const mockProjects = [
        { id: '1', title: 'Project 1', slug: 'project-1', description: 'Description 1', image: 'https://example.com/1.jpg', category: 'Analytics', viewCount: 0, clickCount: 0 },
        { id: '2', title: 'Project 2', slug: 'project-2', description: 'Description 2', image: 'https://example.com/2.jpg', category: 'Dashboard', viewCount: 0, clickCount: 0 }
      ]
      vi.mocked(getProjects).mockResolvedValueOnce(mockProjects)

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProjects)
    })

    it('should return empty array when no projects exist', async () => {
      const { getProjects } = await import('@/lib/content/projects')
      vi.mocked(getProjects).mockResolvedValueOnce([])

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should handle errors gracefully', async () => {
      const { getProjects } = await import('@/lib/content/projects')
      vi.mocked(getProjects).mockRejectedValueOnce(new Error('Database error'))

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch projects')
    })
  })
})
