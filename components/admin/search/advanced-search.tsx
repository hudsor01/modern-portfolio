"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const searchSchema = z.object({
  query: z.string().optional(),
  type: z.enum(["all", "posts", "projects"]).default("all"),
  status: z.enum(["all", "published", "draft", "scheduled"]).default("all"),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
})

type SearchValues = z.infer<typeof searchSchema>

interface AdvancedSearchProps {
  tags: string[]
  onSearch: (values: SearchValues) => void
}

export function AdvancedSearch({ tags, onSearch }: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get("q") || "",
      type: (searchParams.get("type") as SearchValues["type"]) || "all",
      status: (searchParams.get("status") as SearchValues["status"]) || "all",
      tags: [],
    },
  })

  const onSubmit = (values: SearchValues) => {
    const params = new URLSearchParams()
    if (values.query) params.set("q", values.query)
    if (values.type !== "all") params.set("type", values.type)
    if (values.status !== "all") params.set("status", values.status)
    if (values.dateRange?.from) params.set("from", values.dateRange.from.toISOString())
    if (values.dateRange?.to) params.set("to", values.dateRange.to.toISOString())
    if (values.tags.length > 0) params.set("tags", values.tags.join(","))

    router.push(`?${params.toString()}`)
    onSearch(values)
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      form.setValue("tags", newTags)
    }
  }

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag)
    setSelectedTags(newTags)
    form.setValue("tags", newTags)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Search..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="posts">Blog Posts</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Range</FormLabel>
                <FormControl>
                  <DatePickerWithRange date={field.value} onDateChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Tags</FormLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Select onValueChange={addTag}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Add tags..." />
              </SelectTrigger>
              <SelectContent>
                {tags
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit">Apply Filters</Button>
      </form>
    </Form>
  )
}

