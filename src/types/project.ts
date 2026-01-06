/**
 * Unified Project Types - Consolidated from multiple type files
 * Single source of truth for all project-related interfaces
 */

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
 * Main Project interface representing a portfolio project
 * Matches Prisma schema with all fields
 */
export interface Project {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  content?: string

  // Media & URLs
  image: string
  link?: string
  github?: string
  liveUrl?: string // Alias for link
  githubUrl?: string // Alias for github

  // Categorization & Metadata
  category: string
  tags?: string[]
  technologies?: string[] // Alias for tags
  featured?: boolean

  // Project metadata
  client?: string
  role?: string
  duration?: string
  year?: number
  caseStudyUrl?: string

  // Analytics (per Prisma schema)
  viewCount: number
  clickCount: number

  // Dates
  date?: string | Date
  createdAt?: Date | string
  updatedAt?: Date | string

  // Rich content fields (stored as JSON in DB)
  impact?: string[]
  results?: ResultMetric[]
  displayMetrics?: DisplayMetric[]
  metrics?: Record<string, string>
  testimonial?: Testimonial
  gallery?: ProjectImage[]
  details?: {
    challenge: string
    solution: string
    impact: string
  }
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'funnel' | 'heatmap'
    title: string
    dataKey: string
  }>

  // STAR data - for case study/copy generation only, not UI display
  starData?: STARData
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
 * Project data with required image
 */
export interface ProjectData extends Project {
  image: string
}

/**
 * Project tabs component props
 */
export interface ProjectTabsProps {
  projects: Project[]
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

// Chart data types moved to @/types/chart for centralization

/**
 * Chart event handler for interactive charts
 */
export interface ChartEventHandler {
  dataIndex: number
  dataKey?: string
  value?: number
  name?: string
  color?: string
}
