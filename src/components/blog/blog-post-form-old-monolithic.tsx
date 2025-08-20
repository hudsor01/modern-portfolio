'use client'

import React, { useState, useEffect } from 'react'
import { m as motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Save, 
  Eye, 
  Calendar, 
  Tag, 
  X,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { BlogContent } from './blog-content'
import { cn } from '@/lib/utils'
import type { BlogPost, BlogCategory, BlogTag, BlogAuthor, PostStatus, ContentType } from '@/types/blog'

// Form schema
const blogPostFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string().max(500, 'Excerpt cannot exceed 500 characters').optional(),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  contentType: z.enum(['MARKDOWN', 'HTML', 'RICH_TEXT']).default('MARKDOWN'),
  status: z.enum(['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'DELETED']).default('DRAFT'),
  
  // SEO Fields
  metaTitle: z.string().max(100, 'Meta title cannot exceed 100 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description cannot exceed 160 characters').optional(),
  keywords: z.array(z.string()).max(10, 'Cannot have more than 10 keywords').default([]),
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
  tagIds: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
})

type BlogPostFormData = z.infer<typeof blogPostFormSchema>

interface BlogPostFormProps {
  post?: Partial<BlogPost>
  categories: BlogCategory[]
  tags: BlogTag[]
  authors: BlogAuthor[]
  isLoading?: boolean
  onSubmit: (data: BlogPostFormData) => Promise<void>
  onSaveDraft?: (data: BlogPostFormData) => Promise<void>
  onPreview?: (data: BlogPostFormData) => void
  onCancel?: () => void
  className?: string
}

export function BlogPostForm({
  post,
  categories,
  tags,
  authors: _authors,
  isLoading: _isLoading = false,
  onSubmit,
  onSaveDraft,
  onPreview: _onPreview,
  onCancel: _onCancel,
  className
}: BlogPostFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map(t => (typeof t === 'string' ? t : t?.id)) || []
  )
  const [newKeyword, setNewKeyword] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      contentType: (post?.contentType as ContentType) || 'MARKDOWN',
      status: (post?.status as PostStatus) || 'DRAFT',
      metaTitle: post?.metaTitle || '',
      metaDescription: post?.metaDescription || '',
      keywords: post?.keywords || [],
      canonicalUrl: post?.canonicalUrl || '',
      ogTitle: post?.ogTitle || '',
      ogDescription: post?.ogDescription || '',
      ogImage: post?.ogImage || '',
      twitterTitle: post?.twitterTitle || '',
      twitterDescription: post?.twitterDescription || '',
      twitterImage: post?.twitterImage || '',
      featuredImage: post?.featuredImage || '',
      featuredImageAlt: post?.featuredImageAlt || '',
      publishedAt: post?.publishedAt,
      scheduledAt: post?.scheduledAt,
      categoryId: post?.category?.id || '',
      tagIds: post?.tags?.map(t => (typeof t === 'string' ? t : t?.id)).filter(Boolean) || [],
      featured: post?.featured || false,
    }
  })

  const watchedContent = watch('content')
  const watchedTitle = watch('title')
  const watchedKeywords = watch('keywords')

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !post?.slug) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug)
    }
  }, [watchedTitle, setValue, post?.slug])

  const handleAddKeyword = () => {
    if (newKeyword.trim() && watchedKeywords.length < 10) {
      const currentKeywords = watchedKeywords || []
      if (!currentKeywords.includes(newKeyword.trim())) {
        setValue('keywords', [...currentKeywords, newKeyword.trim()])
        setNewKeyword('')
      }
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    const currentKeywords = watchedKeywords || []
    setValue('keywords', currentKeywords.filter(k => k !== keyword))
  }


  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const getWordCount = (content: string) => {
    return content.split(/\s+/).length
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('max-w-6xl mx-auto space-y-6', className)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {post?.id ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isDirty && <span className="text-orange-600">• Unsaved changes</span>}
              {watchedContent && (
                <span className="ml-2">
                  {getWordCount(watchedContent)} words • {calculateReadingTime(watchedContent)} min read
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            
            {onSaveDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSubmit(onSaveDraft)}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {post?.id ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  {/* Content Tab */}
                  <TabsContent value="content" className="space-y-6 mt-6">
                    {!previewMode ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            {...register('title')}
                            className="text-lg font-semibold"
                            placeholder="Enter post title..."
                          />
                          {errors.title && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug">Slug *</Label>
                          <Input
                            id="slug"
                            {...register('slug')}
                            placeholder="post-url-slug"
                          />
                          {errors.slug && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.slug.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="excerpt">Excerpt</Label>
                          <Textarea
                            id="excerpt"
                            {...register('excerpt')}
                            rows={3}
                            placeholder="Brief description of the post..."
                          />
                          {errors.excerpt && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.excerpt.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="content">Content *</Label>
                            <Controller
                              name="contentType"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="MARKDOWN">Markdown</SelectItem>
                                    <SelectItem value="HTML">HTML</SelectItem>
                                    <SelectItem value="RICH_TEXT">Rich Text</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                          <Textarea
                            id="content"
                            {...register('content')}
                            rows={20}
                            placeholder="Write your post content here..."
                            className="font-mono text-sm"
                          />
                          {errors.content && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.content.message}
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-4">{watchedTitle || 'Untitled Post'}</h2>
                          <div className="prose prose-lg dark:prose-invert max-w-none">
                            <BlogContent 
                              content={watchedContent || ''} 
                              contentType={watch('contentType')}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* SEO Tab */}
                  <TabsContent value="seo" className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        {...register('metaTitle')}
                        placeholder="SEO optimized title..."
                      />
                      {errors.metaTitle && (
                        <p className="text-sm text-red-600">{errors.metaTitle.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        {...register('metaDescription')}
                        rows={3}
                        placeholder="Brief description for search engines..."
                      />
                      {errors.metaDescription && (
                        <p className="text-sm text-red-600">{errors.metaDescription.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Keywords</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Add keyword..."
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                        />
                        <Button
                          type="button"
                          onClick={handleAddKeyword}
                          disabled={!newKeyword.trim() || (watchedKeywords?.length || 0) >= 10}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {watchedKeywords?.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(keyword)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canonicalUrl">Canonical URL</Label>
                      <Input
                        id="canonicalUrl"
                        {...register('canonicalUrl')}
                        placeholder="https://example.com/canonical-url"
                      />
                      {errors.canonicalUrl && (
                        <p className="text-sm text-red-600">{errors.canonicalUrl.message}</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Social Tab */}
                  <TabsContent value="social" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Open Graph</h3>
                      <div className="space-y-2">
                        <Label htmlFor="ogTitle">OG Title</Label>
                        <Input
                          id="ogTitle"
                          {...register('ogTitle')}
                          placeholder="Title for social media sharing..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ogDescription">OG Description</Label>
                        <Textarea
                          id="ogDescription"
                          {...register('ogDescription')}
                          rows={2}
                          placeholder="Description for social media sharing..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ogImage">OG Image URL</Label>
                        <Input
                          id="ogImage"
                          {...register('ogImage')}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Twitter</h3>
                      <div className="space-y-2">
                        <Label htmlFor="twitterTitle">Twitter Title</Label>
                        <Input
                          id="twitterTitle"
                          {...register('twitterTitle')}
                          placeholder="Title for Twitter sharing..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitterDescription">Twitter Description</Label>
                        <Textarea
                          id="twitterDescription"
                          {...register('twitterDescription')}
                          rows={2}
                          placeholder="Description for Twitter sharing..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitterImage">Twitter Image URL</Label>
                        <Input
                          id="twitterImage"
                          {...register('twitterImage')}
                          placeholder="https://example.com/twitter-image.jpg"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="featuredImage">Featured Image URL</Label>
                      <Input
                        id="featuredImage"
                        {...register('featuredImage')}
                        placeholder="https://example.com/featured-image.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="featuredImageAlt">Featured Image Alt Text</Label>
                      <Input
                        id="featuredImageAlt"
                        {...register('featuredImageAlt')}
                        placeholder="Descriptive alt text for the image..."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Controller
                        name="featured"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id="featured"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="featured">Featured Post</Label>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Publishing */}
            <Card className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Publishing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="REVIEW">Under Review</SelectItem>
                          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories & Tags */}
            <Card className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Categories & Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="space-y-2">
                    {tags.map(tag => (
                      <label key={tag.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={(e) => {
                            const newSelectedTags = e.target.checked
                              ? [...selectedTags, tag.id]
                              : selectedTags.filter(t => t !== tag.id)
                            setSelectedTags(newSelectedTags)
                            setValue('tagIds', newSelectedTags)
                          }}
                        />
                        <span className="text-sm">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}