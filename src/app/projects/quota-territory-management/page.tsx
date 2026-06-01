import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import QuotaTerritoryPageContent from './_components/QuotaTerritoryPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Intelligent Quota Management & Territory Planning',
  description:
    'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
  path: '/projects/quota-territory-management',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
})

export default async function QuotaTerritoryManagementPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Intelligent Quota Management & Territory Planning',
            url: canonicalUrl('/projects/quota-territory-management'),
          },
        ]}
      />
      <QuotaTerritoryPageContent />
    </>
  )
}
