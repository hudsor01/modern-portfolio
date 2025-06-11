'use client'

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useSwiper } from 'swiper/react'
import { cn } from '@/lib/utils'

interface SwiperButtonProps {
  className?: string
}

export function PrevButton({ className }: SwiperButtonProps) {
  const swiper = useSwiper()

  return (
    <button
      className={cn(
        'group hover:bg-primary/10 rounded-full p-2.5 shadow-xs transition-colors duration-300 hover:shadow',
        className
      )}
      onClick={() => swiper.slidePrev()}
      aria-label="Previous slide"
    >
      <ChevronLeft className="group-hover:text-primary h-5 w-5 transition-all duration-300 group-hover:scale-110" />
    </button>
  )
}

export function NextButton({ className }: SwiperButtonProps) {
  const swiper = useSwiper()

  return (
    <button
      className={cn(
        'group hover:bg-primary/10 rounded-full p-2.5 shadow-xs transition-colors duration-300 hover:shadow',
        className
      )}
      onClick={() => swiper.slideNext()}
      aria-label="Next slide"
    >
      <ChevronRight className="group-hover:text-primary h-5 w-5 transition-all duration-300 group-hover:scale-110" />
    </button>
  )
}

interface PaginationProps {
  totalSlides: number
  activeIndex: number
  className?: string
}

export function CustomPagination({ totalSlides, activeIndex, className }: PaginationProps) {
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

interface AutoplayControlProps {
  playing: boolean
  onToggleAction: () => void
  className?: string
}

export function AutoplayControl({ playing, onToggleAction, className }: AutoplayControlProps) {
  return (
    <button
      className={cn(
        'group hover:bg-primary/10 rounded-full p-2.5 shadow-xs transition-colors duration-300 hover:shadow',
        className
      )}
      onClick={onToggleAction}
      aria-label={playing ? 'Pause autoplay' : 'Start autoplay'}
    >
      {playing ? (
        <Pause className="group-hover:text-primary h-4 w-4 transition-all duration-300 group-hover:scale-110" />
      ) : (
        <Play className="group-hover:text-primary h-4 w-4 transition-all duration-300 group-hover:scale-110" />
      )}
    </button>
  )
}
