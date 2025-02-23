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
import { MDXEditor } from "@/components/mdx-editor"
import { ImageUpload } from "@/components/image-upload"
import { createPost, updatePost } from "@/lib/actions/posts"
import { slugify } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]).default("draft"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  publishedAt: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface Post extends FormData {
  id: string
  createdAt: string
  updatedAt: string
}

interface PostFormProps {
  post?: Post
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      status: post?.status ?? "draft",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      coverImage: post?.coverImage ?? "",
      publishedAt: post?.publishedAt ?? undefined,
    },
  })

  async function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString())
          }
        })

        const result = post ? await updatePost(post.id, formData) : await createPost(formData)

        if (!result.success) {
          throw new Error(result.message)
        }

        toast({
          title: post ? "Post updated" : "Post created",
          description: post ? "Your post has been updated." : "Your post has been created.",
        })

        router.push("/admin/blog")
        router.refresh()
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Post title"
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
                  <Input placeholder="post-slug" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of the post..." {...field} disabled={isPending} />
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

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const newStatus = form.getValues("status") === "published" ? "draft" : "published"
              form.setValue("status", newStatus)
            }}
            disabled={isPending}
          >
            {form.getValues("status") === "published" ? "Unpublish" : "Publish"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/blog")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

