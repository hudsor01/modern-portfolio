import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { siteConfig } from '@/lib/site'
import { analyticsDataService } from '@/lib/data-service/service'
import {
  monthlyRevenue2024,
  partnerGroupsData,
} from '@/app/projects/data/partner-analytics'

import { RevenueKPIClient } from './_components/RevenueKPIClient'

export const dynamic = 'force-static'

/**
 * Revenue KPI Dashboard - Server Component
 *
 * Data is fetched server-side and passed to the client component.
 * This eliminates client-side data generation delays (15-20s improvement).
 */
export default async function RevenueKPI() {
  const nonce = (await headers()).get('x-nonce')

  // Fetch all analytics data on the server
  const analyticsData = await analyticsDataService.getAllAnalyticsData()

  return (
    <>
      <ProjectJsonLd
        title="Revenue KPI Dashboard - Partner Analytics & Business Intelligence"
        description="Real-time revenue analytics dashboard featuring partner performance metrics, growth trends, and business intelligence for data-driven decision making. Built with React, TypeScript, and Recharts."
        slug="revenue-kpi"
        category="Business Intelligence"
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
        nonce={nonce}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: 'Revenue KPI Dashboard', url: `${siteConfig.url}/projects/revenue-kpi` },
        ]}
        nonce={nonce}
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
