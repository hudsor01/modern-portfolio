// API Response Types
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Contact Form API Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
}

export interface ContactApiResponse extends ApiResponse {
  data?: {
    id: string;
    createdAt: string;
  };
}

// Newsletter API Types
export interface NewsletterSubscriptionData {
  email: string;
  name?: string;
}

export interface NewsletterApiResponse extends ApiResponse {
  data?: {
    id: string;
    createdAt: string;
  };
}

import type { Project } from '@/types/project';

// Project API Types
export interface ProjectApiResponse extends ApiResponse {
  data?: {
    projects: Project[];
  };
}

// Search API Types
export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  // Add other common search result fields as needed
}

export interface SearchApiResponse extends ApiResponse {
  data?: {
    results: SearchResultItem[];
    totalResults: number;
  };
}
