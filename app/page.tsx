import { HeroSectionStatic } from '@/components/hero-section-static';

export const metadata = {
  title: 'Richard Hudson | Revenue Operations Professional',
  description:
    'Driving business growth through data-driven insights, process optimization, and strategic operational improvements.',
};

export default async function HomePage() {
  return (
    <main>
      {/* Static Hero Section */}
      <HeroSectionStatic />
    </main>
  );
}
