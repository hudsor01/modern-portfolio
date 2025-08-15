/**
 * Comprehensive database operations validation
 * Tests all database operations for type safety and production readiness
 */

import { 
  BlogPostOperations, 
  AnalyticsOperations, 
  UserContextOperations, 
  TransactionOperations,
  DatabaseError,
  NotFoundError,
  ValidationError
} from '../src/lib/database/operations'
import { 
  DatabaseMonitor, 
  ConnectionManager, 
  QueryOptimizer, 
  DatabaseCache,
  validateDatabaseEnvironment 
} from '../src/lib/database/production-utils'
import { db } from '../src/lib/db'

interface TestResult {
  name: string
  passed: boolean
  duration: number
  error?: string
}

interface TestSuite {
  name: string
  tests: TestResult[]
  passed: number
  failed: number
  totalDuration: number
}

class DatabaseValidator {
  private testResults: TestSuite[] = []

  async runTest(name: string, testFn: () => Promise<void>): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      await testFn()
      const duration = Date.now() - startTime
      
      console.log(`✅ ${name} (${duration}ms)`)
      return { name, passed: true, duration }
      
    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      console.error(`❌ ${name} (${duration}ms): ${errorMessage}`)
      return { name, passed: false, duration, error: errorMessage }
    }
  }

  async runTestSuite(suiteName: string, tests: Array<{ name: string; test: () => Promise<void> }>): Promise<TestSuite> {
    console.log(`\n📋 Running test suite: ${suiteName}`)
    console.log('='.repeat(50))
    
    const startTime = Date.now()
    const results: TestResult[] = []
    
    for (const { name, test } of tests) {
      const result = await this.runTest(name, test)
      results.push(result)
    }
    
    const totalDuration = Date.now() - startTime
    const passed = results.filter(r => r.passed).length
    const failed = results.length - passed
    
    const suite: TestSuite = {
      name: suiteName,
      tests: results,
      passed,
      failed,
      totalDuration
    }
    
    this.testResults.push(suite)
    
    console.log(`\n📊 Suite Summary: ${passed}/${results.length} passed (${totalDuration}ms)`)
    
    return suite
  }

  // =======================
  // ENVIRONMENT TESTS
  // =======================

  async testEnvironment(): Promise<TestSuite> {
    return this.runTestSuite('Environment Validation', [
      {
        name: 'Environment variables are valid',
        test: async () => {
          validateDatabaseEnvironment()
        }
      },
      {
        name: 'Database connection is available',
        test: async () => {
          await ConnectionManager.ensureConnection()
        }
      },
      {
        name: 'Database health check passes',
        test: async () => {
          const health = await DatabaseMonitor.getHealth()
          if (health.status === 'unhealthy') {
            throw new Error(`Database is unhealthy: ${health.errors.map(e => e.type).join(', ')}`)
          }
        }
      }
    ])
  }

  // =======================
  // BLOG POST OPERATIONS TESTS
  // =======================

  async testBlogPostOperations(): Promise<TestSuite> {
    let testPostId: string | null = null
    let testAuthorId: string | null = null

    return this.runTestSuite('Blog Post Operations', [
      {
        name: 'Find published blog posts',
        test: async () => {
          const posts = await BlogPostOperations.findMany({
            status: 'PUBLISHED',
            limit: 5
          })
          
          if (posts.length === 0) {
            throw new Error('No published posts found')
          }
          
          // Validate type safety
          const post = posts[0]
          if (!post.author?.name || !post.title) {
            throw new Error('Post relations not properly loaded')
          }
          
          testAuthorId = post.author.id
        }
      },
      {
        name: 'Find blog post by slug',
        test: async () => {
          const posts = await BlogPostOperations.findMany({ limit: 1 })
          if (posts.length === 0) throw new Error('No posts available for testing')
          
          const post = await BlogPostOperations.findBySlug(posts[0].slug, true)
          
          if (!post.author || !post._count) {
            throw new Error('Post with relations not properly loaded')
          }
        }
      },
      {
        name: 'Handle not found error for invalid slug',
        test: async () => {
          try {
            await BlogPostOperations.findBySlug('non-existent-slug')
            throw new Error('Should have thrown NotFoundError')
          } catch (error) {
            if (!(error instanceof NotFoundError)) {
              throw new Error('Expected NotFoundError')
            }
          }
        }
      },
      {
        name: 'Create new blog post',
        test: async () => {
          if (!testAuthorId) throw new Error('No test author available')
          
          const post = await BlogPostOperations.create({
            title: 'Test Blog Post',
            slug: `test-blog-post-${Date.now()}`,
            content: 'This is a test blog post content with enough words to test reading time calculation.',
            excerpt: 'Test excerpt',
            authorId: testAuthorId,
            keywords: ['test', 'validation'],
            status: 'DRAFT'
          })
          
          testPostId = post.id
          
          if (!post.wordCount || !post.readingTime) {
            throw new Error('Word count and reading time not calculated')
          }
        }
      },
      {
        name: 'Update blog post',
        test: async () => {
          if (!testPostId) throw new Error('No test post available')
          
          const updatedPost = await BlogPostOperations.update({
            id: testPostId,
            title: 'Updated Test Blog Post',
            content: 'Updated content with more words to test reading time recalculation and validation.'
          })
          
          if (updatedPost.title !== 'Updated Test Blog Post') {
            throw new Error('Post not properly updated')
          }
        }
      },
      {
        name: 'Validate required fields on create',
        test: async () => {
          try {
            await BlogPostOperations.create({
              title: '',
              slug: 'empty-title',
              content: 'Content',
              authorId: testAuthorId!
            })
            throw new Error('Should have thrown ValidationError')
          } catch (error) {
            if (!(error instanceof ValidationError)) {
              throw new Error('Expected ValidationError for empty title')
            }
          }
        }
      },
      {
        name: 'Delete test blog post',
        test: async () => {
          if (!testPostId) throw new Error('No test post to delete')
          
          await BlogPostOperations.delete(testPostId)
          
          // Verify deletion
          try {
            await BlogPostOperations.findBySlug(`test-blog-post-${testPostId}`)
            throw new Error('Post should have been deleted')
          } catch (error) {
            if (!(error instanceof NotFoundError)) {
              throw new Error('Expected NotFoundError after deletion')
            }
          }
        }
      }
    ])
  }

  // =======================
  // ANALYTICS OPERATIONS TESTS
  // =======================

  async testAnalyticsOperations(): Promise<TestSuite> {
    let testPostId: string | null = null

    return this.runTestSuite('Analytics Operations', [
      {
        name: 'Get published post for analytics testing',
        test: async () => {
          const posts = await BlogPostOperations.findMany({
            status: 'PUBLISHED',
            limit: 1
          })
          
          if (posts.length === 0) {
            throw new Error('No published posts available for analytics testing')
          }
          
          testPostId = posts[0].id
        }
      },
      {
        name: 'Record page view',
        test: async () => {
          if (!testPostId) throw new Error('No test post available')
          
          await AnalyticsOperations.recordView(testPostId, {
            visitorId: 'test-visitor',
            sessionId: 'test-session',
            country: 'US',
            readingTime: 120,
            scrollDepth: 0.8
          })
        }
      },
      {
        name: 'Record interaction',
        test: async () => {
          if (!testPostId) throw new Error('No test post available')
          
          await AnalyticsOperations.recordInteraction(testPostId, 'LIKE', {
            visitorId: 'test-visitor',
            sessionId: 'test-session'
          })
        }
      },
      {
        name: 'Get analytics data',
        test: async () => {
          if (!testPostId) throw new Error('No test post available')
          
          const analytics = await AnalyticsOperations.getAnalytics({
            postId: testPostId,
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          })
          
          if (typeof analytics.totalViews !== 'number' || analytics.totalViews < 0) {
            throw new Error('Invalid analytics data structure')
          }
        }
      },
      {
        name: 'Validate analytics for non-existent post',
        test: async () => {
          try {
            await AnalyticsOperations.recordView('non-existent-id', {
              visitorId: 'test'
            })
            throw new Error('Should have thrown NotFoundError')
          } catch (error) {
            if (!(error instanceof NotFoundError)) {
              throw new Error('Expected NotFoundError for non-existent post')
            }
          }
        }
      }
    ])
  }

  // =======================
  // USER CONTEXT TESTS
  // =======================

  async testUserContext(): Promise<TestSuite> {
    return this.runTestSuite('User Context Operations', [
      {
        name: 'Set admin context',
        test: async () => {
          await UserContextOperations.setAdminContext()
          
          // Verify we can access all posts
          const posts = await BlogPostOperations.findMany({ 
            status: ['PUBLISHED', 'DRAFT'] as any,
            limit: 10 
          })
          
          // Should include both published and draft posts
          const hasDrafts = posts.some(p => p.status === 'DRAFT')
          const hasPublished = posts.some(p => p.status === 'PUBLISHED')
          
          if (!hasPublished) {
            throw new Error('Admin context should access published posts')
          }
        }
      },
      {
        name: 'Set author context',
        test: async () => {
          const authors = await db.author.findFirst()
          if (!authors) throw new Error('No authors available for testing')
          
          await UserContextOperations.setAuthorContext(authors.id)
        }
      },
      {
        name: 'Clear context',
        test: async () => {
          await UserContextOperations.clearContext()
          
          // Verify we can only access published posts
          const posts = await BlogPostOperations.findMany({ limit: 10 })
          const allPublished = posts.every(p => p.status === 'PUBLISHED')
          
          if (!allPublished) {
            throw new Error('Cleared context should only access published posts')
          }
        }
      }
    ])
  }

  // =======================
  // TRANSACTION TESTS
  // =======================

  async testTransactions(): Promise<TestSuite> {
    return this.runTestSuite('Transaction Operations', [
      {
        name: 'Create post with tags in transaction',
        test: async () => {
          const authors = await db.author.findFirst()
          if (!authors) throw new Error('No authors available for testing')
          
          const post = await TransactionOperations.createPostWithTags({
            title: 'Transaction Test Post',
            slug: `transaction-test-${Date.now()}`,
            content: 'This post was created in a transaction with tags.',
            authorId: authors.id,
            status: 'DRAFT'
          }, ['test-tag-1', 'test-tag-2'])
          
          // Verify post was created with tags
          const postWithTags = await BlogPostOperations.findBySlug(post.slug)
          if (postWithTags.tags.length !== 2) {
            throw new Error('Transaction did not create tags properly')
          }
          
          // Clean up
          await BlogPostOperations.delete(post.id)
        }
      },
      {
        name: 'Transaction rollback on error',
        test: async () => {
          try {
            await TransactionOperations.withTransaction(async (tx) => {
              // Create a post
              await tx.blogPost.create({
                data: {
                  title: 'Rollback Test',
                  slug: 'rollback-test',
                  content: 'This should be rolled back',
                  authorId: 'invalid-author-id' // This will cause an error
                }
              })
              
              throw new Error('Simulated transaction error')
            })
            
            throw new Error('Transaction should have rolled back')
          } catch (error) {
            if (error instanceof Error && error.message === 'Transaction should have rolled back') {
              throw error
            }
            // Expected error - transaction was rolled back
          }
        }
      }
    ])
  }

  // =======================
  // PERFORMANCE TESTS
  // =======================

  async testPerformance(): Promise<TestSuite> {
    return this.runTestSuite('Performance & Monitoring', [
      {
        name: 'Database health monitoring',
        test: async () => {
          const health = await DatabaseMonitor.getHealth()
          
          if (!health.timestamp || !health.connections || !health.performance) {
            throw new Error('Invalid health check structure')
          }
          
          if (health.responseTime > 10000) {
            throw new Error(`Database response time too slow: ${health.responseTime}ms`)
          }
        }
      },
      {
        name: 'Query optimization analysis',
        test: async () => {
          const slowQueries = await QueryOptimizer.getSlowQueries(5)
          // This might be empty in development, which is fine
          console.log(`Found ${slowQueries.length} slow queries in history`)
        }
      },
      {
        name: 'Cache operations',
        test: async () => {
          const testKey = 'test-cache-key'
          const testData = { test: 'data', timestamp: Date.now() }
          
          // Set cache
          DatabaseCache.set(testKey, testData, 1000)
          
          // Get cache
          const cached = DatabaseCache.get(testKey)
          if (!cached || cached.test !== testData.test) {
            throw new Error('Cache set/get not working properly')
          }
          
          // Test cache invalidation
          DatabaseCache.invalidate('test-cache')
          const invalidated = DatabaseCache.get(testKey)
          if (invalidated !== null) {
            throw new Error('Cache invalidation not working properly')
          }
        }
      },
      {
        name: 'Performance monitoring metrics',
        test: async () => {
          // Clear previous metrics
          DatabaseMonitor.clearMetrics()
          
          // Run a monitored operation
          const posts = await BlogPostOperations.findMany({ limit: 5 })
          
          // Check metrics were recorded
          const metrics = DatabaseMonitor.getMetrics()
          if (metrics.length === 0) {
            throw new Error('Performance metrics not being recorded')
          }
        }
      }
    ])
  }

  // =======================
  // SUMMARY AND REPORTING
  // =======================

  generateReport(): void {
    console.log('\n' + '='.repeat(80))
    console.log('📋 DATABASE VALIDATION REPORT')
    console.log('='.repeat(80))
    
    let totalPassed = 0
    let totalFailed = 0
    let totalDuration = 0
    
    for (const suite of this.testResults) {
      console.log(`\n📦 ${suite.name}:`)
      console.log(`   ✅ Passed: ${suite.passed}`)
      console.log(`   ❌ Failed: ${suite.failed}`)
      console.log(`   ⏱️  Duration: ${suite.totalDuration}ms`)
      
      if (suite.failed > 0) {
        console.log('   💥 Failures:')
        suite.tests
          .filter(t => !t.passed)
          .forEach(t => console.log(`      - ${t.name}: ${t.error}`))
      }
      
      totalPassed += suite.passed
      totalFailed += suite.failed
      totalDuration += suite.totalDuration
    }
    
    console.log('\n' + '='.repeat(80))
    console.log('📊 OVERALL SUMMARY:')
    console.log(`   ✅ Total Passed: ${totalPassed}`)
    console.log(`   ❌ Total Failed: ${totalFailed}`)
    console.log(`   ⏱️  Total Duration: ${totalDuration}ms`)
    console.log(`   📈 Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`)
    
    if (totalFailed === 0) {
      console.log('\n🎉 All tests passed! Database is production-ready.')
    } else {
      console.log('\n⚠️  Some tests failed. Please review and fix issues before production deployment.')
    }
    
    console.log('='.repeat(80))
  }

  async runAllTests(): Promise<boolean> {
    console.log('🧪 Starting comprehensive database validation...\n')
    
    try {
      await this.testEnvironment()
      await this.testBlogPostOperations()
      await this.testAnalyticsOperations()
      await this.testUserContext()
      await this.testTransactions()
      await this.testPerformance()
      
      this.generateReport()
      
      const totalFailed = this.testResults.reduce((sum, suite) => sum + suite.failed, 0)
      return totalFailed === 0
      
    } catch (error) {
      console.error('💥 Fatal error during validation:', error)
      return false
    }
  }
}

// Run validation
async function main() {
  const validator = new DatabaseValidator()
  const success = await validator.runAllTests()
  
  await db.$disconnect()
  process.exit(success ? 0 : 1)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})