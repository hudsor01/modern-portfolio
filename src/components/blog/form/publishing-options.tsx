'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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
import type { BlogCategory, BlogTag } from '@/types/blog'

interface PublishingOptionsProps {
  form: UseFormReturn<BlogPostFormData>
  categories: BlogCategory[]
  tags: BlogTag[]
  selectedTags: string[]
  onToggleTag: (tagId: string) => void
}

const statusOptions = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'REVIEW', label: 'Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'PUBLISHED', label: 'Published', color: 'bg-green-100 text-green-800' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-gray-100 text-gray-600' },
]

export function PublishingOptions({ 
  form, 
  categories, 
  tags, 
  selectedTags, 
  onToggleTag 
}: PublishingOptionsProps) {
  const currentStatus = form.watch('status')

  return (
    <div className="space-y-6">
      {/* Status */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Featured */}
      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Featured Post</FormLabel>
              <p className="text-sm text-gray-500">
                Show this post prominently on the homepage
              </p>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Category */}
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags */}
      <FormField
        control={form.control}
        name="tagIds"
        render={() => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {tags.map(tag => (
                  <label
                    key={tag.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => onToggleTag(tag.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId)
                    return tag ? (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Featured Image */}
      <FormField
        control={form.control}
        name="featuredImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Featured Image URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="https://example.com/featured-image.jpg"
                type="url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="featuredImageAlt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Featured Image Alt Text</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Descriptive text for accessibility..."
                maxLength={200}
              />
            </FormControl>
            <p className="text-sm text-gray-500">
              {field.value?.length || 0}/200 characters
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Scheduling */}
      {currentStatus === 'SCHEDULED' && (
        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled Publication Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? field.value.toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    field.onChange(date)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}