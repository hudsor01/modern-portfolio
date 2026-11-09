import { headers } from 'next/headers'
import { generateMetadata } from '@/app/shared-metadata'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ResumePageContent from './_components/resume-page-content'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

export const metadata = generateMetadata(
  'Resume | Richard Hudson - Revenue Operations Professional',
  'Richard Hudson resume: Data Analyst at HomeVestors, over eight years in revenue operations and business systems at Thryv and six years as an Army IT specialist.',
  '/resume'
)

export default async function ResumePage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Resume', url: canonicalUrl('/resume') },
        ]}
      />
      <ResumePageContent />
    </>
  )
}
