'use client'

import { useState, useCallback, useMemo } from 'react'
import { ShadcnSkeletonWrapper } from '@/components/ui/shadcn-skeleton-wrapper'
import { useProjects, usePrefetchProjects } from '@/hooks/use-api-queries'
import { useSharedState } from '@/hooks/use-component-consolidation-queries'
import type { Project } from '@/types/project'

interface ProjectsContainerProps {
  // Container configuration
  variant?: 'grid' | 'list' | 'carousel'
  enablePrefetch?: boolean
  enableFiltering?: boolean
  
  // Layout configuration
  itemsPerPage?: number
  showLoadMore?: boolean
  className?: string
  
  // Filter options
  categoryFilter?: string
  sortBy?: 'date' | 'name' | 'featured'
  sortOrder?: 'asc' | 'desc'
  
  // Event handlers
  onProjectSelect?: (project: Project) => void
  onFilterChange?: (filters: ProjectFilters) => void
  
  // Presentation component
  children: (props: ProjectsContainerRenderProps) => React.ReactNode
}

interface ProjectFilters {
  category?: string
  sortBy: 'date' | 'name' | 'featured'
  sortOrder: 'asc' | 'desc'
  search?: string
}

interface ProjectsContainerRenderProps {
  // Data
  projects: Project[]
  filteredProjects: Project[]
  
  // State
  isLoading: boolean
  isError: boolean
  error: Error | null
  
  // Pagination
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  
  // Filters
  filters: ProjectFilters
  setFilters: (filters: Partial<ProjectFilters>) => void
  
  // Actions
  loadMore: () => void
  refetch: () => void
  prefetchProject: (slug: string) => void
  
  // Selection
  selectedProject: Project | null
  selectProject: (project: Project | null) => void
}

export function ProjectsContainer({
  enablePrefetch = true,
  itemsPerPage = 6,
  showLoadMore = true,
  className,
  categoryFilter,
  sortBy = 'date',
  sortOrder = 'desc',
  onProjectSelect,
  onFilterChange,
  children,
}: ProjectsContainerProps) {
  
  // Local state
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  // Shared state for cross-component synchronization
  const { data: filters, updateData: setFilters } = useSharedState<ProjectFilters>(
    'project-filters',
    {
      category: categoryFilter,
      sortBy,
      sortOrder,
    },
    { persist: true, sync: true }
  )

  // Business logic hooks
  const projectsQuery = useProjects({
    prefetchRelated: enablePrefetch,
    suspense: false,
  })

  const prefetchProject = usePrefetchProjects()

  // Container logic - filter and sort projects
  const filteredProjects = useMemo(() => {
    if (!projectsQuery.data) return []
    
    let result = [...(Array.isArray(projectsQuery.data) ? projectsQuery.data : [])]
    
    // Apply category filter
    if (filters?.category && filters.category !== 'all') {
      result = result.filter(project => 
        project.category?.toLowerCase() === filters.category?.toLowerCase()
      )
    }
    
    // Apply search filter (if we add search functionality)
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      switch (filters?.sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title)
          break
        case 'featured':
          comparison = (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
          break
        case 'date':
        default:
          comparison = new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          break
      }
      
      return filters?.sortOrder === 'asc' ? comparison : -comparison
    })
    
    return result
  }, [projectsQuery.data, filters])

  // Container logic - pagination
  const paginatedProjects = useMemo(() => {
    if (!showLoadMore) {
      return filteredProjects.slice(0, currentPage * itemsPerPage)
    }
    return filteredProjects.slice(0, currentPage * itemsPerPage)
  }, [filteredProjects, currentPage, itemsPerPage, showLoadMore])

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const hasNextPage = currentPage < totalPages

  // Container logic - handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<ProjectFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setCurrentPage(1) // Reset to first page when filters change
    
    onFilterChange?.(updatedFilters)
  }, [filters, setFilters, onFilterChange])

  // Container logic - handle project selection
  const handleProjectSelect = useCallback((project: Project | null) => {
    setSelectedProject(project)
    if (project) onProjectSelect?.(project)
  }, [onProjectSelect])

  // Container logic - handle load more
  const handleLoadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1)
  }, [])

  // Container logic - handle prefetch
  const handlePrefetchProject = useCallback((slug: string) => {
    if (!enablePrefetch) return
    
    prefetchProject.prefetchOnHover('project', slug)
  }, [enablePrefetch, prefetchProject])

  // Loading state
  if (projectsQuery.isLoading) {
    return (
      <div className={className}>
        <ShadcnSkeletonWrapper
          layout="card"
          count={itemsPerPage}
          variant="default"
        />
      </div>
    )
  }

  // Error state
  if (projectsQuery.isError) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Failed to load projects
          </h3>
          <p className="text-gray-400 mb-4">
            {projectsQuery.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => projectsQuery.refetch()}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No projects state
  if (filteredProjects.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-400 mb-2">
            No projects found
          </h3>
          <p className="text-gray-400 mb-4">
            {filters?.category || filters?.search 
              ? 'Try adjusting your filters'
              : 'No projects available at the moment'
            }
          </p>
          {(filters?.category || filters?.search) && (
            <button
              onClick={() => handleFilterChange({ category: undefined, search: undefined })}
              className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    )
  }

  // Render props pattern - pass all data and functions to presentation component
  return (
    <div className={className}>
      {children({
        // Data
        projects: (projectsQuery.data || []) as Project[],
        filteredProjects,
        
        // State
        isLoading: projectsQuery.isLoading,
        isError: projectsQuery.isError,
        error: projectsQuery.error,
        
        // Pagination
        currentPage,
        totalPages,
        hasNextPage,
        
        // Filters
        filters: filters || { sortBy: 'date', sortOrder: 'desc' },
        setFilters: handleFilterChange,
        
        // Actions
        loadMore: handleLoadMore,
        refetch: projectsQuery.refetch,
        prefetchProject: handlePrefetchProject,
        
        // Selection
        selectedProject,
        selectProject: handleProjectSelect,
      })}

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-xs text-gray-400">
          <h4 className="font-semibold mb-2">Container Debug Info:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>Total Projects: {((projectsQuery.data as Project[]) || []).length}</div>
            <div>Filtered: {filteredProjects.length}</div>
            <div>Displayed: {paginatedProjects.length}</div>
            <div>Current Page: {currentPage}</div>
            <div>Total Pages: {totalPages}</div>
            <div>Has Next: {hasNextPage ? 'Yes' : 'No'}</div>
            <div>Selected: {selectedProject?.title || 'None'}</div>
            <div>Filters: {JSON.stringify(filters)}</div>
          </div>
        </div>
      )}
    </div>
  )
}