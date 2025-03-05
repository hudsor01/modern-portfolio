'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

export function WebVitals() {
	useReportWebVitals(metric => {
		// Log to console in development
		if (process.env.NODE_ENV === 'development') {
			console.log(`Web Vital: ${metric.name}`, {
				value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
				delta: Math.round(metric.delta),
				id: metric.id,
			})
		}

		// Send to Vercel Analytics
		const analyticsId = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID
		if (analyticsId) {
			const body = {
				dsn: analyticsId,
				id: metric.id,
				page: window.location.pathname,
				url: window.location.href,
				user_agent: window.navigator.userAgent,
				name: metric.name,
				value: metric.value.toString(),
				delta: metric.delta.toString(),
				event_label: metric.id,
				event_category: 'Web Vitals',
				non_interaction: true,
			}

			// Use `navigator.sendBeacon()` if available
			const sendBeacon = (url: string, data: any) => {
				if (navigator.sendBeacon) {
					const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
					navigator.sendBeacon(url, blob)
				} else {
					fetch(url, {
						body: JSON.stringify(data),
						method: 'POST',
						keepalive: true,
						headers: {
							'Content-Type': 'application/json',
						},
					})
				}
			}

			sendBeacon('/api/vitals', body)
		}
	})

	return <VercelAnalytics />
}
