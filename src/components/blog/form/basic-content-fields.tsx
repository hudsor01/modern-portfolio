'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { UseFormReturn } from 'react-hook-form'
import type { BlogPostFormData } from '@/hooks/use-blog-post-form'

interface BasicContentFieldsProps {
  form: UseFormReturn<BlogPostFormData>
  onTitleChange: (title: string) => void
}

export function BasicContentFields({ form, onTitleChange }: BasicContentFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Title *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter blog post title..."
                className="text-lg"
                onChange={(e) => {
                  field.onChange(e)
                  onTitleChange(e.target.value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Slug */}
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL Slug *</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="url-friendly-slug"
                className="font-mono text-sm"
              />
            </FormControl>
            <p className="text-sm text-gray-500">
              URL: /blog/{field.value || 'your-slug'}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Excerpt */}
      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Excerpt</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Brief description for preview cards and SEO..."
                rows={3}
                maxLength={500}
              />
            </FormControl>
            <p className="text-sm text-gray-500">
              {field.value?.length || 0}/500 characters
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Content */}
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Content *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Write your blog post content here..."
                rows={12}
                className="font-mono text-sm"
              />
            </FormControl>
            <p className="text-sm text-gray-500">
              {field.value?.length || 0} characters (minimum 100)
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Content Type */}
      <FormField
        control={form.control}
        name="contentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MARKDOWN">Markdown</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
                <SelectItem value="RICH_TEXT">Rich Text</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}