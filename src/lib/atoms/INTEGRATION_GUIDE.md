# Jotai Integration Guide

This guide shows exactly how to integrate the Jotai atomic state management system into your existing Next.js application.

## Step 1: Update Layout Provider Structure

Replace your current provider structure in `src/app/layout.tsx`:

### Before:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientComponentsProvider>
            <PreloadManager />
            <ScrollProgress />
            {children}
            <ScrollToTop />
            <Toaster position="bottom-right" closeButton richColors />
            <SpeedInsights />
            <Analytics />
          </ClientComponentsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### After:
```tsx
import { JotaiProvider } from '@/components/providers/jotai-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <JotaiProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientComponentsProvider>
              <PreloadManager />
              <ScrollProgress />
              {children}
              <ScrollToTop />
              <Toaster position="bottom-right" closeButton richColors />
              <SpeedInsights />
              <Analytics />
            </ClientComponentsProvider>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
```

## Step 2: Update Contact Modal Component

Replace the modal state management in your contact modal:

### Before (src/components/ui/contact-modal.tsx):
```tsx
interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  // ... existing logic
}
```

### After:
```tsx
'use client'

import { useContactModal } from '@/lib/atoms'

export function ContactModal() {
  const { isOpen, close } = useContactModal()

  // Replace onClose with close
  // Remove isOpen prop dependency
  
  return (
    <AnimatePresence>
      {isOpen && (
        // ... existing modal JSX with close instead of onClose
      )}
    </AnimatePresence>
  )
}
```

## Step 3: Update Components That Open Modals

Replace modal state props with atomic state hooks:

### Before:
```tsx
export function SomeComponent() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  
  return (
    <div>
      <Button onClick={() => setIsContactModalOpen(true)}>
        Contact Me
      </Button>
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  )
}
```

### After:
```tsx
'use client'

import { useContactModal } from '@/lib/atoms'

export function SomeComponent() {
  const { open } = useContactModal()
  
  return (
    <div>
      <Button onClick={open}>
        Contact Me
      </Button>
      {/* ContactModal manages its own state now */}
    </div>
  )
}
```

## Step 4: Update Theme Management

Replace next-themes usage with Jotai theme atoms:

### Before:
```tsx
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </Button>
  )
}
```

### After:
```tsx
'use client'

import { useTheme } from '@/lib/atoms'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()
  
  return (
    <Button onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? '🌙' : '☀️'}
    </Button>
  )
}
```

## Step 5: Add Navigation State Management

Update navigation components to use atomic state:

### Before:
```tsx
export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <nav>
      <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        Menu
      </Button>
      {mobileMenuOpen && <MobileMenu />}
    </nav>
  )
}
```

### After:
```tsx
'use client'

import { useMobileMenu, useScrollNavigation } from '@/lib/atoms'

export function Navigation() {
  const { isOpen, toggle } = useMobileMenu()
  const { headerVisible } = useScrollNavigation()
  
  return (
    <nav className={`transition-transform ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <Button onClick={toggle}>
        Menu
      </Button>
      {isOpen && <MobileMenu />}
    </nav>
  )
}
```

## Step 6: Add Form State Management

Replace form state with atomic form management:

### Before:
```tsx
export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // ... form submission logic
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />
      {/* ... */}
    </form>
  )
}
```

### After:
```tsx
'use client'

import { useContactForm } from '@/lib/atoms'

export function ContactForm() {
  const { 
    formData, 
    errors, 
    updateFormField, 
    handleSubmit, 
    isSubmitting 
  } = useContactForm()
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <input
        value={formData.name}
        onChange={(e) => updateFormField('name', e.target.value)}
      />
      {errors.name && <span className="error">{errors.name}</span>}
      {/* ... */}
    </form>
  )
}
```

## Step 7: Add Analytics Tracking

Replace existing analytics with atomic analytics:

### Before:
```tsx
export function SomeComponent() {
  const trackEvent = (eventName, properties) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties)
    }
  }
  
  return (
    <Button onClick={() => trackEvent('button_click', { component: 'some-component' })}>
      Click Me
    </Button>
  )
}
```

### After:
```tsx
'use client'

import { useAnalytics } from '@/lib/atoms'

export function SomeComponent() {
  const { trackClick, trackCustomEvent } = useAnalytics()
  
  const handleClick = () => {
    trackClick({
      element: 'click-me-button',
      page: 'some-component',
      metadata: { component: 'some-component' }
    })
  }
  
  return (
    <Button onClick={handleClick}>
      Click Me
    </Button>
  )
}
```

## Step 8: Add Blog State Management

For blog components, replace local state with atomic state:

### Before:
```tsx
export function BlogFilters({ onFiltersChange }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortOrder, setSortOrder] = useState('desc')
  
  useEffect(() => {
    onFiltersChange({ searchQuery, selectedCategories, sortOrder })
  }, [searchQuery, selectedCategories, sortOrder])
  
  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* ... */}
    </div>
  )
}
```

### After:
```tsx
'use client'

import { useBlogFilters } from '@/lib/atoms'

export function BlogFilters() {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilters,
    toggleCategoryFilter,
    sortOrder,
    setSortOrder
  } = useBlogFilters()
  
  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* ... */}
    </div>
  )
}
```

## Step 9: Add Notifications

Replace toast notifications with atomic notifications:

### Before:
```tsx
import { toast } from 'sonner'

export function SomeComponent() {
  const handleSuccess = () => {
    toast.success('Operation successful!')
  }
  
  return <Button onClick={handleSuccess}>Save</Button>
}
```

### After:
```tsx
'use client'

import { useNotifications } from '@/lib/atoms'

export function SomeComponent() {
  const { showSuccess } = useNotifications()
  
  const handleSuccess = () => {
    showSuccess('Success!', 'Operation completed successfully')
  }
  
  return <Button onClick={handleSuccess}>Save</Button>
}
```

## Step 10: Add User Preferences

Add user preference management:

```tsx
'use client'

import { useUserPreferences, useAccessibility } from '@/lib/atoms'

export function SettingsPanel() {
  const { preferences, updatePreference } = useUserPreferences()
  const { reducedMotion, setReducedMotion } = useAccessibility()
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={preferences.contactPreferences.newsletter}
          onChange={(e) => updatePreference('contactPreferences', {
            ...preferences.contactPreferences,
            newsletter: e.target.checked
          })}
        />
        Subscribe to newsletter
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
        />
        Reduce motion
      </label>
    </div>
  )
}
```

## Testing the Integration

Create a test page to verify the atomic state is working:

```tsx
// src/app/test-atoms/page.tsx
import { JotaiExamples } from '@/components/examples/jotai-examples'

export default function TestAtomsPage() {
  return (
    <div className="container mx-auto py-8">
      <JotaiExamples />
    </div>
  )
}
```

Visit `/test-atoms` to interact with all the atomic state examples.

## Migration Checklist

- [ ] Add JotaiProvider to layout
- [ ] Update ContactModal to use atomic state
- [ ] Replace theme management with atomic themes
- [ ] Update navigation components
- [ ] Migrate form state to atomic forms
- [ ] Add analytics tracking atoms
- [ ] Implement blog state management
- [ ] Add notification system
- [ ] Implement user preferences
- [ ] Add accessibility settings
- [ ] Test all integrations
- [ ] Remove old state management code
- [ ] Update component imports
- [ ] Run tests to ensure functionality

## Benefits After Integration

✅ **Improved Performance**: Only components using specific atoms re-render
✅ **Better Developer Experience**: No prop drilling, clear state boundaries  
✅ **Persistent State**: User preferences and form data survive page reloads
✅ **Type Safety**: Full TypeScript support with minimal boilerplate
✅ **Easier Testing**: Atomic state can be tested in isolation
✅ **Better Analytics**: Comprehensive tracking without manual setup
✅ **Accessibility**: Built-in accessibility preference management
✅ **GDPR Compliance**: Automatic consent and data management

## Next Steps

1. Start with the JotaiProvider integration
2. Migrate one component at a time
3. Test each migration thoroughly
4. Remove old state management patterns
5. Add new atomic features as needed
6. Monitor performance improvements
7. Update documentation for your team

The atomic state architecture is designed to be adopted incrementally, so you can migrate components gradually while maintaining existing functionality.