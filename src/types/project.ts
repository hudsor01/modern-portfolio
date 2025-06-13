/**
 * Comprehensive Project Types
 * Contains all project-related interfaces consolidated from across the application
 */

/**
 * Main Project interface representing a portfolio project
 */
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  featured: boolean;
  image?: string;
  link?: string;
  github?: string;
  category: string;
  tags?: string[];
  createdAt: Date;
  updatedAt?: Date;
  longDescription?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  date?: string | Date;
  client?: string;
  role?: string;
  testimonial?: Testimonial;
  gallery?: ProjectImage[];
  metrics?: Record<string, string>;
  details?: {
    challenge: string;
    solution: string;
    impact: string;
  };
  charts?: Array<{
    type: 'line' | 'bar' | 'pie' | 'funnel' | 'heatmap';
    title: string;
    dataKey: string;
  }>;
}

/**
 * Project image for gallery displays
 */
export interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
}

/**
 * Project testimonial from clients
 */
export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
}

/**
 * Project filter for category filtering
 */
export interface ProjectFilter {
  category: string;
  count: number;
}

/**
 * Project filter options for UI filtering
 */
export interface ProjectFilterOptions {
  category?: string;
  technology?: string;
  featured?: boolean;
  search?: string;
}

/**
 * Project API response format
 */
export interface ProjectsResponse {
  projects: Project[];
  filters: ProjectFilter[];
  total?: number;
}

/**
 * Project data with required image
 */
export interface ProjectData extends Project {
  image: string;
}

/**
 * Project tabs component props
 */
export interface ProjectTabsProps {
  projects: Project[];
}

/**
 * Project result from filtering
 */
export interface ProjectsResult {
  projects: Project[];
  total: number;
  filter: ProjectFilterOptions;
}

/**
 * Project page props for Next.js pages
 */
export interface ProjectPageProps {
  params: {
    slug: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * Chart data for project visualizations
 */
export interface ChartData {
  name: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
}

/**
 * Chart event handler for interactive charts
 */
export interface ChartEventHandler {
  dataIndex: number;
  dataKey?: string;
  value?: number;
  name?: string;
  color?: string;
}
