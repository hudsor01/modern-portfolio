import { Metadata } from 'next'
import ChurnPageContent from './_components/ChurnPageContent'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Customer Churn & Retention Analysis - Predictive Analytics | Richard Hudson',
  description: 'Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization.',
  openGraph: {
    title: 'Customer Churn & Retention Analysis - Predictive Analytics',
    description: 'Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization.',
    url: 'https://richardwhudsonjr.com/projects/churn-retention',
    siteName: 'Richard Hudson',
    images: [{ url: 'https://richardwhudsonjr.com/og-image.png', width: 1200, height: 630, alt: 'Customer Churn & Retention Analysis - Predictive Analytics' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Churn & Retention Analysis - Predictive Analytics',
    description: 'Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization.',
    images: ['https://richardwhudsonjr.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/churn-retention',
  },
}

export default function ChurnRetentionPage() {
  return <ChurnPageContent />
}
