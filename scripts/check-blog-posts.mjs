#!/usr/bin/env node
/**
 * Check blog posts in database
 * Usage: node scripts/check-blog-posts.mjs
 */

import { PrismaClient } from '../prisma/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in environment')
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    console.log('🔍 Checking database for blog posts...\n')

    // Check database connection
    await prisma.$connect()
    console.log('✅ Database connection successful\n')

    // Count total posts
    const totalPosts = await prisma.blogPost.count()
    console.log(`📊 Total blog posts: ${totalPosts}`)

    if (totalPosts === 0) {
      console.log('\n❌ No blog posts found in database')
      console.log('\nOptions:')
      console.log('1. Create new Rev Ops blog posts/case studies')
      console.log('2. Import existing posts from storage')
      return
    }

    // Get published posts
    const publishedPosts = await prisma.blogPost.count({
      where: { status: 'PUBLISHED' }
    })
    console.log(`📝 Published posts: ${publishedPosts}`)

    // Get draft posts
    const draftPosts = await prisma.blogPost.count({
      where: { status: 'DRAFT' }
    })
    console.log(`📝 Draft posts: ${draftPosts}`)

    console.log('\n📄 Post Details:\n')

    // List all posts
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        category: {
          select: { name: true }
        },
        author: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`)
      console.log(`   Status: ${post.status}`)
      console.log(`   Slug: ${post.slug}`)
      console.log(`   Author: ${post.author?.name || 'Unknown'}`)
      console.log(`   Category: ${post.category?.name || 'None'}`)
      console.log(`   Published: ${post.publishedAt || 'Not published'}`)
      console.log()
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code === 'P2021') {
      console.error('\n⚠️  Database table does not exist. Run migrations:')
      console.error('   bun run db:generate')
      console.error('   bun run db:migrate')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
