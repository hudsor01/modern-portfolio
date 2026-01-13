import { describe, afterAll, it, expect, vi, beforeEach, afterEach, mock } from 'vitest'

// Create mock function
const mockGetProjects = vi.fn()

// Mock the data layer
mock.module('@/lib/content/projects', () => ({
  getProjects: mockGetProjects,
}))

// Import after mocks
import { GET } from '../route'

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetProjects.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return projects successfully', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Project 1',
          slug: 'project-1',
          description: 'Description 1',
          image: 'https://example.com/1.jpg',
          category: 'Analytics',
          viewCount: 0,
          clickCount: 0,
        },
        {
          id: '2',
          title: 'Project 2',
          slug: 'project-2',
          description: 'Description 2',
          image: 'https://example.com/2.jpg',
          category: 'Dashboard',
          viewCount: 0,
          clickCount: 0,
        },
      ]
      mockGetProjects.mockResolvedValueOnce(mockProjects)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProjects)
    })

    it('should return empty array when no projects exist', async () => {
      mockGetProjects.mockResolvedValueOnce([])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should handle errors gracefully', async () => {
      // Mock NODE_ENV for this test
      const originalNodeEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
      })

      try {
        mockGetProjects.mockRejectedValueOnce(new Error('Database error'))

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.success).toBe(false)
        expect(data.error).toBe('Database error') // Shows full error in development/test
        expect(data.code).toBe('INTERNAL_ERROR')
        expect(data.timestamp).toBeDefined()
      } finally {
        // Restore original NODE_ENV
        Object.defineProperty(process.env, 'NODE_ENV', {
          value: originalNodeEnv,
          writable: true,
        })
      }
    })
  })
})
