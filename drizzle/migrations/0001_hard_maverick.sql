-- pg_trgm is required by the gin_trgm_ops indexes below (and by the
-- word_similarity() fallback in src/lib/search.ts). It is already installed on
-- the production database, so this is a no-op there; it exists so the migration
-- is self-contained for a from-scratch Postgres, e.g. local development.
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce("blog_posts"."title", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("blog_posts"."excerpt", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("blog_posts"."content", '')), 'C')
      ) STORED;--> statement-breakpoint
CREATE INDEX "blog_posts_search_vector_idx" ON "blog_posts" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "blog_posts_title_trgm_idx" ON "blog_posts" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "blog_posts_excerpt_trgm_idx" ON "blog_posts" USING gin ("excerpt" gin_trgm_ops);