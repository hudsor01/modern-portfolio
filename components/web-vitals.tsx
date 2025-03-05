'use client'

import { useReportWebVitals } from 'next/web-vitals'

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

		// You can send metrics to your analytics platform here
		// Example: sending to Google Analytics
		// if (window.gtag) {
		//   window.gtag('event', metric.name, {
		//     value: metric.value,
		//     event_category: 'Web Vitals',
		//     event_label: metric.id,
		//     non_interaction: true,
		//   });
		// }
	})

	return null
}
