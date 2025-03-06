'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

export function WebVitals() {
  // Use a very simple implementation to avoid serialization issues
  useReportWebVitals((metric) => {
    // Just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vital: ${metric.name}`, metric.value);
    }
  });

  return <VercelAnalytics />;
}
