'use client'

import React, { useEffect, useCallback } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ShadcnContactForm } from '@/app/contact/components/shadcn-contact-form'
import { Button } from '@/components/ui/button'
import { ProfessionalCard, ProfessionalCardHeader, ProfessionalCardTitle, ProfessionalCardDescription, ProfessionalCardContent } from '@/components/ui/professional-card'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  // Handle escape key press
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      onClose()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSuccess = useCallback(() => {
    // Auto-close modal after successful submission
    setTimeout(() => {
      onClose()
    }, TIMING_CONSTANTS.AUTO_SAVE_DISPLAY)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TIMING_CONSTANTS.DROPDOWN_ANIMATION / 1000 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: TIMING_CONSTANTS.MODAL_ANIMATION / 1000
              }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Professional Modal Container */}
              <ProfessionalCard variant="elevated" size="xl" className="max-w-2xl mx-auto">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all duration-200"
                  onClick={onClose}
                  aria-label="Close contact form"
                >
                  <X size={20} />
                </Button>

                <ProfessionalCardHeader className="text-center pb-6">
                  <ProfessionalCardTitle className="text-2xl md:text-3xl font-bold mb-3">
                    Professional Connect
                  </ProfessionalCardTitle>
                  <ProfessionalCardDescription className="text-base max-w-md mx-auto">
                    Connect with me for professional opportunities, networking, or revenue operations discussions.
                  </ProfessionalCardDescription>
                </ProfessionalCardHeader>

                <ProfessionalCardContent className="space-y-6">
                  {/* shadcn/ui Contact Form */}
                  <ShadcnContactForm
                    onSuccess={handleSuccess}
                    showOptionalFields={true}
                    variant="detailed"
                    title="Professional Connect"
                    description="Connect with me for professional opportunities, networking, or revenue operations discussions."
                    enableAutoSave={true}
                    className="border-0 shadow-none"
                  />

                  {/* Professional Footer */}
                  <div className="pt-6 border-t border-slate-700/50">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm">
                        <span className="font-medium">Response Time:</span> Within 24 hours
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        All conversations are confidential and professional
                      </p>
                    </div>
                  </div>
                </ProfessionalCardContent>
              </ProfessionalCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}