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
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { type UseContactFormReturn } from '@/hooks/use-contact-form'

// ============================================================================
// Props
// ============================================================================

interface ContactFormProps {
  form: UseContactFormReturn
}

// ============================================================================
// Component
// ============================================================================

export function ContactForm({ form }: ContactFormProps) {
  const {
    formData,
    errors,
    submitStatus,
    showPrivacy,
    agreedToTerms,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    setShowPrivacy,
    setAgreedToTerms,
  } = form

  return (
    <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <h2 className="typography-h3 mb-6">Send a Message</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Email Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-3 top-3.5 text-muted-foreground">
              <User className="w-5 h-5" />
            </div>
            <Input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name *"
              required
              aria-invalid={!!errors.name}
              className="pl-12"
            />
            {errors.name && <span role="alert" className="text-destructive text-sm mt-1 block">{errors.name}</span>}
          </div>
          <div className="relative">
            <div className="absolute left-3 top-3.5 text-muted-foreground">
              <Mail className="w-5 h-5" />
            </div>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your email *"
              required
              aria-invalid={!!errors.email}
              className="pl-12"
            />
            {errors.email && <span role="alert" className="text-destructive text-sm mt-1 block">{errors.email}</span>}
          </div>
        </div>

        {/* Message */}
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-hidden focus:ring-2 text-foreground placeholder-muted-foreground resize-none transition-all ${
              errors.message
                ? 'border-destructive focus:ring-destructive'
                : 'border-border focus:ring-primary'
            }`}
            placeholder="What would you like to discuss? *"
          />
          <div className="absolute bottom-3 right-3 typography-small text-muted-foreground">
            {formData.message.length}/500
          </div>
          {errors.message && <span role="alert" className="text-destructive text-sm mt-1 block">{errors.message}</span>}
        </div>

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
              >
                privacy policy
                {showPrivacy ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
              {' '}and consent to processing my data for this inquiry. *
            </label>
            {showPrivacy && (
              <div className="mt-2 p-3 bg-card rounded-lg typography-small text-muted-foreground border border-border">
                Your information will be used solely to respond to your inquiry. We don't share personal data with third parties and you can request deletion at any time.
              </div>
            )}
            {errors.terms && <div role="alert" className="text-destructive text-sm mt-1">{errors.terms}</div>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !agreedToTerms}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
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
