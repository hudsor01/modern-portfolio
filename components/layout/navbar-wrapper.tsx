'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // Only render Navbar on non-homepage routes
  if (isHomePage) {
    return null;
  }
  
  return <Navbar />;
}
