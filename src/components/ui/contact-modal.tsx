'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { EnhancedContactForm } from '@/components/ui/enhanced-contact-form'
import { Button } from '@/components/ui/button'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

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

  const handleSuccess = () => {
    // Auto-close modal after successful submission
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
                duration: 0.3 
              }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Container */}
              <div className="relative bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-blue-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                {/* Subtle background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-3xl" />
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                  onClick={onClose}
                  aria-label="Close contact form"
                >
                  <X size={24} />
                </Button>

                {/* Modal Content */}
                <div className="relative z-10 p-8 overflow-y-auto max-h-[90vh]">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 
                      id="contact-modal-title"
                      className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent mb-4"
                    >
                      Let's Work Together
                    </h2>
                    <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                      Ready to optimize your revenue operations? Let's discuss your project and goals.
                    </p>
                  </div>

                  {/* Enhanced Contact Form */}
                  <EnhancedContactForm
                    onSuccess={handleSuccess}
                    showOptionalFields={true}
                    variant="detailed"
                    buttonText="Send Message"
                    successMessage="Thank you! I'll get back to you within 24 hours."
                    className="space-y-6"
                  />

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="text-center text-gray-400 text-sm">
                      <p>
                        Typically respond within 24 hours • All conversations are confidential
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}