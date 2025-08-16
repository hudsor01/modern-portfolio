import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
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
                {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" />}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your full name" 
                  {...field}
                  className={cn(
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
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
                {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" />}
              </FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="your.email@company.com" 
                  {...field}
                  className={cn(
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Optional fields */}
      {showOptionalFields && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company <span className="text-muted-foreground text-sm">(optional)</span>
                  </FormLabel>
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
                  <FormLabel>
                    Phone <span className="text-muted-foreground text-sm">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="+1 (555) 123-4567" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
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
              {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" />}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="What would you like to discuss?" 
                {...field}
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Message */}
      <FormField
        control={form.control}
        name="message"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Message
              {fieldState.error && <AlertCircle className="h-4 w-4 text-destructive" />}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell me about your project, goals, and how I can help..."
                className={cn(
                  "min-h-32 resize-none",
                  variant === 'detailed' && "min-h-48",
                  fieldState.error && "border-destructive focus-visible:ring-destructive"
                )}
                {...field}
              />
            </FormControl>
            <FormMessage />
            {variant === 'detailed' && (
              <div className="text-xs text-muted-foreground">
                {field.value?.length || 0} characters
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}