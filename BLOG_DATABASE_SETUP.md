# Blog Database System Setup Guide

This guide provides comprehensive instructions for setting up the blog database system with Prisma, PostgreSQL, and comprehensive analytics tracking.

## 🏗️ Architecture Overview

The blog database system is built with:

- **Database**: PostgreSQL with optimized indexes and constraints
- **ORM**: Prisma Client with type-safe queries
- **Analytics**: Comprehensive tracking of views, interactions, and SEO metrics
- **Content Management**: Full workflow support from draft to published
- **SEO Automation**: Automated keyword tracking and performance monitoring

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 22.14.0 or higher
- PostgreSQL 13+ (local or hosted)
- npm 11.2.0 or higher

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd modern-portfolio
npm install
```

### 2. Environment Setup

Copy the environment template and configure your database:

```bash
cp .env.example .env
```

Edit `.env` with your database configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/modern_portfolio_blog"
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR run migrations (for production)
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Verify Setup

Check that everything is working:

```bash
# Open Prisma Studio to explore data
npm run db:studio

# Run type checking
npm run type-check

# Start development server
npm run dev
```

## 📊 Database Schema

### Core Entities

#### BlogPost
- **Purpose**: Main content entity with full SEO support
- **Key Features**:
  - Multi-status workflow (DRAFT → REVIEW → SCHEDULED → PUBLISHED)
  - Rich metadata (title, excerpt, content, SEO fields)
  - Social media optimization (Open Graph, Twitter Cards)
  - Analytics integration (views, interactions, engagement)

#### Author
- **Purpose**: Content creators and contributors
- **Key Features**:
  - Profile information with social links
  - Analytics tracking (total posts, views, engagement)
  - Bio and SEO optimization

#### Category
- **Purpose**: Hierarchical content organization
- **Key Features**:
  - Nested category support (parent-child relationships)
  - SEO-optimized with custom meta fields
  - Analytics tracking per category

#### Tag
- **Purpose**: Flexible content tagging system
- **Key Features**:
  - Many-to-many relationship with posts
  - Usage analytics and trending detection
  - Color coding for UI consistency

#### PostSeries
- **Purpose**: Multi-part content organization
- **Key Features**:
  - Ordered post sequences
  - Progress tracking and navigation
  - Series-level SEO optimization

### Analytics Entities

#### PostView
- **Purpose**: Detailed view tracking and user behavior
- **Tracks**:
  - Geographic data (country, region, city)
  - Engagement metrics (reading time, scroll depth)
  - Traffic sources and referrers
  - User journey data

#### PostInteraction
- **Purpose**: User engagement tracking
- **Types**: LIKE, SHARE, COMMENT, BOOKMARK, SUBSCRIBE, DOWNLOAD
- **Features**: Flexible metadata storage for custom interaction types

#### SEOKeyword
- **Purpose**: Search performance tracking
- **Metrics**:
  - Search position and ranking changes
  - Click-through rates and impressions
  - Search volume and difficulty scores
  - Cost-per-click data

#### SEOEvent
- **Purpose**: SEO automation and monitoring
- **Event Types**:
  - Content analysis results
  - Performance alerts and opportunities
  - Technical issue detection
  - Ranking change notifications

## 🛠️ Available Scripts

### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes (development)
npm run db:push

# Create and run migrations
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Reset database (WARNING: deletes all data)
npm run db:migrate:reset

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Development Scripts

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Lint code
npm run lint

# Run tests
npm run test

# Validate code before build
npm run validate
```

## 🔍 Query Utilities

The system includes comprehensive query utilities in `src/lib/queries/`:

### Blog Posts (`blog-posts.ts`)
```typescript
import { getBlogPosts, createBlogPost, updateBlogPost } from '@/lib/queries/blog-posts'

// Get paginated posts with filters
const posts = await getBlogPosts(
  { status: 'PUBLISHED', authorId: 'author-id' },
  { field: 'publishedAt', order: 'desc' },
  { page: 1, limit: 10 }
)

// Create new post
const newPost = await createBlogPost({
  title: 'My Blog Post',
  slug: 'my-blog-post',
  content: '# Blog content here',
  authorId: 'author-id',
  status: 'DRAFT'
})
```

### Authors (`authors.ts`)
```typescript
import { getAuthorById, createAuthor } from '@/lib/queries/authors'

const author = await getAuthorById('author-id')
const analytics = await getAuthorAnalytics('author-id')
```

### Categories (`categories.ts`)
```typescript
import { getCategoryTree, createCategory } from '@/lib/queries/categories'

const categoryTree = await getCategoryTree()
const categoryWithPosts = await getCategoryWithPosts('category-slug')
```

### Tags (`tags.ts`)
```typescript
import { getPopularTags, getTagCloud } from '@/lib/queries/tags'

const popularTags = await getPopularTags(20)
const tagCloud = await getTagCloud()
```

### Analytics (`analytics.ts`)
```typescript
import { getBlogAnalyticsSummary, getPostAnalytics } from '@/lib/queries/analytics'

const summary = await getBlogAnalyticsSummary()
const postStats = await getPostAnalytics('post-id')
```

## 📈 Analytics Features

### View Tracking
- Page views with geographic data
- Reading time and engagement metrics
- Bounce rate and scroll depth analysis
- Traffic source attribution

### Interaction Tracking
- Like, share, comment, bookmark events
- Custom interaction types with metadata
- Engagement rate calculations
- User behavior patterns

### SEO Monitoring
- Keyword position tracking
- Search performance analytics
- Technical SEO issue detection
- Content optimization recommendations

### Performance Metrics
- Dashboard with key KPIs
- Trend analysis and forecasting
- Comparative performance reports
- Export capabilities (JSON, CSV)

## 🔒 Security & Performance

### Database Security
- Row-level security policies (if using Supabase)
- Input validation with Zod schemas
- SQL injection prevention
- Proper indexing for performance

### Performance Optimization
- Efficient query patterns with proper includes
- Database connection pooling
- Query result caching strategies
- Optimized indexes for common queries

### Data Privacy
- Anonymized visitor tracking
- GDPR-compliant data handling
- Configurable data retention policies
- Opt-out mechanisms for tracking

## 🚀 Production Deployment

### Environment Variables
Set the following in production:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NODE_ENV="production"
NEXTAUTH_SECRET="secure-secret-key"
```

### Migration Strategy
1. **Backup**: Always backup production database before migrations
2. **Testing**: Test migrations on staging environment first
3. **Zero-downtime**: Use Prisma's migration system for safe deployments
4. **Rollback**: Keep migration rollback plans ready

### Monitoring
- Set up database monitoring and alerts
- Monitor query performance and slow queries
- Track database growth and optimization needs
- Regular maintenance and cleanup tasks

## 🧪 Testing

### Database Testing
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Test database operations
npm run test:db
```

### Sample Test Data
The seeding script creates realistic test data:
- 3 authors with different specializations
- 5 categories with hierarchical structure
- 12 tags with realistic usage patterns
- 8 blog posts with various statuses
- Analytics data with realistic engagement patterns

## 🛟 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database connection
npx prisma db pull

# Verify environment variables
echo $DATABASE_URL
```

#### Migration Issues
```bash
# Reset database (development only)
npm run db:migrate:reset

# Manual migration resolve
npx prisma migrate resolve --applied "migration_name"
```

#### Performance Issues
```bash
# Analyze query performance
# Use Prisma Studio or database tools
npm run db:studio

# Check database indexes
# Review slow query logs
```

### Getting Help
1. Check the [Prisma documentation](https://www.prisma.io/docs/)
2. Review database logs for errors
3. Use Prisma Studio to inspect data
4. Check GitHub issues for known problems

## 🔄 Maintenance

### Regular Tasks
- **Weekly**: Review slow queries and optimize
- **Monthly**: Clean up old analytics data
- **Quarterly**: Database performance review
- **Annually**: Schema optimization and archival

### Data Cleanup
```typescript
import { cleanupOldAnalytics } from '@/lib/queries/analytics'

// Clean up analytics data older than 365 days
await cleanupOldAnalytics(365)
```

### Backup Strategy
- Daily automated backups
- Point-in-time recovery capability
- Regular backup restoration tests
- Offsite backup storage

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Database Integration](https://nextjs.org/docs/basic-features/data-fetching)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-best-practices.html)

---

This comprehensive blog database system provides enterprise-grade content management with powerful analytics and SEO capabilities. The modular query system makes it easy to extend and customize for specific needs while maintaining type safety and performance.