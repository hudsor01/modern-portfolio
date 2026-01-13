/**
 * Unit tests for validation schemas
 */
import { describe, it, expect } from 'vitest'
import {
  ProjectSchema,
  validateProject,
  safeValidateProject,
  normalizeProjectDates,
  ensureProjectSlug,
  sanitizeProjectForAPI,
  validateProjectFilter,
  ProjectFilterSchema,
} from '../validations/project-schema'

describe('project-schema', () => {
  describe('ProjectSchema', () => {
    it('should validate valid project data', () => {
      const validProject = {
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'This is a description of my project.',
        image: 'https://example.com/image.jpg',
        category: 'Web Development',
        tags: ['react', 'typescript'],
        featured: true,
      }
      const result = ProjectSchema.safeParse(validProject)
      expect(result.success).toBe(true)
    })

    it('should reject missing required fields', () => {
      const invalidProject = {
        id: 'proj-123',
        // missing title, slug, description, image, category
      }
      const result = ProjectSchema.safeParse(invalidProject)
      expect(result.success).toBe(false)
    })

    it('should reject empty title', () => {
      const result = ProjectSchema.safeParse({
        id: 'proj-123',
        title: '',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
      })
      expect(result.success).toBe(false)
    })

    it('should accept optional fields', () => {
      const projectWithOptionals = {
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
        content: 'Full content here...',
        longDescription: 'Long description...',
        link: 'https://example.com',
        github: 'https://github.com/user/repo',
        client: 'Acme Corp',
        role: 'Lead Developer',
        viewCount: 100,
        clickCount: 50,
      }
      const result = ProjectSchema.safeParse(projectWithOptionals)
      expect(result.success).toBe(true)
    })

    it('should handle testimonial object', () => {
      const projectWithTestimonial = {
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
        testimonial: {
          quote: 'Great work!',
          author: 'John Doe',
          role: 'CEO',
          company: 'Acme',
          avatar: 'https://example.com/avatar.jpg',
        },
      }
      const result = ProjectSchema.safeParse(projectWithTestimonial)
      expect(result.success).toBe(true)
    })
  })

  describe('validateProject', () => {
    it('should return validated project on success', () => {
      const project = {
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
      }
      const result = validateProject(project)
      expect(result.id).toBe('proj-123')
      expect(result.title).toBe('My Project')
    })

    it('should throw on invalid data', () => {
      expect(() => validateProject({})).toThrow()
    })
  })

  describe('safeValidateProject', () => {
    it('should return success for valid project', () => {
      const result = safeValidateProject({
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
      })
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should return error for invalid project', () => {
      const result = safeValidateProject({})
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('normalizeProjectDates', () => {
    it('should convert string dates to Date objects', () => {
      const project = {
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-06-01T00:00:00Z',
      } as Parameters<typeof normalizeProjectDates>[0]
      const result = normalizeProjectDates(project)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('should preserve Date objects', () => {
      const date = new Date('2024-01-01')
      const project = {
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
        createdAt: date,
      } as Parameters<typeof normalizeProjectDates>[0]
      const result = normalizeProjectDates(project)
      expect(result.createdAt).toBe(date)
    })
  })

  describe('ensureProjectSlug', () => {
    it('should keep existing slug', () => {
      const project = {
        id: 'proj-123',
        title: 'My Project',
        slug: 'my-project',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
      } as Parameters<typeof ensureProjectSlug>[0]
      const result = ensureProjectSlug(project)
      expect(result.slug).toBe('my-project')
    })

    it('should use id as slug when slug is missing', () => {
      const project = {
        id: 'proj-123',
        title: 'My Project',
        slug: '',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
      } as unknown as Parameters<typeof ensureProjectSlug>[0]
      const result = ensureProjectSlug(project)
      expect(result.slug).toBe('proj-123')
    })
  })

  describe('sanitizeProjectForAPI', () => {
    it('should normalize dates and ensure slug', () => {
      const project = {
        id: 'proj-123',
        title: 'My Project',
        slug: '',
        description: 'A description.',
        image: 'https://example.com/image.jpg',
        category: 'Web',
        createdAt: '2024-01-01T00:00:00Z',
      } as Parameters<typeof sanitizeProjectForAPI>[0]
      const result = sanitizeProjectForAPI(project)
      expect(result.slug).toBe('proj-123')
      expect(result.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('ProjectFilterSchema', () => {
    it('should validate filter options', () => {
      const filter = {
        category: 'Web Development',
        technology: 'React',
        featured: true,
        search: 'project',
        tags: ['react', 'typescript'],
      }
      const result = ProjectFilterSchema.safeParse(filter)
      expect(result.success).toBe(true)
    })

    it('should accept empty filter', () => {
      const result = ProjectFilterSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })

  describe('validateProjectFilter', () => {
    it('should return validated filter', () => {
      const filter = { category: 'Web' }
      const result = validateProjectFilter(filter)
      expect(result.category).toBe('Web')
    })
  })
})