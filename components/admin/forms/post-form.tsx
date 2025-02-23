"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/admin/image-upload"
import { MDXEditor } from "@/components/mdx-editor"
import { createPost, updatePost } from "@/lib/actions/blog"
import { slugify } from "@/lib/utils"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
})

type FormData = z.infer<typeof postSchema>

interface PostFormProps {
  post?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt?: string
    coverImage?: string
    published: boolean
  }
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      content: post?.content ?? "",
      excerpt: post?.excerpt ?? "",
      coverImage: post?.coverImage ?? "",
      published: post?.published ?? false,
    },
  })

  function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value.toString())
        })

        if (post) {
          await updatePost(post.id, formData)
          toast({
            title: "Success",
            description: "Post updated successfully.",
          })
        } else {
          await createPost(formData)
          toast({
            title: "Success",
            description: "Post created successfully.",
          })
        }

        router.push("/admin/blog")
        router.refresh()
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  onChange={(e) => {
                    field.onChange(e)
                    if (!post) {
                      form.setValue("slug", slugify(e.target.value))
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MDXEditor value={field.value} onChange={field.onChange} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
                <p className="text-sm text-muted-foreground">Make this post visible to the public</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

