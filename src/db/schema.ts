import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import {
  boolean,
  customType,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { createId } from './cuid'

// citext (case-insensitive text) — Postgres extension already enabled in DB
const citext = customType<{ data: string; driverData: string }>({
  dataType: () => 'citext',
})

// inet — Postgres native IP address type
const inet = customType<{ data: string; driverData: string }>({
  dataType: () => 'inet',
})

// Enums
export const postStatus = pgEnum('PostStatus', [
  'DRAFT',
  'REVIEW',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
  'DELETED',
])

export const contentType = pgEnum('ContentType', ['MARKDOWN', 'HTML', 'RICH_TEXT'])

export const interactionType = pgEnum('InteractionType', [
  'LIKE',
  'SHARE',
  'COMMENT',
  'BOOKMARK',
  'SUBSCRIBE',
  'DOWNLOAD',
])

export const submissionStatus = pgEnum('SubmissionStatus', [
  'NEW',
  'READ',
  'IN_PROGRESS',
  'RESPONDED',
  'ARCHIVED',
  'SPAM',
])

export const securityEventType = pgEnum('SecurityEventType', [
  'RATE_LIMIT_EXCEEDED',
  'CSRF_VALIDATION_FAILED',
  'INVALID_INPUT',
  'SUSPICIOUS_ACTIVITY',
  'BOT_DETECTED',
  'BRUTE_FORCE_ATTEMPT',
  'BLOCKED_REQUEST',
  'AUTH_FAILURE',
  'SQL_INJECTION_ATTEMPT',
  'XSS_ATTEMPT',
  'UNAUTHORIZED_ACCESS',
])

export const securitySeverity = pgEnum('SecuritySeverity', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

// Authors
export const authors = pgTable('authors', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
  email: citext('email').notNull().unique(),
  slug: citext('slug').notNull().unique(),
  bio: text('bio'),
  avatar: text('avatar'),
  website: text('website'),
  twitter: text('twitter'),
  linkedin: text('linkedin'),
  github: text('github'),
  metaDescription: varchar('metaDescription', { length: 160 }),
  totalViews: integer('totalViews').notNull().default(0),
  totalPosts: integer('totalPosts').notNull().default(0),
  createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
})

// Categories — self-referential parent/child
export const categories = pgTable(
  'categories',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    name: text('name').notNull().unique(),
    slug: citext('slug').notNull().unique(),
    description: text('description'),
    color: text('color'),
    icon: text('icon'),
    metaTitle: text('metaTitle'),
    metaDescription: varchar('metaDescription', { length: 160 }),
    keywords: text('keywords').array().notNull().default(sql`'{}'::text[]`),
    // Self-referential FK — Drizzle requires the AnyPgColumn forward-ref cast
    // because `categories` isn't defined yet at this point in the file.
    parentId: text('parentId').references((): AnyPgColumn => categories.id, {
      onDelete: 'set null',
    }),
    postCount: integer('postCount').notNull().default(0),
    totalViews: integer('totalViews').notNull().default(0),
    createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  },
  (t) => [index('categories_parentId_idx').on(t.parentId)]
)

// Tags
export const tags = pgTable('tags', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name').notNull().unique(),
  slug: citext('slug').notNull().unique(),
  description: text('description'),
  color: text('color'),
  metaDescription: varchar('metaDescription', { length: 160 }),
  postCount: integer('postCount').notNull().default(0),
  totalViews: integer('totalViews').notNull().default(0),
  createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
})

// Blog posts
export const blogPosts = pgTable(
  'blog_posts',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    title: text('title').notNull(),
    slug: citext('slug').notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    contentType: contentType('contentType').notNull().default('MARKDOWN'),
    status: postStatus('status').notNull().default('DRAFT'),
    metaTitle: text('metaTitle'),
    metaDescription: varchar('metaDescription', { length: 160 }),
    keywords: text('keywords').array().notNull().default(sql`'{}'::text[]`),
    canonicalUrl: text('canonicalUrl'),
    ogTitle: text('ogTitle'),
    ogDescription: varchar('ogDescription', { length: 300 }),
    ogImage: text('ogImage'),
    twitterTitle: text('twitterTitle'),
    twitterDescription: varchar('twitterDescription', { length: 200 }),
    twitterImage: text('twitterImage'),
    featuredImage: text('featuredImage'),
    featuredImageAlt: text('featuredImageAlt'),
    readingTime: integer('readingTime'),
    wordCount: integer('wordCount'),
    publishedAt: timestamp('publishedAt', { precision: 3, withTimezone: false }),
    scheduledAt: timestamp('scheduledAt', { precision: 3, withTimezone: false }),
    archivedAt: timestamp('archivedAt', { precision: 3, withTimezone: false }),
    deletedAt: timestamp('deletedAt', { precision: 3, withTimezone: false }),
    createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
    authorId: text('authorId')
      .notNull()
      .references(() => authors.id, { onDelete: 'restrict' }),
    categoryId: text('categoryId').references(() => categories.id, { onDelete: 'set null' }),
    viewCount: integer('viewCount').notNull().default(0),
    likeCount: integer('likeCount').notNull().default(0),
    shareCount: integer('shareCount').notNull().default(0),
    commentCount: integer('commentCount').notNull().default(0),
  },
  (t) => [
    index('blog_posts_status_publishedAt_idx').on(t.status, t.publishedAt.desc()),
    index('blog_posts_authorId_idx').on(t.authorId),
    index('blog_posts_categoryId_idx').on(t.categoryId),
    // Partial unique index: PUBLISHED, non-deleted posts can't share a
    // featured image. Prevents the original duplicate-image failure
    // class at the DB layer, regardless of who's writing. Multiple
    // rows can still have NULL featuredImage because Postgres treats
    // NULLs as distinct in unique indexes by default.
    //
    // Applied to prod via scripts/apply-featured-image-unique-index.ts
    // (raw `CREATE UNIQUE INDEX IF NOT EXISTS … WHERE`). drizzle-kit
    // has no baseline against the Prisma-era schema, so `bun run
    // db:generate` would emit a 0000 full-schema migration unsafe to
    // apply against prod. Until baselining via `drizzle-kit pull` (the
    // canonical drizzle-kit recipe for adopting an existing DB), this
    // declaration is documentation + DSL-typesafety only; the DDL
    // truth lives in the focused script.
    //
    // Limitation: partial UNIQUE INDEX cannot be DEFERRABLE in
    // Postgres. scripts/update-blog-featured-images.ts pre-checks for
    // swap-mode UPDATE patterns and fails loudly with operator
    // guidance instead of letting the per-row constraint check fire
    // an opaque 23505 mid-statement. We deliberately don't switch to
    // `EXCLUDE … USING gist (col WITH =) WHERE … DEFERRABLE INITIALLY
    // DEFERRED` (the canonical Postgres deferrable-partial primitive)
    // because (a) it requires the `btree_gist` extension which adds a
    // Neon-side review surface, (b) Drizzle's DSL has no EXCLUDE
    // helper so the constraint would only live in the apply script,
    // and (c) the swap scenario is already caught at the script's
    // pre-flight — cheaper enforcement at the only known writer.
    uniqueIndex('blog_posts_featuredImage_published_unique_idx')
      .on(t.featuredImage)
      .where(sql`${t.status} = 'PUBLISHED' AND ${t.deletedAt} IS NULL`),
  ]
)

// Post tags — composite PK
export const postTags = pgTable(
  'post_tags',
  {
    postId: text('postId')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),
    tagId: text('tagId')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] }), index('post_tags_tagId_idx').on(t.tagId)]
)

// Post views
export const postViews = pgTable(
  'post_views',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    postId: text('postId')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),
    visitorId: text('visitorId'),
    sessionId: text('sessionId'),
    ipAddress: inet('ipAddress'),
    userAgent: text('userAgent'),
    // DB column name matches the correct English spelling + the
    // `document.referrer` JS API. The HTTP wire-format header "Referer"
    // (RFC 7231 §5.5.2) was a historical typo; persisted analytics columns
    // are a different concern from header parsing, so we use the standard
    // spelling here.
    referrer: text('referrer'),
    country: text('country'),
    region: text('region'),
    city: text('city'),
    readingTime: integer('readingTime'),
    scrollDepth: doublePrecision('scrollDepth'),
    viewedAt: timestamp('viewedAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  },
  (t) => [
    index('post_views_postId_idx').on(t.postId),
    index('post_views_viewedAt_idx').on(t.viewedAt.desc()),
    index('post_views_postId_viewedAt_idx').on(t.postId, t.viewedAt.desc()),
    index('post_views_visitorId_idx').on(t.visitorId),
    index('post_views_country_idx').on(t.country),
    index('post_views_sessionId_idx').on(t.sessionId),
    index('post_views_viewedAt_country_idx').on(t.viewedAt, t.country),
  ]
)

// Post interactions
export const postInteractions = pgTable(
  'post_interactions',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    postId: text('postId')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),
    type: interactionType('type').notNull(),
    visitorId: text('visitorId'),
    sessionId: text('sessionId'),
    value: text('value'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  },
  (t) => [
    index('post_interactions_postId_type_idx').on(t.postId, t.type),
    index('post_interactions_createdAt_idx').on(t.createdAt.desc()),
  ]
)

// Projects
export const projects = pgTable(
  'projects',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    slug: citext('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    longDescription: text('longDescription'),
    content: text('content'),
    image: text('image').notNull(),
    link: text('link'),
    github: text('github'),
    category: text('category').notNull(),
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    featured: boolean('featured').notNull().default(false),
    client: text('client'),
    role: text('role'),
    duration: text('duration'),
    year: integer('year'),
    caseStudyUrl: text('caseStudyUrl'),
    // JSON columns — typed loosely so consumers narrow with Array.isArray()
    // before reading. Matches the shapes documented on prisma/schema.prisma:219-226.
    impact: jsonb('impact').$type<string[]>(),
    results:
      jsonb('results').$type<
        Array<{ metric: string; before: string; after: string; improvement: string }>
      >(),
    displayMetrics:
      jsonb('displayMetrics').$type<Array<{ label: string; value: string; iconName: string }>>(),
    metrics: jsonb('metrics').$type<Record<string, string>>(),
    testimonial: jsonb('testimonial').$type<{
      quote: string
      author: string
      role?: string
      company?: string
      avatar?: string
    }>(),
    gallery: jsonb('gallery').$type<Array<{ url: string; alt: string; caption?: string }>>(),
    details: jsonb('details').$type<{ challenge: string; solution: string; impact: string }>(),
    charts: jsonb('charts').$type<Array<{ type: string; title: string; dataKey: string }>>(),
    viewCount: integer('viewCount').notNull().default(0),
    clickCount: integer('clickCount').notNull().default(0),
    createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  },
  (t) => [
    index('projects_category_idx').on(t.category),
    index('projects_featured_idx').on(t.featured),
    index('projects_createdAt_idx').on(t.createdAt.desc()),
    index('projects_year_idx').on(t.year),
  ]
)

// Contact submissions
export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    name: text('name').notNull(),
    email: text('email').notNull(),
    company: text('company'),
    phone: text('phone'),
    subject: text('subject'),
    message: text('message').notNull(),
    status: submissionStatus('status').notNull().default('NEW'),
    responded: boolean('responded').notNull().default(false),
    respondedAt: timestamp('respondedAt', { precision: 3, withTimezone: false }),
    notes: text('notes'),
    ipAddress: inet('ipAddress'),
    userAgent: text('userAgent'),
    // See note on post_views.referrer — standard spelling, not the wire-format
    // HTTP header typo.
    referrer: text('referrer'),
    emailSent: boolean('emailSent').notNull().default(false),
    emailId: text('emailId'),
    emailError: text('emailError'),
    createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  },
  (t) => [
    index('contact_submissions_status_createdAt_idx').on(t.status, t.createdAt.desc()),
    index('contact_submissions_email_idx').on(t.email),
    index('contact_submissions_createdAt_idx').on(t.createdAt.desc()),
    index('contact_submissions_responded_idx').on(t.responded),
  ]
)

// Security events
export const securityEvents = pgTable(
  'security_events',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    type: securityEventType('type').notNull(),
    severity: securitySeverity('severity').notNull().default('MEDIUM'),
    message: text('message').notNull(),
    details: jsonb('details'),
    ipAddress: inet('ipAddress'),
    userAgent: text('userAgent'),
    path: text('path'),
    method: text('method'),
    clientId: text('clientId'),
    sessionId: text('sessionId'),
    acknowledged: boolean('acknowledged').notNull().default(false),
    acknowledgedAt: timestamp('acknowledgedAt', { precision: 3, withTimezone: false }),
    acknowledgedBy: text('acknowledgedBy'),
    createdAt: timestamp('createdAt', { precision: 3, withTimezone: false }).notNull().defaultNow(),
  },
  (t) => [
    index('security_events_type_createdAt_idx').on(t.type, t.createdAt.desc()),
    index('security_events_severity_acknowledged_idx').on(t.severity, t.acknowledged),
    index('security_events_clientId_createdAt_idx').on(t.clientId, t.createdAt.desc()),
    index('security_events_createdAt_idx').on(t.createdAt.desc()),
  ]
)

// Relations
export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(blogPosts),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'CategoryHierarchy',
  }),
  children: many(categories, { relationName: 'CategoryHierarchy' }),
  posts: many(blogPosts),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}))

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(authors, { fields: [blogPosts.authorId], references: [authors.id] }),
  category: one(categories, { fields: [blogPosts.categoryId], references: [categories.id] }),
  tags: many(postTags),
  views: many(postViews),
  interactions: many(postInteractions),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(blogPosts, { fields: [postTags.postId], references: [blogPosts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}))

export const postViewsRelations = relations(postViews, ({ one }) => ({
  post: one(blogPosts, { fields: [postViews.postId], references: [blogPosts.id] }),
}))

export const postInteractionsRelations = relations(postInteractions, ({ one }) => ({
  post: one(blogPosts, { fields: [postInteractions.postId], references: [blogPosts.id] }),
}))

// Inferred row types
export type Author = typeof authors.$inferSelect
export type NewAuthor = typeof authors.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert
export type PostTag = typeof postTags.$inferSelect
export type NewPostTag = typeof postTags.$inferInsert
export type PostView = typeof postViews.$inferSelect
export type NewPostView = typeof postViews.$inferInsert
export type PostInteraction = typeof postInteractions.$inferSelect
export type NewPostInteraction = typeof postInteractions.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
export type SecurityEvent = typeof securityEvents.$inferSelect
export type NewSecurityEvent = typeof securityEvents.$inferInsert

// Enum value types — re-export so callers don't import drizzle internals
export type PostStatus = (typeof postStatus.enumValues)[number]
export type ContentType = (typeof contentType.enumValues)[number]
export type InteractionType = (typeof interactionType.enumValues)[number]
export type SubmissionStatus = (typeof submissionStatus.enumValues)[number]
export type SecurityEventType = (typeof securityEventType.enumValues)[number]
export type SecuritySeverity = (typeof securitySeverity.enumValues)[number]
