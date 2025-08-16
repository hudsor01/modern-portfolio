'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Eye, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { BlogPostFormData } from '@/hooks/use-blog-post-form'

interface FormActionsProps {
  form: UseFormReturn<BlogPostFormData>
  isLoading?: boolean
  previewMode: boolean
  onPreview: () => void
  onSaveDraft?: () => void
  onCancel?: () => void
}

export function FormActions({
  form,
  isLoading = false,
  previewMode,
  onPreview,
  onSaveDraft,
  onCancel
}: FormActionsProps) {
  const formState = form.formState
  const hasErrors = Object.keys(formState.errors).length > 0
  const isDirty = formState.isDirty

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 flex items-center justify-between gap-4">
      {/* Form Status */}
      <div className="flex items-center gap-3">
        {hasErrors ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {Object.keys(formState.errors).length} Error{Object.keys(formState.errors).length !== 1 ? 's' : ''}
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Form Valid
          </Badge>
        )}
        
        {isDirty && (
          <Badge variant="outline">
            Unsaved Changes
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}

        {onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isLoading || hasErrors}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={onPreview}
          disabled={isLoading || hasErrors}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {previewMode ? 'Edit' : 'Preview'}
        </Button>

        <Button
          type="submit"
          disabled={isLoading || hasErrors}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Publishing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Publish Post
            </>
          )}
        </Button>
      </div>
    </div>
  )
}