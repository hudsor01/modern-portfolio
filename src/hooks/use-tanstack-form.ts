import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { zodValidator } from '@/lib/forms/tanstack-validators'

/**
 * Hook to create a TanStack form with Zod validation
 */
export function useTanStackForm<T extends Record<string, any>>(options: {
  defaultValues: T
  validationSchema?: Record<keyof T, z.ZodType<any>>
  onSubmit: (values: T) => Promise<void> | void
  onError?: (error: Error) => void
}) {
  const validators = options.validationSchema
    ? Object.entries(options.validationSchema).reduce(
        (acc, [key, schema]) => {
          acc[key] = () => zodValidator(schema)
          return acc
        },
        {} as Record<string, () => any>
      )
    : {}

  const form = useForm({
    defaultValues: options.defaultValues,
    validators,
    onSubmit: async ({ value }: { value: T }) => {
      try {
        await options.onSubmit(value)
      } catch (error) {
        if (error instanceof Error) {
          options.onError?.(error)
        }
      }
    },
  })

  return form
}

/**
 * Hook for contact form with built-in validation
 */
export function useContactForm(
  onSubmit: (values: {
    name: string
    email: string
    subject: string
    message: string
    company?: string
    phone?: string
  }) => Promise<void> | void,
  onError?: (error: Error) => void
) {
  return useTanStackForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      company: '',
      phone: '',
    },
    validationSchema: {
      name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
      email: z.string().email('Please enter a valid email address'),
      subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must not exceed 100 characters'),
      message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must not exceed 1000 characters'),
      company: z.string().max(100, 'Company name must not exceed 100 characters').optional().or(z.literal('')),
      phone: z.string()
        .regex(/^[\d\s\-\+\(\)\.]*$/, 'Please enter a valid phone number')
        .max(20, 'Phone number must not exceed 20 characters')
        .optional()
        .or(z.literal('')),
    },
    onSubmit,
    onError,
  })
}
