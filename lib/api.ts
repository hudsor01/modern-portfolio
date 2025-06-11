import { format, parseISO } from 'date-fns';

const API_BASE_URL = '/api'; // Assuming your API routes are served under /api

// Helper function for fetch requests
async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Import the canonical Project type
import type { Project } from '@/types/project';
import type { ProjectFilters } from '@/lib/queryKeys';

// Format dates with date-fns
export const formatProjectDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'MMMM dd, yyyy')
  } catch (error) {
    console.error('Invalid date format', error)
    return dateString
  }
}

// API functions with filtering support
export const fetchProjects = async (filters?: ProjectFilters): Promise<Project[]> => {
  // Import getProjects dynamically to avoid circular dependencies
  const { getProjects } = await import('@/lib/content/projects');
  let projects = await getProjects();
  
  // Apply client-side filtering if filters are provided
  if (filters) {
    if (filters.category) {
      projects = projects.filter(p => p.category === filters.category);
    }
    if (filters.technology) {
      projects = projects.filter(p => 
        p.technologies?.includes(filters.technology!) || 
        p.tags?.includes(filters.technology!)
      );
    }
    if (filters.featured !== undefined) {
      projects = projects.filter(p => p.featured === filters.featured);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.technologies?.some(tech => tech.toLowerCase().includes(searchTerm)) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
  }
  
  return projects;
}

export const fetchFeaturedProjects = async (): Promise<Project[]> => {
  // Import getFeaturedProjects dynamically to avoid circular dependencies
  const { getFeaturedProjects } = await import('@/lib/content/projects');
  return getFeaturedProjects();
}

export const fetchProjectById = async (slug: string): Promise<Project> => {
  // Import getProject dynamically to avoid circular dependencies
  const { getProject } = await import('@/lib/content/projects');
  const project = await getProject(slug);
  
  if (!project) {
    throw new Error(`Project with slug "${slug}" not found`);
  }
  
  return project;
}

// Import ContactFormData if not already (it might be implicitly available if this file is in the same scope or via tsconfig paths)
// For clarity, let's assume it needs to be imported if it's from a different module structure.
// However, based on the error, ContactFormData is known in contact-form.tsx, so it should be fine to use directly.
// We also need ContactApiResponse for the return type.
import type { ContactFormData, ContactApiResponse } from '@/app/api/types'; // Adjust path if necessary

export const sendContactForm = async (formData: ContactFormData): Promise<ContactApiResponse> => {
  return fetchData<ContactApiResponse>('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
}

// Removed 'export default api' as 'api' is now a local constant
// and not intended to be exported directly in this manner.
// The functions (fetchProjects, sendContactForm, etc.) are the intended public API of this module.
