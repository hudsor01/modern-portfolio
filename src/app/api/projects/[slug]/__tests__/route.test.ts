import { describe, afterAll, it, expect, vi, beforeEach, afterEach, mock } from 'bun:test'

// Create mock function for getProject
const mockGetProject = vi.fn()

// Mock the data layer
mock.module('@/lib/content/projects', () => ({
  getProject: mockGetProject
}))

// Mock the logger
mock.module('@/lib/monitoring/logger', () => ({
  createContextLogger: () => ({
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {}
  })
}))

// Import after mocks
import { GET } from '../route'
import { createMockNextRequest } from '@/test/mock-next-request'

// Create mock request with proper headers
const createMockRequest = () => {
  return createMockNextRequest('http://localhost:3000/api/projects/test-project', {
    headers: { 'x-forwarded-for': '127.0.0.1' }
  })
}

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/projects/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetProject.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return project when found', async () => {
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
      mockGetProject.mockResolvedValueOnce(mockProject)

      const response = await GET(createMockRequest(), { params: { slug: 'test-project' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProject)
      expect(mockGetProject).toHaveBeenCalledWith('test-project')
    })

    it('should return 404 when project not found', async () => {
      mockGetProject.mockResolvedValueOnce(null)

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
      mockGetProject.mockRejectedValueOnce(new Error('Database error'))

      const response = await GET(createMockRequest(), { params: { slug: 'test-project' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch project')
    })
  })
})
