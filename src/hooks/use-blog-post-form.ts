import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { BlogPost } from '@/types/blog'

// Form schema
export const blogPostFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
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
  twitterDescription: z.string().max(200, 'Twitter description cannot exceed 200 characters').optional(),
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
  featured: z.boolean(),
})

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>

export function useBlogPostForm(post?: Partial<BlogPost>) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map(t => (typeof t === 'string' ? t : t?.id)).filter((id): id is string => Boolean(id)) || []
  )
  const [newKeyword, setNewKeyword] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      contentType: post?.contentType || 'MARKDOWN',
      status: post?.status || 'DRAFT',
      metaTitle: post?.metaTitle || '',
      metaDescription: post?.metaDescription || '',
      keywords: post?.keywords || [] as string[],
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
      tagIds: selectedTags || [] as string[],
      featured: post?.featured || false as boolean,
    },
  })

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    form.setValue('title', title)
    if (!form.getValues('slug')) {
      form.setValue('slug', generateSlug(title))
    }
  }

  const addKeyword = () => {
    const currentKeywords = form.getValues('keywords') || []
    if (newKeyword.trim() && !currentKeywords.includes(newKeyword.trim()) && currentKeywords.length < 10) {
      form.setValue('keywords', [...currentKeywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    const currentKeywords = form.getValues('keywords') || []
    form.setValue('keywords', currentKeywords.filter(k => k !== keyword))
  }

  const toggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    
    setSelectedTags(newSelectedTags)
    form.setValue('tagIds', newSelectedTags)
  }

  return {
    form,
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
  }
}