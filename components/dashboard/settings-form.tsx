"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { updateSettings } from "@/lib/actions/settings"

const settingsFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  ogImage: z.string().url().optional(),
  twitterHandle: z.string().optional(),
  githubHandle: z.string().optional(),
  linkedinHandle: z.string().optional(),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function SettingsForm() {
  const [, startTransition] = React.useTransition()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: async () => {
      try {
        // We'll fetch initial values in the page component instead
        return {
          title: "",
          description: "",
          ogImage: "",
          twitterHandle: "",
          githubHandle: "",
          linkedinHandle: "",
        }
      } catch {
        return {}
      }
    },
  })

  async function onSubmit(data: SettingsFormValues) {
    startTransition(async () => {
      try {
        const result = await updateSettings(data)
        if (result.success) {
          toast({
            title: "Settings updated",
            description: "Your settings have been updated successfully.",
          })
        } else {
          throw new Error("Failed to update settings")
        }
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Form fields remain the same */}
      </form>
    </Form>
  )
}
