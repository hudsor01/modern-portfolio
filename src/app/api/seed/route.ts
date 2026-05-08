import { type NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { count, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { authors, blogPosts, categories } from '@/db/schema'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env-validation'

function isAuthorized(request: NextRequest): boolean {
  const expected = env.ADMIN_API_TOKEN
  if (!expected) return false

  const header = request.headers.get('authorization') ?? ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) return false

  const provided = (match[1] ?? '').trim()
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  if (env.NODE_ENV === 'production' && env.ALLOW_SEED_IN_PRODUCTION !== 'true') {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }

  if (!isAuthorized(request)) {
    logger.warn('Unauthorized seed attempt', { route: 'api/seed' })
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const existingPostsRows = await db.select({ value: count() }).from(blogPosts)
    const existingPosts = existingPostsRows[0]?.value ?? 0
    if (existingPosts > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already has data',
      })
    }

    logger.info('Seeding database via API', { route: 'api/seed' })

    const authorRows = await db
      .insert(authors)
      .values({
        name: 'Richard Hudson',
        email: 'richard@modernportfolio.dev',
        slug: 'richard-hudson',
        bio: 'Revenue Operations Professional with expertise in data analytics, process optimization, and business intelligence.',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
        website: 'https://richardwhudsonjr.com',
        linkedin: 'https://linkedin.com/in/hudsor01',
      })
      .returning()
    const author = authorRows[0]
    if (!author) throw new Error('Failed to insert author')

    const categoryRows = await db
      .insert(categories)
      .values([
        {
          name: 'Revenue Operations',
          slug: 'revenue-operations',
          description:
            'Insights on revenue operations, data analytics, and business growth strategies.',
          color: '#3B82F6',
        },
        {
          name: 'Data Analytics',
          slug: 'data-analytics',
          description: 'Data analysis techniques, visualization, and business intelligence.',
          color: '#10B981',
        },
      ])
      .returning()

    const cat0 = categoryRows[0]
    const cat1 = categoryRows[1]
    if (!cat0 || !cat1) throw new Error('Failed to insert categories')

    await db.insert(blogPosts).values([
      {
        title: 'Getting Started with Revenue Operations',
        slug: 'getting-started-revenue-operations',
        excerpt:
          'A comprehensive guide to understanding and implementing revenue operations in your organization.',
        content: `# Getting Started with Revenue Operations

Revenue Operations (RevOps) is the strategic approach to aligning sales, marketing, and customer success teams around a common goal: driving revenue growth.

## Why RevOps Matters

In today's competitive landscape, companies need to break down silos between departments and create a unified approach to revenue generation. RevOps provides the framework to do this effectively.

## Key Components

1. **Data Integration**: Connecting all revenue-related data sources
2. **Process Optimization**: Streamlining workflows across teams
3. **Technology Stack**: Implementing the right tools for your needs
4. **Metrics & Analytics**: Measuring what matters

## Getting Started

Start by assessing your current state and identifying quick wins. Focus on data integration first, then move to process improvements.`,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        readingTime: 5,
        wordCount: 250,
        authorId: author.id,
        categoryId: cat0.id,
      },
      {
        title: 'Data-Driven Decision Making in Business',
        slug: 'data-driven-decision-making',
        excerpt:
          'How to leverage data analytics to make better business decisions and drive growth.',
        content: `# Data-Driven Decision Making in Business

In the age of big data, making decisions based on intuition alone is no longer sufficient. Data-driven decision making has become essential for business success.

## The Data-Driven Framework

1. **Define the Question**: What problem are you trying to solve?
2. **Collect Data**: Gather relevant data from multiple sources
3. **Analyze**: Use statistical methods and visualization
4. **Interpret**: Draw meaningful insights
5. **Act**: Implement changes based on findings

## Tools and Technologies

- SQL for data querying
- Python/R for statistical analysis
- Tableau/Power BI for visualization
- Machine learning for predictive analytics`,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 86400000),
        readingTime: 7,
        wordCount: 350,
        authorId: author.id,
        categoryId: cat1.id,
      },
    ])

    for (const category of categoryRows) {
      const rows = await db
        .select({ value: count() })
        .from(blogPosts)
        .where(eq(blogPosts.categoryId, category.id))
      const c = rows[0]?.value ?? 0
      await db.update(categories).set({ postCount: c }).where(eq(categories.id, category.id))
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        author: 1,
        categories: categoryRows.length,
        posts: 2,
      },
    })
  } catch (error) {
    logger.error('Seeding failed', error instanceof Error ? error : new Error(String(error)), {
      route: 'api/seed',
    })
    return NextResponse.json(
      {
        success: false,
        error: 'Seeding failed',
      },
      { status: 500 }
    )
  }
}
