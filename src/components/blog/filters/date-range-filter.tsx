'use client'

import { m as motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { MotionVariant } from '@/types/ui'

interface DateRangeFilterProps {
  dateRange: { from?: Date; to?: Date }
  isLoading: boolean
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void
  itemVariants: MotionVariant
}

export function DateRangeFilter({
  dateRange,
  isLoading,
  onDateRangeChange,
  itemVariants
}: DateRangeFilterProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-3 md:col-span-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        Date Range
      </Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  )
}