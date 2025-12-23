-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'READ', 'IN_PROGRESS', 'RESPONDED', 'ARCHIVED', 'SPAM');

-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('RATE_LIMIT_EXCEEDED', 'CSRF_VALIDATION_FAILED', 'INVALID_INPUT', 'SUSPICIOUS_ACTIVITY', 'BOT_DETECTED', 'BRUTE_FORCE_ATTEMPT', 'BLOCKED_REQUEST', 'AUTH_FAILURE', 'SQL_INJECTION_ATTEMPT', 'XSS_ATTEMPT', 'UNAUTHORIZED_ACCESS');

-- CreateEnum
CREATE TYPE "SecuritySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "github" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "timeline" TEXT,
    "budget" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "responded" BOOLEAN NOT NULL DEFAULT false,
    "respondedAt" TIMESTAMP(3),
    "notes" TEXT,
    "ipAddress" INET,
    "userAgent" TEXT,
    "referer" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailId" TEXT,
    "emailError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "type" "SecurityEventType" NOT NULL,
    "severity" "SecuritySeverity" NOT NULL DEFAULT 'MEDIUM',
    "message" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" INET,
    "userAgent" TEXT,
    "path" TEXT,
    "method" TEXT,
    "clientId" TEXT,
    "sessionId" TEXT,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "projects"("category");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "projects"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "contact_submissions_status_createdAt_idx" ON "contact_submissions"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions"("email");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "contact_submissions_responded_idx" ON "contact_submissions"("responded");

-- CreateIndex
CREATE INDEX "security_events_type_createdAt_idx" ON "security_events"("type", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "security_events_severity_acknowledged_idx" ON "security_events"("severity", "acknowledged");

-- CreateIndex
CREATE INDEX "security_events_clientId_createdAt_idx" ON "security_events"("clientId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "security_events_createdAt_idx" ON "security_events"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "blog_posts_status_idx" ON "blog_posts"("status");

-- CreateIndex
CREATE INDEX "blog_posts_publishedAt_idx" ON "blog_posts"("publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_status_authorId_idx" ON "blog_posts"("status", "authorId");

-- CreateIndex
CREATE INDEX "blog_posts_status_categoryId_idx" ON "blog_posts"("status", "categoryId");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_postCount_idx" ON "categories"("postCount" DESC);

-- CreateIndex
CREATE INDEX "categories_name_slug_idx" ON "categories"("name", "slug");

-- CreateIndex
CREATE INDEX "post_views_postId_idx" ON "post_views"("postId");

-- CreateIndex
CREATE INDEX "post_views_country_idx" ON "post_views"("country");

-- CreateIndex
CREATE INDEX "post_views_sessionId_idx" ON "post_views"("sessionId");

-- CreateIndex
CREATE INDEX "post_views_viewedAt_country_idx" ON "post_views"("viewedAt", "country");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tags_name_slug_idx" ON "tags"("name", "slug");
