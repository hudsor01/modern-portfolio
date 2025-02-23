"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MediaPicker } from "../media/media-picker"

const seoSchema = z.object({
  title: z.string().min(10).max(60),
  description: z.string().min(50).max(160),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
  keywords: z.string(),
})

type SeoValues = z.infer<typeof seoSchema>

interface SeoManagerProps {
  initialData?: Partial<SeoValues>
  onSubmit: (values: SeoValues) => void
}

export function SeoManager({ initialData, onSubmit }: SeoManagerProps) {
  const form = useForm<SeoValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      ogImage: initialData?.ogImage || "",
      canonicalUrl: initialData?.canonicalUrl || "",
      keywords: initialData?.keywords || "",
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The title that appears in search engine results (50-60 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>A brief summary that appears in search results (150-160 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Share Image</FormLabel>
                  <FormControl>
                    <MediaPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Image that appears when sharing on social media (1200x630px recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canonicalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canonical URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The preferred version of this page for search engines</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Separate keywords with commas" />
                  </FormControl>
                  <FormDescription>Keywords that help search engines understand your content</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save SEO Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

