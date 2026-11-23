'use client'

import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  MessageSquare,
  Building2,
  Phone,
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Field, FieldError } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import type { TanStackFieldApi, UseContactFormReturn } from '@/types/forms'

interface ContactFormProps {
  form: UseContactFormReturn
}

export function ContactForm({ form: formHook }: ContactFormProps) {
  const { form, submitStatus, isSubmitting, error } = formHook

  return (
    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <h2 className="typography-h3 mb-6">Send a Message</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        <noscript>
          <div className="flex items-center gap-2 text-foreground bg-muted p-4 rounded-xl mb-2 border border-border">
            <Mail className="w-5 h-5 flex-shrink-0 text-primary" />
            <span>
              This form requires JavaScript. Please email{' '}
              <a href="mailto:hudsor01@icloud.com" className="underline">
                hudsor01@icloud.com
              </a>{' '}
              directly.
            </span>
          </div>
        </noscript>

        {/* Name & Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="name"
            children={(field: TanStackFieldApi<string>) => (
              <Field data-invalid={(field.state.meta.errors?.length ?? 0) > 0}>
                <Label htmlFor={field.name}>Name *</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your name *"
                    required
                    aria-invalid={(field.state.meta.errors?.length ?? 0) > 0}
                    className="pl-12"
                  />
                </div>
                <FieldError>{(field.state.meta.errors ?? []).join(', ')}</FieldError>
              </Field>
            )}
          />

          <form.Field
            name="email"
            children={(field: TanStackFieldApi<string>) => (
              <Field data-invalid={(field.state.meta.errors?.length ?? 0) > 0}>
                <Label htmlFor={field.name}>Email *</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your email *"
                    required
                    aria-invalid={(field.state.meta.errors?.length ?? 0) > 0}
                    className="pl-12"
                  />
                </div>
                <FieldError>{field.state.meta.errors?.join(', ') ?? ''}</FieldError>
              </Field>
            )}
          />
        </div>

        {/* Company & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="company"
            children={(field: TanStackFieldApi<string>) => (
              <Field data-invalid={(field.state.meta.errors?.length ?? 0) > 0}>
                <Label htmlFor={field.name}>Company / Organization</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Company / Organization"
                    aria-invalid={(field.state.meta.errors?.length ?? 0) > 0}
                    className="pl-12"
                  />
                </div>
                <FieldError>{field.state.meta.errors?.join(', ') ?? ''}</FieldError>
              </Field>
            )}
          />

          <form.Field
            name="phone"
            children={(field: TanStackFieldApi<string>) => (
              <Field data-invalid={(field.state.meta.errors?.length ?? 0) > 0}>
                <Label htmlFor={field.name}>Phone number</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Phone number"
                    aria-invalid={(field.state.meta.errors?.length ?? 0) > 0}
                    className="pl-12"
                  />
                </div>
                <FieldError>{field.state.meta.errors?.join(', ') ?? ''}</FieldError>
              </Field>
            )}
          />
        </div>

        {/* Message */}
        <form.Field
          name="message"
          children={(field: TanStackFieldApi<string>) => (
            <Field data-invalid={(field.state.meta.errors?.length ?? 0) > 0}>
              <Label htmlFor={field.name}>Message *</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value as string}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  required
                  rows={6}
                  className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-hidden focus:ring-[3px] text-foreground placeholder-muted-foreground resize-none transition-all duration-300 ease-out ${
                    (field.state.meta.errors?.length ?? 0) > 0
                      ? 'border-destructive focus:ring-destructive/50'
                      : 'border-border focus:ring-primary/50'
                  }`}
                  placeholder="What would you like to discuss? *"
                />
                <div className="absolute bottom-3 right-3 typography-small text-muted-foreground">
                  {(field.state.value as string).length}/500
                </div>
              </div>
              <FieldError>{field.state.meta.errors?.join(', ') ?? ''}</FieldError>
            </Field>
          )}
        />

        {/* Submit Button + privacy notice */}
        <div className="space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-xl transition-all duration-300 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                Send Message
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* One error surface: the generic lead plus the specific reason, if any. */}
          {(submitStatus === 'error' || error) && (
            <div
              role="alert"
              className="flex items-start gap-2 text-destructive bg-destructive/10 p-4 rounded-xl"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Failed to send message.{' '}
                {error?.message && error.message !== 'Submission failed'
                  ? error.message
                  : 'Please try again.'}
              </span>
            </div>
          )}

          <p className="typography-small text-center">
            By sending, your name, email and message are used only to reply to you. See the{' '}
            {/* New tab so reading the policy doesn't discard what's been typed. */}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener"
              aria-label="Privacy Policy (opens in a new tab)"
              className="whitespace-nowrap text-primary hover:text-primary/70 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 text-success bg-success/10 p-4 rounded-xl"
          >
            <CheckCircle className="w-5 h-5" aria-hidden="true" />
            Message sent successfully! I'll get back to you soon.
          </div>
        )}
      </form>
    </div>
  )
}
