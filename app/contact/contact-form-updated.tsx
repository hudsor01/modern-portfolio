'use client'

import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast }  from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CheckCircle2 } from 'lucide-react'
import { sendContactEmail } from '@/app/api/send-email/action'

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

type FormValues = z.infer<typeof formSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(data: FormValues) {
    // Show loading toast
    const loadingToastId = toast.loading('Sending your message...')
    setIsSubmitting(true)

    try {
      // Call the server action to send email
      const result = await sendContactEmail(data)

      if (result.success) {
        // Dismiss loading toast and show success
        toast.dismiss(loadingToastId)
        toast.success('Your message has been sent!')
        setIsSubmitted(true)
        form.reset()
      } else {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToastId)

        // Handle validation or server errors
        if (result.validationErrors) {
          // Apply validation errors to form
          Object.entries(result.validationErrors).forEach(([key, value]) => {
            if (value) {
              form.setError(key as keyof FormValues, {
                type: 'server',
                message: value[0],
              })
            }
          })
          toast.error('Please check the form for errors.')
        } else {
          // Display general error message
          toast.error(result.error || 'Something went wrong. Please try again.')
        }
      }
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId)
      console.error('Form submission error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
        <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can I help you?" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}
