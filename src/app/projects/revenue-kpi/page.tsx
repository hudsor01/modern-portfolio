import { Metadata } from 'next'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { analyticsDataService } from '@/lib/data-service/service'
import {
  monthlyRevenue2024,
  partnerGroupsData,
} from '@/app/projects/data/partner-analytics'

import { RevenueKPIClient } from './_components/RevenueKPIClient'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Revenue KPI Dashboard - Partner Analytics & Business Intelligence',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Revenue KPI Dashboard - Partner Analytics & Business Intelligence | Richard Hudson',
  description: 'Real-time revenue analytics dashboard featuring partner performance metrics, growth trends, and business intelligence for data-driven decision making. Built with React, TypeScript, and Recharts.',
  openGraph: {
    title: 'Revenue KPI Dashboard - Partner Analytics & Business Intelligence',
    description: 'Real-time revenue analytics dashboard featuring partner performance metrics, growth trends, and business intelligence for data-driven decision making. Built with React, TypeScript, and Recharts.',
    url: 'https://richardwhudsonjr.com/projects/revenue-kpi',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Revenue KPI Dashboard - Partner Analytics & Business Intelligence' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue KPI Dashboard - Partner Analytics & Business Intelligence',
    description: 'Real-time revenue analytics dashboard featuring partner performance metrics, growth trends, and business intelligence for data-driven decision making. Built with React, TypeScript, and Recharts.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/revenue-kpi',
  },
}

/**
 * Revenue KPI Dashboard - Server Component
 *
 * Data is fetched server-side and passed to the client component.
 * This eliminates client-side data generation delays (15-20s improvement).
 */
export default async function RevenueKPI() {
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
