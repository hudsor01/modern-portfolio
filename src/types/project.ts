/**
 * Project types - Unique types not provided by Prisma
 * For Project model type, import directly from @/generated/prisma/client
 */

import type { Project } from '@/generated/prisma/client'

// Re-export Prisma Project for convenience
export type { Project }

// ============================================================================
// DISPLAY/UI TYPES - Not in Prisma schema
// ============================================================================

/**
 * Display metric for project cards and detail pages
 * Uses iconName string instead of React component for DB storage
 */
export interface DisplayMetric {
  label: string
  value: string
  iconName: string // e.g., 'dollar-sign', 'trending-up', 'target', 'clock', 'zap', 'award'
}

/**
 * Result metric showing before/after comparison
 */
export interface ResultMetric {
  metric: string
  before: string
  after: string
  improvement: string
}

/**
 * Project image for gallery displays
 */
export interface ProjectImage {
  url: string
  alt: string
  caption?: string
}

/**
 * Project testimonial from clients
 */
export interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
}

/**
 * STAR format metric data for project achievements
 * NOTE: STAR data is for case study/copy generation only - not for UI display
 */
export interface STARMetric {
  phase: string
  impact: number
  efficiency: number
  value: number
}

/**
 * STAR format data (Situation, Task, Action, Result)
 * NOTE: STAR data is for case study/copy generation only - not for UI display
 */
export interface STARData {
  situation: STARMetric
  task: STARMetric
  action: STARMetric
  result: STARMetric
}

// ============================================================================
// API/QUERY TYPES - Not in Prisma schema
// ============================================================================

/**
 * Project filter for category filtering
 */
export interface ProjectFilter {
  category: string
  count: number
}

/**
 * Project filter options for UI filtering
 */
export interface ProjectFilterOptions {
  category?: string
  technology?: string
  featured?: boolean
  search?: string
}

/**
 * Project API response format
 */
export interface ProjectsResponse {
  projects: Project[]
  filters: ProjectFilter[]
  total?: number
}

/**
 * Project result from filtering
 */
export interface ProjectsResult {
  projects: Project[]
  total: number
  filter: ProjectFilterOptions
}

/**
 * Project page props for Next.js pages
 */
export interface ProjectPageProps {
  params: {
    slug: string
  }
  searchParams?: Record<string, string | string[] | undefined>
}

/**
 * Project tabs component props
 */
export interface ProjectTabsProps {
  projects: Project[]
}

// ============================================================================
// RUNTIME VALIDATION & TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if an object is a valid Project
 */
export function isProject(obj: unknown): obj is Project {
  if (!obj || typeof obj !== 'object') return false

  const project = obj as Record<string, unknown>

  // Required fields validation
  if (typeof project.id !== 'string') return false
  if (typeof project.title !== 'string') return false
  if (typeof project.slug !== 'string') return false
  if (typeof project.description !== 'string') return false
  if (typeof project.image !== 'string') return false
  if (typeof project.category !== 'string') return false
  if (!Array.isArray(project.tags)) return false
  if (!project.tags.every((tag: unknown) => typeof tag === 'string')) return false
  if (typeof project.featured !== 'boolean') return false
  if (typeof project.viewCount !== 'number') return false
  if (typeof project.clickCount !== 'number') return false
  if (project.createdAt === undefined || project.createdAt === null) return false
  if (project.updatedAt === undefined || project.updatedAt === null) return false

  // Optional fields validation
  if (project.link !== undefined && typeof project.link !== 'string' && project.link !== null)
    return false
  if (project.github !== undefined && typeof project.github !== 'string' && project.github !== null)
    return false

  return true
}

/**
 * Validates critical Project fields at runtime
 * Throws detailed errors for invalid data
 */
export function validateProject(project: unknown): asserts project is Project {
  if (!isProject(project)) {
    const errors: string[] = []

    if (!project || typeof project !== 'object') {
      errors.push('Project must be an object')
    } else {
      const p = project as Record<string, unknown>

      if (typeof p.id !== 'string') errors.push('id must be a string')
      if (typeof p.title !== 'string') errors.push('title must be a string')
      if (typeof p.slug !== 'string') errors.push('slug must be a string')
      if (typeof p.description !== 'string') errors.push('description must be a string')
      if (typeof p.image !== 'string') errors.push('image must be a string')
      if (typeof p.category !== 'string') errors.push('category must be a string')
      if (!Array.isArray(p.tags)) {
        errors.push('tags must be an array')
      } else if (!p.tags.every((tag: unknown) => typeof tag === 'string')) {
        errors.push('all tags must be strings')
      }
      if (typeof p.featured !== 'boolean') errors.push('featured must be a boolean')
      if (typeof p.viewCount !== 'number') errors.push('viewCount must be a number')
      if (typeof p.clickCount !== 'number') errors.push('clickCount must be a number')
      if (p.createdAt === undefined || p.createdAt === null) errors.push('createdAt is required')
      if (p.updatedAt === undefined || p.updatedAt === null) errors.push('updatedAt is required')

      if (
        p.link !== undefined &&
        p.link !== null &&
        typeof p.link !== 'string'
      )
        errors.push('link must be a string if provided')
      if (
        p.github !== undefined &&
        p.github !== null &&
        typeof p.github !== 'string'
      )
        errors.push('github must be a string if provided')
    }

    throw new Error(`Invalid Project data: ${errors.join(', ')}`)
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely extracts project URLs with validation
 */
export function getProjectUrls(project: Project): { liveUrl?: string; githubUrl?: string } {
  return {
    liveUrl: project.link ?? undefined,
    githubUrl: project.github ?? undefined,
  }
}

/**
 * Safely extracts project technologies/tags
 */
export function getProjectTechnologies(project: Project): string[] {
  return project.tags || []
}

/**
 * Normalized project type for display components
 * Includes additional computed properties for UI rendering
 */
export type NormalizedProject = Project & {
  liveUrl?: string
  githubUrl?: string
  technologies: string[]
}

/**
 * Creates a display-ready project object with normalized fields
 */
export function normalizeProjectForDisplay(project: Project): NormalizedProject {
  const urls = getProjectUrls(project)
  const technologies = getProjectTechnologies(project)

  return {
    ...project,
    ...urls,
    technologies,
  }
}
