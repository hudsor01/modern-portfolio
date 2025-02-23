import { generateBlogFeed } from '@/lib/rss';
import { NextResponse } from 'next/server';

export async function GET() {
  const feed = await generateBlogFeed();
  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

