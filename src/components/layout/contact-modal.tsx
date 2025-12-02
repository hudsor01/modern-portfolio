'use client'

import { useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ContactForm } from '@/app/contact/components/contact-form'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const handleSuccess = useCallback(() => {
    setTimeout(() => onClose(), 2000)
  }, [onClose])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Get in Touch</DialogTitle>
          <DialogDescription>
            Connect with me for professional opportunities or revenue operations discussions.
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          variant="embedded"
          onSuccess={handleSuccess}
          showOptionalFields
        />
      </DialogContent>
    </Dialog>
  )
}
