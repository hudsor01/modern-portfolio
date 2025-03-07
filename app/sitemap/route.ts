import { NextResponse } from 'next/server';

export async function GET() {
  // This file only exists to redirect to the correct sitemap
  // The actual sitemap functionality is in /app/sitemap.ts
  return NextResponse.redirect(new URL('/sitemap.xml', 'https://richardwhudsonjr.com'));
}
