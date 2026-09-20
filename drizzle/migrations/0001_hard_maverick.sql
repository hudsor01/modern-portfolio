ALTER TABLE "blog_posts" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce("blog_posts"."title", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("blog_posts"."excerpt", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("blog_posts"."content", '')), 'C')
      ) STORED;--> statement-breakpoint
CREATE INDEX "blog_posts_search_vector_idx" ON "blog_posts" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "blog_posts_title_trgm_idx" ON "blog_posts" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "blog_posts_excerpt_trgm_idx" ON "blog_posts" USING gin ("excerpt" gin_trgm_ops);