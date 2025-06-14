'use client'

import { useForm } from 'react-hook-form'
import { useContactMutation } from '@/hooks/use-api-queries'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contactFormSchema } from '@/lib/validation'
import { ContactFormData } from '@/app/api/types'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-sonner-toast'

interface ContactFormProps {
  initialValues?: Partial<ContactFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
  buttonText?: string
  successMessage?: string
  errorMessage?: string
  showOptionalFields?: boolean
}

export function ContactForm({
  initialValues,
  onSuccess,
  onError,
  variant = 'default',
  className,
  buttonText = 'Send Message',
  successMessage = 'Thank you for your message. I will get back to you soon.',
  showOptionalFields = false,
}: ContactFormProps) {

  const { success: showSuccessToast, error: showErrorToast } = useToast()

  // Initialize the form with validation schema
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      subject: initialValues?.subject || '',
      message: initialValues?.message || '',
      company: (initialValues?.company as string) || '',
      phone: initialValues?.phone || '',
    },
  })

  const mutation = useContactMutation()

  // Handle successful submission
  const handleSuccess = () => {
    showSuccessToast(successMessage)
    form.reset()
    if (onSuccess) {
      onSuccess()
    }
  }

  // Handle submission error
  const handleError = (error: Error) => {
    const errorMessage = error.message || 'Unknown error occurred'
    showErrorToast(errorMessage)
    if (onError) {
      onError(error)
    }
  }

  // Handle form submission
  function onSubmit(values: ContactFormData) {
    mutation.mutate(values, {
      onSuccess: handleSuccess,
      onError: handleError,
    })
  }

  // Determine layout based on variant
  const isCompact = variant === 'compact'
  const isDetailed = variant === 'detailed'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
        <div className={cn('grid gap-4', isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2')}>
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
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showOptionalFields && (
          <div
            className={cn('grid gap-4', isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2')}
          >
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="What is this regarding?" {...field} />
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
                <Textarea
                  placeholder="Your message here..."
                  className={cn('min-h-32', isDetailed ? 'min-h-48' : '')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={cn(isCompact ? 'w-auto' : 'w-full')}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Sending...' : buttonText}
        </Button>
      </form>
    </Form>
  )
}
