import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContactFormData } from '@/app/api/types'

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormData>
  variant: 'default' | 'minimal' | 'detailed'
  showOptionalFields: boolean
}

export function ContactFormFields({
  form,
  variant,
  showOptionalFields
}: ContactFormFieldsProps) {
  // Watch form values for dynamic behavior if needed
  // const formValues = form.watch()

  return (
    <div className="space-y-6">
      {/* Name and Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Name
                <span className="text-destructive">*</span>
                {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" aria-label="Error" />}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your full name"
                  required
                  minLength={2}
                  maxLength={50}
                  aria-invalid={!!fieldState.error}
                  aria-describedby={fieldState.error ? 'name-error' : 'name-hint'}
                  {...field}
                  className={cn(
                    'transition-colors duration-200',
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormControl>
              {!fieldState.error && (
                <FormDescription id="name-hint">
                  Enter your full name (2-50 characters)
                </FormDescription>
              )}
              {fieldState.error && (
                <FormMessage
                  id="name-error"
                  role="alert"
                  aria-live="polite"
                  aria-atomic="true"
                />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Email
                <span className="text-destructive">*</span>
                {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" aria-label="Error" />}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  required
                  maxLength={100}
                  aria-invalid={!!fieldState.error}
                  aria-describedby={fieldState.error ? 'email-error' : 'email-hint'}
                  {...field}
                  className={cn(
                    'transition-colors duration-200',
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormControl>
              {!fieldState.error && (
                <FormDescription id="email-hint">
                  We'll use this to get back to you
                </FormDescription>
              )}
              {fieldState.error && (
                <FormMessage
                  id="email-error"
                  role="alert"
                  aria-live="polite"
                  aria-atomic="true"
                />
              )}
            </FormItem>
          )}
        />
      </div>

      {/* Optional fields */}
      {showOptionalFields && (
        <>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Company
                    <span className="text-muted-foreground text-sm">(optional)</span>
                    {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" aria-label="Error" />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your company name"
                      maxLength={100}
                      aria-invalid={!!fieldState.error}
                      aria-describedby={fieldState.error ? 'company-error' : 'company-hint'}
                      {...field}
                      className={cn(
                        'transition-colors duration-200',
                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormControl>
                  {!fieldState.error && (
                    <FormDescription id="company-hint">
                      Help us understand your professional context
                    </FormDescription>
                  )}
                  {fieldState.error && (
                    <FormMessage
                      id="company-error"
                      role="alert"
                      aria-live="polite"
                      aria-atomic="true"
                    />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Phone
                    <span className="text-muted-foreground text-sm">(optional)</span>
                    {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" aria-label="Error" />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      maxLength={20}
                      aria-invalid={!!fieldState.error}
                      aria-describedby={fieldState.error ? 'phone-error' : 'phone-hint'}
                      {...field}
                      className={cn(
                        'transition-colors duration-200',
                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormControl>
                  {!fieldState.error && (
                    <FormDescription id="phone-hint">
                      For urgent matters or direct discussion
                    </FormDescription>
                  )}
                  {fieldState.error && (
                    <FormMessage
                      id="phone-error"
                      role="alert"
                      aria-live="polite"
                      aria-atomic="true"
                    />
                  )}
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {/* Subject */}
      <FormField
        control={form.control}
        name="subject"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Subject
              <span className="text-destructive">*</span>
              {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" aria-label="Error" />}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="What would you like to discuss?"
                required
                maxLength={100}
                aria-invalid={!!fieldState.error}
                aria-describedby={fieldState.error ? 'subject-error' : 'subject-hint'}
                {...field}
                className={cn(
                  'transition-colors duration-200',
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
              />
            </FormControl>
            {!fieldState.error && (
              <FormDescription id="subject-hint">
                Brief summary of your inquiry (max 100 characters)
              </FormDescription>
            )}
            {fieldState.error && (
              <FormMessage
                id="subject-error"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
              />
            )}
          </FormItem>
        )}
      />

      {/* Message */}
      <FormField
        control={form.control}
        name="message"
        render={({ field, fieldState }) => {
          const currentLength = field.value?.length || 0
          const maxLength = 1000
          const isNearLimit = currentLength > maxLength * 0.9

          return (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Message
                <span className="text-destructive">*</span>
                {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" aria-label="Error" />}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your professional inquiry, project opportunity, or how we might collaborate..."
                  required
                  minLength={10}
                  maxLength={1000}
                  aria-invalid={!!fieldState.error}
                  aria-describedby={fieldState.error ? 'message-error' : 'message-counter'}
                  className={cn(
                    "min-h-32 resize-none transition-colors duration-200",
                    variant === 'detailed' && "min-h-48",
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <div>
                  {!fieldState.error && (
                    <FormDescription className="text-xs">
                      Provide details about your inquiry (10-1000 characters)
                    </FormDescription>
                  )}
                  {fieldState.error && (
                    <FormMessage
                      id="message-error"
                      role="alert"
                      aria-live="polite"
                      aria-atomic="true"
                    />
                  )}
                </div>
                {variant === 'detailed' && (
                  <div
                    id="message-counter"
                    className={cn(
                      'text-xs font-medium transition-colors duration-200',
                      isNearLimit ? 'text-orange-500' : 'text-muted-foreground'
                    )}
                    role="status"
                    aria-live="polite"
                    aria-label={`${currentLength} characters out of ${maxLength}`}
                  >
                    {currentLength}/{maxLength}
                  </div>
                )}
              </div>
            </FormItem>
          )
        }}
      />
    </div>
  )
}