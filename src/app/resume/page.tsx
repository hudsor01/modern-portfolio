import { generateMetadata } from '@/app/shared-metadata'
import ResumePageContent from './_components/resume-page-content'

export const dynamic = 'force-static'

export const metadata = generateMetadata(
  'Resume | Richard Hudson - Revenue Operations Professional',
  'Richard Hudson resume: 10+ years Revenue Operations experience. Expert in Salesforce, HubSpot, Tableau, SQL. Proven track record: $4.8M+ revenue generated, 432% growth achieved. Download PDF resume.',
  '/resume'
)

export default function ResumePage() {
  return <ResumePageContent />
}
