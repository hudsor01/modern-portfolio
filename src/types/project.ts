/**
 * Project types — model row type comes from the Drizzle schema.
 */

import type { Project } from '@/db/schema'

export type { Project }

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely extracts project URLs with validation
 */
function getProjectUrls(project: Project): { liveUrl?: string; githubUrl?: string } {
  return {
    liveUrl: project.link ?? undefined,
    githubUrl: project.github ?? undefined,
  }
}

/**
 * Safely extracts project technologies/tags
 */
function getProjectTechnologies(project: Project): string[] {
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
