/**
 * API Types
 * Contains all API-related interfaces consolidated from across the application
 */

/**
 * Base API response interface
 */
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Contact form data for submissions
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
}

/**
 * Contact API response with submission details
 */
export interface ContactApiResponse extends ApiResponse {
  data?: {
    id: string;
    createdAt: string;
  };
}

/**
 * Newsletter subscription data
 */
export interface NewsletterSubscriptionData {
  email: string;
  name?: string;
}

/**
 * Newsletter API response
 */
export interface NewsletterApiResponse extends ApiResponse {
  data?: {
    id: string;
    createdAt: string;
  };
}

/**
 * Project API response
 */
export interface ProjectApiResponse extends ApiResponse {
  data?: {
    projects: ProjectData[];
  };
}

// Import from shared-api for consistency
interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Search API response
 */
export interface SearchApiResponse extends ApiResponse {
  data?: {
    results: SearchResult[];
    totalResults: number;
  };
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'project' | 'page' | 'blog' | 'content';
  relevance: number;
  createdAt: string;
}

/**
 * SEO-related types
 */
export interface SEOScore {
  title: number;
  description: number;
  keywords: number;
  content: number;
  overall: number;
}

export interface SEOSuggestion {
  type: 'title' | 'description' | 'keywords' | 'content';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface KeywordRanking {
  keyword: string;
  position: number;
  change: number;
  volume: number;
  difficulty: number;
}

/**
 * Web Vitals API data
 */
export interface WebVitalsData {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
  pathname: string;
}