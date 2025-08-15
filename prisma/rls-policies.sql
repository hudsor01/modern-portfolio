-- Row Level Security (RLS) Policies for Modern Portfolio Blog System
-- This file contains PostgreSQL RLS policies to secure data access
-- Execute these statements after running migrations

-- =======================
-- ENABLE RLS ON ALL TABLES
-- =======================

-- Core blog entities
ALTER TABLE "public"."authors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;

-- Relationship tables
ALTER TABLE "public"."post_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_relations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."series_posts" ENABLE ROW LEVEL SECURITY;

-- Content management
ALTER TABLE "public"."post_versions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_series" ENABLE ROW LEVEL SECURITY;

-- Analytics and tracking (more permissive)
ALTER TABLE "public"."post_views" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_interactions" ENABLE ROW LEVEL SECURITY;

-- SEO automation
ALTER TABLE "public"."seo_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."seo_keywords" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sitemap_entries" ENABLE ROW LEVEL SECURITY;

-- =======================
-- PUBLIC READ POLICIES
-- =======================

-- Allow public read access to published content
CREATE POLICY "public_read_published_posts" ON "public"."blog_posts"
  FOR SELECT
  USING (status = 'PUBLISHED');

-- Allow public read access to authors (for published posts)
CREATE POLICY "public_read_authors" ON "public"."authors"
  FOR SELECT
  USING (true);

-- Allow public read access to categories
CREATE POLICY "public_read_categories" ON "public"."categories"
  FOR SELECT
  USING (true);

-- Allow public read access to tags
CREATE POLICY "public_read_tags" ON "public"."tags"
  FOR SELECT
  USING (true);

-- Allow public read access to post series
CREATE POLICY "public_read_post_series" ON "public"."post_series"
  FOR SELECT
  USING (true);

-- Allow public read access to published post tags
CREATE POLICY "public_read_post_tags" ON "public"."post_tags"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."blog_posts" 
      WHERE "public"."blog_posts"."id" = "public"."post_tags"."postId" 
      AND "public"."blog_posts"."status" = 'PUBLISHED'
    )
  );

-- Allow public read access to published post relations
CREATE POLICY "public_read_post_relations" ON "public"."post_relations"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."blog_posts" 
      WHERE "public"."blog_posts"."id" = "public"."post_relations"."originalPostId" 
      AND "public"."blog_posts"."status" = 'PUBLISHED'
    )
  );

-- Allow public read access to series posts (for published posts)
CREATE POLICY "public_read_series_posts" ON "public"."series_posts"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "public"."blog_posts" 
      WHERE "public"."blog_posts"."id" = "public"."series_posts"."postId" 
      AND "public"."blog_posts"."status" = 'PUBLISHED'
    )
  );

-- Allow public read access to sitemap entries
CREATE POLICY "public_read_sitemap_entries" ON "public"."sitemap_entries"
  FOR SELECT
  USING (included = true);

-- =======================
-- ANALYTICS POLICIES
-- =======================

-- Allow anonymous users to create post views (for analytics)
CREATE POLICY "anonymous_create_post_views" ON "public"."post_views"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."blog_posts" 
      WHERE "public"."blog_posts"."id" = "public"."post_views"."postId" 
      AND "public"."blog_posts"."status" = 'PUBLISHED'
    )
  );

-- Allow anonymous users to create interactions (likes, shares, etc.)
CREATE POLICY "anonymous_create_interactions" ON "public"."post_interactions"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "public"."blog_posts" 
      WHERE "public"."blog_posts"."id" = "public"."post_interactions"."postId" 
      AND "public"."blog_posts"."status" = 'PUBLISHED'
    )
  );

-- Restrict read access to analytics data (admin only)
CREATE POLICY "admin_read_post_views" ON "public"."post_views"
  FOR SELECT
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  );

CREATE POLICY "admin_read_interactions" ON "public"."post_interactions"
  FOR SELECT
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- =======================
-- ADMIN POLICIES
-- =======================

-- Admin full access to all blog posts
CREATE POLICY "admin_all_blog_posts" ON "public"."blog_posts"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- Admin full access to authors
CREATE POLICY "admin_all_authors" ON "public"."authors"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- Admin full access to categories
CREATE POLICY "admin_all_categories" ON "public"."categories"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- Admin full access to tags
CREATE POLICY "admin_all_tags" ON "public"."tags"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- Admin full access to post versions
CREATE POLICY "admin_all_post_versions" ON "public"."post_versions"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- Admin full access to post series
CREATE POLICY "admin_all_post_series" ON "public"."post_series"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'admin'
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'admin'
  );

-- =======================
-- AUTHOR POLICIES
-- =======================

-- Authors can read all published posts
CREATE POLICY "author_read_published_posts" ON "public"."blog_posts"
  FOR SELECT
  USING (
    current_setting('app.current_user_role', true) = 'author' 
    AND status = 'PUBLISHED'
  );

-- Authors can manage their own posts
CREATE POLICY "author_manage_own_posts" ON "public"."blog_posts"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'author' 
    AND "authorId" = current_setting('app.current_user_id', true)
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'author' 
    AND "authorId" = current_setting('app.current_user_id', true)
  );

-- Authors can manage their own post versions
CREATE POLICY "author_manage_own_versions" ON "public"."post_versions"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'author' 
    AND "authorId" = current_setting('app.current_user_id', true)
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'author' 
    AND "authorId" = current_setting('app.current_user_id', true)
  );

-- Authors can update their own profile
CREATE POLICY "author_update_own_profile" ON "public"."authors"
  FOR UPDATE
  USING (
    current_setting('app.current_user_role', true) = 'author' 
    AND "id" = current_setting('app.current_user_id', true)
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) = 'author' 
    AND "id" = current_setting('app.current_user_id', true)
  );

-- =======================
-- SEO AUTOMATION POLICIES
-- =======================

-- Allow system/admin access to SEO events
CREATE POLICY "system_seo_events" ON "public"."seo_events"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) IN ('admin', 'system')
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) IN ('admin', 'system')
  );

-- Allow system/admin access to SEO keywords
CREATE POLICY "system_seo_keywords" ON "public"."seo_keywords"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) IN ('admin', 'system')
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) IN ('admin', 'system')
  );

-- Allow system/admin access to sitemap entries
CREATE POLICY "system_sitemap_entries" ON "public"."sitemap_entries"
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) IN ('admin', 'system')
  )
  WITH CHECK (
    current_setting('app.current_user_role', true) IN ('admin', 'system')
  );

-- =======================
-- HELPER FUNCTIONS
-- =======================

-- Function to set user context for RLS policies
CREATE OR REPLACE FUNCTION set_user_context(user_id TEXT, user_role TEXT)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id, false);
  PERFORM set_config('app.current_user_role', user_role, false);
END;
$$ LANGUAGE plpgsql;

-- Function to clear user context
CREATE OR REPLACE FUNCTION clear_user_context()
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', '', false);
  PERFORM set_config('app.current_user_role', '', false);
END;
$$ LANGUAGE plpgsql;

-- Function to get current user context
CREATE OR REPLACE FUNCTION get_user_context()
RETURNS TABLE(user_id TEXT, user_role TEXT) AS $$
BEGIN
  RETURN QUERY SELECT 
    current_setting('app.current_user_id', true),
    current_setting('app.current_user_role', true);
END;
$$ LANGUAGE plpgsql;

-- =======================
-- BYPASS POLICIES (For Application)
-- =======================

-- Create a role for the application that can bypass RLS
-- This should be used carefully and only for trusted application code

-- Create application role (run as superuser)
-- CREATE ROLE app_role;
-- GRANT USAGE ON SCHEMA public TO app_role;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_role;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_role;

-- Allow application role to bypass RLS (use with caution)
-- ALTER TABLE "public"."blog_posts" FORCE ROW LEVEL SECURITY;
-- ... (repeat for all tables where you want to force RLS even for table owners)

-- =======================
-- INDEXES FOR RLS PERFORMANCE
-- =======================

-- Indexes to support RLS policy performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_author ON "public"."blog_posts" (status, "authorId");
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON "public"."post_views" ("postId");
CREATE INDEX IF NOT EXISTS idx_post_interactions_post_id ON "public"."post_interactions" ("postId");
CREATE INDEX IF NOT EXISTS idx_seo_events_post_id ON "public"."seo_events" ("postId");
CREATE INDEX IF NOT EXISTS idx_seo_keywords_post_id ON "public"."seo_keywords" ("postId");

-- =======================
-- COMMENTS AND DOCUMENTATION
-- =======================

COMMENT ON TABLE "public"."blog_posts" IS 'Blog posts with RLS policies for public/admin/author access';
COMMENT ON POLICY "public_read_published_posts" ON "public"."blog_posts" IS 'Allow anyone to read published blog posts';
COMMENT ON POLICY "admin_all_blog_posts" ON "public"."blog_posts" IS 'Allow admins full access to all blog posts';
COMMENT ON POLICY "author_manage_own_posts" ON "public"."blog_posts" IS 'Allow authors to manage their own posts';

COMMENT ON FUNCTION set_user_context(TEXT, TEXT) IS 'Set user context for RLS policies - call before database operations';
COMMENT ON FUNCTION clear_user_context() IS 'Clear user context - call after database operations';
COMMENT ON FUNCTION get_user_context() IS 'Get current user context for debugging';

-- =======================
-- USAGE EXAMPLES
-- =======================

/*
-- Example usage in application code:

-- Set context for admin user
SELECT set_user_context('admin-user-id', 'admin');

-- Set context for author
SELECT set_user_context('author-user-id', 'author');

-- Set context for anonymous/public access
SELECT clear_user_context();

-- Check current context
SELECT * FROM get_user_context();

-- Example: Author accessing their own posts
SELECT set_user_context('author-123', 'author');
SELECT * FROM blog_posts WHERE "authorId" = 'author-123';

-- Example: Public accessing published posts
SELECT clear_user_context();
SELECT * FROM blog_posts; -- Only published posts will be returned

-- Example: Admin accessing all posts
SELECT set_user_context('admin-456', 'admin');
SELECT * FROM blog_posts; -- All posts will be returned
*/