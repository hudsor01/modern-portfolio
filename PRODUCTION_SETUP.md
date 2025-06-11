# Production Setup Guide

This guide covers the complete setup for deploying Richard Hudson's portfolio to production with all features enabled.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required for Email Service
```bash
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=contact@yourdomain.com
TO_EMAIL=your-email@yourdomain.com

# Optional: Custom email settings
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

### Optional but Recommended
```bash
# Logging Configuration
LOG_LEVEL=info  # debug, info, warn, error, fatal
ENABLE_FILE_LOGGING=false  # Set to true for persistent logging

# Analytics Configuration
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# Performance Monitoring
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_SAMPLE_RATE=0.1  # 10% sampling rate

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSP_REPORT_URI=https://yourdomain.com/api/csp-report

# Build Information
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BUILD_TIME=2024-01-01T00:00:00Z
```

## Dependencies Installation

Install the required production dependencies:

```bash
npm install uuid zod resend
```

### Development Dependencies
```bash
npm install --save-dev @types/uuid
```

## Email Service Setup

### 1. Resend Configuration (Recommended)

1. Sign up for [Resend](https://resend.com)
2. Verify your domain
3. Create an API key
4. Add the API key to your environment variables

### 2. Alternative SMTP Configuration

If you prefer to use a different email service:

```typescript
// In lib/email/email-service.ts, modify the EmailService constructor
constructor() {
  this.isProduction = NODE_ENV === 'production'
  
  // Use SMTP instead of Resend
  if (process.env.SMTP_HOST) {
    // Configure your SMTP transport here
  }
}
```

## Web Vitals Analytics

The application automatically collects Core Web Vitals data. For production use:

### 1. Database Storage (Recommended)

Replace the in-memory storage with a database:

```typescript
// Example: PostgreSQL storage implementation
class PostgreSQLAnalyticsStorage implements AnalyticsStorage {
  async store(data: EnhancedWebVitalsData): Promise<void> {
    await db.webVitals.create({ data })
  }
  
  async query(filters: AnalyticsQueryFilters): Promise<AnalyticsQueryResult[]> {
    return db.webVitals.findMany({ where: filters })
  }
  
  // ... implement other methods
}

// Update the WebVitalsService constructor
export const webVitalsService = new WebVitalsService(
  new PostgreSQLAnalyticsStorage()
)
```

### 2. External Analytics Service

Send data to an external service like DataDog, New Relic, or Google Analytics:

```typescript
// In lib/analytics/web-vitals-service.ts
export class ExternalAnalyticsStorage implements AnalyticsStorage {
  async store(data: EnhancedWebVitalsData): Promise<void> {
    await fetch('https://your-analytics-service.com/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }
  
  // ... implement other methods
}
```

## Logging Configuration

### 1. Development Logging
In development, logs are displayed in the console with colors.

### 2. Production Logging

For production, logs are structured JSON. Configure external log aggregation:

#### DataDog Integration
```typescript
// In lib/monitoring/logger.ts, add DataDog transport
class DataDogTransport implements LogTransport {
  async log(entry: LogEntry): Promise<void> {
    await fetch('https://http-intake.logs.datadoghq.com/v1/input/YOUR_API_KEY', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
  }
}
```

#### CloudWatch Integration
```typescript
// Using AWS SDK
import { CloudWatchLogs } from '@aws-sdk/client-cloudwatch-logs'

class CloudWatchTransport implements LogTransport {
  private client = new CloudWatchLogs({})
  
  async log(entry: LogEntry): Promise<void> {
    await this.client.putLogEvents({
      logGroupName: '/aws/lambda/portfolio',
      logStreamName: 'portfolio-stream',
      logEvents: [{
        timestamp: Date.now(),
        message: JSON.stringify(entry),
      }],
    })
  }
}
```

## Performance Monitoring

### 1. Enable Performance Monitoring

Set environment variables:
```bash
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_SAMPLE_RATE=0.1  # Sample 10% of requests
```

### 2. Custom Performance Metrics

```typescript
import { performanceMonitor } from '@/lib/monitoring/logger'

// Measure database operations
const result = await performanceMonitor.measureAsync(
  'database-query',
  () => db.projects.findMany(),
  { operation: 'find-projects' }
)

// Measure API calls
const data = performanceMonitor.measure(
  'api-call',
  () => fetchExternalData(),
  { endpoint: '/external-api' }
)
```

## Security Configuration

### 1. Content Security Policy

Update `next.config.js` CSP headers for your domain:

```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://yourdomain.com;
  style-src 'self' 'unsafe-inline' https://yourdomain.com;
  img-src 'self' blob: data: https://yourdomain.com;
  font-src 'self' https://yourdomain.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`
```

### 2. Rate Limiting

The application includes built-in rate limiting for:
- Contact form submissions (5 per hour per IP)
- Web Vitals collection (50 per minute per IP)

For production, consider using Redis for distributed rate limiting:

```typescript
// In lib/email/email-service.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; resetTime?: number }> {
  const key = `rate-limit:${identifier}`
  const window = 60 * 60 * 1000 // 1 hour
  const maxAttempts = 5
  
  const current = await redis.get(key)
  if (!current) {
    await redis.setex(key, window / 1000, '1')
    return { allowed: true }
  }
  
  const count = parseInt(current)
  if (count >= maxAttempts) {
    return { allowed: false, resetTime: Date.now() + window }
  }
  
  await redis.incr(key)
  return { allowed: true }
}
```

## Database Setup (Optional)

For persistent data storage, integrate with your preferred database:

### 1. PostgreSQL with Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. MongoDB with Mongoose

```bash
npm install mongoose
```

### 3. Supabase

```bash
npm install @supabase/supabase-js
```

## Monitoring Dashboard

Create an admin dashboard to monitor application health:

```typescript
// pages/admin/dashboard.tsx
import { webVitalsService } from '@/lib/analytics/web-vitals-service'
import { performanceMonitor } from '@/lib/monitoring/logger'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null)
  
  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await fetch('/api/analytics/vitals?range=24h')
      setMetrics(await data.json())
    }
    
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30s
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="admin-dashboard">
      {/* Display metrics, performance data, error rates, etc. */}
    </div>
  )
}
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Email service tested
- [ ] Analytics collection verified
- [ ] Performance monitoring enabled
- [ ] Security headers configured
- [ ] Rate limiting tested
- [ ] Error handling verified

### Deployment
- [ ] Build succeeds without errors
- [ ] All tests pass
- [ ] Type checking passes
- [ ] Security scan completed
- [ ] Performance benchmarks met

### Post-deployment
- [ ] Email functionality tested in production
- [ ] Analytics data flowing correctly
- [ ] Logs being collected
- [ ] Performance metrics available
- [ ] Error monitoring active
- [ ] Contact form working
- [ ] All pages loading correctly

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check RESEND_API_KEY is set correctly
   - Verify domain ownership in Resend dashboard
   - Check rate limiting logs

2. **Analytics not collecting**
   - Verify Web Vitals API endpoint is accessible
   - Check browser console for errors
   - Confirm storage implementation is working

3. **Performance issues**
   - Review performance monitoring logs
   - Check database query performance
   - Verify caching is working correctly

4. **Type errors**
   - Run `npm run typecheck`
   - Ensure all dependencies are installed
   - Check for circular imports

### Error Monitoring

Monitor application errors through:
- Console logs (development)
- Structured JSON logs (production)
- External monitoring services (DataDog, Sentry, etc.)

### Performance Optimization

1. **Caching Strategy**
   - Analytics data cached for 5-15 minutes
   - TanStack Query provides client-side caching
   - Consider Redis for server-side caching

2. **Bundle Optimization**
   - Tree shaking enabled
   - Dynamic imports for large components
   - Image optimization with Next.js Image component

3. **Database Optimization**
   - Use appropriate indexes
   - Implement connection pooling
   - Monitor query performance

## Support

For issues related to this production setup:

1. Check the troubleshooting section above
2. Review application logs
3. Verify environment configuration
4. Test in development environment first

## Version History

- v1.0.0 - Initial production setup
- v1.1.0 - Added Web Vitals analytics
- v1.2.0 - Enhanced logging and monitoring
- v1.3.0 - Production-ready email service