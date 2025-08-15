import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  formatProjectDate, 
  fetchProjects, 
  fetchFeaturedProjects, 
  fetchProjectById, 
  sendContactForm 
} from '../api'
import { createMockProject, createMockContactForm, createMockApiResponse } from '@/test/factories'
import type { Project } from '@/types/project'
import type { ContactFormData, ContactApiResponse } from '@/app/api/types'

// Mock the dynamic imports
vi.mock('@/lib/content/projects', () => ({
  getProjects: vi.fn(),
  getFeaturedProjects: vi.fn(),
  getProject: vi.fn(),
}))

describe('API utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock fetch globally
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('formatProjectDate', () => {
    it('should format valid ISO date strings correctly', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const formatted = formatProjectDate(dateString)
      expect(formatted).toBe('January 15, 2024')
    })

    it('should handle invalid date strings gracefully', () => {
      const invalidDate = 'invalid-date'
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = formatProjectDate(invalidDate)
      expect(result).toBe(invalidDate)
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date format', expect.any(Error))
    })

    it('should handle empty strings', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = formatProjectDate('')
      expect(result).toBe('')
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('fetchProjects', () => {
    const mockProjects: Project[] = [
      createMockProject({ 
        id: '1', 
        title: 'React Dashboard', 
        category: 'Analytics',
        technologies: ['React', 'TypeScript'],
        tags: ['dashboard', 'analytics'],
        featured: true
      }),
      createMockProject({ 
        id: '2', 
        title: 'Vue Components', 
        category: 'UI/UX',
        technologies: ['Vue', 'JavaScript'],
        tags: ['components', 'ui'],
        featured: false
      }),
      createMockProject({ 
        id: '3', 
        title: 'Angular Service', 
        category: 'Backend',
        technologies: ['Angular', 'Node.js'],
        tags: ['service', 'api'],
        featured: true
      }),
    ]

    beforeEach(async () => {
      const { getProjects } = await import('@/lib/content/projects')
      vi.mocked(getProjects).mockResolvedValue(mockProjects)
    })

    it('should fetch all projects when no filters provided', async () => {
      const projects = await fetchProjects()
      expect(projects).toEqual(mockProjects)
      expect(projects).toHaveLength(3)
    })

    it('should filter projects by category', async () => {
      const projects = await fetchProjects({ category: 'Analytics' })
      expect(projects).toHaveLength(1)
      expect(projects[0]?.title).toBe('React Dashboard')
    })

    it('should filter projects by technology', async () => {
      const projects = await fetchProjects({ technology: 'React' })
      expect(projects).toHaveLength(1)
      expect(projects[0]?.title).toBe('React Dashboard')
    })

    it('should filter projects by tag', async () => {
      const projects = await fetchProjects({ technology: 'dashboard' })
      expect(projects).toHaveLength(1)
      expect(projects[0]?.title).toBe('React Dashboard')
    })

    it('should filter featured projects', async () => {
      const projects = await fetchProjects({ featured: true })
      expect(projects).toHaveLength(2)
      expect(projects.every(p => p.featured)).toBe(true)
    })

    it('should filter non-featured projects', async () => {
      const projects = await fetchProjects({ featured: false })
      expect(projects).toHaveLength(1)
      expect(projects[0]?.title).toBe('Vue Components')
    })

    it('should search projects by title', async () => {
      const projects = await fetchProjects({ search: 'React' })
      expect(projects).toHaveLength(1)
      expect(projects[0]?.title).toBe('React Dashboard')
    })

    it('should search projects by description', async () => {
      const projects = await fetchProjects({ search: 'test project' })
      expect(projects).toHaveLength(3) // All mock projects have "test project" in description
    })

    it('should perform case-insensitive search', async () => {
      const projects = await fetchProjects({ search: 'REACT' })
      expect(projects).toHaveLength(1)
      expect(projects[0]?.title).toBe('React Dashboard')
    })

    it('should combine multiple filters', async () => {
      const projects = await fetchProjects({ 
        category: 'Analytics', 
        featured: true 
      })
      expect(projects).toHaveLength(1)
      expect(projects[0]?.title).toBe('React Dashboard')
    })

    it('should return empty array when no projects match filters', async () => {
      const projects = await fetchProjects({ category: 'NonExistent' })
      expect(projects).toHaveLength(0)
    })
  })

  describe('fetchFeaturedProjects', () => {
    it('should fetch featured projects', async () => {
      const mockFeaturedProjects = [
        createMockProject({ featured: true }),
        createMockProject({ featured: true }),
      ]

      const { getFeaturedProjects } = await import('@/lib/content/projects')
      vi.mocked(getFeaturedProjects).mockResolvedValue(mockFeaturedProjects)

      const projects = await fetchFeaturedProjects()
      expect(projects).toEqual(mockFeaturedProjects)
      expect(projects).toHaveLength(2)
      expect(getFeaturedProjects).toHaveBeenCalledOnce()
    })
  })

  describe('fetchProjectById', () => {
    it('should fetch project by slug', async () => {
      const mockProject = createMockProject({ slug: 'test-project' })
      
      const { getProject } = await import('@/lib/content/projects')
      vi.mocked(getProject).mockResolvedValue(mockProject)

      const project = await fetchProjectById('test-project')
      expect(project).toEqual(mockProject)
      expect(getProject).toHaveBeenCalledWith('test-project')
    })

    it('should throw error when project not found', async () => {
      const { getProject } = await import('@/lib/content/projects')
      vi.mocked(getProject).mockResolvedValue(null)

      await expect(fetchProjectById('non-existent')).rejects.toThrow(
        'Project with slug "non-existent" not found'
      )
    })
  })

  describe('sendContactForm', () => {
    const mockFormData: ContactFormData = createMockContactForm()
    const mockResponse: ContactApiResponse = createMockApiResponse('Message sent successfully')

    it('should send contact form successfully', async () => {
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await sendContactForm(mockFormData)

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      })
    })

    it('should handle API errors correctly', async () => {
      const errorResponse = { message: 'Server error' }
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve(errorResponse),
      } as Response)

      await expect(sendContactForm(mockFormData)).rejects.toThrow('Server error')
    })

    it('should handle network errors', async () => {
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(sendContactForm(mockFormData)).rejects.toThrow('Network error')
    })

    it('should handle response without JSON error message', async () => {
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.reject(new Error('Invalid JSON')),
      } as Response)

      await expect(sendContactForm(mockFormData)).rejects.toThrow('Bad Request')
    })
  })
})