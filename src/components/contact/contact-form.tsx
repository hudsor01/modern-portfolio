'use client'

import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  MessageSquare,
  Eye,
  EyeOff,
  Building2,
  Phone,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldError } from '@/components/ui/field'
import { type UseContactFormReturn } from '@/hooks/use-contact-form'
import type { AnyFieldApi } from '@tanstack/react-form'

// ============================================================================
// Props
// ============================================================================

interface ContactFormProps {
  form: UseContactFormReturn
}

// ============================================================================
// Helper Component for Field Info
// ============================================================================

function FieldErrorDisplay({
  field,
  fallbackError,
}: {
  field: AnyFieldApi
  fallbackError?: string
}) {
  const hasFieldErrors = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const errorMessage = hasFieldErrors ? field.state.meta.errors[0] : fallbackError

  if (!errorMessage) return null

  return <FieldError>{errorMessage}</FieldError>
}

// ============================================================================
// Component
// ============================================================================

export function ContactForm({ form: formHook }: ContactFormProps) {
  const {
    submitStatus,
    showPrivacy,
    agreedToTerms,
    errors,
    form,
    setShowPrivacy,
    setAgreedToTerms,
  } = formHook

  return (
    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <h2 className="typography-h3 mb-6">Send a Message</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          formHook.handleSubmit(e)
        }}
        className="space-y-6"
      >
        {/* Name & Email Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <form.Field
            name="name"
            children={(field: AnyFieldApi) => (
              <Field data-invalid={field.state.meta.errors.length > 0 || !!errors.name}>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      formHook.handleInputChange(e)
                    }}
                    onBlur={field.handleBlur}
                    placeholder="Your name *"
                    required
                    aria-invalid={field.state.meta.errors.length > 0 || !!errors.name}
                    className="pl-12"
                  />
                </div>
                <FieldErrorDisplay field={field} fallbackError={errors.name} />
              </Field>
            )}
          />

          <form.Field
            name="email"
            children={(field: AnyFieldApi) => (
              <Field data-invalid={field.state.meta.errors.length > 0 || !!errors.email}>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      formHook.handleInputChange(e)
                    }}
                    onBlur={field.handleBlur}
                    placeholder="Your email *"
                    required
                    aria-invalid={field.state.meta.errors.length > 0 || !!errors.email}
                    className="pl-12"
                  />
                </div>
                <FieldErrorDisplay field={field} fallbackError={errors.email} />
              </Field>
            )}
          />
        </div>

        {/* Company & Phone Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <form.Field
            name="company"
            children={(field: AnyFieldApi) => (
              <Field data-invalid={field.state.meta.errors.length > 0 || !!errors.company}>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      formHook.handleInputChange(e)
                    }}
                    onBlur={field.handleBlur}
                    placeholder="Company / Organization"
                    aria-invalid={field.state.meta.errors.length > 0 || !!errors.company}
                    className="pl-12"
                  />
                </div>
                <FieldErrorDisplay field={field} fallbackError={errors.company} />
              </Field>
            )}
          />

          <form.Field
            name="phone"
            children={(field: AnyFieldApi) => (
              <Field data-invalid={field.state.meta.errors.length > 0 || !!errors.phone}>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                      formHook.handleInputChange(e)
                    }}
                    onBlur={field.handleBlur}
                    placeholder="Phone number"
                    aria-invalid={field.state.meta.errors.length > 0 || !!errors.phone}
                    className="pl-12"
                  />
                </div>
                <FieldErrorDisplay field={field} fallbackError={errors.phone} />
              </Field>
            )}
          />
        </div>

        {/* Message */}
        <form.Field
          name="message"
          children={(field: AnyFieldApi) => (
            <Field data-invalid={field.state.meta.errors.length > 0 || !!errors.message}>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                    formHook.handleInputChange(e)
                  }}
                  onBlur={field.handleBlur}
                  required
                  rows={6}
                  className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-hidden focus:ring-[3px] text-foreground placeholder-muted-foreground resize-none transition-all duration-300 ease-out ${
                    field.state.meta.errors.length > 0 || errors.message
                      ? 'border-destructive focus:ring-destructive/50'
                      : 'border-border focus:ring-primary/50'
                  }`}
                  placeholder="What would you like to discuss? *"
                />
                <div className="absolute bottom-3 right-3 typography-small text-muted-foreground">
                  {String(field.state.value).length}/500
                </div>
              </div>
              <FieldErrorDisplay field={field} fallbackError={errors.message} />
            </Field>
          )}
        />

        {/* Privacy Agreement */}
        <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border">
          <Checkbox
            id="privacy"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <div className="text-sm">
            <label htmlFor="privacy" className="text-muted-foreground cursor-pointer">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="text-primary hover:text-primary/70 underline inline-flex items-center gap-1"
                aria-label={showPrivacy ? 'Hide privacy policy' : 'Show privacy policy'}
                aria-expanded={showPrivacy}
              >
                privacy policy
                {showPrivacy ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>{' '}
              and consent to processing my data for this inquiry. *
            </label>
            {showPrivacy && (
              <div className="mt-2 p-3 bg-card rounded-lg typography-small text-muted-foreground border border-border">
                Your information will be used solely to respond to your inquiry. We don't share
                personal data with third parties and you can request deletion at any time.
              </div>
            )}
            {errors.terms && <FieldError>{errors.terms}</FieldError>}
          </div>
        </div>

        {/* Submit Button - Using form.Subscribe for reactive state */}
        <form.Subscribe
          selector={(state: { canSubmit: boolean; isSubmitting: boolean }) => [
            state.canSubmit,
            state.isSubmitting,
          ]}
          children={([_canSubmit, isSubmitting]: [boolean, boolean]) => (
            <button
              type="submit"
              disabled={isSubmitting || !agreedToTerms}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
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
          )}
        />

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 text-success bg-success/10 p-4 rounded-xl"
          >
            <CheckCircle className="w-5 h-5" />
            Message sent successfully! I'll get back to you soon.
          </div>
        )}
        {submitStatus === 'error' && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-xl"
          >
            <AlertCircle className="w-5 h-5" />
            Failed to send message. Please try again.
          </div>
        )}
      </form>
    </div>
  )
}
