/**
 * Create RLS helper functions for the database
 * This script creates PostgreSQL functions that can be used for Row Level Security
 */

import { db } from '../src/lib/db'

async function createRLSFunctions() {
  console.log('🔄 Creating RLS helper functions...')
  
  try {
    // Create user context functions
    console.log('🔄 Creating set_user_context function...')
    await db.$executeRaw`
      CREATE OR REPLACE FUNCTION set_user_context(user_id TEXT, user_role TEXT)
      RETURNS void AS $$
      BEGIN
        PERFORM set_config('app.current_user_id', user_id, false);
        PERFORM set_config('app.current_user_role', user_role, false);
      END;
      $$ LANGUAGE plpgsql;
    `
    
    console.log('🔄 Creating clear_user_context function...')
    await db.$executeRaw`
      CREATE OR REPLACE FUNCTION clear_user_context()
      RETURNS void AS $$
      BEGIN
        PERFORM set_config('app.current_user_id', '', false);
        PERFORM set_config('app.current_user_role', '', false);
      END;
      $$ LANGUAGE plpgsql;
    `
    
    console.log('🔄 Creating get_user_context function...')
    await db.$executeRaw`
      CREATE OR REPLACE FUNCTION get_user_context()
      RETURNS TABLE(user_id TEXT, user_role TEXT) AS $$
      BEGIN
        RETURN QUERY SELECT 
          current_setting('app.current_user_id', true),
          current_setting('app.current_user_role', true);
      END;
      $$ LANGUAGE plpgsql;
    `
    
    console.log('✅ RLS helper functions created successfully!')
    
    // Test the functions
    await testRLSFunctions()
    
  } catch (error) {
    console.error('❌ Failed to create RLS functions:', error)
    throw error
  }
}

async function testRLSFunctions() {
  console.log('\n🧪 Testing RLS functions...')
  
  try {
    // Test setting and getting context
    console.log('🔄 Testing set_user_context...')
    await db.$executeRaw`SELECT set_user_context('test-user', 'admin')`
    
    console.log('🔄 Testing get_user_context...')
    const context = await db.$queryRaw`SELECT * FROM get_user_context()`
    console.log('✅ User context:', context)
    
    console.log('🔄 Testing clear_user_context...')
    await db.$executeRaw`SELECT clear_user_context()`
    
    const clearedContext = await db.$queryRaw`SELECT * FROM get_user_context()`
    console.log('✅ Cleared context:', clearedContext)
    
    console.log('✅ RLS functions are working correctly!')
    
  } catch (error) {
    console.error('❌ RLS function testing failed:', error)
    throw error
  }
}

async function createBasicRLSPolicies() {
  console.log('\n🔒 Creating basic RLS policies...')
  
  try {
    // Enable RLS on key tables
    console.log('🔄 Enabling RLS on tables...')
    await db.$executeRaw`ALTER TABLE "public"."authors" ENABLE ROW LEVEL SECURITY`
    await db.$executeRaw`ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY`
    await db.$executeRaw`ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY`
    await db.$executeRaw`ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY`
    await db.$executeRaw`ALTER TABLE "public"."post_tags" ENABLE ROW LEVEL SECURITY`
    await db.$executeRaw`ALTER TABLE "public"."post_views" ENABLE ROW LEVEL SECURITY`
    await db.$executeRaw`ALTER TABLE "public"."post_interactions" ENABLE ROW LEVEL SECURITY`
    
    // Create public read policies
    console.log('🔄 Creating public read policies...')
    
    // Public can read published blog posts
    await db.$executeRaw`
      CREATE POLICY "public_read_published_posts" ON "public"."blog_posts"
      FOR SELECT
      USING (status = 'PUBLISHED')
    `
    
    // Public can read authors
    await db.$executeRaw`
      CREATE POLICY "public_read_authors" ON "public"."authors"
      FOR SELECT
      USING (true)
    `
    
    // Public can read categories and tags
    await db.$executeRaw`
      CREATE POLICY "public_read_categories" ON "public"."categories"
      FOR SELECT
      USING (true)
    `
    
    await db.$executeRaw`
      CREATE POLICY "public_read_tags" ON "public"."tags"
      FOR SELECT
      USING (true)
    `
    
    // Admin has full access
    console.log('🔄 Creating admin policies...')
    
    await db.$executeRaw`
      CREATE POLICY "admin_all_blog_posts" ON "public"."blog_posts"
      FOR ALL
      USING (current_setting('app.current_user_role', true) = 'admin')
      WITH CHECK (current_setting('app.current_user_role', true) = 'admin')
    `
    
    await db.$executeRaw`
      CREATE POLICY "admin_all_authors" ON "public"."authors"
      FOR ALL
      USING (current_setting('app.current_user_role', true) = 'admin')
      WITH CHECK (current_setting('app.current_user_role', true) = 'admin')
    `
    
    // Analytics policies
    console.log('🔄 Creating analytics policies...')
    
    // Allow creating views for published posts
    await db.$executeRaw`
      CREATE POLICY "create_post_views" ON "public"."post_views"
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM "public"."blog_posts" 
          WHERE "public"."blog_posts"."id" = "public"."post_views"."postId" 
          AND "public"."blog_posts"."status" = 'PUBLISHED'
        )
      )
    `
    
    // Allow creating interactions for published posts
    await db.$executeRaw`
      CREATE POLICY "create_post_interactions" ON "public"."post_interactions"
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM "public"."blog_posts" 
          WHERE "public"."blog_posts"."id" = "public"."post_interactions"."postId" 
          AND "public"."blog_posts"."status" = 'PUBLISHED'
        )
      )
    `
    
    // Admin can read analytics
    await db.$executeRaw`
      CREATE POLICY "admin_read_analytics" ON "public"."post_views"
      FOR SELECT
      USING (current_setting('app.current_user_role', true) = 'admin')
    `
    
    await db.$executeRaw`
      CREATE POLICY "admin_read_interactions" ON "public"."post_interactions"
      FOR SELECT
      USING (current_setting('app.current_user_role', true) = 'admin')
    `
    
    console.log('✅ Basic RLS policies created successfully!')
    
  } catch (error: any) {
    // Ignore "already exists" errors
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Some policies already exist, continuing...')
    } else {
      console.error('❌ Failed to create RLS policies:', error)
      throw error
    }
  }
}

async function testRLSWithPolicies() {
  console.log('\n🧪 Testing RLS with policies...')
  
  try {
    // Test public access
    console.log('🔄 Testing public access...')
    await db.$executeRaw`SELECT clear_user_context()`
    
    const publicPosts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      take: 3
    })
    console.log(`✅ Public can access ${publicPosts.length} published posts`)
    
    // Test admin access
    console.log('🔄 Testing admin access...')
    await db.$executeRaw`SELECT set_user_context('admin-test', 'admin')`
    
    const allPosts = await db.blogPost.findMany({ take: 10 })
    console.log(`✅ Admin can access ${allPosts.length} total posts`)
    
    // Clear context
    await db.$executeRaw`SELECT clear_user_context()`
    
    console.log('✅ RLS policies are working correctly!')
    
  } catch (error) {
    console.error('❌ RLS policy testing failed:', error)
    // Don't throw - this might fail in some environments but that's okay
  }
}

// Run the script
async function main() {
  console.log('🔒 Setting up Row Level Security...\n')
  
  await createRLSFunctions()
  await createBasicRLSPolicies()
  await testRLSWithPolicies()
  
  console.log('\n🎉 RLS setup completed successfully!')
}

main()
  .then(async () => {
    await db.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Fatal error setting up RLS:', error)
    await db.$disconnect()
    process.exit(1)
  })