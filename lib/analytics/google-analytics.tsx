'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Google Analytics ID
const GA_MEASUREMENT_ID = 'G-0N9PQYN0YD';

/**
 * Google Analytics Component
 *
 * Implements Google Analytics 4 with:
 * - Automatic page view tracking
 * - Privacy controls
 * - Consent management
 */
export function GoogleAnalytics({
  consentGiven = true
}: {
  consentGiven?: boolean
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Track page views
  useEffect(() => {
    if (!consentGiven || !hasInitialized) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Send pageview event to Google Analytics
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams, consentGiven, hasInitialized]);

  // Initialize GA when consent is given
  useEffect(() => {
    if (consentGiven && !hasInitialized && typeof window !== 'undefined') {
      setHasInitialized(true);
    }
  }, [consentGiven, hasInitialized]);

  // Don't render scripts if consent is not given
  if (!consentGiven) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          console.log('Google Analytics script loaded successfully');
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              transport_type: 'beacon',
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Track custom events in Google Analytics
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Declare global gtag function
declare global {
  interface Window {
    gtag: (
      command: string,
      target: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

// Default export for backward compatibility
export default GoogleAnalytics;
