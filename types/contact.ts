export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFormProps {
  initialValues?: Partial<ContactFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export interface ContactApiResponse {
  success: boolean
  message: string
  error?: string
  details?: Record<string, any>
}
