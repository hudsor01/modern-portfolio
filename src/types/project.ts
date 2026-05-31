/**
 * Project types — model row type comes from the Drizzle schema.
 */

import type { Project } from '@/db/schema'

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
