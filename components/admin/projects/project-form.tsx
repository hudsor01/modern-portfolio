"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Loader2 } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
})

type FormData = z.infer<typeof formSchema>

interface ProjectFormProps {
  project?: {
    id: string
    title: string
    slug: string
    description: string
    image?: string
    demoUrl?: string
    githubUrl?: string
    tags: string[]
  }
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      description: project?.description || "",
      image: project?.image || "",
      demoUrl: project?.demoUrl || "",
      githubUrl: project?.githubUrl || "",
      tags: project?.tags || [],
    },
  })

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    try {
      const response = await fetch(project ? `/api/projects/${project.slug}` : "/api/projects", {
        method: project ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save project")

      toast.success(project ? "Project updated" : "Project created")
      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !form.getValues("tags").includes(newTag.trim())) {
      form.setValue("tags", [...form.getValues("tags"), newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues("tags").filter((tag) => tag !== tagToRemove),
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} disabled={isSaving} />
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
                    <Input
                      placeholder="project-slug"
                      {...field}
                      disabled={isSaving}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project description" {...field} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <MediaPicker value={field.value} onChange={field.onChange} disabled={isSaving} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://demo.example.com" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/example/project" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  disabled={isSaving}
                />
                <Button type="button" onClick={addTag} disabled={isSaving}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.watch("tags").map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                      disabled={isSaving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? "Update Project" : "Create Project"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

