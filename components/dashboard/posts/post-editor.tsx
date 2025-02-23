"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/dashboard/image-upload"
import { MDXEditor } from "@/components/mdx-editor"
import { updatePost, publishPost } from "@/lib/actions/posts"

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  publishedAt: z.date().optional(),
})

type PostFormValues = z.infer<typeof postFormSchema>

interface Post {
  id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  slug: string;
  excerpt?: string;
  cover_image?: string;
  published_at?: string;
}

interface PostEditorProps {
  post?: Post | null
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [isPreview, setIsPreview] = React.useState(false)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      status: post?.status ?? "draft",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      coverImage: post?.cover_image ?? "",
      publishedAt: post?.published_at ? new Date(post.published_at) : undefined,
    },
  })

  async function onSubmit(data: PostFormValues) {
    startTransition(async () => {
      try {
        if (post) {
          await updatePost(post.id, data)
          toast({
            title: "Post updated",
          })
        }
        router.push("/admin/blog")
        router.refresh()
      } catch {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  async function onPublish() {
    if (!post) return

    startTransition(async () => {
      try {
        await publishPost(post.id)
        toast({
          title: "Post published",
          description: "Your post has been published successfully.",
        })
        router.refresh()
      } catch {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post?.status === "draft" && (
              <Button type="button" onClick={onPublish} disabled={isPending}>
                Publish
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)}>
              {isPreview ? "Edit" : "Preview"}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : post ? "Update" : "Create"}
            </Button>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Post title" {...field} disabled={isPending} />
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

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Brief description of your post..." {...field} disabled={isPending} />
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
            name="publishedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publish Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Card className="p-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  {isPreview ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <MDXEditor value={field.value} onChange={field.onChange} readOnly />
                    </div>
                  ) : (
                    <MDXEditor value={field.value} onChange={field.onChange} disabled={isPending} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
      </form>
    </Form>
  )
}
