"use client";

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CalendlyWidget() {
  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup function to remove script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Schedule a Meeting</CardTitle>
        <CardDescription>
          Book a time slot that works for you using my online calendar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/rhudsontspr?hide_landing_page_details=1&hide_gdpr_banner=1"
          style={{ minWidth: '320px', height: '700px' }}
        />
      </CardContent>
    </Card>
  );
}
