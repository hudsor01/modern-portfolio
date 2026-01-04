/**
 * Prisma types re-export for client-side usage
 * This file can be safely imported in client components
 * It uses the browser-safe exports from Prisma (no node modules)
 */

// Re-export enums (these are values, not just types)
export {
  PostStatus,
  ContentType,
  RelationType,
  ChangeType,
  InteractionType,
  SEOEventType,
  SEOSeverity,
  ChangeFrequency,
  SubmissionStatus,
  SecurityEventType,
  SecuritySeverity,
} from '@/prisma/browser'

// Re-export Prisma namespace (needed for Prisma types)
export { Prisma } from '@/prisma/browser'

// Re-export types
export type {
  BlogPost,
  Author,
  Category,
  Tag,
  PostTag,
  PostRelation,
  PostVersion,
  PostSeries,
  SeriesPost,
  PostView,
  PostInteraction,
  SEOEvent,
  SEOKeyword,
  SitemapEntry,
  Project,
  ContactSubmission,
  SecurityEvent,
} from '@/prisma/browser'
