'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Plus, X } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { BlogPostFormData } from '@/hooks/use-blog-post-form'

interface SeoFieldsProps {
  form: UseFormReturn<BlogPostFormData>
  newKeyword: string
  setNewKeyword: (value: string) => void
  onAddKeyword: () => void
  onRemoveKeyword: (keyword: string) => void
}

export function SeoFields({ 
  form, 
  newKeyword, 
  setNewKeyword, 
  onAddKeyword, 
  onRemoveKeyword 
}: SeoFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Meta Title */}
      <FormField
        control={form.control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="SEO title for search engines..."
                maxLength={100}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              {field.value?.length || 0}/100 characters
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Meta Description */}
      <FormField
        control={form.control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Brief description for search engine results..."
                rows={3}
                maxLength={160}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              {field.value?.length || 0}/160 characters
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Keywords */}
      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keywords</FormLabel>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add a keyword..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      onAddKeyword()
                    }
                  }}
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={onAddKeyword}
                  disabled={!newKeyword.trim() || (field.value?.length || 0) >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((keyword) => (
                    <Badge 
                      key={keyword} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => onRemoveKeyword(keyword)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                {field.value?.length || 0}/10 keywords
              </p>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Canonical URL */}
      <FormField
        control={form.control}
        name="canonicalUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canonical URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="https://example.com/original-post"
                type="url"
              />
            </FormControl>
            <p className="text-sm text-muted-foreground">
              Optional: Use if this content was originally published elsewhere
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}