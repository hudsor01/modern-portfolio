import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl md:text-8xl font-bold mb-6 text-[#8DA9C4]">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button asChild className="bg-[#8DA9C4] hover:bg-[#7A9BB9]">
          <Link href={'/' as Route<string>}>Go Home</Link>
        </Button>
        <Button asChild variant="outline" className="border-[#8DA9C4] text-[#8DA9C4]">
          <Link href={'/contact' as Route<string>}>Contact Me</Link>
        </Button>
      </div>
    </div>
  );
}
