import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ChurnPageContent from './_components/ChurnPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Partner Churn Prediction Model Case Study',
  description:
    'Partner churn case study: a prediction model with 89% accuracy that cut quarterly partner churn from 14.2% to 10.9% and lifted high-value retention to 92%.',
  path: '/projects/churn-retention',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'churn-retention',
})

export default async function ChurnRetentionPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Partner Churn Prediction Model',
            url: canonicalUrl('/projects/churn-retention'),
          },
        ]}
      />
      <ChurnPageContent />
    </>
  )
}
