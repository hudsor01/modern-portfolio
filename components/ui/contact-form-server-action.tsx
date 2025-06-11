'use client'

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query' // Added useMutation
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
import { submitContactForm } from '@/lib/actions/contact-form-action'
import { ContactFormProps } from '@/types/ui'

export function ContactFormWithServerAction({
  initialValues,
  onSuccess,
  onError,
  variant = 'default',
  className,
  buttonText = 'Send Message',
  successMessage = 'Your message has been sent successfully!',
  showOptionalFields = true,
}: ContactFormProps) {

  const { success: showSuccessToast, error: showErrorToast } = useToast()

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      message: initialValues?.message || '',
      subject: initialValues?.subject || '',
      company: initialValues?.company || '',
      phone: initialValues?.phone || '',
    },
  })

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data) => {
      if (data.success) {
        showSuccessToast(successMessage)
        form.reset()
        if (variant === 'detailed') {
          // setIsFormVisible(false) // This state needs to be handled differently or passed down if parent controls visibility
        }
        if (onSuccess) {
          onSuccess()
        }
        // Example: queryClient.invalidateQueries({ queryKey: ['someRelatedData'] })
      } else {
        // Handle server-side failure indicated by `data.success === false`
        showErrorToast(data.message || data.error || 'Submission failed')
        if (onError) {
          onError(new Error(data.message || data.error || 'Submission failed'))
        }
      }
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Unknown error occurred'
      showErrorToast(errorMessage)
      if (onError) {
        onError(error)
      }
    },
  })

  // Handle form submission using server action
  function onSubmit(values: ContactFormData) {
    mutation.mutate(values)
  }

  // Show loading state while form is submitting
  if (mutation.isPending && variant === 'detailed') {
    return <div className={cn('p-6 border rounded-lg animate-pulse', className)}>Loading...</div>
  }

  // Show success message if form is not visible (and mutation was successful)
  // This logic might need adjustment depending on how isFormVisible was intended to work.
  // For simplicity, we'll assume success means we can show the success message if variant is 'detailed'.
  if (mutation.isSuccess && mutation.data?.success && variant === 'detailed') {
    return (
      <div className={cn('space-y-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg', className)}>
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">Message Sent!</h3>
        <p className="text-green-600 dark:text-green-300">{successMessage}</p>
        <Button onClick={() => mutation.reset()} variant="outline"> {/* Reset mutation to allow sending another */}
          Send Another Message
        </Button>
      </div>
    )
  }
  
  // If the form should not be visible after a successful 'default' variant submission,
  // the parent component would need to control its visibility or this component needs a local state for it.
  // For now, only 'detailed' variant hides the form.

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'space-y-4',
          {
            'p-6 border rounded-lg shadow-sm': variant === 'detailed',
            'space-y-2': variant === 'compact',
          },
          className
        )}
      >
        {variant === 'detailed' && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
            <p className="text-muted-foreground">Fill out the form below to send me a message.</p>
          </div>
        )}

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

        {showOptionalFields && (
          <>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="What's this about?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {variant === 'detailed' && (
              <>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
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
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </>
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          className={cn({
            'w-full': variant === 'detailed',
            'mt-2': variant === 'compact',
          })}
        >
          {mutation.isPending ? 'Sending...' : buttonText}
        </Button>
      </form>
    </Form>
  )
}
