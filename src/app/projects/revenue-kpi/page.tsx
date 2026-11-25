import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { analyticsDataService } from '@/lib/data-service/service'
import { monthlyRevenue2024, partnerGroupsData } from '@/app/projects/data/partner-analytics'

import { RevenueKPIClient } from './_components/RevenueKPIClient'
import { canonicalUrl, SITE_ORIGIN, ogImageUrl } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160, so search results show them
// whole. Figures come from the write-up (NarrativeSections Result section) and are
// checked by project-page-copy-sourced.test.ts, which reads these literals.
export const metadata = genMeta({
  title: 'Revenue KPI Dashboard Case Study',
  description:
    'Revenue KPI dashboard case study: CRM, billing and partner data unified into real-time dashboards, with $4.2M in added revenue and 94% forecast accuracy.',
  path: '/projects/revenue-kpi',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'revenue-kpi',
})

/**
 * Revenue KPI Dashboard - Server Component
 *
 * Data is fetched server-side and passed to the client component.
 * This eliminates client-side data generation delays (15-20s improvement).
 */
export default async function RevenueKPI() {
  // Fetch all analytics data on the server
  const analyticsData = await analyticsDataService.getAllAnalyticsData()
  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <ProjectJsonLd
        nonce={nonce}
        title="Revenue KPI Dashboard - Partner Analytics & Business Intelligence"
        description="Revenue KPI dashboard case study: CRM, billing and partner data unified into real-time dashboards, with $4.2M in added revenue and 94% forecast accuracy."
        slug="revenue-kpi"
        image={ogImageUrl({
          title: 'Revenue KPI Dashboard Case Study',
          subtitle: 'Revenue Operations Project',
          project: 'revenue-kpi',
        })}
        category="Business Intelligence"
        datePublished="2025-03-05T00:00:00-06:00"
        dateModified="2026-01-15T00:00:00-06:00"
        tags={[
          'Revenue Analytics',
          'Partner Management',
          'KPI Dashboard',
          'Business Intelligence',
          'Data Visualization',
          'Recharts',
          'React',
          'TypeScript',
        ]}
      />
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Revenue KPI Dashboard',
            url: canonicalUrl('/projects/revenue-kpi'),
          },
        ]}
      />
      <RevenueKPIClient
        yearOverYearData={analyticsData.yearOverYear}
        growthData={analyticsData.growth}
        topPartnersData={analyticsData.topPartners}
        monthlyRevenue={monthlyRevenue2024}
        partnerGroupsData={partnerGroupsData}
      />
    </>
  )
}
