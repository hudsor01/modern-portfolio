/**
 * Jotai Usage Examples
 * Demonstrates how to use the atomic state system in components
 */

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Import Jotai hooks and atoms
import {
  useTheme,
  useContactModal,
  useImageModal,
  useMobileMenu,
  useNotifications,
  useUserPreferences,
  useAccessibility,
  useBlogFilters,
  useBlogBookmarks,
  useContactForm,
  useAnalytics,
  usePrivacyConsent
} from '@/lib/atoms'

// Icons
import { 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  Settings, 
  Filter,
  Bookmark,
  Mail,
  BarChart3,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

/**
 * Main examples component showcasing Jotai usage
 */
export function JotaiExamples() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Jotai State Management Examples</h1>
        <p className="text-lg text-muted-foreground">
          Interactive demonstrations of atomic state management
        </p>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="modals">Modals</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="blog">Blog State</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <ThemeExample />
        </TabsContent>

        <TabsContent value="modals">
          <ModalExample />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationExample />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesExample />
        </TabsContent>

        <TabsContent value="blog">
          <BlogStateExample />
        </TabsContent>

        <TabsContent value="forms">
          <FormExample />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsExample />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacyExample />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Theme Management Example
 */
function ThemeExample() {
  const { theme, resolvedTheme, systemTheme, setTheme, toggleTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          Theme Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Current Theme</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{theme}</Badge>
              {theme === 'system' && systemTheme && (
                <Badge variant="outline">{systemTheme}</Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Resolved Theme</Label>
            <Badge>{resolvedTheme}</Badge>
          </div>
          
          <div className="space-y-2">
            <Label>System Theme</Label>
            <Badge variant="outline">{systemTheme || 'unknown'}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
            className="flex items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            Light
          </Button>
          
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
            className="flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            Dark
          </Button>
          
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            onClick={() => setTheme('system')}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            System
          </Button>
          
          <Button
            variant="secondary"
            onClick={toggleTheme}
            className="flex items-center gap-2"
          >
            Toggle Theme
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> Theme state is managed with atomic state that persists 
            to localStorage and automatically detects system theme changes.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Modal Management Example
 */
function ModalExample() {
  const contactModal = useContactModal()
  const imageModal = useImageModal()
  const mobileMenu = useMobileMenu()

  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modal State Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Contact Modal</Label>
            <div className="flex items-center gap-2">
              <Badge variant={contactModal.isOpen ? 'default' : 'secondary'}>
                {contactModal.isOpen ? 'Open' : 'Closed'}
              </Badge>
              <Button
                size="sm"
                onClick={contactModal.toggle}
              >
                Toggle
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image Modal</Label>
            <div className="flex items-center gap-2">
              <Badge variant={imageModal.isOpen ? 'default' : 'secondary'}>
                {imageModal.isOpen ? 'Open' : 'Closed'}
              </Badge>
              {imageModal.imageSrc && (
                <Badge variant="outline" className="text-xs">
                  Image loaded
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mobile Menu</Label>
            <div className="flex items-center gap-2">
              <Badge variant={mobileMenu.isOpen ? 'default' : 'secondary'}>
                {mobileMenu.isOpen ? 'Open' : 'Closed'}
              </Badge>
              <Button
                size="sm"
                onClick={mobileMenu.toggle}
              >
                Toggle
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Open Image Modal</Label>
            <div className="flex gap-2 mt-2">
              {sampleImages.map((src, index) => (
                <button
                  key={index}
                  onClick={() => imageModal.open(src)}
                  className="w-16 h-16 rounded overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                >
                  <img
                    src={src}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={contactModal.open}>Open Contact Modal</Button>
            <Button variant="secondary" onClick={imageModal.close}>Close Image Modal</Button>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> Modal states are managed independently with atomic state, 
            allowing for complex modal interactions without prop drilling.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Notification Management Example
 */
function NotificationExample() {
  const { notifications, showSuccess, showError, showWarning, showInfo, clearNotifications } = useNotifications()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Active Notifications</Label>
            <Badge>{notifications.length}</Badge>
          </div>
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearNotifications}>
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            onClick={() => showSuccess('Success!', 'Operation completed successfully')}
            className="bg-green-500 hover:bg-green-600"
          >
            Success
          </Button>
          
          <Button
            onClick={() => showError('Error!', 'Something went wrong')}
            className="bg-red-500 hover:bg-red-600"
          >
            Error
          </Button>
          
          <Button
            onClick={() => showWarning('Warning!', 'Please check your input')}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Warning
          </Button>
          
          <Button
            onClick={() => showInfo('Info', 'Here is some useful information')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Info
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Current Notifications</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded border text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      notification.type === 'success' ? 'default' :
                      notification.type === 'error' ? 'destructive' :
                      'secondary'
                    }>
                      {notification.type}
                    </Badge>
                    <span className="font-medium">{notification.title}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{notification.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {notifications.length === 0 && (
              <p className="text-muted-foreground text-sm">No notifications</p>
            )}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> Notifications are managed with atomic state that includes 
            auto-removal, persistence settings, and action callbacks.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * User Preferences Example
 */
function PreferencesExample() {
  const { preferences, updatePreference } = useUserPreferences()
  const { reducedMotion, highContrast, fontSize, setReducedMotion, setHighContrast, setFontSize } = useAccessibility()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          User Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">General Preferences</h4>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => updatePreference('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={preferences.currency}
                onValueChange={(value) => updatePreference('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter">Newsletter Subscription</Label>
              <Switch
                id="newsletter"
                checked={preferences.contactPreferences.newsletter}
                onCheckedChange={(checked) => 
                  updatePreference('contactPreferences', {
                    ...preferences.contactPreferences,
                    newsletter: checked
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Accessibility</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={fontSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFontSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> User preferences are persisted to localStorage with 
            version migration support and automatic system preference detection.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Blog State Example
 */
function BlogStateExample() {
  const {
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    viewMode,
    setViewMode,
    hasActiveFilters,
    activeFiltersCount,
    clearAllFilters
  } = useBlogFilters()

  const { bookmarkedPosts, toggleBookmark, isBookmarked } = useBlogBookmarks()

  const samplePosts = ['post-1', 'post-2', 'post-3', 'post-4']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Blog State Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Query</Label>
              <Input
                id="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Sort Field</Label>
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publishedAt">Published Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="viewCount">View Count</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>View Mode</Label>
              <div className="flex gap-2">
                {(['grid', 'list', 'compact'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Active Filters</Label>
                <div className="flex items-center gap-2">
                  <Badge>{activeFiltersCount}</Badge>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bookmarked Posts ({bookmarkedPosts.length})</Label>
              <div className="space-y-2">
                {samplePosts.map((postId) => (
                  <div
                    key={postId}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="text-sm">Sample {postId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(postId)}
                      className="flex items-center gap-1"
                    >
                      <Bookmark 
                        className={`h-4 w-4 ${isBookmarked(postId) ? 'fill-current' : ''}`} 
                      />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> Blog state includes URL synchronization, persistent 
            bookmarks, and debounced search with faceted filtering capabilities.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Form Management Example
 */
function FormExample() {
  const {
    formData,
    errors,
    updateFormField,
    isSubmitting,
    isSubmitted,
    isDirty
  } = useContactForm()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Form State Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-name">Name</Label>
              <Input
                id="demo-name"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-email">Email</Label>
              <Input
                id="demo-email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormField('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-subject">Subject</Label>
              <Input
                id="demo-subject"
                value={formData.subject}
                onChange={(e) => updateFormField('subject', e.target.value)}
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Form State</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={isDirty ? 'default' : 'secondary'}>
                    {isDirty ? 'Modified' : 'Clean'}
                  </Badge>
                  <Badge variant={isSubmitting ? 'default' : 'secondary'}>
                    {isSubmitting ? 'Submitting' : 'Ready'}
                  </Badge>
                  <Badge variant={isSubmitted ? 'default' : 'secondary'}>
                    {isSubmitted ? 'Submitted' : 'Not Submitted'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Form Data Preview</Label>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <Label>Validation Errors</Label>
              <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-auto max-h-32">
                {Object.keys(errors).length > 0 
                  ? JSON.stringify(errors, null, 2) 
                  : 'No errors'
                }
              </pre>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> Form state includes auto-save to localStorage, 
            real-time validation, submission state, and field-level error tracking.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Analytics Tracking Example
 */
function AnalyticsExample() {
  const { isEnabled, trackClick, trackCustomEvent, setConsent } = useAnalytics()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Analytics Status</Label>
            <Badge variant={isEnabled ? 'default' : 'secondary'}>
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <Button
            onClick={() => setConsent(!isEnabled)}
            variant={isEnabled ? 'destructive' : 'default'}
          >
            {isEnabled ? 'Disable' : 'Enable'} Analytics
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            onClick={() => trackClick({
              element: 'demo-button',
              page: 'jotai-examples',
              metadata: { type: 'demo' }
            })}
            disabled={!isEnabled}
          >
            Track Click
          </Button>

          <Button
            onClick={() => trackCustomEvent({
              name: 'demo_interaction',
              properties: {
                component: 'jotai-examples',
                action: 'custom_event_demo',
                timestamp: new Date().toISOString()
              }
            })}
            disabled={!isEnabled}
          >
            Custom Event
          </Button>

          <Button
            onClick={() => trackCustomEvent({
              name: 'feature_used',
              properties: {
                feature: 'atomic_state_demo',
                category: 'engagement'
              }
            })}
            disabled={!isEnabled}
          >
            Feature Used
          </Button>

          <Button
            onClick={() => trackCustomEvent({
              name: 'user_action',
              properties: {
                action: 'example_interaction',
                value: Math.floor(Math.random() * 100)
              }
            })}
            disabled={!isEnabled}
          >
            User Action
          </Button>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> Analytics tracking includes automatic page views, 
            interaction tracking, performance monitoring, and GDPR-compliant consent management.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Privacy Consent Example
 */
function PrivacyExample() {
  const {
    analyticsConsent,
    cookiesConsent,
    personalizationConsent,
    setAnalyticsConsent,
    setCookiesConsent,
    setPersonalizationConsent,
    grantAllConsent,
    revokeAllConsent
  } = usePrivacyConsent()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Consent Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics-consent">Analytics</Label>
              <Switch
                id="analytics-consent"
                checked={analyticsConsent}
                onCheckedChange={setAnalyticsConsent}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Track usage and performance metrics
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="cookies-consent">Cookies</Label>
              <Switch
                id="cookies-consent"
                checked={cookiesConsent}
                onCheckedChange={setCookiesConsent}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Store preferences and session data
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="personalization-consent">Personalization</Label>
              <Switch
                id="personalization-consent"
                checked={personalizationConsent}
                onCheckedChange={setPersonalizationConsent}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Customize experience based on usage
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={grantAllConsent} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Accept All
          </Button>
          <Button onClick={revokeAllConsent} variant="outline" className="flex items-center gap-2">
            <EyeOff className="h-4 w-4" />
            Reject All
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Current Consent Status</Label>
          <div className="flex flex-wrap gap-2">
            <Badge variant={analyticsConsent ? 'default' : 'secondary'}>
              Analytics: {analyticsConsent ? 'Granted' : 'Denied'}
            </Badge>
            <Badge variant={cookiesConsent ? 'default' : 'secondary'}>
              Cookies: {cookiesConsent ? 'Granted' : 'Denied'}
            </Badge>
            <Badge variant={personalizationConsent ? 'default' : 'secondary'}>
              Personalization: {personalizationConsent ? 'Granted' : 'Denied'}
            </Badge>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm">
            <strong>Atomic State:</strong> Privacy consent is managed with persistent atomic state 
            that automatically clears related data when consent is revoked, ensuring GDPR compliance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default JotaiExamples