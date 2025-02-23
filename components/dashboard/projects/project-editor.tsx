"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/dashboard/image-upload"
import { createProject, updateProject } from "@/lib/actions/projects"
import { slugify } from "@/lib/utils"

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  technologies: z.string(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectEditorProps {
  project?: {
    id: string
    title: string
    description: string
    slug: string
    image?: string
    demoUrl?: string
    githubUrl?: string
    technologies: string
  } | null
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      slug: project?.slug ?? "",
      image: project?.image ?? "",
      demoUrl: project?.demoUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      technologies: project?.technologies ?? "",
    },
  })

  function onSubmit(data: ProjectFormValues) {
    startTransition(async () => {
      try {
        if (project) {
          await updateProject(project.id, data)
          toast({
            title: "Project updated",
            description: "Your project has been updated successfully.",
          })
        } else {
          await createProject(data)
          toast({
            title: "Project created",
            description: "Your project has been created successfully.",
          })
        }
        router.push("/admin/projects")
        router.refresh()
      } catch (error) {
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
        <Card className="p-6 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Project title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      if (!project) {
                        form.setValue("slug", slugify(e.target.value))
                      }
                    }}
                    disabled={isPending}
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
                  <Textarea placeholder="Project description" {...field} disabled={isPending} />
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
                  <Input placeholder="project-slug" {...field} disabled={isPending} />
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
                  <ImageUpload value={field.value} onChange={field.onChange} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="demoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} disabled={isPending} />
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
                    <Input placeholder="https://github.com/username/repo" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies</FormLabel>
                <FormControl>
                  <Input placeholder="React, Next.js, TypeScript" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : project ? "Update Project" : "Create Project"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

