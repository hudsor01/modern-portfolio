// Augment Next.js types
import 'next';
import type { Route } from 'next';
import type { UrlObject } from 'url';

// Helper type for href props in Next.js 15+
export type NextLinkHref = Route<string> | UrlObject;

declare module 'next/types' {
  interface PageProps {
    params: Record<string, string>;
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}
