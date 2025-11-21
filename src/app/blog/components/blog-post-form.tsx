'use client'

import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlogContent } from './blog-content'
import { BasicContentFields } from './form/basic-content-fields'
import { SeoFields } from './form/seo-fields'
import { SocialMediaFields } from './form/social-media-fields'
import { PublishingOptions } from './form/publishing-options'
import { FormActions } from './form/form-actions'
import { useBlogPostForm, type BlogPostFormData } from '@/hooks/use-blog-post-form'
import type { BlogPost, BlogCategory, BlogTag, BlogAuthor } from '@/types/blog'
import { createContextLogger } from '@/lib/logging/logger'

const logger = createContextLogger('BlogPostForm')

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
  isLoading = false,
  onSubmit,
  onSaveDraft,
  onPreview: _onPreview,
  onCancel,
  className = ''
}: BlogPostFormProps) {
  const {
    form,
    selectedTags,
    newKeyword,
    setNewKeyword,
    previewMode,
    setPreviewMode,
    handleTitleChange,
    addKeyword,
    removeKeyword,
    toggleTag,
  } = useBlogPostForm(post)

  const handleFormSubmit = async (data: BlogPostFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      logger.error('Form submission error', error instanceof Error ? error : new Error(String(error)))
    }
  }

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      const data = form.getValues()
      try {
        await onSaveDraft({ ...data, status: 'DRAFT' })
      } catch (error) {
        logger.error('Save draft error', error instanceof Error ? error : new Error(String(error)))
      }
    }
  }

  const handlePreview = () => {
    setPreviewMode(!previewMode)
  }

  if (previewMode) {
    const formData = form.getValues()
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogContent 
              post={{
                ...formData,
                id: post?.id || 'preview',
                author: _authors[0] || { id: '1', name: 'Author', email: 'author@example.com' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                viewCount: 0,
                likeCount: 0,
                shareCount: 0,
                commentCount: 0,
              }}
            />
          </CardContent>
        </Card>
        
        <FormActions
          form={form}
          isLoading={isLoading}
          previewMode={previewMode}
          onPreview={handlePreview}
          onSaveDraft={handleSaveDraft}
          onCancel={onCancel}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {post?.id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="publishing">Publishing</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  <BasicContentFields 
                    form={form}
                    onTitleChange={handleTitleChange}
                  />
                </TabsContent>

                <TabsContent value="seo" className="space-y-6">
                  <SeoFields
                    form={form}
                    newKeyword={newKeyword}
                    setNewKeyword={setNewKeyword}
                    onAddKeyword={addKeyword}
                    onRemoveKeyword={removeKeyword}
                  />
                </TabsContent>

                <TabsContent value="social" className="space-y-6">
                  <SocialMediaFields form={form} />
                </TabsContent>

                <TabsContent value="publishing" className="space-y-6">
                  <PublishingOptions
                    form={form}
                    categories={categories}
                    tags={tags}
                    selectedTags={selectedTags}
                    onToggleTag={toggleTag}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <FormActions
            form={form}
            isLoading={isLoading}
            previewMode={previewMode}
            onPreview={handlePreview}
            onSaveDraft={handleSaveDraft}
            onCancel={onCancel}
          />
        </form>
      </Form>
    </div>
  )
}