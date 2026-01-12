#!/usr/bin/env node
/**
 * Initialize blog database with author and category
 * Usage: node scripts/init-blog-database.mjs
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
    console.log('🔧 Initializing blog database...\n')

    await prisma.$connect()
    console.log('✅ Database connection successful\n')

    // Create author
    const author = await prisma.author.upsert({
      where: { email: 'richard@thehudsonfam.com' },
      update: {},
      create: {
        name: 'Richard Hudson',
        email: 'richard@thehudsonfam.com',
        slug: 'richard-hudson',
        bio: 'Revenue Operations Professional with expertise in data analytics, sales optimization, and process automation.',
        avatar: null,
      }
    })
    console.log(`✅ Author created/verified: ${author.name} (ID: ${author.id})`)

    // Create RevOps Strategy category
    const category = await prisma.category.upsert({
      where: { slug: 'revops-strategy' },
      update: {},
      create: {
        name: 'RevOps Strategy',
        slug: 'revops-strategy',
        description: 'Strategic approaches to Revenue Operations, covering analytics, automation, and optimization.',
      }
    })
    console.log(`✅ Category created/verified: ${category.name} (ID: ${category.id})`)

    // Store IDs for reference
    console.log('\n📋 Database IDs for n8n workflow:')
    console.log(`   Author ID: ${author.id}`)
    console.log(`   Category ID: ${category.id}`)

    console.log('\n✨ Database initialization complete!')
    console.log('\n📝 Ready to generate blog posts with n8n workflow')

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
