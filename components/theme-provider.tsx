'use client';

import { useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Properly type the props based on next-themes requirements
type ThemeProviderProps = {
  children: ReactNode;
  [prop: string]: any;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure theme attributes are only rendered client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
