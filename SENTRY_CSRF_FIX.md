# Fix Sentry CSRF Blocking Events

## The Problem (DIAGNOSED)

Your Sentry server returns **HTTP 403 "CSRF Validation Failed"** when the SDK tries to send events.

**Error message from server:**
```
CSRF Validation Failed | Sentry
A required security token was not found or was invalid.
You are seeing this message because Sentry requires a 'Referer header' 
to be sent by your Web browser, but none was sent.
```

**Why this happens:**
- Self-hosted Sentry has CSRF protection enabled
- Sentry SDK doesn't send Referer headers on ingestion requests
- Cloudflare (sitting in front) may strip headers
- Result: All events blocked with 403

---

## Fix Option 1: Disable CSRF for API Endpoints (Recommended)

SSH into your Sentry server and edit the config:

```bash
# SSH to your homelab server
ssh user@sentry-server

# Find your Sentry installation directory
cd /path/to/sentry  # Or wherever docker-compose.yml is

# Edit the Sentry config
nano sentry/config.yml

# Add this line to disable CSRF for ingestion:
SENTRY_FEATURES['system:multi-region-selector'] = False
CSRF_TRUSTED_ORIGINS = [
    'https://sentry.thehudsonfam.com',
]
# OR disable CSRF completely for ingestion:
CSRF_COOKIE_SECURE = False
DISABLE_CSRF_PROTECTION = True

# Save and restart
docker-compose restart web worker
```

**If using Docker Compose**, add environment variable:
```yaml
services:
  web:
    environment:
      - SENTRY_FEATURES_SYSTEM_MULTI_REGION_SELECTOR=False
      - CSRF_TRUSTED_ORIGINS=https://sentry.thehudsonfam.com
```

Then restart:
```bash
docker-compose up -d
```

---

## Fix Option 2: Configure Cloudflare to Preserve Headers

If Cloudflare is stripping Referer headers:

1. Go to Cloudflare dashboard
2. Select your domain (`thehudsonfam.com`)
3. Go to **Rules → Transform Rules**
4. Create HTTP Request Header Modification:
   - **Name**: Preserve Referer for Sentry
   - **If**: Hostname equals `sentry.thehudsonfam.com`
   - **Then**: Set dynamic header `Referer` to expression: `http.request.uri.path`
5. Save and deploy

---

## Fix Option 3: Whitelist SDK User-Agent

Edit Sentry middleware to skip CSRF for SDK requests:

```bash
# In Sentry config
nano sentry/sentry.conf.py

# Add:
MIDDLEWARE = list(MIDDLEWARE)
MIDDLEWARE.insert(
    MIDDLEWARE.index('django.middleware.csrf.CsrfViewMiddleware'),
    'sentry.middleware.ingestion_bypass.IngestionBypassMiddleware'
)
```

---

## Verify the Fix

After applying any fix above, test from your dev machine:

```bash
# Test 1: Direct API call (should now return 200 or 400, NOT 403)
curl -X POST "https://sentry.thehudsonfam.com/api/2/store/" \
  -H "Content-Type: application/json" \
  -H "X-Sentry-Auth: Sentry sentry_version=7, sentry_key=8e788de96e89cf23a2e40c00d196a4e7, sentry_client=test/1.0" \
  -d '{"message":"Test after fix","level":"error","platform":"javascript"}'

# Test 2: Send from your app
curl -X POST http://localhost:3000/api/sentry-test-verbose

# Test 3: Check Sentry Issues page
# Go to: https://sentry.thehudsonfam.com/organizations/sentry/issues/
# Should now see events!
```

---

## Quick Diagnosis Commands

**Check Sentry logs for CSRF errors:**
```bash
docker logs sentry_web_1 --tail 100 | grep -i csrf
docker logs sentry_worker_1 --tail 100 | grep -i csrf
```

**Check Sentry config:**
```bash
docker exec sentry_web_1 cat /etc/sentry/config.yml | grep -i csrf
```

**Check Cloudflare is the issue:**
```bash
# Bypass Cloudflare by adding Sentry IP to /etc/hosts
# Get Sentry server IP:
docker inspect sentry_web_1 | grep IPAddress

# Test direct connection:
curl -H "Host: sentry.thehudsonfam.com" http://[SENTRY_IP]/api/2/store/
```

---

## Expected Result

**Before fix:**
```bash
curl https://sentry.thehudsonfam.com/api/2/store/
# Returns: HTTP 403 with CSRF error HTML page
```

**After fix:**
```bash
curl https://sentry.thehudsonfam.com/api/2/store/
# Returns: HTTP 400 "Bad Request" (missing data is OK - means CSRF is bypassed!)
# OR HTTP 200 with event ID
```

---

## If You Can't Access Server

If you can't SSH to your Sentry server, you have these options:

1. **Use a different Sentry instance** (cloud.sentry.io free tier)
2. **Contact homelab admin** to apply the fix
3. **Temporarily disable Sentry** until you can fix the server

---

## Next Steps After Fix

Once events appear:

1. ✅ Go to https://sentry.thehudsonfam.com/organizations/sentry/issues/
2. ✅ You should see "VERBOSE TEST ERROR" events
3. ✅ Click on an issue to see details
4. ✅ Set up alerts (Settings → Alerts)
5. ✅ Delete test events if desired

---

## Summary

**The problem:** Sentry server CSRF protection blocks SDK ingestion requests
**The fix:** Disable CSRF for API endpoints or configure header preservation
**The test:** `curl` should return 400/200 instead of 403
**The result:** Events will appear in Sentry Issues dashboard

**Most likely fastest fix:** Option 1 (disable CSRF via config)
