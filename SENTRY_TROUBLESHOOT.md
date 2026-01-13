# 🔍 Sentry Not Showing Events - Troubleshooting Guide

## Current Status: ✅ Events ARE Being Sent!

**Event ID**: `32141756407349a49328066d64b24ca7`
**Sent**: Just now
**Destination**: `sentry.thehudsonfam.com` → Project ID: 2

The Sentry SDK is working correctly and events are being captured and sent. If you don't see them in your dashboard, the issue is likely with your Sentry instance configuration.

---

## Step-by-Step Troubleshooting

### 1. Verify Your Sentry Project Settings

**Go to**: https://sentry.thehudsonfam.com/settings/sentry/projects/homelab/

**Check**:
- [ ] Does the "homelab" project exist?
- [ ] Is the project ID actually `2`? (Check URL or project settings)
- [ ] Is the project active (not disabled)?
- [ ] Are you logged in to the right organization?

**If project doesn't exist**:
1. Go to https://sentry.thehudsonfam.com/organizations/sentry/projects/
2. Click "Create Project"
3. Name it "homelab"
4. Note the new project ID
5. Update `.env.local` with new DSN

---

### 2. Check Inbound Filters

**Go to**: https://sentry.thehudsonfam.com/settings/sentry/projects/homelab/filters/

**Check if these filters are BLOCKING events**:
- [ ] Browser Extensions filter (might block dev environment)
- [ ] Legacy Browsers filter
- [ ] Localhost filter (⚠️ MIGHT BE THE ISSUE)
- [ ] Web Crawlers filter

**Fix**: Disable any filters that might block development errors.

**Especially check**: If "Filter out events coming from localhost" is enabled, that's why you don't see anything!

---

### 3. Verify DSN is Correct

**Your current DSN**: `https://8e788de96e89cf23a2e40c00d196a4e7@sentry.thehudsonfam.com/2`

**To get the correct DSN from Sentry**:
1. Go to: https://sentry.thehudsonfam.com/settings/sentry/projects/homelab/keys/
2. Look for "Client Keys (DSN)"
3. Copy the DSN
4. Compare with what's in `.env.local`

**If DSN is different**:
```bash
# Update .env.local
NEXT_PUBLIC_SENTRY_DSN="[paste correct DSN here]"
SENTRY_DSN="[paste correct DSN here]"

# Restart dev server
pkill -f "next dev"
bun dev
```

---

### 4. Check for Pending Events

Some self-hosted Sentry instances have background workers that process events.

**Go to**: https://sentry.thehudsonfam.com/organizations/sentry/stats/

**Check**:
- Is the "Events" graph showing activity?
- Are there pending events in the queue?

**If no activity**: Events might not be reaching the server at all.

---

### 5. Test with Sentry CLI (Direct Verification)

Install Sentry CLI to send a test event directly:

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Configure
export SENTRY_URL=https://sentry.thehudsonfam.com
export SENTRY_ORG=sentry
export SENTRY_PROJECT=homelab
export SENTRY_AUTH_TOKEN=fdfa994ec8ce9b48159e6b2d9afd7a001eb84bf0f31e996cf8028526f307c530

# Send test event
sentry-cli send-event -m "Test event from CLI"
```

**If CLI event appears**: Your Sentry is working, issue is with the app configuration.
**If CLI event doesn't appear**: Issue is with your Sentry instance.

---

### 6. Check Sentry Instance Logs

If you have SSH access to your Sentry server:

```bash
# Check worker logs
docker logs sentry_worker_1

# Check web logs
docker logs sentry_web_1

# Check for errors
docker logs sentry_worker_1 2>&1 | grep -i error
```

**Look for**:
- Connection errors
- Database errors
- Permission errors
- Project not found errors

---

### 7. Verify Network Connectivity

**Test from your dev machine**:
```bash
# Can we reach the Sentry API?
curl -v https://sentry.thehudsonfam.com/api/2/store/ \
  -H "X-Sentry-Auth: Sentry sentry_key=8e788de96e89cf23a2e40c00d196a4e7" \
  2>&1 | grep -E "HTTP|Connected"
```

**Expected**: HTTP 200 or 401 (auth error is OK, means server is reachable)
**If connection fails**: Network/firewall issue

---

### 8. Check Project ID Match

**Verify your project ID**:

1. Go to: https://sentry.thehudsonfam.com/organizations/sentry/projects/
2. Find "homelab" project
3. Click on it
4. Look at the URL: `.../projects/homelab/` or check settings for project ID
5. Note the ID (should be `2`)

**If project ID is different**:
Update DSN in `.env.local` with correct project ID:
```
NEXT_PUBLIC_SENTRY_DSN="https://8e788de96e89cf23a2e40c00d196a4e7@sentry.thehudsonfam.com/[CORRECT_ID]"
```

---

### 9. Try a Different Project

**Quick test**: Create a new test project in Sentry

1. Go to: https://sentry.thehudsonfam.com/organizations/sentry/projects/new/
2. Create project named "test-project"
3. Copy the DSN
4. Update `.env.local` with new DSN
5. Restart dev server
6. Send test error: `curl -X POST http://localhost:3000/api/sentry-test-verbose`
7. Check new project's Issues page

**If errors appear in new project**: Original "homelab" project has an issue.
**If errors still don't appear**: Sentry instance has a broader issue.

---

### 10. Check Browser Console (Client-Side Errors)

**For browser errors specifically**:

1. Open http://localhost:3000/sentry-example-page
2. Open browser DevTools (F12)
3. Go to Console tab
4. Click "Throw Client Error" button
5. Look for Sentry messages in console:
   ```
   [Sentry] Sending error event
   [Sentry] Event sent successfully
   ```

**If you see errors about CORS or network**: Firewall/CORS issue on Sentry server.

---

## Most Likely Issues (In Order)

### 🎯 #1: Localhost Filter Enabled (Most Common)
**Fix**: https://sentry.thehudsonfam.com/settings/sentry/projects/homelab/filters/
Disable "Filter out events coming from localhost"

### 🎯 #2: Wrong Project ID
**Fix**: Get correct DSN from project settings and update `.env.local`

### 🎯 #3: Project Doesn't Exist
**Fix**: Create "homelab" project or update DSN to existing project

### 🎯 #4: Sentry Workers Not Running
**Fix**: Restart Sentry workers on your homelab server

### 🎯 #5: CORS/Network Issue
**Fix**: Check Sentry server firewall and CORS settings

---

## Quick Diagnosis Commands

Run these to collect information:

```bash
# Check Sentry configuration
curl http://localhost:3000/api/sentry-debug | jq .

# Send test event and get ID
curl -X POST http://localhost:3000/api/sentry-test-verbose | jq .

# Check if DSN is set
grep SENTRY_DSN .env.local

# Test Sentry server is reachable
curl -I https://sentry.thehudsonfam.com

# Check dev server logs for Sentry errors
tail -50 /tmp/sentry-dev.log | grep -i sentry
```

---

## What We Know Works

✅ Sentry SDK is initialized
✅ DSN is configured
✅ Events are being captured
✅ Events are being sent (event ID: `32141756407349a49328066d64b24ca7`)
✅ Sentry server is reachable

**The issue is between**: App sending events → Sentry storing/displaying them

**Most likely**: Configuration on your Sentry instance (filters, project settings, or workers).

---

## Still Stuck?

**Share this info**:
1. Screenshot of https://sentry.thehudsonfam.com/organizations/sentry/projects/
2. Screenshot of https://sentry.thehudsonfam.com/settings/sentry/projects/homelab/filters/
3. Output of: `curl http://localhost:3000/api/sentry-debug | jq .`
4. Output of: `curl -X POST http://localhost:3000/api/sentry-test-verbose | jq .`

**Or**: Check your Sentry server logs for why events aren't being processed.
