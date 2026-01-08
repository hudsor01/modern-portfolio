/**
 * useBlogPostForm - Custom hook for blog post form state management using TanStack Form
 * Migrated from react-hook-form to @tanstack/react-form
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { z } from 'zod'
import { useCrossTabSync } from '@/lib/utils/cross-tab-sync'
import { createContextLogger } from '@/lib/monitoring/logger'
import type { BlogPost } from '@/types/blog'

// ============================================================================
// Form Schema
// ============================================================================

export const blogPostFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  excerpt: z.string().max(500, 'Excerpt cannot exceed 500 characters').optional(),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  contentType: z.enum(['MARKDOWN', 'HTML', 'RICH_TEXT']),
  status: z.enum(['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'DELETED']),

  // SEO Fields
  metaTitle: z.string().max(100, 'Meta title cannot exceed 100 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters').optional(),
  keywords: z.array(z.string()).max(10, 'Cannot have more than 10 keywords'),
  canonicalUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),

  // Social Media
  ogTitle: z.string().max(100, 'OG title cannot exceed 100 characters').optional(),
  ogDescription: z.string().max(300, 'OG description cannot exceed 300 characters').optional(),
  ogImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitterTitle: z.string().max(100, 'Twitter title cannot exceed 100 characters').optional(),
  twitterDescription: z
    .string()
    .max(200, 'Twitter description cannot exceed 200 characters')
    .optional(),
  twitterImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),

  // Content Structure
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featuredImageAlt: z.string().max(200, 'Alt text cannot exceed 200 characters').optional(),

  // Publishing
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),

  // Relationships
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()),
})

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>

// Return type is inferred - exported below for external use

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a URL-friendly slug from a title string
 * @param title - The title to convert to a slug
 * @returns A lowercase, hyphenated slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim()
}

// ============================================================================
// Hook
// ============================================================================

export function useBlogPostForm(post?: Partial<BlogPost>) {
  const logger = createContextLogger('useBlogPostForm')
  const formId = `blog-post-form-${post?.id || 'new'}`
  const isInitialMount = useRef(true)
  const lastBroadcastRef = useRef<number>(0)

  // Extract initial tag IDs from post - memoized to prevent dependency changes
  const initialTagIds = useMemo(
    () =>
      post?.tags
        ?.map((t) => (typeof t === 'string' ? t : t?.tagId))
        .filter((id): id is string => Boolean(id)) || [],
    [post?.tags]
  )

  // Additional state not managed by TanStack Form
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTagIds)
  const [newKeyword, setNewKeyword] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictData, setConflictData] = useState<{
    local: BlogPostFormData
    remote: BlogPostFormData
  } | null>(null)

  // Default values for the form
  const defaultValues: BlogPostFormData = {
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    contentType: post?.contentType || 'MARKDOWN',
    status: post?.status || 'DRAFT',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    keywords: post?.keywords || [],
    canonicalUrl: post?.canonicalUrl || '',
    ogTitle: post?.metaTitle || '',
    ogDescription: post?.metaDescription || '',
    ogImage: post?.featuredImage || '',
    twitterTitle: post?.metaTitle || '',
    twitterDescription: post?.metaDescription || '',
    twitterImage: post?.featuredImage || '',
    featuredImage: post?.featuredImage || '',
    featuredImageAlt: post?.featuredImageAlt || '',
    publishedAt: post?.publishedAt ? new Date(post.publishedAt) : undefined,
    scheduledAt: post?.scheduledAt ? new Date(post.scheduledAt) : undefined,
    categoryId: typeof post?.category === 'string' ? post.category : post?.category?.id || '',
    tagIds: initialTagIds,
  }

  // TanStack Form instance
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      // This will be called when form.handleSubmit() is invoked
      // The consuming component should handle the actual submission
      return value
    },
  })

  // Get current form values using useStore for reactivity
  const formValues = useStore(form.store, (state) => state.values)

  // Cross-tab synchronization
  const crossTabSync = useCrossTabSync(formId, (message: unknown) => {
    if (!message || typeof message !== 'object') return

    const now = Date.now()
    // Prevent echo broadcasts
    if (now - lastBroadcastRef.current < 100) return

    switch (message.type) {
      case 'update':
        if (message.data && !hasConflict) {
          logger.info('Received cross-tab form update', { formId, version: message.version })
          // Merge remote data with local data to avoid conflicts
          const mergedData = mergeFormData(formValues, message.data as BlogPostFormData)
          Object.entries(mergedData).forEach(([key, value]) => {
            if (
              JSON.stringify(formValues[key as keyof BlogPostFormData]) !== JSON.stringify(value)
            ) {
              form.setFieldValue(key as keyof BlogPostFormData, value as BlogPostFormData[keyof BlogPostFormData])
            }
          })
          // Update selected tags if they changed
          if (
            mergedData.tagIds &&
            JSON.stringify(mergedData.tagIds) !== JSON.stringify(selectedTags)
          ) {
            setSelectedTags(mergedData.tagIds)
          }
        }
        break

      case 'field-update':
        if (message.data && message.fieldPath && !hasConflict) {
          logger.info('Received cross-tab field update', { formId, fieldPath: message.fieldPath })
          // Apply field-level update
          const fieldPath = message.fieldPath as keyof BlogPostFormData
          const newValue = message.data[fieldPath]
          if (
            newValue !== undefined &&
            JSON.stringify(formValues[fieldPath]) !== JSON.stringify(newValue)
          ) {
            form.setFieldValue(fieldPath as keyof BlogPostFormData, newValue as BlogPostFormData[keyof BlogPostFormData])
            // Special handling for tagIds
            if (fieldPath === 'tagIds' && Array.isArray(newValue)) {
              setSelectedTags(newValue)
            }
          }
        }
        break

      case 'clear':
        logger.info('Received cross-tab form clear', { formId })
        form.reset()
        setSelectedTags(initialTagIds)
        setNewKeyword('')
        setPreviewMode(false)
        setHasConflict(false)
        setConflictData(null)
        break

      case 'conflict':
        logger.warn('Cross-tab conflict detected', { formId })
        setHasConflict(true)
        setConflictData({
          local: formValues,
          remote: message.remoteData as BlogPostFormData,
        })
        break
    }
  })

  // Set up conflict resolver
  useEffect(() => {
    if (crossTabSync) {
      crossTabSync.setConflictResolver(
        (local: Record<string, unknown>, remote: Record<string, unknown>) => {
          // Use a smart merge strategy: prefer non-empty values, keep local changes for recently modified fields
          const merged: Record<string, unknown> = { ...local }

          Object.entries(remote).forEach(([key, remoteValue]) => {
            const localValue = local[key]

            // If local value is empty/null and remote has content, use remote
            if (
              (localValue === '' || localValue === null || localValue === undefined) &&
              remoteValue !== '' &&
              remoteValue !== null &&
              remoteValue !== undefined
            ) {
              merged[key] = remoteValue
            }
            // For arrays, merge them
            else if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
              merged[key] = [...new Set([...localValue, ...remoteValue])]
            }
            // For other cases, keep local value (last-write-wins for conflicts)
          })

          return merged
        }
      )
    }
  }, [crossTabSync])

  // Broadcast form changes to other tabs
  useEffect(() => {
    if (!crossTabSync || isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const now = Date.now()
    lastBroadcastRef.current = now

    // Debounce broadcasts to avoid excessive localStorage writes
    const timeoutId = setTimeout(() => {
      crossTabSync.broadcast(formValues)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [formValues, crossTabSync])

  // Helper function to merge form data intelligently
  const mergeFormData = useCallback(
    (local: BlogPostFormData, remote: BlogPostFormData): BlogPostFormData => {
      const merged: BlogPostFormData = { ...local }

      Object.entries(remote).forEach(([key, remoteValue]) => {
        const localValue = local[key as keyof BlogPostFormData]

        // Prefer non-empty values
        if (
          (localValue === '' || localValue === null || localValue === undefined) &&
          remoteValue !== '' &&
          remoteValue !== null &&
          remoteValue !== undefined
        ) {
          ;(merged as Record<string, unknown>)[key] = remoteValue
        }
        // Merge arrays (for tags, keywords)
        else if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
          ;(merged as Record<string, unknown>)[key] = [...new Set([...localValue, ...remoteValue])]
        }
      })

      return merged
    },
    []
  )

  // Handle title change with auto-slug generation
  const handleTitleChange = useCallback(
    (title: string) => {
      form.setFieldValue('title', title)
      // Auto-generate slug if slug is empty
      const currentSlug = form.getFieldValue('slug')
      if (!currentSlug) {
        form.setFieldValue('slug', generateSlug(title))
      }
    },
    [form]
  )

  // Add a keyword to the keywords array
  const addKeyword = useCallback(() => {
    const currentKeywords = form.getFieldValue('keywords') || []
    const trimmedKeyword = newKeyword.trim()

    if (
      trimmedKeyword &&
      !currentKeywords.includes(trimmedKeyword) &&
      currentKeywords.length < 10
    ) {
      const newKeywords = [...currentKeywords, trimmedKeyword]
      form.setFieldValue('keywords', newKeywords)
      setNewKeyword('')

      // Broadcast field-level change
      if (crossTabSync) {
        crossTabSync.broadcast({ keywords: newKeywords }, 'keywords')
      }
    }
  }, [form, newKeyword, crossTabSync])

  // Remove a keyword from the keywords array
  const removeKeyword = useCallback(
    (keyword: string) => {
      const currentKeywords = form.getFieldValue('keywords') || []
      const newKeywords = currentKeywords.filter((k: string) => k !== keyword)
      form.setFieldValue('keywords', newKeywords)

      // Broadcast field-level change
      if (crossTabSync) {
        crossTabSync.broadcast({ keywords: newKeywords }, 'keywords')
      }
    },
    [form, crossTabSync]
  )

  // Toggle a tag in the tagIds array
  const toggleTag = useCallback(
    (tagId: string) => {
      const newSelectedTags = selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]

      setSelectedTags(newSelectedTags)
      form.setFieldValue('tagIds', newSelectedTags)

      // Broadcast field-level change
      if (crossTabSync) {
        crossTabSync.broadcast({ tagIds: newSelectedTags }, 'tagIds')
      }
    },
    [form, selectedTags, crossTabSync]
  )

  // Reset form to initial state
  const resetForm = useCallback(() => {
    form.reset()
    setSelectedTags(initialTagIds)
    setNewKeyword('')
    setPreviewMode(false)
    setHasConflict(false)
    setConflictData(null)

    // Broadcast clear to other tabs
    if (crossTabSync) {
      crossTabSync.clear()
    }
  }, [form, initialTagIds, crossTabSync])

  // Resolve conflict by choosing local data
  const resolveConflictWithLocal = useCallback(() => {
    setHasConflict(false)
    setConflictData(null)
    logger.info('Resolved conflict by keeping local data', { formId })
  }, [formId, logger])

  // Resolve conflict by choosing remote data
  const resolveConflictWithRemote = useCallback(() => {
    if (conflictData?.remote) {
      Object.entries(conflictData.remote).forEach(([key, value]) => {
        form.setFieldValue(key as keyof BlogPostFormData, value as BlogPostFormData[keyof BlogPostFormData])
      })
      setSelectedTags(conflictData.remote.tagIds || [])
      setHasConflict(false)
      setConflictData(null)
      logger.info('Resolved conflict by applying remote data', { formId })
    }
  }, [conflictData, form, formId, logger])

  // Resolve conflict by merging data
  const resolveConflictWithMerge = useCallback(() => {
    if (conflictData && crossTabSync) {
      // For now, use a simple merge strategy - prefer remote data
      const merged = { ...conflictData.local, ...conflictData.remote }
      Object.entries(merged).forEach(([key, value]) => {
        form.setFieldValue(key as keyof BlogPostFormData, value as BlogPostFormData[keyof BlogPostFormData])
      })
      setSelectedTags((merged as BlogPostFormData).tagIds || [])
      setHasConflict(false)
      setConflictData(null)
      logger.info('Resolved conflict by merging data', { formId })
    }
  }, [conflictData, crossTabSync, formId, form, logger])

  return {
    form,
    formValues,
    selectedTags,
    setSelectedTags,
    newKeyword,
    setNewKeyword,
    previewMode,
    setPreviewMode,
    handleTitleChange,
    addKeyword,
    removeKeyword,
    toggleTag,
    generateSlug,
    resetForm,
    // Cross-tab sync state
    hasConflict,
    conflictData,
    resolveConflictWithLocal,
    resolveConflictWithRemote,
    resolveConflictWithMerge,
    // Cross-tab sync controls
    enableSync: () => crossTabSync?.enable(),
    disableSync: () => crossTabSync?.disable(),
    isSyncActive: () => crossTabSync?.isActive() ?? false,
    tabId: crossTabSync?.tabId,
  }
}

// Export inferred type for external use - TanStack Form types flow naturally
export type UseBlogPostFormReturn = ReturnType<typeof useBlogPostForm>
