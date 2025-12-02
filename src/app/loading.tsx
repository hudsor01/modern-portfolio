'use client'

import { m } from 'framer-motion'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <m.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-16 h-16">
          <m.div
            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="mt-4 text-muted-foreground dark:text-muted-foreground">Loading...</p>
      </m.div>
    </div>
  )
}