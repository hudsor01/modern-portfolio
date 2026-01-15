/**
 * Project Data Validation Schema
 * Ensures data integrity and type safety for all project data
 */

import { z } from 'zod'

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
  link: z.url().optional(),
  github: z.url().optional(),

  // Categorization & Metadata (category required per Prisma schema)
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
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
  testimonial: z
    .object({
      quote: z.string(),
      author: z.string(),
      role: z.string().optional(),
      company: z.string().optional(),
      avatar: z.string().optional(),
    })
    .optional(),
  gallery: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    )
    .optional(),
  metrics: z.record(z.string(), z.string()).optional(),
  details: z
    .object({
      challenge: z.string(),
      solution: z.string(),
      impact: z.string(),
    })
    .optional(),
  charts: z
    .array(
      z.object({
        type: z.enum(['line', 'bar', 'pie', 'funnel', 'heatmap']),
        title: z.string(),
        dataKey: z.string(),
      })
    )
    .optional(),
})

// Required project schema for API responses
export const RequiredProjectSchema = ProjectSchema.extend({
  image: z.string().min(1, 'Image is required for display'),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
})

// Project filter schema
export const ProjectFilterSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Project response schema
export const ProjectsResponseSchema = z.object({
  projects: z.array(ProjectSchema),
  filters: z.array(
    z.object({
      category: z.string(),
      count: z.number(),
    })
  ),
  total: z.number().optional(),
})

// Export inferred types
export type ValidatedProject = z.infer<typeof ProjectSchema>
export type ValidatedRequiredProject = z.infer<typeof RequiredProjectSchema>
export type ValidatedProjectFilter = z.infer<typeof ProjectFilterSchema>
export type ValidatedProjectsResponse = z.infer<typeof ProjectsResponseSchema>

// Data transformation helpers
export function normalizeProjectDates(project: ValidatedProject): ValidatedProject {
  return {
    ...project,
    createdAt: normalizeDate(project.createdAt),
    updatedAt: normalizeDate(project.updatedAt),
    date: normalizeDate(project.date),
  }
}

export function ensureProjectSlug(project: ValidatedProject): ValidatedProject {
  return {
    ...project,
    slug: project.slug || project.id,
  }
}

export function sanitizeProjectForAPI(project: ValidatedProject): ValidatedProject {
  const sanitized = normalizeProjectDates(project)
  return ensureProjectSlug(sanitized)
}

function normalizeDate(value?: string | Date): Date | undefined {
  if (value instanceof Date) return value
  if (!value) return undefined
  return new Date(value)
}
