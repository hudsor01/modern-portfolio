'use client'

import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Building,
  Phone,
  MessageSquare,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type UseContactFormReturn } from '@/hooks/use-contact-form'
import { subjectOptions, budgetRanges, timelineOptions, iconMap } from './contact-constants'

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
    progress,
    isSubmitting,
    handleInputChange,
    handleFieldChange,
    handleSubjectSelect,
    handleSubmit,
    setShowPrivacy,
    setAgreedToTerms,
  } = form

  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="typography-h3">Send a Message</h2>
        <div className="flex items-center gap-2">
          <div className="typography-small text-muted-foreground">Form Progress</div>
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-primary font-medium">{progress}%</div>
        </div>
      </div>

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

        {/* Company & Phone Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute left-3 top-3.5 text-muted-foreground">
              <Building className="w-5 h-5" />
            </div>
            <Input
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company"
              className="pl-12"
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-3.5 text-muted-foreground">
              <Phone className="w-5 h-5" />
            </div>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              aria-invalid={!!errors.phone}
              className="pl-12"
            />
            {errors.phone && <span role="alert" className="text-destructive text-sm mt-1 block">{errors.phone}</span>}
          </div>
        </div>

        {/* Subject Selection */}
        <div>
          <Label className="block text-sm font-medium text-muted-foreground mb-3">
            What can I help you with? *
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subjectOptions.map((option) => {
              const Icon = iconMap[option.icon as keyof typeof iconMap]
              const isSelected = formData.subject === option.value
              return (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  onClick={() => handleSubjectSelect(option.value)}
                  className={`h-auto p-4 flex-col gap-2 ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/20 bg-white/5 text-muted-foreground hover:border-primary/50 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{option.label}</span>
                </Button>
              )
            })}
          </div>
          {errors.subject && <span role="alert" className="text-destructive text-sm mt-1 block">{errors.subject}</span>}
        </div>

        {/* Timeline & Budget Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">Project Timeline</Label>
            <Select
              value={formData.timeline}
              onValueChange={(value) => handleFieldChange('timeline', value)}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/20 rounded-xl">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelineOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-2">Budget Range</Label>
            <Select
              value={formData.budget}
              onValueChange={(value) => handleFieldChange('budget', value)}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/20 rounded-xl">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent>
                {budgetRanges.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Message */}
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground z-10" />
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            aria-invalid={!!errors.message}
            className="pl-12 pr-4 bg-white/10 border-white/20 rounded-xl resize-none"
            placeholder="Tell me about your project or requirements... *"
          />
          <div className="absolute bottom-3 right-3 typography-small text-muted-foreground">
            {formData.message.length}/500
          </div>
          {errors.message && <span role="alert" className="text-destructive text-sm mt-1 block">{errors.message}</span>}
        </div>

        {/* Privacy Agreement */}
        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
          <Checkbox
            id="privacy"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
          />
          <div className="text-sm">
            <Label htmlFor="privacy" className="text-muted-foreground cursor-pointer font-normal">
              I agree to the{' '}
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="h-auto p-0 text-primary hover:text-primary/70 underline"
              >
                privacy policy
                {showPrivacy ? <EyeOff className="w-3 h-3 ml-1" /> : <Eye className="w-3 h-3 ml-1" />}
              </Button>
              {' '}and consent to processing my data for this inquiry. *
            </Label>
            {showPrivacy && (
              <div className="mt-2 p-3 bg-white/5 rounded-xs typography-small text-muted-foreground border border-white/10">
                Your information will be used solely to respond to your inquiry. We don&apos;t share personal data with third parties and you can request deletion at any time.
              </div>
            )}
            {errors.terms && <div role="alert" className="text-destructive text-sm mt-1">{errors.terms}</div>}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !agreedToTerms}
          size="lg"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-foreground font-semibold py-4 px-6 rounded-xl h-auto group"
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
        </Button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-2 text-success bg-success/10 p-4 rounded-xl"
          >
            <CheckCircle className="w-5 h-5" />
            Message sent successfully!
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
