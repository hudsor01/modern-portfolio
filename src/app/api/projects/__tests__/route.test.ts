import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from '../route'

// Mock the data layer
vi.mock('@/data/projects', () => ({
  getProjects: vi.fn()
}))

describe('/api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return projects successfully', async () => {
      const { getProjects } = await import('@/data/projects')
      const mockProjects = [
        { id: '1', title: 'Project 1', slug: 'project-1', description: 'Description 1' },
        { id: '2', title: 'Project 2', slug: 'project-2', description: 'Description 2' }
      ]
      vi.mocked(getProjects).mockResolvedValueOnce(mockProjects)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProjects)
    })

    it('should return empty array when no projects exist', async () => {
      const { getProjects } = await import('@/data/projects')
      vi.mocked(getProjects).mockResolvedValueOnce([])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should handle errors gracefully', async () => {
      const { getProjects } = await import('@/data/projects')
      vi.mocked(getProjects).mockRejectedValueOnce(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch projects')
    })
  })
})
