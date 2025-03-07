'use client';

import dynamic from 'next/dynamic';

// Load the custom cursor component dynamically to avoid SSR issues
const CustomCursor = dynamic(() => import('@/components/custom-cursor'), {
  ssr: false,
});

export default function CursorProvider() {
  return <CustomCursor />;
}
