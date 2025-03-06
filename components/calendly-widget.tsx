"use client";

// Extend the Window interface to include Calendly
declare global {
  interface Window {
    Calendly?: any;
  }
}

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CalendlyWidget() {
  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Calendly once script is loaded
    script.onload = () => {
      if (window.Calendly) {
        console.log('Calendly script loaded successfully');
      }
    };

    return () => {
      // Find and remove the script
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

// Directly embed the Calendly inline widget using their recommended approach
    return (
      <Card className="w-full overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Schedule a Meeting</CardTitle>
          <CardDescription>
            Book a time slot that works for you using my online calendar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[700px]">
          <iframe
            src="https://calendly.com/rhudsontspr?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=0070f3"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule a meeting with Richard Hudson"
          />
        </CardContent>
      </Card>
    );
}
