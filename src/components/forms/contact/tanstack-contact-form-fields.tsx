'use client'

import React from 'react'
import { FormApi } from '@tanstack/react-form'
import { Separator } from '@/components/ui/separator'
import type { ContactFormData } from '@/app/api/types'
import {
  TanStackInputField,
  TanStackTextareaField,
} from '@/components/forms/tanstack-form-fields'

interface TanStackContactFormFieldsProps {
  form: FormApi<ContactFormData, any>
  variant: 'default' | 'minimal' | 'detailed'
  showOptionalFields: boolean
}

export function TanStackContactFormFields({
  form,
  variant,
  showOptionalFields
}: TanStackContactFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Name and Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <form.Field
          name="name"
          children={(field: any) => (
            <TanStackInputField
              field={field}
              label="Name"
              description="Enter your full name (2-50 characters)"
              placeholder="Your full name"
              required
              minLength={2}
              maxLength={50}
              containerClassName="space-y-2"
            />
          )}
        />

        <form.Field
          name="email"
          children={(field: any) => (
            <TanStackInputField
              field={field}
              type="email"
              label="Email"
              description="We'll use this to get back to you"
              placeholder="your.email@company.com"
              required
              maxLength={100}
              containerClassName="space-y-2"
            />
          )}
        />
      </div>

      {/* Optional fields */}
      {showOptionalFields && (
        <>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="company"
              children={(field: any) => (
                <TanStackInputField
                  field={field}
                  label="Company"
                  description="Help us understand your professional context"
                  placeholder="Your company name"
                  maxLength={100}
                  containerClassName="space-y-2"
                />
              )}
            />

            <form.Field
              name="phone"
              children={(field: any) => (
                <TanStackInputField
                  field={field}
                  type="tel"
                  label="Phone"
                  description="For urgent matters or direct discussion"
                  placeholder="+1 (555) 123-4567"
                  maxLength={20}
                  containerClassName="space-y-2"
                />
              )}
            />
          </div>
        </>
      )}

      {/* Subject */}
      <form.Field
        name="subject"
        children={(field: any) => (
          <TanStackInputField
            field={field}
            label="Subject"
            description="Brief summary of your inquiry (max 100 characters)"
            placeholder="What would you like to discuss?"
            required
            maxLength={100}
            containerClassName="space-y-2"
          />
        )}
      />

      {/* Message */}
      <form.Field
        name="message"
        children={(field: any) => (
          <TanStackTextareaField
            field={field}
            label="Message"
            description="Provide details about your inquiry (10-1000 characters)"
            placeholder="Tell me about your professional inquiry, project opportunity, or how we might collaborate..."
            required
            minLength={10}
            maxLength={1000}
            rows={variant === 'detailed' ? 8 : 4}
            showCharacterCount={variant === 'detailed'}
            containerClassName="space-y-2"
          />
        )}
      />
    </div>
  )
}
