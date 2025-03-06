// Augment Next.js types
import 'next';

declare module 'next/types' {
  interface PageProps {
    params: Record<string, string>;
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}
