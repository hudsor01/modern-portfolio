'use client';

import { Carousel } from '@/components/ui/carousel';
import type { CarouselImage, TransitionEffect } from '@/components/ui/carousel';

interface EffectCarouselProps {
  images: CarouselImage[];
  effect: TransitionEffect;
  height?: number | string;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
}

export function EffectCarousel({
  images,
  effect,
  height = 400,
  autoplay = true,
  autoplayDelay = 3000,
  className,
}: EffectCarouselProps) {
  return (
    <Carousel
      images={images}
      effect={effect}
      autoplay={autoplay}
      autoplayDelay={autoplayDelay}
      height={height}
      loop={true}
      className={className}
    />
  );
}
