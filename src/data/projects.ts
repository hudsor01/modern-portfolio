/**
 * Project Data - Server-side data exports  
 * This file maintains backward compatibility while using secure server-side architecture
 */

// Note: This file now provides server-side only access
// For client-side usage, use the API hooks from @/hooks/use-projects-api

import { ProjectDataManager } from '@/lib/server/project-data-manager'

// Server-side functions (not accessible from client)
export const getProjects = () => ProjectDataManager.getProjects()
export const getProjectsWithFilters = () => ProjectDataManager.getProjectsWithFilters()
export const getProjectBySlug = (slug: string) => ProjectDataManager.getProjectBySlug(slug)
export const getProject = getProjectBySlug // Alias for backward compatibility
export const getProjectById = getProjectBySlug // Alias for backward compatibility

// Export the class for server-side usage
export { ProjectDataManager }

// Export types for backward compatibility
export type {
  Project,
  ProjectsResponse,
  ProjectFilter,
  ProjectData
} from '@/types/project';