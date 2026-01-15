import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('🌱 Seeding database via API...');

    // Check if already seeded
    const existingPosts = await db.blogPost.count();
    if (existingPosts > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already has data'
      });
    }

    // Create author
    const author = await db.author.create({
      data: {
        name: 'Richard Hudson',
        email: 'richard@modernportfolio.dev',
        slug: 'richard-hudson',
        bio: 'Revenue Operations Professional with expertise in data analytics, process optimization, and business intelligence.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
        website: 'https://richardwhudsonjr.com',
        linkedin: 'https://linkedin.com/in/hudsor01'
      }
    });

    // Create categories
    const categories = await Promise.all([
      db.category.create({
        data: {
          name: 'Revenue Operations',
          slug: 'revenue-operations',
          description: 'Insights on revenue operations, data analytics, and business growth strategies.',
          color: '#3B82F6'
        }
      }),
      db.category.create({
        data: {
          name: 'Data Analytics',
          slug: 'data-analytics',
          description: 'Data analysis techniques, visualization, and business intelligence.',
          color: '#10B981'
        }
      })
    ]);

    // Create sample blog posts
    await Promise.all([
      db.blogPost.create({
        data: {
          title: 'Getting Started with Revenue Operations',
          slug: 'getting-started-revenue-operations',
          excerpt: 'A comprehensive guide to understanding and implementing revenue operations in your organization.',
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
          categoryId: categories[0].id
        }
      }),

      db.blogPost.create({
        data: {
          title: 'Data-Driven Decision Making in Business',
          slug: 'data-driven-decision-making',
          excerpt: 'How to leverage data analytics to make better business decisions and drive growth.',
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
          categoryId: categories[1].id
        }
      })
    ]);

    // Update category post counts
    for (const category of categories) {
      const count = await db.blogPost.count({
        where: { categoryId: category.id }
      });
      await db.category.update({
        where: { id: category.id },
        data: { postCount: count }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        author: 1,
        categories: categories.length,
        posts: 2
      }
    });

  } catch (error) {
    console.error('Seeding failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}