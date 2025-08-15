/**
 * Project Data - Re-exports from centralized data manager
 * This file maintains backward compatibility while using the new data architecture
 */

// Re-export everything from the centralized data manager
export {
  getProjects,
  getProjectsWithFilters,
  getProjectBySlug,
  getProject,
  getProjectById,
  projects,
  ProjectDataManager
} from '@/lib/data/project-data-manager';

// Export types for backward compatibility
export type {
  Project,
  ProjectsResponse,
  ProjectFilter,
  ProjectData
} from '@/types/project';