'use client'

import { useSwiper } from 'swiper/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavigationButtonProps {
  className?: string
}

interface PaginationProps {
  totalSlides: number
  activeIndex: number
  className?: string
}

const iconStyles =
  'group-hover:text-primary h-5 w-5 transition-all duration-300 group-hover:scale-110'

export function SwiperPrevButton({ className }: NavigationButtonProps) {
  const swiper = useSwiper()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full shadow-xs hover:shadow group', className)}
      onClick={() => swiper.slidePrev()}
      aria-label="Previous slide"
    >
      <ChevronLeft className={iconStyles} />
    </Button>
  )
}

export function SwiperNextButton({ className }: NavigationButtonProps) {
  const swiper = useSwiper()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full shadow-xs hover:shadow group', className)}
      onClick={() => swiper.slideNext()}
      aria-label="Next slide"
    >
      <ChevronRight className={iconStyles} />
    </Button>
  )
}

export function SwiperPagination({
  totalSlides,
  activeIndex,
  className,
}: PaginationProps) {
  const swiper = useSwiper()
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          className={cn(
            'h-2.5 w-2.5 rounded-full transition-all duration-300',
            activeIndex === index
              ? 'bg-primary scale-110 shadow-xs'
              : 'bg-primary/20 hover:bg-primary/40'
          )}
          onClick={() => swiper.slideTo(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={activeIndex === index ? 'true' : 'false'}
        />
      ))}
    </div>
  )
}
