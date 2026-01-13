# Sentry Self-Hosted Integration Setup

## ✅ Configuration Complete

Your modern-portfolio project is now configured to send errors and performance data to your self-hosted Sentry instance at **sentry.thehudsonfam.com**.

## Configuration Files

### Environment Variables (`.env.local`)
All required environment variables have been configured:
- **Runtime DSN**: Points to your Homelab project (ID: 2)
- **Environment**: Set to "production"
- **Traces**: 10% sampling rate for performance monitoring
- **Session Replay**: 10% general sessions, 100% error sessions
- **Source Maps**: Configured for build-time upload

### Modified Files
1. **`next.config.js`**: Added `url` parameter for self-hosted Sentry support
2. **`.env.local`**: Created with all Sentry configuration
3. **`src/app/api/test-sentry/route.ts`**: Test endpoint for verification

## Testing the Integration

### 1. Test Message Capture (Info Level)
```bash
curl http://localhost:3000/api/test-sentry
```
**Expected**: Success response, check Sentry for info-level message

### 2. Test Error Capture
```bash
curl -X POST http://localhost:3000/api/test-sentry
```
**Expected**: 500 error response, check Sentry for captured exception

### 3. Check Sentry Dashboard
1. Log in: https://sentry.thehudsonfam.com
2. Email: rhudsontspr@gmail.com
3. Navigate to: **Homelab** project
4. Check **Issues** tab for captured errors
5. Check **Performance** tab for transaction data

## What Gets Tracked

### Automatically Captured
- ✅ Unhandled JavaScript exceptions (client & server)
- ✅ Unhandled promise rejections
- ✅ API route errors
- ✅ Server-side errors
- ✅ Edge runtime errors

### Performance Monitoring (10% sampling)
- ✅ Page load times
- ✅ API response times
- ✅ Database query performance
- ✅ Custom transactions

### Session Replay (10% sampling + 100% errors)
- ✅ User interactions on error
- ✅ DOM mutations
- ✅ Network requests
- ⚠️ PII filtering enabled (emails/passwords masked)

## Manual Error Capturing

### In API Routes
```typescript
import * as Sentry from '@sentry/nextjs'

export async function POST(request: Request) {
  try {
    // Your code
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: '/api/example' },
      extra: { userId: 'user-123' }
    })
    throw error
  }
}
```

### In Client Components
```typescript
'use client'
import * as Sentry from '@sentry/nextjs'

export function MyComponent() {
  const handleClick = () => {
    try {
      // Your code
    } catch (error) {
      Sentry.captureException(error)
    }
  }
}
```

## Source Maps

Source maps will be automatically uploaded to Sentry during production builds when:
1. `SENTRY_AUTH_TOKEN` is set (✅ configured)
2. `SENTRY_ORG` is set (✅ configured as "sentry")
3. `SENTRY_PROJECT` is set (✅ configured as "homelab")
4. `SENTRY_URL` is set (✅ configured for self-hosted)

**Build with source map upload**:
```bash
bun run build
```

## Configuration Details

### Self-Hosted Instance
- **URL**: https://sentry.thehudsonfam.com
- **Organization**: sentry
- **Project**: homelab (ID: 2)
- **DSN**: `https://8e788de96e89cf23a2e40c00d196a4e7@sentry.thehudsonfam.com/2`

### Sampling Rates
- **Traces**: 10% (1 in 10 transactions)
- **Profiles**: 0% (disabled)
- **Session Replay**: 10% general + 100% on error
- **Send PII**: Disabled (emails/passwords filtered)

## Troubleshooting

### Not Seeing Errors in Sentry?

1. **Check DSN is set**:
   ```bash
   grep SENTRY_DSN .env.local
   ```

2. **Verify environment**:
   ```bash
   echo $NEXT_PUBLIC_SENTRY_DSN
   ```

3. **Check Sentry is initialized**:
   - Client: Check browser console for Sentry SDK messages
   - Server: Check terminal logs during startup

4. **Test with test endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/test-sentry
   ```

5. **Check Sentry project settings**:
   - Verify project ID matches (should be 2)
   - Check "Client Keys (DSN)" in project settings

### Source Maps Not Uploading?

1. **Verify auth token is valid**:
   ```bash
   curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
     https://sentry.thehudsonfam.com/api/0/
   ```

2. **Check build logs for upload errors**:
   ```bash
   bun run build 2>&1 | grep -i sentry
   ```

3. **Verify token permissions**:
   - Should have: `project:releases`, `project:write`, `org:read`

## Next Steps

1. **Test the integration**:
   ```bash
   bun dev
   curl -X POST http://localhost:3000/api/test-sentry
   ```

2. **Check Sentry dashboard**: Verify the test error appears

3. **Remove test endpoint** (optional):
   ```bash
   rm src/app/api/test-sentry/route.ts
   ```

4. **Deploy to production**:
   - Source maps will be uploaded automatically
   - All errors will be tracked in real-time

## Additional Resources

- Self-hosted Sentry: https://sentry.thehudsonfam.com
- Sentry Next.js Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Project Issues: https://sentry.thehudsonfam.com/organizations/sentry/issues/

---

**Status**: ✅ Ready for testing
**Created**: 2026-01-12
