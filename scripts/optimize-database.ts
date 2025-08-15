/**
 * Database optimization script
 * Creates additional indexes for performance and validates existing ones
 */

import { db } from '../src/lib/db'

async function createPerformanceIndexes() {
  console.log('🔄 Creating performance indexes...')
  
  try {
    const indexes = [
      // Full-text search indexes
      {
        name: 'idx_blog_posts_fulltext',
        sql: `CREATE INDEX IF NOT EXISTS idx_blog_posts_fulltext ON "public"."blog_posts" USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || content))`
      },
      
      // Composite indexes for common queries
      {
        name: 'idx_blog_posts_status_published_date',
        sql: `CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_date ON "public"."blog_posts" (status, "publishedAt" DESC) WHERE status = 'PUBLISHED'`
      },
      
      {
        name: 'idx_blog_posts_category_status',
        sql: `CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status ON "public"."blog_posts" ("categoryId", status, "publishedAt" DESC)`
      },
      
      {
        name: 'idx_blog_posts_author_status',
        sql: `CREATE INDEX IF NOT EXISTS idx_blog_posts_author_status ON "public"."blog_posts" ("authorId", status, "publishedAt" DESC)`
      },
      
      // Analytics indexes
      {
        name: 'idx_post_views_performance',
        sql: `CREATE INDEX IF NOT EXISTS idx_post_views_performance ON "public"."post_views" ("postId", "viewedAt" DESC, country)`
      },
      
      {
        name: 'idx_post_interactions_performance',
        sql: `CREATE INDEX IF NOT EXISTS idx_post_interactions_performance ON "public"."post_interactions" ("postId", type, "createdAt" DESC)`
      },
      
      // SEO indexes
      {
        name: 'idx_seo_keywords_performance',
        sql: `CREATE INDEX IF NOT EXISTS idx_seo_keywords_performance ON "public"."seo_keywords" ("postId", position ASC, "updatedAt" DESC)`
      },
      
      {
        name: 'idx_seo_events_processing',
        sql: `CREATE INDEX IF NOT EXISTS idx_seo_events_processing ON "public"."seo_events" (processed, severity, "createdAt" DESC)`
      },
      
      // Category hierarchy index
      {
        name: 'idx_categories_hierarchy',
        sql: `CREATE INDEX IF NOT EXISTS idx_categories_hierarchy ON "public"."categories" ("parentId", name) WHERE "parentId" IS NOT NULL`
      },
      
      // Tag usage index
      {
        name: 'idx_post_tags_usage',
        sql: `CREATE INDEX IF NOT EXISTS idx_post_tags_usage ON "public"."post_tags" ("tagId", "createdAt" DESC)`
      },
      
      // Sitemap index
      {
        name: 'idx_sitemap_entries_active',
        sql: `CREATE INDEX IF NOT EXISTS idx_sitemap_entries_active ON "public"."sitemap_entries" (included, "lastMod" DESC) WHERE included = true`
      }
    ]
    
    for (const index of indexes) {
      try {
        console.log(`🔄 Creating index: ${index.name}`)
        await db.$executeRawUnsafe(index.sql)
        console.log(`✅ Created index: ${index.name}`)
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Index ${index.name} already exists`)
        } else {
          console.error(`❌ Failed to create index ${index.name}:`, error.message.split('\n')[0])
        }
      }
    }
    
    console.log('✅ Performance indexes creation completed!')
    
  } catch (error) {
    console.error('❌ Failed to create performance indexes:', error)
    throw error
  }
}

async function analyzeTableStats() {
  console.log('\n📊 Analyzing table statistics...')
  
  try {
    // Update table statistics for query planner
    console.log('🔄 Updating table statistics...')
    await db.$executeRaw`ANALYZE`
    
    // Get table sizes
    const tableSizes = await db.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation,
        most_common_vals
      FROM pg_stats 
      WHERE schemaname = 'public' 
        AND tablename IN ('blog_posts', 'authors', 'categories', 'post_views', 'post_interactions')
      ORDER BY tablename, attname
    `
    
    console.log('📊 Table statistics updated:', Array.isArray(tableSizes) ? tableSizes.length : 0, 'stats available')
    
    // Get index usage information
    const indexUsage = await db.$queryRaw`
      SELECT 
        indexrelname as index_name,
        relname as table_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes 
      WHERE schemaname = 'public'
      ORDER BY idx_scan DESC
      LIMIT 10
    `
    
    console.log('📊 Top 10 most used indexes:')
    if (Array.isArray(indexUsage)) {
      indexUsage.forEach((index: any, i) => {
        console.log(`   ${i + 1}. ${index.index_name} (${index.table_name}) - ${index.index_scans} scans`)
      })
    }
    
  } catch (error) {
    console.error('❌ Failed to analyze table stats:', error)
    // Don't throw - this is informational
  }
}

async function validateDatabaseConstraints() {
  console.log('\n🔍 Validating database constraints...')
  
  try {
    // Check for orphaned records
    console.log('🔄 Checking for orphaned records...')
    
    const orphanedPostTags = await db.$queryRaw`
      SELECT COUNT(*) as count
      FROM post_tags pt
      LEFT JOIN blog_posts bp ON pt."postId" = bp.id
      LEFT JOIN tags t ON pt."tagId" = t.id
      WHERE bp.id IS NULL OR t.id IS NULL
    `
    
    const orphanedViews = await db.$queryRaw`
      SELECT COUNT(*) as count
      FROM post_views pv
      LEFT JOIN blog_posts bp ON pv."postId" = bp.id
      WHERE bp.id IS NULL
    `
    
    console.log('✅ Orphaned records check completed:')
    console.log(`   - Orphaned post tags: ${Array.isArray(orphanedPostTags) ? orphanedPostTags[0]?.count || 0 : 0}`)
    console.log(`   - Orphaned post views: ${Array.isArray(orphanedViews) ? orphanedViews[0]?.count || 0 : 0}`)
    
    // Check data consistency
    console.log('🔄 Checking data consistency...')
    
    const inconsistentCounts = await db.$queryRaw`
      SELECT 
        bp.id,
        bp.title,
        bp."viewCount" as stored_count,
        COUNT(pv.id) as actual_count
      FROM blog_posts bp
      LEFT JOIN post_views pv ON bp.id = pv."postId"
      GROUP BY bp.id, bp.title, bp."viewCount"
      HAVING bp."viewCount" != COUNT(pv.id)
      LIMIT 5
    `
    
    if (Array.isArray(inconsistentCounts) && inconsistentCounts.length > 0) {
      console.log('⚠️  Found posts with inconsistent view counts:')
      inconsistentCounts.forEach((post: any) => {
        console.log(`   - ${post.title}: stored=${post.stored_count}, actual=${post.actual_count}`)
      })
    } else {
      console.log('✅ View counts are consistent')
    }
    
  } catch (error) {
    console.error('❌ Failed to validate constraints:', error)
    // Don't throw - this is validation
  }
}

async function optimizeQueries() {
  console.log('\n⚡ Testing query performance...')
  
  try {
    const queries = [
      {
        name: 'Published posts with author and category',
        query: () => db.blogPost.findMany({
          where: { status: 'PUBLISHED' },
          include: {
            author: { select: { name: true, slug: true } },
            category: { select: { name: true, slug: true } }
          },
          orderBy: { publishedAt: 'desc' },
          take: 10
        })
      },
      {
        name: 'Blog post with full relations',
        query: () => db.blogPost.findFirst({
          where: { status: 'PUBLISHED' },
          include: {
            author: true,
            category: true,
            tags: { include: { tag: true } },
            views: { take: 5, orderBy: { viewedAt: 'desc' } }
          }
        })
      },
      {
        name: 'Category with post counts',
        query: () => db.category.findMany({
          include: {
            _count: {
              select: { posts: { where: { status: 'PUBLISHED' } } }
            }
          }
        })
      },
      {
        name: 'Tag usage statistics',
        query: () => db.tag.findMany({
          include: {
            _count: { select: { posts: true } }
          },
          orderBy: { postCount: 'desc' },
          take: 10
        })
      }
    ]
    
    for (const test of queries) {
      const startTime = Date.now()
      try {
        const result = await test.query()
        const endTime = Date.now()
        const duration = endTime - startTime
        
        console.log(`✅ ${test.name}: ${duration}ms (${Array.isArray(result) ? result.length : 1} records)`)
      } catch (error: any) {
        console.error(`❌ ${test.name}: Failed - ${error.message.split('\n')[0]}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Query performance testing failed:', error)
  }
}

// Main function
async function main() {
  console.log('🔧 Database Optimization Starting...\n')
  
  await createPerformanceIndexes()
  await analyzeTableStats()
  await validateDatabaseConstraints()
  await optimizeQueries()
  
  console.log('\n🎉 Database optimization completed successfully!')
}

main()
  .then(async () => {
    await db.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Fatal error during database optimization:', error)
    await db.$disconnect()
    process.exit(1)
  })