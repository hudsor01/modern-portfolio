# Hono RPC API Architecture

A complete type-safe RPC API implementation using Hono framework, designed to replace the existing REST API routes with enhanced performance, security, and developer experience.

## 🚀 Architecture Overview

### Technology Stack
- **Hono**: Fast, lightweight web framework for edge environments
- **Zod**: Type-safe schema validation and serialization
- **Prisma**: Type-safe database client (for blog features)
- **TypeScript**: Full type safety across client and server
- **Resend**: Email service for contact forms

### Key Features
- ✅ **Type-Safe**: End-to-end type safety from client to server
- ✅ **Validation**: Zod schema validation on all inputs/outputs
- ✅ **Authentication**: JWT-based auth with role-based access control
- ✅ **Rate Limiting**: Configurable rate limiting per endpoint
- ✅ **Security**: CORS, CSP, security headers, and CSP violation reporting
- ✅ **File Uploads**: Support for image uploads with validation
- ✅ **Caching**: Optimal performance with intelligent caching
- ✅ **Logging**: Comprehensive request/response logging
- ✅ **Health Checks**: Built-in health monitoring and metrics
- ✅ **Error Handling**: Structured error responses with proper HTTP codes

## 📁 Project Structure

```
src/server/rpc/
├── app.ts                 # Main Hono application
├── client.ts              # Type-safe RPC client for frontend
├── middleware.ts          # Auth, rate limiting, logging middleware
├── types.ts               # Shared types and Zod schemas
├── routes/
│   ├── contact.ts         # Contact form endpoints
│   ├── blog.ts            # Blog CRUD operations
│   ├── projects.ts        # Project data endpoints
│   ├── analytics.ts       # Web vitals and analytics
│   └── auth.ts            # Authentication and security
└── README.md              # This documentation
```

## 🔌 API Endpoints

### Base URL
All RPC endpoints are available at: `/api/rpc/`

### Contact (`/contact`)
- `POST /submit` - Submit contact form
- `POST /validate` - Validate form data
- `GET /stats` - Get contact statistics

### Blog (`/blog`) 
- `GET /posts` - List blog posts (with pagination/filtering)
- `GET /posts/:slug` - Get single blog post
- `POST /posts` - Create new post (auth required)
- `PUT /posts/:id` - Update post (auth required)
- `DELETE /posts/:id` - Delete post (auth required)
- `GET /categories` - List categories
- `GET /tags` - List tags
- `GET /analytics` - Blog analytics
- `POST /upload` - Upload images (auth required)

### Projects (`/projects`)
- `GET /` - List projects (with pagination/filtering)
- `GET /:slug` - Get single project
- `GET /categories/list` - List project categories
- `GET /technologies/list` - List technologies
- `GET /stats` - Project statistics
- `POST /search` - Advanced project search

### Analytics (`/analytics`)
- `POST /vitals` - Report web vitals
- `GET /vitals/summary` - Web vitals summary
- `POST /pageview` - Track page view
- `GET /pageviews` - Page view analytics
- `GET /dashboard` - Analytics dashboard
- `GET /health` - Analytics health check

### Auth (`/auth`)
- `POST /login` - User login
- `POST /register` - User registration (admin only)
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `POST /refresh` - Refresh auth token
- `POST /csp-report` - CSP violation reporting
- `GET /security/audit` - Security audit (admin only)
- `GET /health` - Auth health check

## 💻 Usage Examples

### Frontend Usage with Type-Safe Client

```typescript
import { rpcClient } from '@/server/rpc/client'

// Contact form submission
try {
  const response = await rpcClient.contact.submit({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello there!',
  })
  console.log('Form submitted:', response)
} catch (error) {
  console.error('Submission failed:', error)
}

// Get blog posts with filtering
const posts = await rpcClient.blog.getPosts({
  status: 'PUBLISHED',
  page: 1,
  limit: 10,
  search: 'javascript',
})

// Get project details
const project = await rpcClient.projects.getProject('revenue-kpi')

// Track analytics
await rpcClient.analytics.trackPageView({
  page: '/projects/revenue-kpi',
  title: 'Revenue KPI Dashboard',
})
```

### Authentication

```typescript
// Login
const { user, token } = await rpcClient.auth.login({
  email: 'admin@example.com',
  password: 'password123',
})

// The client automatically stores the token for subsequent requests
// All authenticated endpoints will now work

// Get user profile
const profile = await rpcClient.auth.getProfile()
```

### Error Handling

```typescript
import { RPCError } from '@/server/rpc/client'

try {
  await rpcClient.contact.submit(formData)
} catch (error) {
  if (error instanceof RPCError) {
    // Structured RPC error with code and details
    console.error('RPC Error:', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    })
    
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Handle rate limiting
      showRateLimitMessage()
    }
  } else {
    // Generic error handling
    console.error('Unknown error:', error)
  }
}
```

## 🔒 Security Features

### Rate Limiting
Each endpoint has configurable rate limiting:

```typescript
// Example: 5 requests per 15 minutes for contact form
rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 })
```

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (user/admin)
- Automatic token refresh
- Session management

### Security Headers
- CORS configuration
- Content Security Policy (CSP)
- Security headers (XSS, CSRF protection)
- CSP violation reporting

### Input Validation
All inputs are validated using Zod schemas:

```typescript
const ContactFormSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
})
```

## 📊 Monitoring & Analytics

### Health Checks
Each service provides health check endpoints:
- Overall system health at `/health`
- Individual service health (auth, analytics, etc.)
- Performance metrics and system status

### Logging
Comprehensive logging includes:
- Request/response logging
- Error tracking
- Performance metrics
- Security events

### Web Vitals
Built-in web vitals collection:
- Core Web Vitals (LCP, FID, CLS)
- Performance metrics (FCP, TTFB)
- Trend analysis and recommendations

## 🚦 Migration from REST API

The new RPC API replaces these existing REST endpoints:

| Old REST Endpoint | New RPC Endpoint | Status |
|-------------------|------------------|--------|
| `/api/contact` | `/api/rpc/contact/submit` | ✅ Enhanced |
| `/api/send-email` | Integrated into contact | ✅ Consolidated |
| `/api/analytics/vitals` | `/api/rpc/analytics/vitals` | ✅ Enhanced |
| `/api/blog/*` | `/api/rpc/blog/*` | ✅ Complete CRUD |
| `/api/projects/*` | `/api/rpc/projects/*` | ✅ Enhanced |
| `/api/health-check` | `/api/rpc/health` | ✅ Enhanced |
| `/api/csp-report` | `/api/rpc/auth/csp-report` | ✅ Enhanced |

### Migration Benefits
1. **Type Safety**: End-to-end TypeScript types
2. **Better DX**: Autocomplete and IntelliSense
3. **Performance**: Optimized with Hono framework
4. **Security**: Enhanced security features
5. **Monitoring**: Built-in analytics and health checks
6. **Validation**: Comprehensive input/output validation

## 🔧 Development

### Running the RPC Server
The RPC server is automatically available when running the Next.js development server:

```bash
npm run dev
```

Access the RPC API at: `http://localhost:3000/api/rpc/`

### API Documentation
Visit `http://localhost:3000/api/rpc/docs` for complete API documentation.

### Testing Endpoints
Use the built-in health checks and documentation endpoints:

```bash
# Test API health
curl http://localhost:3000/api/rpc/health

# Get API documentation
curl http://localhost:3000/api/rpc/docs

# Test contact form
curl -X POST http://localhost:3000/api/rpc/contact/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello World"}'
```

## 📝 Type Definitions

All types are defined in `/types.ts` and automatically exported for frontend use:

```typescript
import type {
  ContactFormInput,
  ContactResponse,
  BlogPost,
  Project,
  AnalyticsData,
  // ... all other types
} from '@/server/rpc/types'
```

## 🤝 Contributing

1. All new endpoints should include:
   - Zod schema validation
   - Rate limiting
   - Proper error handling
   - Type-safe responses
   - Documentation

2. Update the client when adding new endpoints
3. Add comprehensive error handling
4. Include health checks for new services
5. Update this documentation

## 📚 Additional Resources

- [Hono Documentation](https://hono.dev/)
- [Zod Documentation](https://zod.dev/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

This RPC architecture provides a robust, type-safe, and secure foundation for the modern portfolio application, with excellent developer experience and production-ready features.