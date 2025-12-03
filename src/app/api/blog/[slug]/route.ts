import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BlogPostData } from '@/types/shared-api';
import { createContextLogger } from '@/lib/monitoring/logger';

const logger = createContextLogger('SlugAPI');

/**
 * Individual Blog Post API Route Handler
 * GET /api/blog/[slug] - Get single blog post by slug
 * PUT /api/blog/[slug] - Update blog post by slug
 * DELETE /api/blog/[slug] - Delete blog post by slug
 * 
 * Follows existing API patterns from shared-api.ts and matches portfolio architecture
 */

// Helper function to get real analytics data
async function getBlogAnalytics(slug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://richardwhudsonjr.com' 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/analytics/views?type=blog&slug=${slug}`)
    if (!response.ok) {
      return { viewCount: 0, likeCount: 0, shareCount: 0, commentCount: 0 }
    }
    
    const data = await response.json()
    const blogViews = data.success ? data.data.views.find((v: { slug: string; totalViews: number }) => v.slug === slug) : null
    
    return {
      viewCount: blogViews?.totalViews || 0,
      likeCount: 0, // Would be implemented separately
      shareCount: 0, // Would be implemented separately
      commentCount: 0 // Would be implemented separately
    }
  } catch (error) {
    logger.error('Failed to fetch analytics', error instanceof Error ? error : new Error(String(error)))
    return { viewCount: 0, likeCount: 0, shareCount: 0, commentCount: 0 }
  }
}

// Import mock data from main route - in real implementation, use database
const mockBlogPosts: BlogPostData[] = [
  {
    id: '2',
    title: 'Building Effective Sales Dashboards with Real-Time Data',
    slug: 'building-effective-sales-dashboards-real-time-data',
    excerpt: 'Learn how to create compelling sales dashboards that drive decision-making and improve team performance.',
    content: `# Building Effective Sales Dashboards

Data visualization is crucial for modern sales teams. An effective dashboard provides real-time insights that drive decision-making and improve performance.

## Key Dashboard Components

### 1. Revenue Metrics
- Monthly Recurring Revenue (MRR)
- Year-over-year growth
- Pipeline velocity
- Win rates by stage

### 2. Activity Tracking
- Calls and meetings scheduled
- Emails sent and responses
- Lead generation metrics
- Follow-up activity

### 3. Performance Indicators
- Individual rep performance
- Team quotas and attainment
- Forecast accuracy
- Deal progression

## Best Practices

1. **Keep it Simple**: Focus on the most important metrics
2. **Real-time Updates**: Ensure data is current and accurate
3. **Mobile Friendly**: Design for various screen sizes
4. **Actionable Insights**: Include clear next steps
5. **Regular Reviews**: Schedule weekly dashboard reviews

## Implementation Tips

- Choose the right visualization tools
- Integrate with your CRM system
- Automate data collection where possible
- Train your team on dashboard usage
- Iterate based on user feedback

## Conclusion

Effective sales dashboards transform raw data into actionable insights. By focusing on key metrics and maintaining data quality, sales teams can make better decisions and drive improved performance.`,
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    // SEO fields
    metaTitle: 'Building Effective Sales Dashboards with Real-Time Data | Richard Hudson',
    metaDescription: 'Learn how to create compelling sales dashboards that drive decision-making and improve team performance.',
    keywords: ['sales dashboards', 'data visualization', 'real-time analytics', 'business intelligence'],
    
    // Content metadata
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'Sales Dashboard with Charts and KPIs',
    readingTime: 6,
    wordCount: 900,
    
    // Publishing
    publishedAt: '2024-01-20T14:30:00Z',
    
    // Timestamps
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    
    // Relationships
    authorId: 'richard-hudson',
    author: {
      id: 'richard-hudson',
      name: 'Richard Hudson',
      email: 'richard@example.com',
      slug: 'richard-hudson',
      bio: 'Revenue Operations Professional with 8+ years of experience in data analytics and process optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
      totalPosts: 10,
      totalViews: 15000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    categoryId: 'data-visualization',
    category: {
      id: 'data-visualization',
      name: 'Data Visualization',
      slug: 'data-visualization',
      description: 'Techniques and best practices for effective data visualization',
      color: '#8B5CF6',
      postCount: 3,
      totalViews: 4500,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    tags: [
      {
        id: 'dashboards',
        name: 'Dashboards',
        slug: 'dashboards',
        color: '#F59E0B',
        postCount: 5,
        totalViews: 3200,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    
    // Analytics - Real data only, no fake metrics
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    commentCount: 0
  },
  {
    id: '1',
    title: 'Revenue Operations Best Practices: A Complete Guide',
    slug: 'revenue-operations-best-practices-complete-guide',
    excerpt: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation.',
    content: `# Revenue Operations Best Practices: A Complete Guide

Revenue operations (RevOps) has become a critical function for modern businesses looking to optimize their sales, marketing, and customer success efforts. As organizations grow, the need for streamlined processes, accurate data, and aligned teams becomes paramount.

## What is Revenue Operations?

Revenue Operations is the strategic approach to aligning sales, marketing, and customer success operations across the entire customer lifecycle. It focuses on process optimization, technology implementation, and data-driven decision making.

## Key Components of Effective RevOps

### 1. Data Management and Analytics
- Centralized data repository
- Real-time reporting and dashboards  
- Advanced analytics and forecasting
- Data quality and governance

### 2. Process Optimization
- Lead routing and management
- Sales pipeline standardization
- Customer onboarding workflows
- Performance tracking and KPIs

### 3. Technology Stack Integration
- CRM optimization and customization
- Marketing automation platforms
- Sales enablement tools
- Analytics and BI platforms

### 4. Cross-Functional Alignment
- Regular team meetings and communication
- Shared goals and metrics
- Collaborative planning processes
- Unified customer experience

## Best Practices for Implementation

### Start with Data Foundation
Before implementing any new processes or tools, ensure your data infrastructure is solid. This includes:
- Data cleansing and standardization
- Establishing single sources of truth
- Creating comprehensive tracking mechanisms
- Implementing data governance policies

### Focus on Process Before Technology
While technology is important, processes should drive tool selection, not the other way around:
- Document existing workflows
- Identify inefficiencies and gaps
- Design optimal future state processes
- Select tools that support these processes

### Measure and Iterate
Continuous improvement is key to RevOps success:
- Define clear KPIs and success metrics
- Regular performance reviews
- Feedback loops from all stakeholders
- Agile approach to process refinement

## Common Challenges and Solutions

### Challenge: Data Silos
**Solution:** Implement integrated platforms and establish data sharing protocols

### Challenge: Process Misalignment
**Solution:** Cross-functional workshops and collaborative process design

### Challenge: Technology Complexity
**Solution:** Focus on integration and user experience rather than feature richness

### Challenge: Change Management
**Solution:** Strong leadership support and comprehensive training programs

## Conclusion

Effective revenue operations require a holistic approach that combines people, process, and technology. By focusing on data-driven decision making, process optimization, and cross-functional alignment, organizations can significantly improve their revenue generation capabilities.

The key is to start small, measure results, and continuously iterate based on what you learn. With proper implementation, RevOps can transform how your organization generates and manages revenue.`,
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    // SEO fields
    metaTitle: 'Revenue Operations Best Practices: A Complete Guide | Richard Hudson',
    metaDescription: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation. Expert insights from a RevOps professional.',
    keywords: ['revenue operations', 'revops', 'data analytics', 'process automation', 'sales ops'],
    
    // Content metadata
    featuredImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'Revenue Operations Dashboard Analytics',
    readingTime: 8,
    wordCount: 1200,
    
    // Publishing
    publishedAt: '2024-01-15T10:00:00Z',
    
    // Timestamps
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    
    // Relationships
    authorId: 'richard-hudson',
    author: {
      id: 'richard-hudson',
      name: 'Richard Hudson',
      email: 'richard@example.com',
      slug: 'richard-hudson',
      bio: 'Revenue Operations Professional with 8+ years of experience in data analytics and process optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
      totalPosts: 10,
      totalViews: 15000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    categoryId: 'revenue-operations',
    category: {
      id: 'revenue-operations',
      name: 'Revenue Operations',
      slug: 'revenue-operations',
      description: 'Insights and strategies for revenue operations professionals',
      color: '#3B82F6',
      postCount: 5,
      totalViews: 8000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    tags: [
      {
        id: 'analytics',
        name: 'Analytics',
        slug: 'analytics',
        color: '#10B981',
        postCount: 8,
        totalViews: 5000,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    
    // Analytics - Real data only, no fake metrics
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    commentCount: 0
  },
  {
    id: '3',
    title: 'Advanced Customer Churn Analysis Techniques',
    slug: 'advanced-customer-churn-analysis-techniques',
    excerpt: 'Discover advanced techniques for analyzing customer churn and implementing retention strategies that drive long-term growth.',
    content: `# Advanced Customer Churn Analysis Techniques

Customer churn is one of the most critical metrics for any business. Understanding why customers leave and when they're likely to churn is essential for sustainable growth.

## Understanding Churn Fundamentals

### What is Customer Churn?
Customer churn rate is the percentage of customers who stop using your product or service during a given time period. It's calculated as:

**Churn Rate = (Customers Lost / Total Customers at Start) × 100**

### Types of Churn
1. **Voluntary Churn**: Customers actively choose to leave
2. **Involuntary Churn**: Customers leave due to payment failures or technical issues
3. **Gradual Churn**: Customers slowly reduce usage before leaving

## Advanced Analysis Techniques

### 1. Cohort Analysis
Track customer behavior over time by grouping them by acquisition date:
- Retention curves by acquisition cohort
- Revenue retention vs. customer retention
- Seasonal patterns in churn behavior

### 2. Predictive Modeling
Use machine learning to predict churn likelihood:
- Logistic regression for probability scoring
- Random forests for feature importance
- Neural networks for complex pattern recognition

### 3. Behavioral Segmentation
Identify at-risk customer segments:
- Product usage patterns
- Support ticket frequency
- Payment history analysis
- Engagement metrics decline

## Key Churn Indicators

### Product Usage Signals
- Declining login frequency
- Reduced feature adoption
- Lower session duration
- Decreased API calls or transactions

### Engagement Signals
- Email engagement decline
- Reduced support interactions
- Lower NPS or satisfaction scores
- Missed onboarding milestones

### Financial Signals
- Payment delays or failures
- Downgrade requests
- Contract renewal hesitation
- Budget constraint discussions

## Retention Strategies

### Proactive Intervention
1. **Early Warning Systems**: Automated alerts for at-risk customers
2. **Success Management**: Dedicated customer success teams
3. **Product Improvements**: Address common pain points
4. **Education Programs**: Increase product value realization

### Reactive Measures
1. **Win-back Campaigns**: Targeted offers for churned customers
2. **Exit Interviews**: Understand reasons for leaving
3. **Product Feedback**: Incorporate learnings into roadmap
4. **Competitive Analysis**: Address market positioning gaps

## Implementation Framework

### Step 1: Data Collection
- Customer usage data
- Support interactions
- Financial transactions
- Survey responses

### Step 2: Analysis Setup
- Define churn events clearly
- Establish analysis timeframes
- Create customer segments
- Set up tracking systems

### Step 3: Model Development
- Feature engineering
- Model training and validation
- Performance testing
- Deployment planning

### Step 4: Action Planning
- Intervention strategies
- Team responsibilities
- Success metrics
- Monitoring processes

## Measuring Success

### Key Metrics
- Churn rate reduction
- Customer lifetime value increase
- Retention rate improvement
- Revenue impact measurement

### Regular Review Process
- Monthly churn analysis
- Quarterly strategy updates
- Annual model retraining
- Continuous improvement cycles

## Conclusion

Advanced churn analysis goes beyond simple metrics to provide actionable insights for customer retention. By combining predictive modeling with behavioral analysis, businesses can proactively address churn and build stronger customer relationships.

The key is to start with solid data foundations, implement robust analysis processes, and maintain a continuous improvement mindset. Success in churn reduction requires cross-functional collaboration between product, marketing, sales, and customer success teams.`,
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    // SEO fields
    metaTitle: 'Advanced Customer Churn Analysis Techniques | Richard Hudson',
    metaDescription: 'Discover advanced techniques for analyzing customer churn and implementing retention strategies that drive long-term growth.',
    keywords: ['customer churn', 'retention analysis', 'predictive modeling', 'customer success'],
    
    // Content metadata
    featuredImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'Customer Analytics Dashboard',
    readingTime: 7,
    wordCount: 1100,
    
    // Publishing
    publishedAt: '2024-02-05T09:00:00Z',
    
    // Timestamps
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-05T09:00:00Z',
    
    // Relationships
    authorId: 'richard-hudson',
    author: {
      id: 'richard-hudson',
      name: 'Richard Hudson',
      email: 'richard@example.com',
      slug: 'richard-hudson',
      bio: 'Revenue Operations Professional with 8+ years of experience in data analytics and process optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
      totalPosts: 10,
      totalViews: 15000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    categoryId: 'analytics',
    category: {
      id: 'analytics',
      name: 'Analytics',
      slug: 'analytics',
      description: 'Advanced analytics techniques and methodologies',
      color: '#10B981',
      postCount: 4,
      totalViews: 6200,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    tags: [
      {
        id: 'churn-analysis',
        name: 'Churn Analysis',
        slug: 'churn-analysis',
        color: '#EF4444',
        postCount: 2,
        totalViews: 1800,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    
    // Analytics
    viewCount: 1200,
    likeCount: 28,
    shareCount: 6,
    commentCount: 4
  },
  {
    id: '4',
    title: 'Automating Revenue Reporting with Modern Tools',
    slug: 'automating-revenue-reporting-modern-tools',
    excerpt: 'Streamline your revenue reporting process with automation tools and best practices for accurate, real-time insights.',
    content: `# Automating Revenue Reporting with Modern Tools

Manual revenue reporting is time-consuming, error-prone, and doesn't scale with business growth. Modern automation tools can transform how you track, analyze, and report on revenue metrics.

## The Challenge with Manual Reporting

### Common Pain Points
- Time-intensive data collection
- Human error in calculations
- Delayed insights and decisions
- Inconsistent reporting formats
- Limited real-time visibility

### Business Impact
- Missed opportunities
- Inaccurate forecasting
- Poor strategic decisions
- Reduced team productivity
- Compliance risks

## Automation Benefits

### Efficiency Gains
- 90% reduction in reporting time
- Real-time data updates
- Standardized processes
- Elimination of manual errors
- Faster decision-making

### Quality Improvements
- Consistent data sources
- Automated validation rules
- Historical trend analysis
- Predictive insights
- Compliance assurance

## Key Automation Tools

### 1. Business Intelligence Platforms
**Tableau, Power BI, Looker**
- Interactive dashboards
- Self-service analytics
- Mobile accessibility
- Scheduled reports

### 2. Revenue Operations Platforms
**HubSpot, Salesforce, Pipedrive**
- Pipeline automation
- Deal tracking
- Forecasting tools
- Integration capabilities

### 3. Data Integration Tools
**Zapier, Integromat, MuleSoft**
- API connections
- Data synchronization
- Workflow automation
- Error handling

### 4. Financial Systems
**QuickBooks, NetSuite, Xero**
- Automated bookkeeping
- Revenue recognition
- Financial reporting
- Audit trails

## Implementation Strategy

### Phase 1: Assessment
1. **Current State Analysis**
   - Document existing processes
   - Identify pain points
   - Map data sources
   - Calculate time investment

2. **Requirements Gathering**
   - Define reporting needs
   - Establish KPIs
   - Set automation goals
   - Determine budgets

### Phase 2: Tool Selection
1. **Evaluation Criteria**
   - Integration capabilities
   - Ease of use
   - Scalability
   - Cost structure
   - Security features

2. **Proof of Concept**
   - Test with sample data
   - Validate functionality
   - Assess user experience
   - Measure performance

### Phase 3: Implementation
1. **Data Migration**
   - Clean existing data
   - Map field relationships
   - Test data accuracy
   - Validate calculations

2. **System Configuration**
   - Set up automation rules
   - Create report templates
   - Configure alerts
   - Establish permissions

### Phase 4: Training and Adoption
1. **User Training**
   - Tool functionality
   - Best practices
   - Troubleshooting
   - Advanced features

2. **Change Management**
   - Communication plan
   - Support resources
   - Feedback collection
   - Continuous improvement

## Best Practices

### Data Quality
- Implement validation rules
- Regular data audits
- Consistent naming conventions
- Automated error detection

### Security
- Role-based access control
- Data encryption
- Audit logging
- Backup procedures

### Performance
- Optimize query performance
- Schedule reports efficiently
- Monitor system health
- Scale infrastructure as needed

### Governance
- Documentation standards
- Change control processes
- Regular reviews
- Compliance monitoring

## Common Implementation Challenges

### Technical Challenges
- Data integration complexity
- System compatibility issues
- Performance optimization
- User adoption resistance

### Solutions
- Phased implementation approach
- Dedicated technical support
- Comprehensive testing
- Change management program

## Measuring Success

### Key Metrics
- Time savings per report
- Error reduction percentage
- User adoption rates
- Decision-making speed
- ROI calculation

### Success Indicators
- Increased reporting frequency
- Improved data accuracy
- Faster insights delivery
- Enhanced user satisfaction
- Better business outcomes

## Future Trends

### Emerging Technologies
- AI-powered insights
- Natural language queries
- Predictive analytics
- Real-time streaming
- Mobile-first design

### Industry Evolution
- Cloud-first solutions
- API-driven architectures
- Self-service analytics
- Embedded intelligence
- Collaborative features

## Conclusion

Automating revenue reporting is not just about efficiency—it's about enabling data-driven decision making and strategic growth. By selecting the right tools and following proven implementation practices, organizations can transform their reporting capabilities and gain competitive advantages.

The key to success is starting with clear objectives, choosing tools that integrate well with existing systems, and maintaining focus on user adoption and data quality throughout the implementation process.`,
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    // SEO fields
    metaTitle: 'Automating Revenue Reporting with Modern Tools | Richard Hudson',
    metaDescription: 'Streamline your revenue reporting process with automation tools and best practices for accurate, real-time insights.',
    keywords: ['revenue reporting', 'automation tools', 'business intelligence', 'data analytics'],
    
    // Content metadata
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'Automated Business Reporting Dashboard',
    readingTime: 8,
    wordCount: 1300,
    
    // Publishing
    publishedAt: '2024-02-12T11:00:00Z',
    
    // Timestamps
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-12T11:00:00Z',
    
    // Relationships
    authorId: 'richard-hudson',
    author: {
      id: 'richard-hudson',
      name: 'Richard Hudson',
      email: 'richard@example.com',
      slug: 'richard-hudson',
      bio: 'Revenue Operations Professional with 8+ years of experience in data analytics and process optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
      totalPosts: 10,
      totalViews: 15000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    categoryId: 'automation',
    category: {
      id: 'automation',
      name: 'Automation',
      slug: 'automation',
      description: 'Business process automation and efficiency optimization',
      color: '#8B5CF6',
      postCount: 3,
      totalViews: 4800,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    tags: [
      {
        id: 'reporting',
        name: 'Reporting',
        slug: 'reporting',
        color: '#F59E0B',
        postCount: 4,
        totalViews: 2500,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    
    // Analytics
    viewCount: 980,
    likeCount: 22,
    shareCount: 5,
    commentCount: 3
  },
  {
    id: '5',
    title: 'KPI Design Principles for Revenue Operations',
    slug: 'kpi-design-principles-revenue-operations',
    excerpt: 'Learn how to design effective KPIs that drive revenue growth and align teams around common objectives.',
    content: `# KPI Design Principles for Revenue Operations

Effective Key Performance Indicators (KPIs) are the foundation of successful revenue operations. They provide clarity, drive accountability, and enable data-driven decision making across sales, marketing, and customer success teams.

## Understanding KPI Fundamentals

### What Makes a Good KPI?
A well-designed KPI should be:
- **Specific**: Clearly defined and unambiguous
- **Measurable**: Quantifiable with available data
- **Achievable**: Realistic given resources and constraints
- **Relevant**: Aligned with business objectives
- **Time-bound**: Have clear measurement periods

### KPI vs. Metrics
- **Metrics**: All measurable data points
- **KPIs**: Critical metrics that drive business decisions

## Revenue Operations KPI Framework

### Tier 1: Strategic KPIs
These align with overall business objectives:
- Annual Recurring Revenue (ARR)
- Customer Lifetime Value (CLV)
- Customer Acquisition Cost (CAC)
- Net Revenue Retention (NRR)

### Tier 2: Operational KPIs
These measure process efficiency:
- Sales cycle length
- Lead conversion rates
- Pipeline velocity
- Deal win rates

### Tier 3: Activity KPIs
These track day-to-day activities:
- Number of qualified leads
- Sales activities per rep
- Email open rates
- Meeting booking rates

## Design Principles

### 1. Alignment with Business Goals
Every KPI should connect to broader business objectives:
- Revenue growth targets
- Market expansion goals
- Customer satisfaction benchmarks
- Operational efficiency metrics

### 2. Balanced Scorecards
Include different types of KPIs:
- **Leading Indicators**: Predict future performance
- **Lagging Indicators**: Measure past results
- **Quantity Metrics**: Volume and activity measures
- **Quality Metrics**: Effectiveness and efficiency measures

### 3. Context and Benchmarking
Provide meaningful context:
- Historical comparisons
- Industry benchmarks
- Peer group analysis
- Target vs. actual performance

### 4. Granular Visibility
Enable drill-down analysis:
- Team-level performance
- Individual contributor metrics
- Geographic breakdowns
- Product/service segmentation

## Common KPI Categories

### Marketing KPIs
- Marketing Qualified Leads (MQLs)
- Cost per Lead (CPL)
- Lead-to-Customer Conversion Rate
- Marketing Attribution ROI

### Sales KPIs
- Sales Qualified Leads (SQLs)
- Average Deal Size
- Sales Cycle Length
- Quota Attainment

### Customer Success KPIs
- Customer Satisfaction Score (CSAT)
- Net Promoter Score (NPS)
- Churn Rate
- Expansion Revenue

### Financial KPIs
- Monthly Recurring Revenue (MRR)
- Gross Revenue Retention
- Customer Payback Period
- Rule of 40

## Implementation Best Practices

### 1. Start Simple
Begin with core metrics:
- Focus on 5-7 key KPIs initially
- Ensure data accuracy and availability
- Establish baseline measurements
- Build reporting infrastructure

### 2. Involve Stakeholders
Engage teams in KPI design:
- Sales leadership input
- Marketing team feedback
- Customer success insights
- Executive alignment

### 3. Regular Review and Refinement
Continuously improve KPIs:
- Monthly performance reviews
- Quarterly target adjustments
- Annual KPI assessment
- Benchmark updates

### 4. Automation and Visualization
Make KPIs accessible:
- Real-time dashboards
- Automated alerts
- Mobile accessibility
- Self-service analytics

## Common Pitfalls to Avoid

### Over-Measurement
- Too many KPIs dilute focus
- Analysis paralysis
- Resource strain
- Confusion about priorities

### Gaming the System
- KPIs that encourage wrong behaviors
- Short-term optimization at expense of long-term goals
- Lack of context or nuance
- Overemphasis on individual metrics

### Data Quality Issues
- Inconsistent definitions
- Poor data collection
- Manual calculation errors
- Delayed reporting

### Lack of Action
- KPIs without accountability
- No clear improvement plans
- Insufficient follow-up
- Missing feedback loops

## Technology Stack for KPI Management

### Dashboard Tools
- Tableau, Power BI, Looker
- Real-time visualization
- Interactive filtering
- Mobile optimization

### Data Integration
- CRM systems (Salesforce, HubSpot)
- Marketing automation platforms
- Financial systems
- Customer success tools

### Analytics Platforms
- Google Analytics
- Mixpanel
- Amplitude
- Custom data warehouses

## Measuring KPI Effectiveness

### Success Indicators
- Improved decision-making speed
- Increased team alignment
- Better performance outcomes
- Enhanced accountability

### Regular Assessment
- KPI relevance reviews
- Data quality audits
- User adoption metrics
- Business impact analysis

## Advanced KPI Techniques

### Composite Scores
Combine multiple metrics:
- Weighted averages
- Balanced scorecards
- Health scores
- Risk indicators

### Predictive KPIs
Forward-looking metrics:
- Pipeline health scores
- Churn probability models
- Forecast accuracy metrics
- Trend analysis

### Cohort-Based KPIs
Time-based analysis:
- Customer cohort performance
- Sales rep ramp metrics
- Product adoption rates
- Seasonal adjustments

## Conclusion

Effective KPI design is both an art and a science. It requires deep understanding of business objectives, careful consideration of measurement methodology, and ongoing refinement based on results and feedback.

The most successful revenue operations teams focus on a balanced set of KPIs that drive the right behaviors, provide actionable insights, and enable continuous improvement. Remember that KPIs are tools to enable better decisions—they should inform action, not replace strategic thinking.

Start with the fundamentals, involve your teams in the design process, and continuously evolve your KPI framework as your business grows and changes.`,
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    
    // SEO fields
    metaTitle: 'KPI Design Principles for Revenue Operations | Richard Hudson',
    metaDescription: 'Learn how to design effective KPIs that drive revenue growth and align teams around common objectives.',
    keywords: ['KPI design', 'revenue operations', 'performance metrics', 'business analytics'],
    
    // Content metadata
    featuredImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center&q=80',
    featuredImageAlt: 'KPI Dashboard with Revenue Metrics',
    readingTime: 9,
    wordCount: 1400,
    
    // Publishing
    publishedAt: '2024-02-18T14:00:00Z',
    
    // Timestamps
    createdAt: '2024-02-16T10:00:00Z',
    updatedAt: '2024-02-18T14:00:00Z',
    
    // Relationships
    authorId: 'richard-hudson',
    author: {
      id: 'richard-hudson',
      name: 'Richard Hudson',
      email: 'richard@example.com',
      slug: 'richard-hudson',
      bio: 'Revenue Operations Professional with 8+ years of experience in data analytics and process optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&q=80',
      totalPosts: 10,
      totalViews: 15000,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    categoryId: 'strategy',
    category: {
      id: 'strategy',
      name: 'Strategy',
      slug: 'strategy',
      description: 'Strategic planning and business development insights',
      color: '#6366F1',
      postCount: 3,
      totalViews: 5200,
      createdAt: '2024-01-01T00:00:00Z'
    },
    
    tags: [
      {
        id: 'kpis',
        name: 'KPIs',
        slug: 'kpis',
        color: '#8B5CF6',
        postCount: 3,
        totalViews: 2100,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    
    // Analytics
    viewCount: 850,
    likeCount: 19,
    shareCount: 4,
    commentCount: 2
  }
];

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Find post by slug
    const post = mockBlogPosts.find(p => p.slug === slug);
    
    if (!post) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Get real analytics data
    const analytics = await getBlogAnalytics(slug);
    
    // Create post with real analytics
    const postWithAnalytics: BlogPostData = {
      ...post,
      viewCount: analytics.viewCount,
      likeCount: analytics.likeCount,
      shareCount: analytics.shareCount,
      commentCount: analytics.commentCount
    };
    
    const response: ApiResponse<BlogPostData> = {
      data: postWithAnalytics,
      success: true
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // Cache for 5 minutes, CDN for 10 minutes
      }
    });
    
  } catch (error) {
    logger.error('Blog Post API Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to fetch blog post'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/blog/[slug] - Update blog post by slug
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    
    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Find post index by slug
    const postIndex = mockBlogPosts.findIndex(p => p.slug === slug);
    
    if (postIndex === -1) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Update post with new data - handle potential undefined
    const currentPost = mockBlogPosts[postIndex];
    if (!currentPost) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found after index lookup'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    const updatedPost: BlogPostData = {
      ...currentPost,
      ...body,
      id: currentPost.id, // Preserve ID
      slug: currentPost.slug, // Preserve slug
      updatedAt: new Date().toISOString(),
      // Update reading time and word count if content changed
      readingTime: body.content ? Math.ceil(body.content.split(' ').length / 200) : currentPost.readingTime,
      wordCount: body.content ? body.content.split(' ').length : currentPost.wordCount,
      // If status changed to published, set publishedAt
      publishedAt: body.status === 'PUBLISHED' && !currentPost.publishedAt 
        ? new Date().toISOString() 
        : body.publishedAt || currentPost.publishedAt
    };
    
    // Update in mock array
    mockBlogPosts[postIndex] = updatedPost;
    
    const response: ApiResponse<BlogPostData> = {
      data: updatedPost,
      success: true,
      message: 'Blog post updated successfully'
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    logger.error('Blog Post Update Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to update blog post'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/blog/[slug] - Delete blog post by slug
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    if (!slug) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Slug parameter is required'
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Find post index by slug
    const postIndex = mockBlogPosts.findIndex(p => p.slug === slug);
    
    if (postIndex === -1) {
      const errorResponse: ApiResponse<never> = {
        data: undefined as never,
        success: false,
        error: 'Blog post not found'
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Remove post from mock array
    mockBlogPosts.splice(postIndex, 1);
    
    const response: ApiResponse<{ success: boolean }> = {
      data: { success: true },
      success: true,
      message: 'Blog post deleted successfully'
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    logger.error('Blog Post Deletion Error:', error instanceof Error ? error : new Error(String(error)));
    
    const errorResponse: ApiResponse<never> = {
      data: undefined as never,
      success: false,
      error: 'Failed to delete blog post'
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}