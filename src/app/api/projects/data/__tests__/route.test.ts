import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../route'

// Mock the ProjectDataManager
vi.mock('@/lib/server/project-data-manager', () => ({
  ProjectDataManager: {
    getProjects: vi.fn(),
    getProjectsByCategory: vi.fn(),
    getFeaturedProjects: vi.fn(),
    searchProjects: vi.fn(),
    getProjectsWithFilters: vi.fn()
  }
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

const createMockRequest = (url: string) => {
  return new NextRequest(url)
}

describe('/api/projects/data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return all projects by default', async () => {
      const { ProjectDataManager } = await import('@/lib/server/project-data-manager')
      const mockProjects = [
        { id: '1', title: 'Project 1', description: 'Description 1' },
        { id: '2', title: 'Project 2', description: 'Description 2' }
      ]
      vi.mocked(ProjectDataManager.getProjects).mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(ProjectDataManager.getProjects).toHaveBeenCalled()
    })

    it('should filter by category', async () => {
      const { ProjectDataManager } = await import('@/lib/server/project-data-manager')
      const mockProjects = [{ id: '1', title: 'Revenue Project', description: 'Revenue description', category: 'revenue' }]
      vi.mocked(ProjectDataManager.getProjectsByCategory).mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?category=revenue'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(ProjectDataManager.getProjectsByCategory).toHaveBeenCalledWith('revenue')
    })

    it('should filter by featured', async () => {
      const { ProjectDataManager } = await import('@/lib/server/project-data-manager')
      const mockProjects = [{ id: '1', title: 'Featured Project', description: 'Featured description', featured: true }]
      vi.mocked(ProjectDataManager.getFeaturedProjects).mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?featured=true'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(ProjectDataManager.getFeaturedProjects).toHaveBeenCalled()
    })

    it('should search projects', async () => {
      const { ProjectDataManager } = await import('@/lib/server/project-data-manager')
      const mockProjects = [{ id: '1', title: 'Revenue Operations', description: 'Revenue ops description' }]
      vi.mocked(ProjectDataManager.searchProjects).mockResolvedValueOnce(mockProjects)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?search=revenue'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
      expect(ProjectDataManager.searchProjects).toHaveBeenCalledWith('revenue')
    })

    it('should return projects with filters', async () => {
      const { ProjectDataManager } = await import('@/lib/server/project-data-manager')
      const mockData = {
        projects: [{ id: '1', title: 'Project 1', description: 'Description 1' }],
        filters: [{ category: 'revenue', count: 5 }, { category: 'analytics', count: 3 }]
      }
      vi.mocked(ProjectDataManager.getProjectsWithFilters).mockResolvedValueOnce(mockData)

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data?withFilters=true'))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockData)
      expect(ProjectDataManager.getProjectsWithFilters).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      const { ProjectDataManager } = await import('@/lib/server/project-data-manager')
      vi.mocked(ProjectDataManager.getProjects).mockRejectedValueOnce(new Error('Database error'))

      const response = await GET(createMockRequest('http://localhost:3000/api/projects/data'))
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch projects')
    })
  })
})
