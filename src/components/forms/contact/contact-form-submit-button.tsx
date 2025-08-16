import { Button } from '@/components/ui/button'
import { CheckCircle, Send, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactFormSubmitButtonProps {
  isSubmitting: boolean
  isBlocked?: boolean
  submitState: 'idle' | 'success' | 'error'
}

export function ContactFormSubmitButton({
  isSubmitting,
  isBlocked,
  submitState
}: ContactFormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        'w-full relative',
        submitState === 'success' && 'bg-green-600 hover:bg-green-700',
        submitState === 'error' && 'bg-destructive hover:bg-destructive/90'
      )}
      disabled={isSubmitting || isBlocked}
    >
      <span className="flex items-center gap-2">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : submitState === 'success' ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Message Sent!
          </>
        ) : submitState === 'error' ? (
          <>
            <AlertCircle className="h-4 w-4" />
            Try Again
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </span>
    </Button>
  )
}