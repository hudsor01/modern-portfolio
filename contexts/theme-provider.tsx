import { HeroSectionStatic } from '@/components/hero-section-static';
import { CTASection } from '@/components/cta-section';

export const metadata = {
  title: 'Richard Hudson | Revenue Operations Professional',
  description:
    'Driving business growth through data-driven insights, process optimization, and strategic operational improvements.',
};

const themeColors = {
  primary: '#60a5fa', // blue-400
  primaryLight: '#93c5fd', // blue-300
  primaryDark: '#3b82f6', // blue-500
};

export default async function HomePage() {
  return (
    <main className="overflow-hidden bg-brown text-eggshell [&>section+section]:pt-0">
      {/* Static Hero Section */}
      <HeroSectionStatic />

      {/* CTA Section */}
      <CTASection buttonTextColor="text-primary-foreground" buttonBgColor="bg-primary" />
    </main>
  );
}
