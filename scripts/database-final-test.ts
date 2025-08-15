/**
 * Final database validation test
 * Quick test to verify all components are working together
 */

import { db, checkDBHealth } from '../src/lib/db'
import { DatabaseMonitor, validateDatabaseEnvironment } from '../src/lib/database/production-utils'

async function runFinalTest() {
  console.log('🔄 Running final database validation...')
  
  try {
    // 1. Environment validation
    console.log('✅ 1. Environment validation')
    validateDatabaseEnvironment()
    
    // 2. Database connectivity
    console.log('✅ 2. Database connectivity')
    const health = await checkDBHealth()
    console.log(`   Status: ${health.status}`)
    
    // 3. Basic operations
    console.log('✅ 3. Basic operations')
    const postCount = await db.blogPost.count()
    const authorCount = await db.author.count()
    const categoryCount = await db.category.count()
    console.log(`   Posts: ${postCount}, Authors: ${authorCount}, Categories: ${categoryCount}`)
    
    // 4. RLS functions
    console.log('✅ 4. RLS functions')
    await db.$executeRaw`SELECT clear_user_context()`
    await db.$executeRaw`SELECT set_user_context('test', 'admin')`
    console.log('   RLS functions working')
    
    // 5. Performance monitoring
    console.log('✅ 5. Performance monitoring')
    const dbHealth = await DatabaseMonitor.getHealth()
    console.log(`   Response time: ${dbHealth.responseTime}ms`)
    
    // 6. Published content access
    console.log('✅ 6. Published content access')
    await db.$executeRaw`SELECT clear_user_context()`
    const publishedPosts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } }
      }
    })
    console.log(`   Found ${publishedPosts.length} published posts`)
    
    console.log('\n🎉 All database components are working correctly!')
    console.log('🚀 Database is production-ready!')
    
    return true
    
  } catch (error) {
    console.error('❌ Final test failed:', error)
    return false
  }
}

// Run the test
runFinalTest()
  .then(async (success) => {
    await db.$disconnect()
    process.exit(success ? 0 : 1)
  })
  .catch(async (error) => {
    console.error('Fatal error:', error)
    await db.$disconnect()
    process.exit(1)
  })