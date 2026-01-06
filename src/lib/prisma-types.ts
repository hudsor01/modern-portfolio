/**
 * Prisma types re-export for client-side usage
 * This file can be safely imported in client components
 *
 * Note: Prisma enums are exported as both const values and types from @/prisma/client.
 * Use regular imports for values and `import type` for types.
 */

// Re-export everything from prisma client - enums work as both values and types
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
  Prisma,
  // Model types
  type BlogPost,
  type Author,
  type Category,
  type Tag,
  type PostTag,
  type PostRelation,
  type PostVersion,
  type PostSeries,
  type SeriesPost,
  type PostView,
  type PostInteraction,
  type SEOEvent,
  type SEOKeyword,
  type SitemapEntry,
  type Project,
  type ContactSubmission,
  type SecurityEvent,
} from '@/prisma/client'
