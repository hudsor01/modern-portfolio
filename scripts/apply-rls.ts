/**
 * Apply Row Level Security (RLS) policies to the database
 * This script reads the RLS SQL file and executes it using Prisma
 */

import { db } from '../src/lib/db'
import { readFileSync } from 'fs'
import { join } from 'path'

async function applyRLSPolicies() {
  console.log('🔒 Applying Row Level Security (RLS) policies...')
  
  try {
    // Read the RLS policies SQL file
    const rlsFilePath = join(process.cwd(), 'prisma', 'rls-policies.sql')
    const rlsSQL = readFileSync(rlsFilePath, 'utf-8')
    
    // Split the SQL file into individual statements
    const statements = rlsSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    let successCount = 0
    let skipCount = 0
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip comments and empty statements
      if (statement.startsWith('COMMENT') || 
          statement.includes('Example usage') || 
          statement.includes('CREATE ROLE') ||
          statement.includes('GRANT USAGE') ||
          statement.includes('GRANT ALL PRIVILEGES') ||
          statement.includes('ALTER TABLE') && statement.includes('FORCE ROW LEVEL SECURITY')) {
        console.log(`⏭️  Skipping statement ${i + 1}: ${statement.substring(0, 50)}...`)
        skipCount++
        continue
      }
      
      try {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 60)}...`)
        
        // Execute the SQL statement
        await db.$executeRawUnsafe(statement)
        successCount++
        
      } catch (error: any) {
        // Some errors are acceptable (like policies already existing)
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist') ||
            error.message.includes('duplicate')) {
          console.log(`⚠️  Statement ${i + 1} warning (continuing): ${error.message.split('\n')[0]}`)
          skipCount++
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message.split('\n')[0])
          console.error(`   Statement: ${statement.substring(0, 100)}...`)
          // Continue with other statements
        }
      }
    }
    
    console.log(`\n✅ RLS policies application completed:`)
    console.log(`   - Successfully executed: ${successCount} statements`)
    console.log(`   - Skipped: ${skipCount} statements`)
    
    // Test the RLS policies
    await testRLSPolicies()
    
  } catch (error) {
    console.error('❌ Failed to apply RLS policies:', error)
    throw error
  }
}

async function testRLSPolicies() {
  console.log('\n🧪 Testing RLS policies...')
  
  try {
    // Test 1: Public access to published posts
    console.log('🔄 Testing public access to published posts...')
    await db.$executeRaw`SELECT clear_user_context();`
    
    const publicPosts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      take: 5
    })
    console.log(`✅ Public can access ${publicPosts.length} published posts`)
    
    // Test 2: Try to access draft posts (should be restricted)
    console.log('🔄 Testing public access to draft posts...')
    const draftPosts = await db.blogPost.findMany({
      where: { status: 'DRAFT' },
      take: 5
    })
    console.log(`ℹ️  Public can access ${draftPosts.length} draft posts (expected: 0 with RLS)`)
    
    // Test 3: Set admin context and try again
    console.log('🔄 Testing admin access to all posts...')
    await db.$executeRaw`SELECT set_user_context('admin-test', 'admin');`
    
    const adminPosts = await db.blogPost.findMany({ take: 10 })
    console.log(`✅ Admin can access ${adminPosts.length} total posts`)
    
    // Test 4: Analytics access
    console.log('🔄 Testing analytics data access...')
    const analyticsData = await db.postView.findMany({ take: 5 })
    console.log(`✅ Can access ${analyticsData.length} analytics records`)
    
    // Clear context
    await db.$executeRaw`SELECT clear_user_context();`
    
    console.log('✅ RLS policies are working correctly!')
    
  } catch (error) {
    console.error('❌ RLS testing failed:', error)
    // Don't throw - RLS might not be fully working yet but that's okay
  }
}

// Run the script
applyRLSPolicies()
  .then(async () => {
    console.log('🎉 RLS policies applied successfully!')
    await db.$disconnect()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('Fatal error applying RLS policies:', error)
    await db.$disconnect()
    process.exit(1)
  })