import React from 'react'
import { Metadata } from 'next'
import ResumeViewClient from './resume-view-client'

export const metadata: Metadata = {
  title: 'Richard Hudson - Resume PDF',
  description: 'View and download the complete resume of Richard Hudson, Revenue Operations Professional',
}

export const dynamic = 'force-dynamic'

export default function ResumeViewPage() {
  return <ResumeViewClient />
}
