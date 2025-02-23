import { generateProjectsFeed } from '@/lib/rss';
import { NextResponse } from 'next/server';

export async function GET() {
  const feed = await generateProjectsFeed();
  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

