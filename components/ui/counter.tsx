'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ScrollFade } from './scroll-fade';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  title: string;
  description?: string;
}

export function Counter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  title,
  description,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        const percentage = Math.min(progress / duration, 1);
        setCount(Math.floor(end * percentage));

        if (progress < duration) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isInView, end, duration]);

  return (
    <ScrollFade>
      <div ref={ref} className="text-center">
        <div className="text-3xl font-bold md:text-4xl">
          {prefix}
          {count}
          {suffix}
        </div>
        <h3 className="mt-2 font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
    </ScrollFade>
  );
}
