'use client'

import { notFound } from 'next/navigation'

// This is needed to handle any 404s that occur in this route group
export default function MainContentNotFound() {
  notFound()
}
