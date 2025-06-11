/**
 * Types for project-related data
 */

/**
 * Represents a project in the portfolio
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  slug?: string;
  technologies?: string[];
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
  github?: string;
  link?: string;
  date?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  featured?: boolean;
  category?: string;
  content?: string;
}

/**
 * Project filter options
 */
export interface ProjectFilter {
  category: string;
  count: number;
}

/**
 * Sorted and filtered projects result
 */
export interface ProjectsResult {
  projects: Project[];
  total: number;
  filter: ProjectFilter;
}

export interface ProjectsResponse {
  projects: Project[];
  filters: ProjectFilter[];
}

export interface ProjectTabsProps {
  projects: Project[]
}
