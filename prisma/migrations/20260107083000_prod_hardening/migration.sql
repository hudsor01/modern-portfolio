/*
  Warnings:

  - Added `deletedAt` to `blog_posts` and new status timestamp checks. Ensure existing data satisfies the constraints before validating.
  - Converted slug/email fields to CITEXT for case-insensitive uniqueness. Existing case-duplicate values must be resolved first.

*/

-- Enable citext for case-insensitive slugs/emails
CREATE EXTENSION IF NOT EXISTS citext;

-- Add soft-delete timestamp
ALTER TABLE "blog_posts" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Case-insensitive slugs/emails
ALTER TABLE "blog_posts" ALTER COLUMN "slug" TYPE CITEXT USING "slug"::citext;
ALTER TABLE "authors" ALTER COLUMN "email" TYPE CITEXT USING "email"::citext;
ALTER TABLE "authors" ALTER COLUMN "slug" TYPE CITEXT USING "slug"::citext;
ALTER TABLE "categories" ALTER COLUMN "slug" TYPE CITEXT USING "slug"::citext;
ALTER TABLE "tags" ALTER COLUMN "slug" TYPE CITEXT USING "slug"::citext;
ALTER TABLE "post_series" ALTER COLUMN "slug" TYPE CITEXT USING "slug"::citext;
ALTER TABLE "projects" ALTER COLUMN "slug" TYPE CITEXT USING "slug"::citext;

-- Prevent cascading deletes of posts when deleting an author
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_authorId_fkey";
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop redundant indexes superseded by unique constraints
DROP INDEX IF EXISTS "blog_posts_slug_idx";
DROP INDEX IF EXISTS "authors_slug_idx";
DROP INDEX IF EXISTS "categories_slug_idx";
DROP INDEX IF EXISTS "tags_slug_idx";
DROP INDEX IF EXISTS "post_series_slug_idx";
DROP INDEX IF EXISTS "sitemap_entries_url_idx";
DROP INDEX IF EXISTS "projects_slug_idx";

-- New indexes for common joins/workflows
CREATE INDEX "blog_posts_status_scheduledAt_idx" ON "blog_posts"("status", "scheduledAt");
CREATE INDEX "blog_posts_deletedAt_idx" ON "blog_posts"("deletedAt");
CREATE INDEX "post_tags_tagId_idx" ON "post_tags"("tagId");
CREATE INDEX "post_versions_authorId_idx" ON "post_versions"("authorId");
CREATE INDEX "series_posts_postId_idx" ON "series_posts"("postId");
CREATE INDEX "sitemap_entries_postId_idx" ON "sitemap_entries"("postId");

-- Status timestamp checks (added as NOT VALID for safe rollout)
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_publishedAt_required" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL) NOT VALID;
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_scheduledAt_required" CHECK ("status" <> 'SCHEDULED' OR "scheduledAt" IS NOT NULL) NOT VALID;
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_archivedAt_required" CHECK ("status" <> 'ARCHIVED' OR "archivedAt" IS NOT NULL) NOT VALID;
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_deletedAt_required" CHECK ("status" <> 'DELETED' OR "deletedAt" IS NOT NULL) NOT VALID;
