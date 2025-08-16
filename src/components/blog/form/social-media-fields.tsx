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
import type { UseFormReturn } from 'react-hook-form'
import type { BlogPostFormData } from '@/hooks/use-blog-post-form'

interface SocialMediaFieldsProps {
  form: UseFormReturn<BlogPostFormData>
}

export function SocialMediaFields({ form }: SocialMediaFieldsProps) {
  return (
    <div className="space-y-8">
      {/* Open Graph (Facebook) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Open Graph (Facebook)
        </h3>
        
        <FormField
          control={form.control}
          name="ogTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Title for Facebook shares..."
                  maxLength={100}
                />
              </FormControl>
              <p className="text-sm text-gray-500">
                {field.value?.length || 0}/100 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ogDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description for Facebook shares..."
                  rows={3}
                  maxLength={300}
                />
              </FormControl>
              <p className="text-sm text-gray-500">
                {field.value?.length || 0}/300 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ogImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Image URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </FormControl>
              <p className="text-sm text-gray-500">
                Recommended: 1200x630px for optimal Facebook display
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Twitter */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Twitter Card
        </h3>
        
        <FormField
          control={form.control}
          name="twitterTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Title for Twitter shares..."
                  maxLength={100}
                />
              </FormControl>
              <p className="text-sm text-gray-500">
                {field.value?.length || 0}/100 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="twitterDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Description for Twitter shares..."
                  rows={2}
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

        <FormField
          control={form.control}
          name="twitterImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Image URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/twitter-image.jpg"
                  type="url"
                />
              </FormControl>
              <p className="text-sm text-gray-500">
                Recommended: 1200x600px for Twitter Card
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}