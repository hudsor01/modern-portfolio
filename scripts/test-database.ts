/**
 * Database connectivity and operations test script
 * Tests all major database operations to ensure everything works correctly
 */

import { db, connectDB, disconnectDB, checkDBHealth } from '../src/lib/db'

async function testDatabaseConnectivity() {
  console.log('🔄 Testing database connectivity...')
  
  try {
    await connectDB()
    console.log('✅ Database connection successful')
    
    const health = await checkDBHealth()
    console.log('✅ Database health check:', health)
    
    return true
  } catch (error) {
    console.error('❌ Database connectivity failed:', error)
    return false
  }
}

async function testBasicQueries() {
  console.log('🔄 Testing basic queries...')
  
  try {
    // Test counting all entities
    const counts = await Promise.all([
      db.author.count(),
      db.category.count(), 
      db.tag.count(),
      db.blogPost.count(),
      db.postView.count(),
      db.sEOKeyword.count()
    ])
    
    console.log('✅ Entity counts:', {
      authors: counts[0],
      categories: counts[1],
      tags: counts[2],
      blogPosts: counts[3],
      postViews: counts[4],
      seoKeywords: counts[5]
    })
    
    return counts.every(count => count > 0)
  } catch (error) {
    console.error('❌ Basic queries failed:', error)
    return false
  }
}

async function testRelationQueries() {
  console.log('🔄 Testing relation queries...')
  
  try {
    // Test complex relationship queries
    const blogPostWithRelations = await db.blogPost.findFirst({
      where: { status: 'PUBLISHED' },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        views: {
          take: 5,
          orderBy: { viewedAt: 'desc' }
        },
        seoKeywords: {
          take: 3,
          orderBy: { position: 'asc' }
        }
      }
    })
    
    if (!blogPostWithRelations) {
      throw new Error('No published blog posts found')
    }
    
    console.log('✅ Blog post with relations found:', {
      title: blogPostWithRelations.title,
      author: blogPostWithRelations.author.name,
      category: blogPostWithRelations.category?.name,
      tagCount: blogPostWithRelations.tags.length,
      viewCount: blogPostWithRelations.views.length,
      seoKeywordCount: blogPostWithRelations.seoKeywords.length
    })
    
    return true
  } catch (error) {
    console.error('❌ Relation queries failed:', error)
    return false
  }
}

async function testAggregationQueries() {
  console.log('🔄 Testing aggregation queries...')
  
  try {
    // Test aggregation operations
    const analytics = await db.blogPost.aggregate({
      where: { status: 'PUBLISHED' },
      _count: { id: true },
      _sum: { 
        viewCount: true, 
        likeCount: true,
        shareCount: true 
      },
      _avg: { 
        readingTime: true,
        seoScore: true 
      },
      _max: { publishedAt: true },
      _min: { publishedAt: true }
    })
    
    console.log('✅ Blog analytics:', {
      totalPosts: analytics._count.id,
      totalViews: analytics._sum.viewCount,
      totalLikes: analytics._sum.likeCount,
      totalShares: analytics._sum.shareCount,
      avgReadingTime: analytics._avg.readingTime,
      avgSeoScore: analytics._avg.seoScore,
      latestPost: analytics._max.publishedAt,
      oldestPost: analytics._min.publishedAt
    })
    
    return true
  } catch (error) {
    console.error('❌ Aggregation queries failed:', error)
    return false
  }
}

async function testSearchOperations() {
  console.log('🔄 Testing search operations...')
  
  try {
    // Test full-text search (PostgreSQL specific)
    const searchResults = await db.blogPost.findMany({
      where: {
        AND: [
          { status: 'PUBLISHED' },
          {
            OR: [
              { title: { contains: 'analytics', mode: 'insensitive' } },
              { content: { contains: 'data', mode: 'insensitive' } },
              { excerpt: { contains: 'revenue', mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } }
      },
      take: 5
    })
    
    console.log('✅ Search results found:', searchResults.length)
    searchResults.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title} by ${post.author.name}`)
    })
    
    return true
  } catch (error) {
    console.error('❌ Search operations failed:', error)
    return false
  }
}

async function testTransactions() {
  console.log('🔄 Testing database transactions...')
  
  try {
    // Test transaction rollback
    const result = await db.$transaction(async (tx) => {
      const author = await tx.author.findFirst()
      if (!author) throw new Error('No author found')
      
      // Create a test blog post
      const testPost = await tx.blogPost.create({
        data: {
          title: 'Test Transaction Post',
          slug: 'test-transaction-post',
          content: 'This is a test post for transaction validation.',
          excerpt: 'Testing transactions...',
          authorId: author.id,
          status: 'DRAFT',
          keywords: ['test', 'transaction']
        }
      })
      
      // Immediately delete it to test rollback
      await tx.blogPost.delete({
        where: { id: testPost.id }
      })
      
      return { success: true, testPostId: testPost.id }
    })
    
    console.log('✅ Transaction completed successfully:', result)
    
    return true
  } catch (error) {
    console.error('❌ Transaction test failed:', error)
    return false
  }
}

async function testIndexPerformance() {
  console.log('🔄 Testing index performance...')
  
  try {
    const startTime = Date.now()
    
    // Test queries that should use indexes
    await Promise.all([
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 10
      }),
      db.blogPost.findUnique({
        where: { slug: 'complete-guide-revenue-operations-strategy' }
      }),
      db.author.findUnique({
        where: { email: 'richard@modernportfolio.dev' }
      }),
      db.category.findUnique({
        where: { slug: 'revenue-operations' }
      })
    ])
    
    const endTime = Date.now()
    const queryTime = endTime - startTime
    
    console.log(`✅ Index queries completed in ${queryTime}ms`)
    
    return queryTime < 1000 // Should complete within 1 second
  } catch (error) {
    console.error('❌ Index performance test failed:', error)
    return false
  }
}

async function runAllTests() {
  console.log('🧪 Starting comprehensive database tests...\n')
  
  const tests = [
    { name: 'Database Connectivity', test: testDatabaseConnectivity },
    { name: 'Basic Queries', test: testBasicQueries },
    { name: 'Relation Queries', test: testRelationQueries },
    { name: 'Aggregation Queries', test: testAggregationQueries },
    { name: 'Search Operations', test: testSearchOperations },
    { name: 'Transactions', test: testTransactions },
    { name: 'Index Performance', test: testIndexPerformance }
  ]
  
  const results = []
  
  for (const { name, test } of tests) {
    console.log(`\n=== ${name} ===`)
    try {
      const passed = await test()
      results.push({ name, passed })
      console.log(`${passed ? '✅' : '❌'} ${name}: ${passed ? 'PASSED' : 'FAILED'}`)
    } catch (error) {
      results.push({ name, passed: false })
      console.error(`❌ ${name}: ERROR -`, error)
    }
  }
  
  // Summary
  console.log('\n📊 Test Summary:')
  console.log('================')
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`)
  })
  
  console.log(`\nResult: ${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed! Database is fully operational.')
  } else {
    console.log('⚠️ Some tests failed. Please review the errors above.')
  }
  
  return passed === total
}

// Run tests
runAllTests()
  .then(async (success) => {
    await disconnectDB()
    process.exit(success ? 0 : 1)
  })
  .catch(async (error) => {
    console.error('Fatal error during database testing:', error)
    await disconnectDB()
    process.exit(1)
  })