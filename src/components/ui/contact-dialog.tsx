'use client'

import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-sonner-toast'
import { motion } from 'framer-motion'
import { Send, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { DialogFooter } from '@/components/ui/dialog'
import { ContactDialogProps } from '@/types/ui'

export function ContactDialog({ open, onCloseAction }: ContactDialogProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const { success, error } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      success('Message sent successfully!')
      setIsSuccess(true)
      setTimeout(() => {
        if (onCloseAction) onCloseAction()
        // Reset after dialog closes
        setTimeout(() => {
          setFormState({ name: '', email: '', message: '' })
          setIsSuccess(false)
        }, 300)
      }, 1500)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) { 
      error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCloseAction()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Get in Touch</DialogTitle>
        <DialogDescription>
          Fill out this form and I&apos;ll get back to you as soon as possible.
        </DialogDescription>

        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mb-1 text-xl font-semibold">Message Sent!</h3>
            <p className="text-muted-foreground">
              Thank you for reaching out. I&apos;ll respond to your inquiry shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="border-border bg-background focus:border-primary focus:ring-3-primary w-full rounded-md border px-3 py-2 text-sm outline-hidden focus:ring-1"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="border-border bg-background focus:border-primary focus:ring-3-primary w-full rounded-md border px-3 py-2 text-sm outline-hidden focus:ring-1"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                rows={4}
                className="border-border bg-background focus:border-primary focus:ring-3-primary w-full rounded-md border px-3 py-2 text-sm outline-hidden focus:ring-1"
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
