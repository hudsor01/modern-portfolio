import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import SalesEnablementPageContent from './_components/SalesEnablementPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Sales Enablement & Coaching Platform',
  description:
    'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45% across a 125-person sales organization.',
  path: '/projects/sales-enablement',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
})

export default async function SalesEnablementPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Sales Enablement & Coaching Platform',
            url: canonicalUrl('/projects/sales-enablement'),
          },
        ]}
      />
      <SalesEnablementPageContent />
    </>
  )
}
