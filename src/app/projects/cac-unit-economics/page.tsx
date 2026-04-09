import { Metadata } from 'next'
import CACPageContent from './_components/CACPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard | Richard Hudson',
  description: 'Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.',
  openGraph: {
    title: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard',
    description: 'Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.',
    url: 'https://richardwhudsonjr.com/projects/cac-unit-economics',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard',
    description: 'Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/cac-unit-economics',
  },
}

export default function CACUnitEconomicsPage() {
  return <CACPageContent />
}
