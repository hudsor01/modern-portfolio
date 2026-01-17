/**
 * Database Seeding Script for Blog System
 * Creates sample data for development and testing
 */

import { PrismaClient, Prisma } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import type {
  Author,
  BlogPost,
  Category,
  Tag,
  PostStatus,
  ContentType,
  InteractionType,
} from '../src/generated/prisma/client'
import { showcaseProjects } from '../src/data/projects'

// Create the Neon adapter for seeding
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const db = new PrismaClient({ adapter })

// =======================
// SEED DATA CONSTANTS
// =======================

const SAMPLE_AUTHORS = [
  {
    name: 'Richard Hudson',
    email: 'richard@richardwhudsonjr.com',
    slug: 'richard-hudson',
    bio: 'Revenue Operations Professional with expertise in data analytics, process optimization, and business intelligence. Passionate about turning data into actionable business insights.',
    avatar: '/images/richard.jpg',
    website: 'https://richardwhudsonjr.com',
    twitter: 'hudsor01',
    linkedin: 'https://linkedin.com/in/hudsor01',
    github: 'hudsor01',
    metaDescription:
      'Revenue Operations expert specializing in data analytics and business intelligence for sustainable growth.',
  },
]

const SAMPLE_CATEGORIES = [
  {
    name: 'Revenue Operations',
    slug: 'revenue-operations',
    description:
      'Strategies, tools, and insights for optimizing revenue processes and driving sustainable business growth.',
    color: '#3B82F6',
    icon: 'trending-up',
    metaTitle: 'Revenue Operations Insights & Strategies',
    metaDescription:
      'Expert insights on revenue operations, process optimization, and data-driven growth strategies.',
    keywords: ['revenue operations', 'business growth', 'process optimization', 'data analytics'],
  },
  {
    name: 'Data Analytics',
    slug: 'data-analytics',
    description:
      'Deep dives into data analysis techniques, visualization best practices, and business intelligence insights.',
    color: '#10B981',
    icon: 'bar-chart',
    metaTitle: 'Data Analytics & Business Intelligence',
    metaDescription:
      'Comprehensive guides on data analytics, visualization, and turning data into actionable business insights.',
    keywords: ['data analytics', 'business intelligence', 'data visualization', 'metrics'],
  },
  {
    name: 'Sales Technology',
    slug: 'sales-technology',
    description:
      'Reviews and tutorials on CRM systems, sales automation tools, and technology stack optimization.',
    color: '#F59E0B',
    icon: 'settings',
    metaTitle: 'Sales Technology & CRM Solutions',
    metaDescription:
      'Expert reviews and guides on sales technology, CRM optimization, and automation tools.',
    keywords: ['sales technology', 'CRM', 'sales automation', 'tech stack'],
  },
  {
    name: 'Customer Analytics',
    slug: 'customer-analytics',
    description:
      'Understanding customer behavior, lifetime value analysis, and churn prediction strategies.',
    color: '#8B5CF6',
    icon: 'users',
    metaTitle: 'Customer Analytics & Behavior Insights',
    metaDescription:
      'Advanced customer analytics techniques including CLV analysis, churn prediction, and segmentation.',
    keywords: ['customer analytics', 'CLV', 'churn analysis', 'customer segmentation'],
    parentId: null, // Will be set to Data Analytics category
  },
  {
    name: 'Marketing Attribution',
    slug: 'marketing-attribution',
    description:
      'Multi-touch attribution models, campaign effectiveness measurement, and ROI optimization.',
    color: '#EF4444',
    icon: 'target',
    metaTitle: 'Marketing Attribution & ROI Analysis',
    metaDescription:
      'Complete guide to marketing attribution models, campaign measurement, and ROI optimization strategies.',
    keywords: [
      'marketing attribution',
      'ROI analysis',
      'campaign measurement',
      'attribution modeling',
    ],
    parentId: null, // Will be set to Data Analytics category
  },
]

const SAMPLE_TAGS = [
  {
    name: 'KPIs',
    slug: 'kpis',
    description: 'Key Performance Indicators and metrics',
    color: '#3B82F6',
  },
  {
    name: 'Dashboards',
    slug: 'dashboards',
    description: 'Dashboard design and best practices',
    color: '#10B981',
  },
  {
    name: 'Salesforce',
    slug: 'salesforce',
    description: 'Salesforce CRM tips and tricks',
    color: '#00A1E0',
  },
  {
    name: 'SQL',
    slug: 'sql',
    description: 'SQL queries and database optimization',
    color: '#F59E0B',
  },
  {
    name: 'Python',
    slug: 'python',
    description: 'Python for data analysis and automation',
    color: '#3776AB',
  },
  {
    name: 'Tableau',
    slug: 'tableau',
    description: 'Tableau visualization techniques',
    color: '#E97627',
  },
  {
    name: 'Power BI',
    slug: 'power-bi',
    description: 'Microsoft Power BI tutorials',
    color: '#F2C811',
  },
  {
    name: 'Machine Learning',
    slug: 'machine-learning',
    description: 'ML applications in business',
    color: '#8B5CF6',
  },
  {
    name: 'Forecasting',
    slug: 'forecasting',
    description: 'Revenue and demand forecasting',
    color: '#EF4444',
  },
  {
    name: 'Lead Scoring',
    slug: 'lead-scoring',
    description: 'Lead qualification and scoring models',
    color: '#06B6D4',
  },
  {
    name: 'A/B Testing',
    slug: 'ab-testing',
    description: 'Experimental design and testing',
    color: '#84CC16',
  },
  {
    name: 'Cohort Analysis',
    slug: 'cohort-analysis',
    description: 'Customer cohort analysis techniques',
    color: '#F97316',
  },
]



// =======================
// SEEDING FUNCTIONS
// =======================

async function seedAuthors() {
  console.log('Seeding authors...')

  const authors = []
  for (const authorData of SAMPLE_AUTHORS) {
    const author = await db.author.upsert({
      where: { email: authorData.email },
      create: authorData,
      update: authorData,
    })
    authors.push(author)
  }

  console.log(`Created ${authors.length} authors`)
  return authors
}

async function seedCategories() {
  console.log('Seeding categories...')

  const categories = []

  // Create root categories first
  const rootCategories = SAMPLE_CATEGORIES.filter((cat) => !cat.parentId)
  for (const categoryData of rootCategories) {
    const { parentId, ...data } = categoryData
    const category = await db.category.upsert({
      where: { slug: data.slug },
      create: data,
      update: data,
    })
    categories.push(category)
  }

  // Create subcategories
  const dataAnalyticsCategory = categories.find((cat) => cat.slug === 'data-analytics')
  if (dataAnalyticsCategory) {
    const subcategories = SAMPLE_CATEGORIES.filter((cat) => cat.parentId !== null)
    for (const categoryData of subcategories) {
      const { parentId, ...data } = categoryData
      const category = await db.category.upsert({
        where: { slug: data.slug },
        create: { ...data, parentId: dataAnalyticsCategory.id },
        update: { ...data, parentId: dataAnalyticsCategory.id },
      })
      categories.push(category)
    }
  }

  console.log(`Created ${categories.length} categories`)
  return categories
}

async function seedTags() {
  console.log('Seeding tags...')

  const tags = []
  for (const tagData of SAMPLE_TAGS) {
    const tag = await db.tag.upsert({
      where: { slug: tagData.slug },
      create: tagData,
      update: tagData,
    })
    tags.push(tag)
  }

  console.log(`Created ${tags.length} tags`)
  return tags
}



async function seedProjects() {
  console.log('Seeding projects...')

  await db.project.createMany({
    data: showcaseProjects.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      longDescription: p.longDescription,
      content: null,
      image: p.image,
      link: null,
      github: null,
      category: p.category,
      tags: p.technologies,
      featured: p.featured,
      client: p.client,
      role: null,
      duration: p.duration,
      year: p.year,
      caseStudyUrl: p.caseStudyUrl,
      // JSON fields - cast through unknown to Prisma.InputJsonValue for type compatibility
      impact: p.impact as unknown as Prisma.InputJsonValue,
      results: p.results as unknown as Prisma.InputJsonValue,
      displayMetrics: p.displayMetrics.map(m => ({
        label: m.label,
        value: m.value,
        iconName: m.icon.name?.toLowerCase() || 'circle',
      })) as unknown as Prisma.InputJsonValue,
      metrics: p.metrics ? (p.metrics as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
      testimonial: Prisma.DbNull,
      gallery: Prisma.DbNull,
      details: Prisma.DbNull,
      charts: Prisma.DbNull,
      viewCount: 0,
      clickCount: 0,
    })),
    skipDuplicates: true,
  })

  const count = await db.project.count()
  console.log(`Created ${count} projects`)
  return count
}

async function generateBlogPostContent(
  title: string,
  category: string
): Promise<{ content: string; excerpt: string }> {
  const contentTemplates = {
    'revenue-operations': `
# ${title}

Revenue operations aligns sales, marketing, and customer success teams to drive predictable revenue growth. This guide covers the key components of successful revenue operations.

## Understanding Revenue Operations

Revenue operations (RevOps) breaks down silos between revenue-generating teams, creating a unified approach to:

- **Data Management**: Centralizing customer data across all touchpoints
- **Process Optimization**: Streamlining workflows for maximum efficiency  
- **Technology Integration**: Connecting tools to share data across systems
- **Performance Analytics**: Measuring what matters for revenue growth

## Key Metrics to Track

### Leading Indicators
- Marketing Qualified Leads (MQLs)
- Sales Qualified Leads (SQLs) 
- Pipeline velocity
- Lead-to-opportunity conversion rate

### Lagging Indicators
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Revenue growth rate

## Implementation Strategy

Successfully implementing revenue operations requires a systematic approach:

1. **Audit Current State**: Document existing processes, tools, and data flows
2. **Define Success Metrics**: Establish KPIs that align with business objectives
3. **Technology Stack Review**: Evaluate and integrate revenue-critical tools
4. **Team Alignment**: Create cross-functional workflows and communication protocols
5. **Continuous Improvement**: Regular analysis and optimization of processes

## Best Practices

### Data Quality Management
Maintaining clean, accurate data is fundamental to revenue operations success. Implement:
- Regular data cleansing procedures
- Standardized data entry protocols
- Automated validation rules
- Duplicate detection and merging

### Reporting and Analytics
Create dashboards that provide actionable insights:
- Executive summaries with key metrics
- Operational reports for day-to-day management
- Diagnostic analysis for problem identification
- Predictive analytics for forecasting

## Making It Work

Revenue operations requires more than technology. You need team alignment, better processes, and decisions based on actual data.
    `,
    'data-analytics': `
# ${title}

Data analytics has become the cornerstone of modern business decision-making. This guide explores advanced techniques and best practices for turning raw data into actionable business insights.

## The Analytics Maturity Model

Organizations typically progress through four stages of analytics maturity:

### 1. Descriptive Analytics
**What happened?**
- Historical reporting
- Basic dashboards
- Performance summaries
- Trend analysis

### 2. Diagnostic Analytics  
**Why did it happen?**
- Root cause analysis
- Correlation studies
- Comparative analysis
- Drill-down capabilities

### 3. Predictive Analytics
**What might happen?**
- Forecasting models
- Risk assessment
- Scenario planning
- Machine learning applications

### 4. Prescriptive Analytics
**What should we do?**
- Optimization models
- Recommendation engines
- Automated decision-making
- Strategic planning support

## Essential Tools and Technologies

### Data Collection
- **Web Analytics**: Google Analytics, Adobe Analytics
- **Customer Data**: CRM systems, customer surveys
- **Business Intelligence**: Salesforce Analytics, HubSpot
- **Third-party Data**: Market research, industry benchmarks

### Analysis Platforms
- **SQL Databases**: PostgreSQL, MySQL, BigQuery
- **Programming Languages**: Python, R, SQL
- **Visualization Tools**: Tableau, Power BI, Looker
- **Statistical Software**: SPSS, SAS, Stata

## Analytical Techniques

### Statistical Methods
- Regression analysis
- Hypothesis testing
- Time series analysis
- Cluster analysis

### Machine Learning
- Supervised learning (classification, regression)
- Unsupervised learning (clustering, dimensionality reduction)
- Deep learning applications
- Natural language processing

## Data Visualization Best Practices

Effective data visualization follows key principles:

### Design Principles
1. **Clarity**: Charts should be immediately understandable
2. **Accuracy**: Visual representations must reflect data truthfully
3. **Efficiency**: Minimize cognitive load for viewers
4. **Aesthetics**: Professional appearance builds trust

### Common Chart Types
- **Line Charts**: Trends over time
- **Bar Charts**: Category comparisons
- **Scatter Plots**: Relationships between variables
- **Heat Maps**: Data density and patterns
- **Dashboards**: Multiple metrics at a glance

## Implementation Roadmap

### Phase 1: Foundation (Months 1-3)
- Data infrastructure setup
- Tool selection and procurement
- Team training and skill development
- Basic reporting implementation

### Phase 2: Enhancement (Months 4-6)
- Advanced analytics capabilities
- Self-service analytics platforms
- Automated reporting systems
- Data quality improvements

### Phase 3: Optimization (Months 7-12)
- Predictive modeling
- Real-time analytics
- Advanced visualization
- AI/ML integration

## Conclusion

Successful data analytics programs combine technical expertise with business acumen to drive measurable results and competitive advantage.
    `,
    'sales-technology': `
# ${title}

The sales technology landscape has evolved dramatically, offering unprecedented opportunities to automate processes, gain insights, and drive revenue growth. This comprehensive guide explores the latest tools and strategies.

## The Modern Sales Tech Stack

A well-designed sales technology stack typically includes:

### Core Components
- **CRM System**: Central hub for customer data and interactions
- **Sales Engagement Platform**: Multi-channel outreach automation
- **Conversation Intelligence**: Call analysis and coaching insights
- **Sales Analytics**: Performance tracking and forecasting

### Supporting Tools
- **Lead Intelligence**: Prospect research and enrichment
- **Email Marketing**: Automated drip campaigns and sequences
- **Document Management**: Proposal and contract automation
- **Revenue Intelligence**: Advanced analytics and AI insights

## CRM Optimization Strategies

### Data Quality Management
Maintaining accurate CRM data is crucial for success:

#### Best Practices
1. **Standardized Data Entry**: Consistent formatting and required fields
2. **Regular Data Cleansing**: Remove duplicates and outdated information
3. **Automated Validation**: Real-time checks for data accuracy
4. **Integration Management**: Seamless data flow between systems

### Process Automation
Streamline repetitive tasks to focus on high-value activities:

#### Key Areas
- Lead routing and assignment
- Follow-up task creation
- Pipeline stage progression
- Report generation and distribution

## Sales Engagement Platforms

### Multi-Channel Outreach
Modern sales requires engagement across multiple touchpoints:

- **Email Sequences**: Personalized drip campaigns
- **Social Selling**: LinkedIn and platform-specific outreach  
- **Phone Automation**: Smart dialing and voicemail drops
- **Video Messaging**: Personalized video communication

### Personalization at Scale
Balance automation with authentic, personalized communication:

#### Techniques
1. **Dynamic Content**: Variable text based on prospect data
2. **Behavioral Triggers**: Actions based on engagement patterns
3. **Account Intelligence**: Company-specific messaging
4. **Industry Customization**: Vertical-specific value propositions

## Conversation Intelligence

### AI-Powered Call Analysis
Modern platforms analyze sales calls to provide insights:

#### Key Features
- **Sentiment Analysis**: Customer emotional state tracking
- **Talk-to-Listen Ratio**: Conversation balance metrics
- **Keyword Detection**: Important topics and competitors mentioned
- **Coaching Recommendations**: Improvement suggestions based on patterns

### Performance Optimization
Use conversation data to improve sales performance:

- **Winning Call Patterns**: Identify successful conversation structures
- **Objection Handling**: Track common concerns and effective responses
- **Competitor Intelligence**: Monitor competitive mentions and positioning
- **Onboarding Acceleration**: Use data to train new sales reps faster

## Implementation Strategy

### Phase 1: Assessment and Planning
1. **Current State Analysis**: Audit existing tools and processes
2. **Gap Identification**: Determine technology and process improvements needed
3. **ROI Projection**: Calculate expected return on investment
4. **Stakeholder Buy-in**: Secure leadership support and budget approval

### Phase 2: Tool Selection and Integration
1. **Vendor Evaluation**: Compare features, pricing, and integrations
2. **Pilot Testing**: Small-scale implementation and feedback collection
3. **Data Migration**: Transfer existing data to new systems
4. **Integration Setup**: Connect tools to share data across systems

### Phase 3: Training and Adoption
1. **User Training**: Comprehensive education on new tools and processes
2. **Change Management**: Address resistance and encourage adoption
3. **Performance Monitoring**: Track usage and effectiveness metrics
4. **Continuous Improvement**: Regular optimization based on feedback

## Measuring Success

### Key Performance Indicators
- **Activity Metrics**: Calls, emails, meetings scheduled
- **Conversion Rates**: Lead-to-opportunity, opportunity-to-close
- **Velocity Metrics**: Time in each sales stage
- **Revenue Impact**: Quota attainment and deal size changes

### ROI Calculation
Quantify the impact of sales technology investments:

#### Benefits
- Increased productivity (time saved)
- Higher conversion rates
- Larger deal sizes
- Reduced sales cycle length

#### Costs
- Software licensing and subscription fees
- Implementation and integration costs
- Training and change management expenses
- Ongoing maintenance and support

## Future Trends

### Artificial Intelligence Integration
AI is transforming sales technology across multiple areas:

- **Predictive Analytics**: Forecast deal probability and optimal actions
- **Lead Scoring**: Intelligent prospect prioritization
- **Content Recommendations**: AI-suggested sales materials
- **Automated Follow-up**: Smart timing and message optimization

### Revenue Intelligence Platforms
Next-generation platforms provide comprehensive revenue insights:

- **Deal Inspection**: Deep analysis of opportunity health
- **Forecast Accuracy**: Improved pipeline prediction
- **Risk Identification**: Early warning systems for at-risk deals
- **Coaching Insights**: Data-driven sales performance improvement

## Conclusion

Success with sales technology requires strategic planning, careful implementation, and ongoing optimization. Focus on tools that integrate well, provide clear ROI, and align with your sales process.
    `,
  }

  const template =
    contentTemplates[category as keyof typeof contentTemplates] ||
    contentTemplates['revenue-operations']
  const content = template.trim()

  // Generate excerpt from first paragraph
  const paragraphs = content.split('\n\n')
  const excerpt =
    paragraphs.find((p) => p.length > 100 && !p.startsWith('#'))?.substring(0, 200) + '...' ||
    `Comprehensive guide to ${title.toLowerCase()}. Learn key strategies, best practices, and implementation techniques.`

  return { content, excerpt }
}

async function seedBlogPosts(
  authors: Author[],
  categories: Category[],
  tags: Tag[]
) {
  console.log('Seeding blog posts...')

  const blogPosts = [
    // Revenue Operations Posts
    {
      title: 'Complete Guide to Revenue Operations Strategy',
      slug: 'complete-guide-revenue-operations-strategy',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'revenue-operations')?.id,
      status: 'PUBLISHED' as PostStatus,
      featuredImage:
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Revenue Operations Strategy Dashboard',
      metaTitle: 'Complete Revenue Operations Strategy Guide 2024',
      keywords: ['revenue operations', 'strategy', 'business growth', 'process optimization'],
      tagSlugs: ['kpis', 'dashboards', 'forecasting'],
    },
    {
      title: 'Building High-Performance Sales Dashboards',
      slug: 'building-high-performance-sales-dashboards',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'sales-technology')?.id,
      status: 'PUBLISHED' as PostStatus,
      featuredImage:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Interactive Sales Performance Dashboard',
      metaTitle: 'Sales Dashboard Design Best Practices',
      keywords: ['sales dashboards', 'data visualization', 'KPIs', 'Tableau'],
      tagSlugs: ['dashboards', 'kpis', 'tableau', 'salesforce'],
    },
    {
      title: 'Advanced Customer Churn Analysis with Python',
      slug: 'advanced-customer-churn-analysis-python',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'customer-analytics')?.id,
      status: 'PUBLISHED' as PostStatus,
      featuredImage:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Customer Churn Analysis Visualization',
      metaTitle: 'Customer Churn Analysis Guide with Python',
      keywords: ['customer churn', 'python', 'machine learning', 'predictive analytics'],
      tagSlugs: ['python', 'machine-learning', 'cohort-analysis'],
    },
    {
      title: 'Multi-Touch Attribution Modeling Best Practices',
      slug: 'multi-touch-attribution-modeling-best-practices',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'marketing-attribution')?.id,
      status: 'PUBLISHED' as PostStatus,
      featuredImage:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Marketing Attribution Model Diagram',
      metaTitle: 'Multi-Touch Attribution Models Guide',
      keywords: [
        'marketing attribution',
        'attribution modeling',
        'ROI analysis',
        'campaign measurement',
      ],
      tagSlugs: ['ab-testing', 'forecasting', 'dashboards'],
    },
    {
      title: 'Salesforce Revenue Analytics Implementation',
      slug: 'salesforce-revenue-analytics-implementation',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'sales-technology')?.id,
      status: 'PUBLISHED' as PostStatus,
      featuredImage:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Salesforce Analytics Cloud Dashboard',
      metaTitle: 'Salesforce Revenue Analytics Setup Guide',
      keywords: ['Salesforce', 'revenue analytics', 'CRM', 'business intelligence'],
      tagSlugs: ['salesforce', 'dashboards', 'kpis'],
    },
    {
      title: 'Lead Scoring Models That Actually Work',
      slug: 'lead-scoring-models-that-actually-work',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'data-analytics')?.id,
      status: 'PUBLISHED' as PostStatus,
      featuredImage:
        'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Lead Scoring Model Visualization',
      metaTitle: 'Effective Lead Scoring Model Implementation',
      keywords: ['lead scoring', 'predictive analytics', 'machine learning', 'sales qualification'],
      tagSlugs: ['lead-scoring', 'machine-learning', 'python'],
    },
    // Draft and scheduled posts
    {
      title: 'The Future of Revenue Operations Technology',
      slug: 'future-revenue-operations-technology',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'revenue-operations')?.id,
      status: 'DRAFT' as PostStatus,
      featuredImage:
        'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Future Technology Trends in Revenue Operations',
      metaTitle: 'Future of Revenue Operations Technology Trends',
      keywords: ['revenue operations', 'technology trends', 'AI', 'automation'],
      tagSlugs: ['forecasting', 'machine-learning'],
    },
    {
      title: 'Optimizing Customer Lifetime Value Calculations',
      slug: 'optimizing-customer-lifetime-value-calculations',
      authorId: authors[0]?.id || '',
      categoryId: categories.find((c) => c.slug === 'customer-analytics')?.id,
      status: 'SCHEDULED' as PostStatus,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      featuredImage:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center&q=80',
      featuredImageAlt: 'Customer Lifetime Value Analysis Dashboard',
      metaTitle: 'Customer Lifetime Value Optimization Guide',
      keywords: ['customer lifetime value', 'CLV', 'retention analysis', 'revenue forecasting'],
      tagSlugs: ['cohort-analysis', 'forecasting', 'python'],
    },
  ]

  const createdPosts = []
  for (let i = 0; i < blogPosts.length; i++) {
    const postData = blogPosts[i]
    if (!postData) continue

    const categoryName =
      categories.find((c) => c.id === postData.categoryId)?.slug || 'revenue-operations'
    const { content, excerpt } = await generateBlogPostContent(postData.title, categoryName)

    // Calculate word count and reading time
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Set published date for published posts
    const publishedAt =
      postData.status === 'PUBLISHED'
        ? new Date(Date.now() - (blogPosts.length - i) * 24 * 60 * 60 * 1000) // Stagger publication dates
        : undefined

    const { tagSlugs, ...postWithoutTags } = postData

    const post = await db.blogPost.create({
      data: {
        ...postWithoutTags,
        content,
        excerpt,
        wordCount,
        readingTime,
        publishedAt,
        viewCount: postData.status === 'PUBLISHED' ? Math.floor(Math.random() * 1000) + 100 : 0,
        likeCount: postData.status === 'PUBLISHED' ? Math.floor(Math.random() * 50) + 5 : 0,
        shareCount: postData.status === 'PUBLISHED' ? Math.floor(Math.random() * 25) + 2 : 0,
        commentCount: postData.status === 'PUBLISHED' ? Math.floor(Math.random() * 15) + 1 : 0,
        contentType: 'MARKDOWN' as ContentType,
      },
    })

    // Add tags
    if (tagSlugs) {
      for (const tagSlug of tagSlugs) {
        const tag = tags.find((t) => t.slug === tagSlug)
        if (tag) {
          await db.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          })
        }
      }
    }



    createdPosts.push(post)
  }

  console.log(`Created ${createdPosts.length} blog posts`)
  return createdPosts
}

async function seedAnalyticsData(posts: BlogPost[]) {
  console.log('Seeding analytics data...')

  let totalViews = 0
  let totalInteractions = 0

  for (const post of posts) {
    if (post.status !== 'PUBLISHED') continue

    // Generate view data
    const numViews = Math.floor(Math.random() * 50) + 10
    for (let i = 0; i < numViews; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const viewedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      await db.postView.create({
        data: {
          postId: post.id,
          visitorId: `visitor_${Math.random().toString(36).substring(7)}`,
          sessionId: `session_${Math.random().toString(36).substring(7)}`,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
          country: ['US', 'CA', 'UK', 'DE', 'FR', 'AU', 'JP'][Math.floor(Math.random() * 7)],
          readingTime: Math.floor(Math.random() * 600) + 60, // 1-10 minutes
          scrollDepth: Math.random(),
          viewedAt,
        },
      })
      totalViews++
    }

    // Generate interaction data
    const interactions: InteractionType[] = ['LIKE', 'SHARE', 'COMMENT', 'BOOKMARK']
    const numInteractions = Math.floor(Math.random() * 20) + 5

    for (let i = 0; i < numInteractions; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      await db.postInteraction.create({
        data: {
          postId: post.id,
          type: interactions[Math.floor(Math.random() * interactions.length)] as InteractionType,
          visitorId: `visitor_${Math.random().toString(36).substring(7)}`,
          sessionId: `session_${Math.random().toString(36).substring(7)}`,
          createdAt,
        },
      })
      totalInteractions++
    }
  }

  console.log(`Created ${totalViews} post views and ${totalInteractions} interactions`)
}





// =======================
// MAIN SEED FUNCTION
// =======================

async function main() {
  console.log('Starting database seeding...')

  try {
    // Clear existing data (in development only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Cleaning existing data...')
      await db.postInteraction.deleteMany()
      await db.postView.deleteMany()
      await db.postTag.deleteMany()
      await db.blogPost.deleteMany()
      await db.tag.deleteMany()
      await db.category.deleteMany()
      await db.author.deleteMany()
      await db.project.deleteMany()
      console.log('Cleaned existing data')
    }

    // Seed data in order
    const authors = await seedAuthors()
    const categories = await seedCategories()
    const tags = await seedTags()
    await seedProjects()
    const posts = await seedBlogPosts(authors, categories, tags)

    // Update stats after creating posts
    console.log('Updating entity statistics...')

    // Update category stats
    for (const category of categories) {
      const stats = await db.blogPost.aggregate({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
        },
        _count: { id: true },
        _sum: { viewCount: true },
      })

      await db.category.update({
        where: { id: category.id },
        data: {
          postCount: stats._count.id,
          totalViews: stats._sum.viewCount || 0,
        },
      })
    }

    // Update tag stats
    for (const tag of tags) {
      const stats = await db.postTag.aggregate({
        where: {
          tagId: tag.id,
          post: { status: 'PUBLISHED' },
        },
        _count: { tagId: true },
      })

      const totalViews = await db.blogPost.aggregate({
        where: {
          status: 'PUBLISHED',
          tags: { some: { tagId: tag.id } },
        },
        _sum: { viewCount: true },
      })

      await db.tag.update({
        where: { id: tag.id },
        data: {
          postCount: stats._count.tagId,
          totalViews: totalViews._sum.viewCount || 0,
        },
      })
    }

    // Update author stats
    for (const author of authors) {
      const stats = await db.blogPost.aggregate({
        where: {
          authorId: author.id,
          status: 'PUBLISHED',
        },
        _count: { id: true },
        _sum: { viewCount: true },
      })

      await db.author.update({
        where: { id: author.id },
        data: {
          totalPosts: stats._count.id,
          totalViews: stats._sum.viewCount || 0,
        },
      })
    }



    // Seed analytics data
    await seedAnalyticsData(posts)

    console.log('Database seeding completed successfully!')

    // Print summary
    const summary = await Promise.all([
      db.author.count(),
      db.category.count(),
      db.tag.count(),
      db.project.count(),
      db.blogPost.count(),
      db.postView.count(),
      db.postInteraction.count(),
    ])

    console.log('\nSeeding Summary:')
    console.log(`Authors: ${summary[0]}`)
    console.log(`Categories: ${summary[1]}`)
    console.log(`Tags: ${summary[2]}`)
    console.log(`Projects: ${summary[3]}`)
    console.log(`Blog Posts: ${summary[4]}`)
    console.log(`Post Views: ${summary[5]}`)
    console.log(`Interactions: ${summary[6]}`)
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Run the seeding script
main().catch((error) => {
  console.error('Fatal error during database seeding:', error)
  process.exit(1)
})
