import { generateMetadata } from '@/app/shared-metadata'
import ResumeViewClient from './resume-view-client'

export const metadata = generateMetadata(
  'Resume PDF | Richard Hudson',
  'View and download the complete resume of Richard Hudson, Revenue Operations Professional in Dallas-Fort Worth.',
  '/resume/view'
)

export const dynamic = 'force-dynamic'

export default function ResumeViewPage() {
  return <ResumeViewClient />
}
