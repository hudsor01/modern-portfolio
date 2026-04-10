import { Metadata } from 'next'
import CLVPageContent from './_components/CLVPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Customer Lifetime Value Predictive Analytics Dashboard',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Customer Lifetime Value Predictive Analytics Dashboard | Richard Hudson',
  description: 'Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.',
  openGraph: {
    title: 'Customer Lifetime Value Predictive Analytics Dashboard',
    description: 'Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.',
    url: 'https://richardwhudsonjr.com/projects/customer-lifetime-value',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Customer Lifetime Value Predictive Analytics Dashboard' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Lifetime Value Predictive Analytics Dashboard',
    description: 'Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/customer-lifetime-value',
  },
}

export default function CustomerLifetimeValuePage() {
  return <CLVPageContent />
}
