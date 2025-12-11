/**
 * Project Data Validation Schema
 * Ensures data integrity and type safety for all project data
 */

import { z } from 'zod';

// Base project schema with all possible fields
export const ProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Project title is required'),
  slug: z.string().min(1, 'Slug is required'), // Required per Prisma schema
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().optional(),
  longDescription: z.string().optional(),

  // Media & URLs (image required per Prisma schema)
  image: z.string().min(1, 'Image is required'),
  link: z.string().url().optional(),
  github: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),

  // Categorization & Metadata (category required per Prisma schema)
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),

  // Analytics (per Prisma schema)
  viewCount: z.number().default(0),
  clickCount: z.number().default(0),

  // Dates - flexible to handle both string and Date objects
  date: z.union([z.string(), z.date()]).optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),

  // Project Details
  client: z.string().optional(),
  role: z.string().optional(),
  testimonial: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    avatar: z.string().optional(),
  }).optional(),
  gallery: z.array(z.object({
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })).optional(),
  metrics: z.record(z.string(), z.string()).optional(),
  details: z.object({
    challenge: z.string(),
    solution: z.string(),
    impact: z.string(),
  }).optional(),
  charts: z.array(z.object({
    type: z.enum(['line', 'bar', 'pie', 'funnel', 'heatmap']),
    title: z.string(),
    dataKey: z.string(),
  })).optional(),
});

// Required project schema for API responses
export const RequiredProjectSchema = ProjectSchema.extend({
  image: z.string().min(1, 'Image is required for display'),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

// Project filter schema
export const ProjectFilterSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Project response schema
export const ProjectsResponseSchema = z.object({
  projects: z.array(ProjectSchema),
  filters: z.array(z.object({
    category: z.string(),
    count: z.number(),
  })),
  total: z.number().optional(),
});

// Export inferred types
export type ValidatedProject = z.infer<typeof ProjectSchema>;
export type ValidatedRequiredProject = z.infer<typeof RequiredProjectSchema>;
export type ValidatedProjectFilter = z.infer<typeof ProjectFilterSchema>;
export type ValidatedProjectsResponse = z.infer<typeof ProjectsResponseSchema>;

// Validation helper functions
export function validateProject(data: unknown): ValidatedProject {
  return ProjectSchema.parse(data);
}

export function validateRequiredProject(data: unknown): ValidatedRequiredProject {
  return RequiredProjectSchema.parse(data);
}

export function validateProjectFilter(data: unknown): ValidatedProjectFilter {
  return ProjectFilterSchema.parse(data);
}

export function validateProjectsResponse(data: unknown): ValidatedProjectsResponse {
  return ProjectsResponseSchema.parse(data);
}

// Safe validation functions that return success/error
export function safeValidateProject(data: unknown): {
  success: boolean;
  data?: ValidatedProject;
  error?: z.ZodError;
} {
  const result = ProjectSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    error: result.success ? undefined : result.error,
  };
}

export function safeValidateProjectsArray(data: unknown[]): {
  success: boolean;
  data: ValidatedProject[];
  errors: Array<{ index: number; error: z.ZodError }>;
} {
  const validatedProjects: ValidatedProject[] = [];
  const errors: Array<{ index: number; error: z.ZodError }> = [];

  data.forEach((item, index) => {
    const result = safeValidateProject(item);
    if (result.success && result.data) {
      validatedProjects.push(result.data);
    } else if (result.error) {
      errors.push({ index, error: result.error });
    }
  });

  return {
    success: errors.length === 0,
    data: validatedProjects,
    errors,
  };
}

// Data transformation helpers
export function normalizeProjectDates(project: ValidatedProject): ValidatedProject {
  return {
    ...project,
    createdAt: project.createdAt instanceof Date 
      ? project.createdAt 
      : project.createdAt 
        ? new Date(project.createdAt) 
        : undefined,
    updatedAt: project.updatedAt instanceof Date 
      ? project.updatedAt 
      : project.updatedAt 
        ? new Date(project.updatedAt) 
        : undefined,
    date: project.date instanceof Date 
      ? project.date 
      : project.date 
        ? new Date(project.date) 
        : undefined,
  };
}

export function ensureProjectSlug(project: ValidatedProject): ValidatedProject {
  return {
    ...project,
    slug: project.slug || project.id,
  };
}

export function sanitizeProjectForAPI(project: ValidatedProject): ValidatedProject {
  const sanitized = normalizeProjectDates(project);
  return ensureProjectSlug(sanitized);
}