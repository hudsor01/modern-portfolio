# Resume Page Testing & Optimization Plan

**Current Status**: Needs testing and optimization
**Page**: `/resume`
**PDF**: ✅ Present (48KB)

---

## 🔍 Current Analysis

### Issues Found

#### 1. **'use client' with force-static Conflict** ⚠️
```tsx
'use client'
export const dynamic = 'force-static'
```

**Problem**: You're using `'use client'` (client component) but trying to force static generation. These conflict.

**Impact**:
- Page is server-rendered on demand (not pre-rendered)
- Slower initial load
- Higher server costs

**Solution**: Choose one approach:
- **Option A (Recommended)**: Remove `'use client'`, keep `force-static`, move interactivity to child components
- **Option B**: Keep `'use client'`, remove `force-static`, accept dynamic rendering

---

#### 2. **No Tests** ❌
Currently **0 tests** for resume page.

**Missing Coverage**:
- Component rendering
- PDF download functionality
- Toggle view behavior
- Accessibility
- SEO metadata

---

#### 3. **Performance Issues** ⚠️

**Potential Problems**:
- Inline animations without optimization
- No lazy loading for PDF viewer
- Multiple `useEffect` hooks
- Client-side state management for static content

---

#### 4. **Accessibility Concerns** ⚠️

**Not Verified**:
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels
- Color contrast

---

#### 5. **SEO Issues** ⚠️

**Missing**:
- Structured data (JSON-LD for Person/Resume)
- Open Graph metadata
- Twitter Card metadata
- Canonical URL

---

## 🎯 Optimization Plan

### Priority 1: Fix Static Generation (High Impact)

#### Current State:
```tsx
// page.tsx
'use client'
export const dynamic = 'force-static'

export default function ResumePage() {
  const [showPdf, setShowPdf] = useState(false)
  // ... client-side logic
}
```

#### Optimized Approach:

**File**: `src/app/resume/page.tsx` (Server Component)
```tsx
import { Metadata } from 'next'
import { ResumeContent } from './resume-content'
import { getResumeData } from '@/types/resume'

export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  const resume = getResumeData()

  return {
    title: `${resume.name} - Resume | Revenue Operations Specialist`,
    description: resume.summary,
    openGraph: {
      title: `${resume.name} - Resume`,
      description: resume.summary,
      type: 'profile',
      images: ['/og-resume.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${resume.name} - Resume`,
      description: resume.summary,
    },
  }
}

export default function ResumePage() {
  const resume = getResumeData()

  return <ResumeContent resume={resume} />
}
```

**File**: `src/app/resume/resume-content.tsx` (Client Component)
```tsx
'use client'

import { useState } from 'react'
import { ResumeData } from '@/types/resume'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
// ... other imports

interface ResumeContentProps {
  resume: ResumeData
}

export function ResumeContent({ resume }: ResumeContentProps) {
  const [showPdf, setShowPdf] = useState(false)
  // ... client-side logic

  return (
    <>
      <Navbar />
      <main>
        {/* Resume content */}
      </main>
      <Footer />
    </>
  )
}
```

**Benefits**:
- ✅ True static generation (pre-rendered at build time)
- ✅ Faster page loads (no JavaScript execution needed)
- ✅ Better SEO (content available immediately)
- ✅ Lower server costs (no runtime rendering)

---

### Priority 2: Add Comprehensive Tests

#### Test Suite Structure

**File**: `src/app/resume/__tests__/page.test.tsx`
```tsx
import { describe, it, expect, vi } from 'bun:test'
import { render, screen, fireEvent } from '@testing-library/react'
import ResumePage from '../page'

describe('Resume Page', () => {
  it('renders resume header with name and title', () => {
    render(<ResumePage />)
    expect(screen.getByText('Richard Hudson')).toBeInTheDocument()
    expect(screen.getByText(/Revenue Operations/)).toBeInTheDocument()
  })

  it('displays all work experience entries', () => {
    render(<ResumePage />)
    expect(screen.getByText('Thryv')).toBeInTheDocument()
    expect(screen.getByText('Revenue Operations Manager')).toBeInTheDocument()
  })

  it('toggles between content and PDF view', () => {
    render(<ResumePage />)
    const toggleButton = screen.getByText(/View PDF/)
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument()
  })

  it('handles PDF download', async () => {
    render(<ResumePage />)
    const downloadButton = screen.getByText(/Download Resume/)
    fireEvent.click(downloadButton)
    // Verify download initiated
  })
})
```

**File**: `src/app/resume/__tests__/components.test.tsx`
```tsx
describe('Resume Components', () => {
  describe('ExperienceSection', () => {
    it('renders all job entries', () => {
      render(<ExperienceSection />)
      expect(screen.getAllByRole('article')).toHaveLength(3)
    })

    it('displays technologies for each job', () => {
      render(<ExperienceSection />)
      expect(screen.getByText('Salesforce')).toBeInTheDocument()
    })
  })

  describe('SkillsSection', () => {
    it('groups skills by category', () => {
      render(<SkillsSection />)
      expect(screen.getByText('Revenue Operations')).toBeInTheDocument()
      expect(screen.getByText('Data Analysis')).toBeInTheDocument()
    })
  })

  describe('EducationCertifications', () => {
    it('displays education and certifications', () => {
      render(<EducationCertifications />)
      expect(screen.getByText(/University of Texas/)).toBeInTheDocument()
      expect(screen.getByText('Salesforce Certified Administrator')).toBeInTheDocument()
    })
  })
})
```

**File**: `src/app/resume/__tests__/accessibility.test.tsx`
```tsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Resume Page Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ResumePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports keyboard navigation', () => {
    render(<ResumePage />)
    const downloadButton = screen.getByText(/Download Resume/)
    downloadButton.focus()
    expect(document.activeElement).toBe(downloadButton)

    // Test Tab navigation
    fireEvent.keyDown(downloadButton, { key: 'Tab' })
    // Verify focus moved to next element
  })

  it('has proper ARIA labels', () => {
    render(<ResumePage />)
    expect(screen.getByLabelText(/Download resume/)).toBeInTheDocument()
  })
})
```

**File**: `src/app/resume/__tests__/seo.test.tsx`
```tsx
describe('Resume Page SEO', () => {
  it('has proper meta tags', () => {
    const metadata = generateMetadata()
    expect(metadata.title).toContain('Richard Hudson')
    expect(metadata.description).toBeTruthy()
  })

  it('includes structured data', () => {
    render(<ResumePage />)
    const script = screen.getByTestId('structured-data')
    const json = JSON.parse(script.textContent!)
    expect(json['@type']).toBe('Person')
  })
})
```

---

### Priority 3: Performance Optimization

#### A. Lazy Load PDF Viewer

**Before**:
```tsx
{showPdf && <ResumeViewer pdfUrl={pdfUrl} />}
```

**After**:
```tsx
import dynamic from 'next/dynamic'

const ResumeViewer = dynamic(() => import('./resume-viewer'), {
  loading: () => <div>Loading PDF...</div>,
  ssr: false, // PDF viewer only works client-side
})

{showPdf && <ResumeViewer pdfUrl={pdfUrl} />}
```

**Benefit**: Saves ~50KB+ of JavaScript on initial load

---

#### B. Optimize Animations

**Before**:
```tsx
className="animate-fade-in-up"
```

**After** (Use Intersection Observer):
```tsx
const { ref, inView } = useInView({ once: true })

<div
  ref={ref}
  className={`transition-all duration-700 ${
    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`}
>
```

**Benefit**: Better performance, no layout shift

---

#### C. Optimize Images

**Current**: Decorative background blurs
```tsx
<div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
```

**Issue**: `blur-3xl` is expensive on low-end devices

**Solution**: Use `will-change` or reduce blur amount
```tsx
<div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-2xl opacity-50" />
```

---

#### D. Code Splitting

**Create separate bundles**:
- `resume-content.tsx` - Main content (always needed)
- `resume-viewer.tsx` - PDF viewer (lazy loaded)
- `resume-download.tsx` - Download logic (lazy loaded)

---

### Priority 4: Add Structured Data

**File**: `src/app/resume/page.tsx`

Add JSON-LD structured data:
```tsx
export default function ResumePage() {
  const resume = getResumeData()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resume.name,
    jobTitle: resume.title,
    email: resume.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Plano',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    alumniOf: resume.education.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu.institution,
    })),
    hasCredential: resume.certifications.map(cert => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: 'certificate',
      recognizedBy: {
        '@type': 'Organization',
        name: cert.issuer,
      },
    })),
    knowsAbout: resume.skills.flatMap(s => s.items),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ResumeContent resume={resume} />
    </>
  )
}
```

---

### Priority 5: Accessibility Improvements

#### A. Add ARIA Labels

```tsx
<button
  onClick={handleDownloadResume}
  aria-label="Download resume as PDF"
  aria-describedby="download-hint"
>
  Download Resume
</button>
<span id="download-hint" className="sr-only">
  Downloads a PDF version of Richard Hudson's resume
</span>
```

---

#### B. Keyboard Navigation

```tsx
<button
  onClick={handleToggleView}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleToggleView()
    }
  }}
  aria-pressed={showPdf}
>
  {showPdf ? 'View Resume' : 'View PDF'}
</button>
```

---

#### C. Focus Management

```tsx
const pdfContainerRef = useRef<HTMLDivElement>(null)

const handleToggleView = () => {
  setShowPdf(!showPdf)

  // Move focus to PDF container when toggling
  if (!showPdf) {
    setTimeout(() => {
      pdfContainerRef.current?.focus()
    }, 100)
  }
}
```

---

## 📊 Testing Checklist

### Unit Tests
- [ ] Resume page renders correctly
- [ ] All sections display proper data
- [ ] PDF toggle works
- [ ] Download functionality works
- [ ] Error handling for missing PDF

### Integration Tests
- [ ] Navigation works
- [ ] Footer renders
- [ ] Toast notifications appear
- [ ] Scroll animations trigger

### Accessibility Tests
- [ ] No axe violations
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

### Performance Tests
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse SEO > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Total Bundle Size < 200KB

### SEO Tests
- [ ] Meta tags present
- [ ] Structured data valid
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URL

---

## 🚀 Implementation Steps

### Step 1: Fix Static Generation (30 min)
```bash
# Create new file
touch src/app/resume/resume-content.tsx

# Move client logic to new file
# Update page.tsx to be server component
# Test build: bun run build
```

### Step 2: Add Tests (2 hours)
```bash
# Create test files
mkdir -p src/app/resume/__tests__
touch src/app/resume/__tests__/page.test.tsx
touch src/app/resume/__tests__/components.test.tsx
touch src/app/resume/__tests__/accessibility.test.tsx

# Write tests
# Run tests: bun test src/app/resume
```

### Step 3: Performance Optimization (1 hour)
```bash
# Add dynamic imports
# Optimize animations
# Add lazy loading
# Test build size: bun run build
```

### Step 4: Add Structured Data (30 min)
```bash
# Add JSON-LD to page
# Validate with Google Rich Results Test
```

### Step 5: Accessibility Audit (1 hour)
```bash
# Add ARIA labels
# Test keyboard navigation
# Run axe-core tests
# Test with screen reader
```

---

## 📈 Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Lighthouse Performance** | ~75 | 90+ | +20% |
| **First Contentful Paint** | ~2.5s | <1.5s | 40% faster |
| **Time to Interactive** | ~4.5s | <3.5s | 22% faster |
| **Bundle Size** | ~250KB | <180KB | 28% smaller |
| **Accessibility Score** | ~80 | 95+ | +19% |
| **SEO Score** | ~85 | 95+ | +12% |

---

## 🔧 Quick Wins (Do These First)

### 1. Add Lazy Loading (5 min)
```tsx
const ResumeViewer = dynamic(() => import('./resume-viewer'), { ssr: false })
```

### 2. Fix Static Generation (15 min)
```tsx
// Remove 'use client' from page.tsx
// Move interactive logic to child component
```

### 3. Add Basic Meta Tags (10 min)
```tsx
export const metadata: Metadata = {
  title: 'Richard Hudson - Resume',
  description: 'Resume for Richard Hudson...',
}
```

### 4. Reduce Blur Effect (2 min)
```tsx
// Change blur-3xl to blur-2xl
<div className="... blur-2xl" />
```

---

## 🧪 Testing Commands

```bash
# Run all tests
bun test src/app/resume

# Run with coverage
bun test --coverage src/app/resume

# Run accessibility tests
bun test src/app/resume/__tests__/accessibility.test.tsx

# Build and analyze bundle
bun run build
bun run analyze

# Lighthouse audit
npx lighthouse http://localhost:3000/resume --view

# Check SEO
npx lighthouse http://localhost:3000/resume --only-categories=seo --view
```

---

## 📝 Monitoring

### After Deployment

1. **Performance Monitoring**
   - Vercel Analytics: Track Core Web Vitals
   - Check `/resume` page metrics
   - Monitor bundle size

2. **User Behavior**
   - PDF download rate
   - Toggle view usage
   - Time on page

3. **Error Tracking**
   - PDF load failures
   - Download errors
   - Console errors

---

## 🎯 Success Criteria

### Must Have (Before Launch)
- ✅ Static generation working
- ✅ All tests passing (>80% coverage)
- ✅ Lighthouse Performance > 85
- ✅ Lighthouse Accessibility > 90
- ✅ No console errors

### Nice to Have (Post-Launch)
- ✅ Lighthouse Performance > 95
- ✅ Perfect accessibility score (100)
- ✅ Structured data validation
- ✅ PDF download analytics
- ✅ A/B test different layouts

---

## 📚 Resources

- [Next.js Static Generation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [axe-core Accessibility](https://github.com/dequelabs/axe-core)
- [Schema.org Person](https://schema.org/Person)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Next Step**: Choose which priority to tackle first and I'll help implement it!
