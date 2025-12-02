'use client'

import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { contactFormSchema, type ContactFormValues } from '@/lib/validations/unified-schemas'
import { submitContactForm } from '@/app/contact/actions'
import { Loader2, Send, CheckCircle } from 'lucide-react'

interface ContactFormProps {
  /** 'standalone' wraps in Card, 'embedded' renders form only */
  variant?: 'standalone' | 'embedded'
  title?: string
  description?: string
  showOptionalFields?: boolean
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function ContactForm({
  variant = 'standalone',
  title = "Get in Touch",
  description = "Have a question or want to work together? Send me a message.",
  showOptionalFields = false,
  className,
  onSuccess,
  onError,
}: ContactFormProps) {
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      company: '',
      phone: '',
    },
  })

  const onSubmit = useCallback(async (data: ContactFormValues) => {
    setSubmitState('submitting')

    try {
      const result = await submitContactForm(data)

      if (result.success) {
        setSubmitState('success')
        form.reset()
        toast.success('Message sent! I\'ll get back to you soon.')
        setTimeout(() => setSubmitState('idle'), 3000)
        onSuccess?.()
      } else {
        setSubmitState('error')
        toast.error(result.error || 'Failed to send message')
        setTimeout(() => setSubmitState('idle'), 3000)
        onError?.(new Error(result.error || 'Failed to send message'))
      }
    } catch (error) {
      setSubmitState('error')
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(message)
      setTimeout(() => setSubmitState('idle'), 3000)
      onError?.(error instanceof Error ? error : new Error(message))
    }
  }, [form, onSuccess, onError])

  const isSubmitting = submitState === 'submitting'

  const formContent = (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn(variant === 'embedded' && className)}>
      <FieldSet>
        <FieldGroup>
              {/* Name and Email row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        placeholder="Your name"
                        aria-invalid={fieldState.invalid}
                        disabled={isSubmitting}
                      />
                      {!fieldState.invalid && (
                        <FieldDescription>Your full name</FieldDescription>
                      )}
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={fieldState.invalid}
                        disabled={isSubmitting}
                      />
                      {!fieldState.invalid && (
                        <FieldDescription>We'll use this to respond</FieldDescription>
                      )}
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </div>

              {/* Optional fields */}
              {showOptionalFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="company"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="company">
                          Company <span className="text-muted-foreground">(optional)</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="company"
                          placeholder="Your company"
                          aria-invalid={fieldState.invalid}
                          disabled={isSubmitting}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phone">
                          Phone <span className="text-muted-foreground">(optional)</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          aria-invalid={fieldState.invalid}
                          disabled={isSubmitting}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                </div>
              )}

              {/* Subject */}
              <Controller
                name="subject"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="subject">
                      Subject <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="subject"
                      placeholder="What's this about?"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* Message */}
              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="message"
                      placeholder="Tell me more..."
                      className="min-h-32 resize-none"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {!fieldState.invalid && (
                      <FieldDescription>
                        {field.value?.length || 0}/1000 characters
                      </FieldDescription>
                    )}
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || submitState === 'success'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : submitState === 'success' ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      )

  if (variant === 'embedded') {
    return formContent
  }

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  )
}
