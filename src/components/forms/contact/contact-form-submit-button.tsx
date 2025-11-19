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
  const isDisabled = isSubmitting || isBlocked

  const getAriaLabel = () => {
    if (isSubmitting) return 'Sending message'
    if (submitState === 'success') return 'Message sent successfully'
    if (submitState === 'error') return 'Try sending again'
    if (isBlocked) return 'Rate limit exceeded, please wait'
    return 'Send message'
  }

  return (
    <Button
      type="submit"
      className={cn(
        'w-full relative',
        submitState === 'success' && 'bg-green-600 hover:bg-green-700',
        submitState === 'error' && 'bg-destructive hover:bg-destructive/90'
      )}
      disabled={isDisabled}
      aria-busy={isSubmitting}
      aria-disabled={isDisabled}
      aria-label={getAriaLabel()}
    >
      <span className="flex items-center gap-2">
        {isSubmitting ? (
          <>
            <Loader2
              className="h-4 w-4 animate-spin"
              aria-hidden="true"
            />
            Sending...
          </>
        ) : submitState === 'success' ? (
          <>
            <CheckCircle
              className="h-4 w-4"
              aria-hidden="true"
            />
            Message Sent!
          </>
        ) : submitState === 'error' ? (
          <>
            <AlertCircle
              className="h-4 w-4"
              aria-hidden="true"
            />
            Try Again
          </>
        ) : (
          <>
            <Send
              className="h-4 w-4"
              aria-hidden="true"
            />
            Send Message
          </>
        )}
      </span>
    </Button>
  )
}