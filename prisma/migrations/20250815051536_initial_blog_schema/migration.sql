-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('MARKDOWN', 'HTML', 'RICH_TEXT');

-- CreateEnum
CREATE TYPE "public"."RelationType" AS ENUM ('RELATED', 'SEQUEL', 'PREQUEL', 'UPDATE', 'REFERENCE');

-- CreateEnum
CREATE TYPE "public"."ChangeType" AS ENUM ('MAJOR', 'MINOR', 'PATCH', 'CONTENT', 'SEO', 'STRUCTURE');

-- CreateEnum
CREATE TYPE "public"."InteractionType" AS ENUM ('LIKE', 'SHARE', 'COMMENT', 'BOOKMARK', 'SUBSCRIBE', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "public"."SEOEventType" AS ENUM ('TITLE_CHANGE', 'META_DESCRIPTION_CHANGE', 'KEYWORD_UPDATE', 'CONTENT_ANALYSIS', 'PERFORMANCE_ALERT', 'RANKING_CHANGE', 'TECHNICAL_ISSUE', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "public"."SEOSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'INFO');

-- CreateEnum
CREATE TYPE "public"."ChangeFrequency" AS ENUM ('ALWAYS', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'NEVER');

-- CreateTable
CREATE TABLE "public"."blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "contentType" "public"."ContentType" NOT NULL DEFAULT 'MARKDOWN',
    "status" "public"."PostStatus" NOT NULL DEFAULT 'DRAFT',
    "metaTitle" TEXT,
    "metaDescription" VARCHAR(160),
    "keywords" TEXT[],
    "canonicalUrl" TEXT,
    "ogTitle" TEXT,
    "ogDescription" VARCHAR(300),
    "ogImage" TEXT,
    "twitterTitle" TEXT,
    "twitterDescription" VARCHAR(200),
    "twitterImage" TEXT,
    "featuredImage" TEXT,
    "featuredImageAlt" TEXT,
    "readingTime" INTEGER,
    "wordCount" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "seoScore" DOUBLE PRECISION DEFAULT 0,
    "seoAnalysis" JSONB,
    "lastSeoCheck" TIMESTAMP(3),

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "metaDescription" VARCHAR(160),
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "metaTitle" TEXT,
    "metaDescription" VARCHAR(160),
    "keywords" TEXT[],
    "parentId" TEXT,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "metaDescription" VARCHAR(160),
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_tags" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "public"."post_relations" (
    "id" TEXT NOT NULL,
    "originalPostId" TEXT NOT NULL,
    "relatedPostId" TEXT NOT NULL,
    "relationType" "public"."RelationType" NOT NULL DEFAULT 'RELATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_versions" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "changeType" "public"."ChangeType" NOT NULL DEFAULT 'MINOR',
    "changeNotes" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_series" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" VARCHAR(160),
    "coverImage" TEXT,
    "color" TEXT,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_posts" (
    "seriesId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "series_posts_pkey" PRIMARY KEY ("seriesId","postId")
);

-- CreateTable
CREATE TABLE "public"."post_views" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "visitorId" TEXT,
    "sessionId" TEXT,
    "ipAddress" INET,
    "userAgent" TEXT,
    "referer" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "readingTime" INTEGER,
    "scrollDepth" DOUBLE PRECISION,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_interactions" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "public"."InteractionType" NOT NULL,
    "visitorId" TEXT,
    "sessionId" TEXT,
    "value" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seo_events" (
    "id" TEXT NOT NULL,
    "postId" TEXT,
    "type" "public"."SEOEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "public"."SEOSeverity" NOT NULL DEFAULT 'INFO',
    "oldValue" TEXT,
    "newValue" TEXT,
    "recommendations" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seo_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seo_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "postId" TEXT,
    "position" INTEGER,
    "searchVolume" INTEGER,
    "difficulty" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastChecked" TIMESTAMP(3),

    CONSTRAINT "seo_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sitemap_entries" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lastMod" TIMESTAMP(3) NOT NULL,
    "changeFreq" "public"."ChangeFrequency" NOT NULL DEFAULT 'WEEKLY',
    "priority" REAL NOT NULL DEFAULT 0.5,
    "postId" TEXT,
    "included" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sitemap_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_publishedAt_idx" ON "public"."blog_posts"("status", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_authorId_idx" ON "public"."blog_posts"("authorId");

-- CreateIndex
CREATE INDEX "blog_posts_categoryId_idx" ON "public"."blog_posts"("categoryId");

-- CreateIndex
CREATE INDEX "blog_posts_createdAt_idx" ON "public"."blog_posts"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "blog_posts_viewCount_idx" ON "public"."blog_posts"("viewCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "authors_email_key" ON "public"."authors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "authors_slug_key" ON "public"."authors"("slug");

-- CreateIndex
CREATE INDEX "authors_slug_idx" ON "public"."authors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "public"."categories"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "post_relations_originalPostId_idx" ON "public"."post_relations"("originalPostId");

-- CreateIndex
CREATE INDEX "post_relations_relatedPostId_idx" ON "public"."post_relations"("relatedPostId");

-- CreateIndex
CREATE UNIQUE INDEX "post_relations_originalPostId_relatedPostId_key" ON "public"."post_relations"("originalPostId", "relatedPostId");

-- CreateIndex
CREATE INDEX "post_versions_postId_version_idx" ON "public"."post_versions"("postId", "version" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "post_versions_postId_version_key" ON "public"."post_versions"("postId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "post_series_slug_key" ON "public"."post_series"("slug");

-- CreateIndex
CREATE INDEX "post_series_slug_idx" ON "public"."post_series"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "series_posts_seriesId_order_key" ON "public"."series_posts"("seriesId", "order");

-- CreateIndex
CREATE INDEX "post_views_postId_viewedAt_idx" ON "public"."post_views"("postId", "viewedAt" DESC);

-- CreateIndex
CREATE INDEX "post_views_visitorId_idx" ON "public"."post_views"("visitorId");

-- CreateIndex
CREATE INDEX "post_views_viewedAt_idx" ON "public"."post_views"("viewedAt" DESC);

-- CreateIndex
CREATE INDEX "post_interactions_postId_type_idx" ON "public"."post_interactions"("postId", "type");

-- CreateIndex
CREATE INDEX "post_interactions_createdAt_idx" ON "public"."post_interactions"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "seo_events_postId_idx" ON "public"."seo_events"("postId");

-- CreateIndex
CREATE INDEX "seo_events_type_createdAt_idx" ON "public"."seo_events"("type", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "seo_events_processed_severity_idx" ON "public"."seo_events"("processed", "severity");

-- CreateIndex
CREATE INDEX "seo_keywords_keyword_idx" ON "public"."seo_keywords"("keyword");

-- CreateIndex
CREATE INDEX "seo_keywords_postId_idx" ON "public"."seo_keywords"("postId");

-- CreateIndex
CREATE INDEX "seo_keywords_position_idx" ON "public"."seo_keywords"("position");

-- CreateIndex
CREATE UNIQUE INDEX "seo_keywords_keyword_postId_key" ON "public"."seo_keywords"("keyword", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "sitemap_entries_url_key" ON "public"."sitemap_entries"("url");

-- CreateIndex
CREATE INDEX "sitemap_entries_url_idx" ON "public"."sitemap_entries"("url");

-- CreateIndex
CREATE INDEX "sitemap_entries_lastMod_idx" ON "public"."sitemap_entries"("lastMod" DESC);

-- CreateIndex
CREATE INDEX "sitemap_entries_included_idx" ON "public"."sitemap_entries"("included");

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_tags" ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_relations" ADD CONSTRAINT "post_relations_originalPostId_fkey" FOREIGN KEY ("originalPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_relations" ADD CONSTRAINT "post_relations_relatedPostId_fkey" FOREIGN KEY ("relatedPostId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_versions" ADD CONSTRAINT "post_versions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_versions" ADD CONSTRAINT "post_versions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_posts" ADD CONSTRAINT "series_posts_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."post_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_posts" ADD CONSTRAINT "series_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_views" ADD CONSTRAINT "post_views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_interactions" ADD CONSTRAINT "post_interactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seo_events" ADD CONSTRAINT "seo_events_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seo_keywords" ADD CONSTRAINT "seo_keywords_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sitemap_entries" ADD CONSTRAINT "sitemap_entries_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
