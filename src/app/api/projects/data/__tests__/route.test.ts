import { describe, afterAll, it, expect, vi, beforeEach, afterEach, mock } from 'bun:test'
import { NextRequest } from 'next/server'

// Create mock functions
const mockGetProjects = vi.fn()
const mockGetProjectsByCategory = vi.fn()
const mockGetFeaturedProjects = vi.fn()
const mockSearchProjects = vi.fn()
const mockGetProjectsWithFilters = vi.fn()

// Mock the ProjectDataManager - must be before imports
mock.module('@/lib/server/project-data-manager', () => ({
  ProjectDataManager: {
    getProjects: mockGetProjects,
    getProjectsByCategory: mockGetProjectsByCategory,
    getFeaturedProjects: mockGetFeaturedProjects,
    searchProjects: mockSearchProjects,
    getProjectsWithFilters: mockGetProjectsWithFilters
  }
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

const createMockRequest = (url: string) => {
  return new NextRequest(url)
}

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('/api/projects/data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetProjects.mockReset()
    mockGetProjectsByCategory.mockReset()
    mockGetFeaturedProjects.mockReset()
    mockSearchProjects.mockReset()
    mockGetProjectsWithFilters.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return all projects by default', async () => {
      const mockProjects = [
        { id: '1', title: 'Project 1', slug: 'project-1', description: 'Description 1', image: 'https://example.com/1.jpg', category: 'Analytics', viewCount: 0, clickCount: 0 },
        { id: '2', title: 'Project 2', slug: 'project-2', description: 'Description 2', image: 'https://example.com/2.jpg', category: 'Dashboard', viewCount: 0, clickCount: 0 }
      ]
      mockGetProjects.mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(mockGetProjects).toHaveBeenCalled()
    })

    it('should filter by category', async () => {
      const mockProjects = [{ id: '1', title: 'Revenue Project', slug: 'revenue-project', description: 'Revenue description', image: 'https://example.com/1.jpg', category: 'revenue', viewCount: 0, clickCount: 0 }]
      mockGetProjectsByCategory.mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?category=revenue'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(mockGetProjectsByCategory).toHaveBeenCalledWith('revenue')
    })

    it('should filter by featured', async () => {
      const mockProjects = [{ id: '1', title: 'Featured Project', slug: 'featured-project', description: 'Featured description', image: 'https://example.com/1.jpg', category: 'Analytics', featured: true, viewCount: 0, clickCount: 0 }]
      mockGetFeaturedProjects.mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?featured=true'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(mockGetFeaturedProjects).toHaveBeenCalled()
    })

    it('should search projects', async () => {
      const mockProjects = [{ id: '1', title: 'Revenue Operations', slug: 'revenue-operations', description: 'Revenue ops description', image: 'https://example.com/1.jpg', category: 'Revenue', viewCount: 0, clickCount: 0 }]
      mockSearchProjects.mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?search=revenue'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(mockSearchProjects).toHaveBeenCalledWith('revenue')
    })

    it('should return projects with filters', async () => {
      const mockData = {
        projects: [{ id: '1', title: 'Project 1', slug: 'project-1', description: 'Description 1', image: 'https://example.com/1.jpg', category: 'Analytics', viewCount: 0, clickCount: 0 }],
        filters: [{ category: 'revenue', count: 5 }, { category: 'analytics', count: 3 }]
      }
      mockGetProjectsWithFilters.mockResolvedValueOnce(mockData)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?withFilters=true'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockData)
      expect(mockGetProjectsWithFilters).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      mockGetProjects.mockRejectedValueOnce(new Error('Database error'))

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data'))
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch projects')
    })
  })
})
