# Sentry Quick Start Guide

## ✅ I Just Sent Your First Error!

I triggered a test error to your Sentry. Let's go see it.

---

## 1. Open Your Sentry Dashboard (Right Now)

**Go to**: https://sentry.thehudsonfam.com

**Login**:
- Email: `rhudsontspr@gmail.com`
- Password: `jirah-richard`

---

## 2. What You'll See

### Left Sidebar → "Issues"
This is where all errors appear. You should see:

```
❌ Error: Test error from modern-portfolio API
   ├─ First seen: Just now
   ├─ Count: 1 event
   ├─ Users affected: 1
   └─ Last seen: Just now
```

**Click on it** → You'll see:

### Error Details Page
1. **Stack Trace** (top section):
   ```
   Error: Test error from modern-portfolio API
     at POST /api/test-sentry/route.ts:17:11
     at ...
   ```
   👆 Shows EXACTLY where the error happened

2. **Tags** (right side):
   - `endpoint: /api/test-sentry`
   - `method: POST`
   - `environment: production`
   - `server: node`

3. **Breadcrumbs** (timeline):
   - Request started
   - POST /api/test-sentry
   - Error thrown
   - Error captured

4. **Context** (bottom):
   - Request headers
   - Environment variables
   - Timestamp

---

## 3. Try Breaking Something Real

### Option A: Break the Contact Form

Open: `src/app/contact/actions.ts`

Add this intentional bug:
```typescript
export async function submitContactForm(data: ContactFormData) {
  // Add this line to cause an error:
  throw new Error('Testing Sentry with real contact form')

  // Rest of the function...
}
```

Then:
1. Go to http://localhost:3000/contact
2. Fill out the form
3. Submit
4. **Check Sentry** → New error appears!

### Option B: Break a Page

Open: `src/app/resume/page.tsx`

Add this in the component:
```typescript
export default function ResumePage() {
  // Add this line:
  throw new Error('Testing Sentry on resume page')

  const resume = getResumeData()
  // ...
}
```

Then:
1. Go to http://localhost:3000/resume
2. Page crashes
3. **Check Sentry** → Error captured with session replay!

**Remove the test errors after seeing them in Sentry.**

---

## 4. What to Do Daily (Realistic Usage)

### Every Morning (30 seconds)
Visit: https://sentry.thehudsonfam.com/organizations/sentry/issues/

**Quick check**:
- ✅ Any new errors overnight?
- ✅ Any spike in error count?
- ✅ Any errors affecting multiple users?

**Most days**: Nothing. Site is working fine. ✨

**When you see an error**:
1. Click on it
2. Read the stack trace → shows exact line
3. Check breadcrumbs → what did user do before error?
4. Watch session replay → see it happen
5. Fix the bug
6. Mark as "Resolved" in Sentry

### Before Deploying
Visit: https://sentry.thehudsonfam.com/organizations/sentry/issues/?query=is:unresolved

**Check**: Are there any unresolved errors?
- ✅ None? Safe to deploy.
- ❌ Yes? Fix them first or mark as "won't fix" if intentional.

### After Deploying
Wait 5-10 minutes, then check Issues page.
- ✅ No new errors? Deploy successful.
- ❌ New spike in errors? Rollback or hotfix.

---

## 5. Set Up Alerts (Optional but Recommended)

### Get Notified of Critical Errors

1. Go to: https://sentry.thehudsonfam.com/settings/sentry/projects/homelab/alerts/

2. Click "Create Alert Rule"

3. Set up:
   ```
   When: An event occurs
   If: Level equals error
   Then: Send notification to rhudsontspr@gmail.com
   ```

4. **Result**: Get email when errors happen. No need to check dashboard constantly.

---

## 6. Real-World Scenarios

### Scenario 1: User Reports "Contact form doesn't work"

**Without Sentry**:
- "Works for me" 🤷
- Ask user for details
- Can't reproduce
- Never gets fixed

**With Sentry**:
1. Open Issues → Search "contact"
2. See error: `ResendAPIError: Invalid API key`
3. Stack trace shows: `contact/actions.ts:47`
4. Oh! API key expired
5. Update key
6. Tell user "Fixed, try again"
7. Total time: 5 minutes

### Scenario 2: Site is Slow

**Without Sentry**:
- "Feels slow to me too"
- Check... what? Database? Frontend?
- Random optimization attempts

**With Sentry**:
1. Go to: Performance tab
2. See: `/api/projects` averages 3.2 seconds
3. Click transaction → See breakdown:
   - Database query: 2.9s ← THE PROBLEM
   - Serialization: 0.3s
4. Check query in Prisma
5. Add index to database
6. Next day: 3.2s → 0.4s
7. Data proves the fix worked

### Scenario 3: Interview Tomorrow

**What to do**:
1. Check Sentry Issues tab
2. If any errors: Fix or mark as resolved
3. **In interview**: "I use Sentry for error tracking. Let me show you..." (pull up dashboard)

**Recruiter sees**:
- Professional monitoring setup
- Clean Issues page (no unresolved errors)
- Performance metrics
- "This person runs a production-grade site"

---

## 7. Common Questions

### Q: Do I need to check Sentry constantly?
**A**: No. Set up email alerts (see #5). Check it:
- Daily: 30 seconds glance
- Before deploy: 2 minutes
- After deploy: 5 minutes
- When user reports issue: As needed

### Q: What if I see errors I don't understand?
**A**:
1. Click the error
2. Read stack trace (shows exact line)
3. Check breadcrumbs (what led to it)
4. Watch session replay
5. Google the error message
6. Ask Claude or Stack Overflow with the exact error

### Q: Should I fix every single error?
**A**: No. Prioritize:
1. ❗ Affects users (contact form, broken pages) → Fix immediately
2. ⚠️  Happens frequently → Fix soon
3. 💡 Rare edge case → Note and revisit later
4. 🤷 Third-party script error → Mark "won't fix"

### Q: What's the "Releases" tab for?
**A**: Shows which version of your code is deployed. When you deploy, errors get tagged with the release version. Helpful for "Did this error start after last deploy?"

(We'll set this up later if you want)

---

## 8. Next Steps

### Right Now:
- [x] Log in to Sentry
- [ ] Click on the test error I sent
- [ ] Look at the stack trace
- [ ] Check out the Tags and Context
- [ ] Try breaking something intentionally (Option A or B)
- [ ] Watch it appear in Sentry

### This Week:
- [ ] Set up email alerts (see #5)
- [ ] Check Sentry once a day for a few days
- [ ] Get comfortable with the interface

### Before Showing Your Portfolio:
- [ ] Check Issues → Make sure no unresolved errors
- [ ] Clean dashboard = professional impression

---

## Quick Reference

| What | Where |
|------|-------|
| See all errors | https://sentry.thehudsonfam.com/organizations/sentry/issues/ |
| Performance data | Click "Performance" in left sidebar |
| Trigger test error | `curl -X POST http://localhost:3000/api/test-sentry` |
| Alert settings | Project Settings → Alerts |
| Your project | https://sentry.thehudsonfam.com/organizations/sentry/projects/homelab/ |

---

## Pro Tip

**Add this to your deploy checklist**:
```
□ Run tests
□ Check Sentry for unresolved errors ← Add this
□ Build passes
□ Deploy
□ Check Sentry 5 min after deploy ← Add this
```

---

**You're all set!** Go click around Sentry now and see what I sent. It's much clearer when you see it live.
