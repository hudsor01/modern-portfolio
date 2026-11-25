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
import { CONTACT_LIMITS, CONTACT_MINIMUMS, contactMessageLength } from '@/lib/schemas'
import type { TanStackFieldApi, UseContactFormReturn } from '@/types/forms'

interface ContactFormProps {
  form: UseContactFormReturn
}

// Browsers compile `pattern` with the `v` flag, where the schema's phone regex
// verbatim is an invalid pattern and would be silently ignored. This class is
// the v-flag-safe equivalent (digits, whitespace, + ( ) -).
const PHONE_PATTERN = String.raw`[\d\s+\(\)\-]*`

/**
 * Text for a field's FieldError. TanStack errors render as themselves when a
 * string, else their `message`; anything else is dropped. Falls back to the
 * server's (no-JS) field error only when TanStack has none and the user has not
 * changed the field since: the server judged the value it was sent, so once the
 * field is dirty that message no longer describes what the field holds.
 */
function fieldErrorText(
  meta: { errors?: unknown[]; isDirty?: boolean },
  serverError: string | undefined
): string {
  const texts: string[] = []
  for (const err of meta.errors ?? []) {
    if (typeof err === 'string') texts.push(err)
    else if (
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof err.message === 'string'
    )
      texts.push(err.message)
  }
  const joined = texts.join(', ')
  if (joined !== '') return joined
  return meta.isDirty ? '' : (serverError ?? '')
}

export function ContactForm({ form: formHook }: ContactFormProps) {
  const {
    form,
    handleSubmit,
    submitStatus,
    isSubmitting,
    error,
    formAction,
    serverFieldErrors,
    fromAction,
  } = formHook
  // A progressive (no-JS / pre-hydration) result arrives on a freshly loaded page
  // scrolled to the top, where a live region present at load is not reliably
  // announced. Native autofocus works without JS: it scrolls the banner into view
  // and moves focus there, so screen readers read it. React never calls focus()
  // on a div, so hydration cannot pull focus back after the user moves on.
  const resultFocus = fromAction
    ? ({ tabIndex: -1, autoFocus: true, 'data-focus-target': '' } as const)
    : {}

  return (
    <div className="relative flex h-full flex-col bg-card rounded-2xl p-8 border border-border shadow-sm">
      <h2 className="typography-h3 mb-6">Send a Message</h2>

      <form
        // First interaction sends one 'Contact Started' event via the layout
        // listener (no field values); success sends 'Contact Submitted'.
        data-track-input="Contact Started"
        data-track-location="contact-form"
        // SSR renders a multipart POST bound to submitContactFormAction, so a
        // submit before hydration or without JS posts to the server action and
        // never puts fields in a URL. Once hydrated, the hook's handleSubmit
        // prevents React's action (react-dom checks defaultPrevented), applies the
        // re-entry and honeypot guards, and TanStack submits via
        // submitContactForm. Never set method/encType: React supplies them.
        action={formAction}
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-6"
      >
        <noscript>
          <div className="flex items-center gap-2 text-foreground bg-muted p-4 rounded-xl mb-2 border border-border">
            <Mail className="w-5 h-5 flex-shrink-0 text-primary" />
            <span>
              Prefer email? Write to{' '}
              <a href="mailto:hudsor01@icloud.com" className="text-link">
                hudsor01@icloud.com
              </a>
              .
            </span>
          </div>
        </noscript>

        {/* Name & Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="name"
            children={(field: TanStackFieldApi<string>) => {
              const errorText = fieldErrorText(field.state.meta, serverFieldErrors.name)
              const hasError = errorText !== ''
              return (
                <Field data-invalid={hasError}>
                  <Label htmlFor={field.name}>Name *</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-0 flex h-9 items-center text-muted-foreground">
                      <User className="w-5 h-5" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value as string}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Jane Smith"
                      autoComplete="name"
                      // Native lengths count UTF-16 units of the raw value; the
                      // schema counts code points, max before trim and min after.
                      // So maxLength is never looser than the server (see
                      // CONTACT_LIMITS), and minLength never blocks a valid value
                      // but can pass one the schema rejects (see CONTACT_MINIMUMS).
                      minLength={CONTACT_MINIMUMS.name}
                      maxLength={CONTACT_LIMITS.name}
                      required
                      aria-invalid={hasError}
                      className="pl-12"
                    />
                  </div>
                  <FieldError>{errorText}</FieldError>
                </Field>
              )
            }}
          />

          <form.Field
            name="email"
            children={(field: TanStackFieldApi<string>) => {
              const errorText = fieldErrorText(field.state.meta, serverFieldErrors.email)
              const hasError = errorText !== ''
              return (
                <Field data-invalid={hasError}>
                  <Label htmlFor={field.name}>Email *</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-0 flex h-9 items-center text-muted-foreground">
                      <Mail className="w-5 h-5" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value as string}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="jane@company.com"
                      autoComplete="email"
                      maxLength={CONTACT_LIMITS.email}
                      required
                      aria-invalid={hasError}
                      className="pl-12"
                    />
                  </div>
                  <FieldError>{errorText}</FieldError>
                </Field>
              )
            }}
          />
        </div>

        {/* Company & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="company"
            children={(field: TanStackFieldApi<string>) => {
              const errorText = fieldErrorText(field.state.meta, serverFieldErrors.company)
              const hasError = errorText !== ''
              return (
                <Field data-invalid={hasError}>
                  <Label htmlFor={field.name}>Company / Organization</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-0 flex h-9 items-center text-muted-foreground">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value as string}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Acme Inc."
                      autoComplete="organization"
                      maxLength={CONTACT_LIMITS.company}
                      aria-invalid={hasError}
                      className="pl-12"
                    />
                  </div>
                  <FieldError>{errorText}</FieldError>
                </Field>
              )
            }}
          />

          <form.Field
            name="phone"
            children={(field: TanStackFieldApi<string>) => {
              const errorText = fieldErrorText(field.state.meta, serverFieldErrors.phone)
              const hasError = errorText !== ''
              return (
                <Field data-invalid={hasError}>
                  <Label htmlFor={field.name}>Phone number</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-0 flex h-9 items-center text-muted-foreground">
                      <Phone className="w-5 h-5" />
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      value={field.state.value as string}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="(555) 123-4567"
                      autoComplete="tel"
                      maxLength={CONTACT_LIMITS.phone}
                      pattern={PHONE_PATTERN}
                      aria-invalid={hasError}
                      className="pl-12"
                    />
                  </div>
                  <FieldError>{errorText}</FieldError>
                </Field>
              )
            }}
          />
        </div>

        {/* Message */}
        <form.Field
          name="message"
          children={(field: TanStackFieldApi<string>) => {
            const errorText = fieldErrorText(field.state.meta, serverFieldErrors.message)
            const hasError = errorText !== ''
            return (
              <Field className="flex-1" data-invalid={hasError}>
                <Label htmlFor={field.name}>Message *</Label>
                <div className="relative flex flex-1 flex-col">
                  <MessageSquare className="pointer-events-none absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                    minLength={CONTACT_MINIMUMS.message}
                    maxLength={CONTACT_LIMITS.message}
                    rows={6}
                    className={`min-h-40 w-full flex-1 pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-hidden focus:ring-[3px] text-foreground placeholder-muted-foreground resize-none transition-all duration-300 ease-out ${
                      hasError
                        ? 'border-destructive focus:ring-destructive/50'
                        : 'border-border focus:ring-primary/50'
                    }`}
                    placeholder="What would you like to discuss?"
                  />
                  <div className="absolute bottom-3 right-3 typography-small text-muted-foreground">
                    {contactMessageLength(field.state.value as string)}/{CONTACT_LIMITS.message}
                  </div>
                </div>
                <FieldError>{errorText}</FieldError>
              </Field>
            )
          }}
        />

        {/* Honeypot: a trap for bots. Hidden from assistive tech and the Tab order
            and never autofilled (the name matches no autofill heuristic). Never
            `hidden`/`display:none`, because bots skip those. Enforced in
            emailService.sendContactEmail. */}
        <form.Field
          name="honeypot"
          children={(field: TanStackFieldApi<string>) => (
            <div
              aria-hidden="true"
              className="absolute h-px w-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]"
            >
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                value={field.state.value as string}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
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
              {...resultFocus}
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

          <p className="text-xs font-normal leading-relaxed text-muted-foreground text-center">
            By sending, your name, email and message are used only to reply to you. See the{' '}
            {/* New tab so reading the policy doesn't discard what's been typed. */}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener"
              aria-label="Privacy Policy (opens in a new tab)"
              className="text-link whitespace-nowrap"
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
            {...resultFocus}
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
