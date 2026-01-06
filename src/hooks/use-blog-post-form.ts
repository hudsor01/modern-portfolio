/**
 * useBlogPostForm - Custom hook for blog post form state management using TanStack Form
 * Migrated from react-hook-form to @tanstack/react-form
 */

import { useState, useCallback, useMemo } from 'react'
import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { z } from 'zod'
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
      form.setFieldValue('keywords', [...currentKeywords, trimmedKeyword])
      setNewKeyword('')
    }
  }, [form, newKeyword])

  // Remove a keyword from the keywords array
  const removeKeyword = useCallback(
    (keyword: string) => {
      const currentKeywords = form.getFieldValue('keywords') || []
      form.setFieldValue(
        'keywords',
        currentKeywords.filter((k: string) => k !== keyword)
      )
    },
    [form]
  )

  // Toggle a tag in the tagIds array
  const toggleTag = useCallback(
    (tagId: string) => {
      const newSelectedTags = selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]

      setSelectedTags(newSelectedTags)
      form.setFieldValue('tagIds', newSelectedTags)
    },
    [form, selectedTags]
  )

  // Reset form to initial state
  const resetForm = useCallback(() => {
    form.reset()
    setSelectedTags(initialTagIds)
    setNewKeyword('')
    setPreviewMode(false)
  }, [form, initialTagIds])

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
  }
}

// Export inferred type for external use - TanStack Form types flow naturally
export type UseBlogPostFormReturn = ReturnType<typeof useBlogPostForm>
