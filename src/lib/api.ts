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

// Import types from centralized shared API types
import type { 
  ContactFormData, 
  ContactApiResponse,
  BlogPostData,
  BlogCategoryData,
  BlogTagData,
  BlogAnalyticsData,
  RSSFeedData,
  PaginatedResponse,
  BlogPostFilters,
  BlogPostSort,
  ApiResponse
} from '@/types/shared-api';

export const sendContactForm = async (formData: ContactFormData): Promise<ContactApiResponse> => {
  return fetchData<ContactApiResponse>('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
}

/**
 * Blog API Functions
 * Integrated with existing API patterns and TanStack Query
 */

// Fetch blog posts with filtering and pagination
export const fetchBlogPosts = async (params?: {
  filters?: BlogPostFilters;
  sort?: BlogPostSort;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<BlogPostData>> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  if (params?.filters) {
    const { filters } = params;
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      searchParams.append('status', statuses.join(','));
    }
    if (filters.authorId) searchParams.append('authorId', filters.authorId);
    if (filters.categoryId) searchParams.append('categoryId', filters.categoryId);
    if (filters.tagIds) searchParams.append('tagIds', filters.tagIds.join(','));
    if (filters.search) searchParams.append('search', filters.search);
    if (filters.published !== undefined) searchParams.append('published', filters.published.toString());
    if (filters.dateRange) {
      searchParams.append('dateFrom', filters.dateRange.from);
      searchParams.append('dateTo', filters.dateRange.to);
    }
  }
  
  if (params?.sort) {
    searchParams.append('sortBy', params.sort.field);
    searchParams.append('sortOrder', params.sort.order);
  }
  
  const url = `/blog${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  return fetchData<PaginatedResponse<BlogPostData>>(url);
};

// Fetch single blog post by slug
export const fetchBlogPost = async (slug: string): Promise<BlogPostData> => {
  const response = await fetchData<ApiResponse<BlogPostData>>(`/blog/${slug}`);
  return response.data;
};

// Create new blog post
export const createBlogPost = async (postData: Partial<BlogPostData>): Promise<BlogPostData> => {
  const response = await fetchData<ApiResponse<BlogPostData>>('/blog', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
  return response.data;
};

// Update existing blog post
export const updateBlogPost = async (slug: string, postData: Partial<BlogPostData>): Promise<BlogPostData> => {
  const response = await fetchData<ApiResponse<BlogPostData>>(`/blog/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
  return response.data;
};

// Delete blog post
export const deleteBlogPost = async (slug: string): Promise<{ success: boolean }> => {
  const response = await fetchData<ApiResponse<{ success: boolean }>>(`/blog/${slug}`, {
    method: 'DELETE',
  });
  return response.data;
};

// Fetch blog categories
export const fetchBlogCategories = async (): Promise<BlogCategoryData[]> => {
  const response = await fetchData<ApiResponse<BlogCategoryData[]>>('/blog/categories');
  return response.data;
};

// Create blog category
export const createBlogCategory = async (categoryData: Partial<BlogCategoryData>): Promise<BlogCategoryData> => {
  const response = await fetchData<ApiResponse<BlogCategoryData>>('/blog/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
  return response.data;
};

// Fetch blog tags with optional filtering
export const fetchBlogTags = async (params?: {
  search?: string;
  popular?: boolean;
  limit?: number;
}): Promise<BlogTagData[]> => {
  const searchParams = new URLSearchParams();
  
  if (params?.search) searchParams.append('search', params.search);
  if (params?.popular) searchParams.append('popular', params.popular.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const url = `/blog/tags${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await fetchData<ApiResponse<BlogTagData[]>>(url);
  return response.data;
};

// Create blog tag
export const createBlogTag = async (tagData: Partial<BlogTagData>): Promise<BlogTagData> => {
  const response = await fetchData<ApiResponse<BlogTagData>>('/blog/tags', {
    method: 'POST',
    body: JSON.stringify(tagData),
  });
  return response.data;
};

// Fetch blog analytics
export const fetchBlogAnalytics = async (params?: {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  details?: boolean;
}): Promise<BlogAnalyticsData> => {
  const searchParams = new URLSearchParams();
  
  if (params?.timeRange) searchParams.append('timeRange', params.timeRange);
  if (params?.details) searchParams.append('details', params.details.toString());
  
  const url = `/blog/analytics${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await fetchData<ApiResponse<BlogAnalyticsData>>(url);
  return response.data;
};

// Fetch RSS feed
export const fetchRSSFeed = async (params?: {
  format?: 'json' | 'xml';
  limit?: number;
}): Promise<RSSFeedData | string> => {
  const searchParams = new URLSearchParams();
  
  if (params?.format) searchParams.append('format', params.format);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const url = `/blog/rss${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  
  if (params?.format === 'xml') {
    // Return raw XML string
    const response = await fetch(`${API_BASE_URL}${url}`);
    if (!response.ok) {
      throw new Error(`RSS Feed Error: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }
  
  // Return JSON format
  const response = await fetchData<ApiResponse<RSSFeedData>>(url);
  return response.data;
};

// Removed 'export default api' as 'api' is now a local constant
// and not intended to be exported directly in this manner.
// The functions (fetchProjects, sendContactForm, fetchBlogPosts, etc.) are the intended public API of this module.
