'use client'

import * as React from 'react'
import { DayPicker, DayButtonProps } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ko}
      showOutsideDays={showOutsideDays}
      className={cn('w-full', className)}
      classNames={{
        months: 'flex flex-col w-full relative',
        month: 'w-full space-y-4',
        month_caption: 'flex justify-center py-2 items-center w-full',
        caption_label: 'text-base font-semibold text-charcoal',
        nav: 'absolute left-0 right-0 top-0 flex justify-between px-2 py-2',
        button_previous: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'h-8 w-8 z-10'
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'h-8 w-8 z-10'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex w-full',
        weekday: 'flex-1 text-charcoal/60 font-medium text-sm py-2 text-center',
        week: 'flex w-full',
        day: 'flex-1 aspect-square text-center text-sm p-0 relative',
        day_button: '',
        range_end: 'day-range-end',
        selected: '',
        today: '',
        outside: '[&>button]:text-charcoal/30',
        disabled: '[&>button]:text-charcoal/30',
        range_middle: '',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
          return <Icon className="h-5 w-5" />
        },
        DayButton: ({ day, modifiers, ...buttonProps }: DayButtonProps) => {
          const isTodayDate = isToday(day.date)
          const isSelected = modifiers.selected

          return (
            <button
              {...buttonProps}
              className={cn(
                'w-full h-full flex items-center justify-center rounded-lg',
                'font-normal transition-colors',
                'hover:bg-blush-pink/10 focus:bg-blush-pink/10',
                // 기본 텍스트 색상
                'text-charcoal',
                // 오늘 날짜 (선택 안 됨)
                isTodayDate && !isSelected && 'bg-blush-pink/30 font-semibold',
                // 오늘 날짜 (선택됨)
                isTodayDate && isSelected && 'bg-blush-pink/50 font-semibold',
                // 다른 날짜 선택됨
                !isTodayDate && isSelected && 'bg-blush-pink text-charcoal hover:bg-blush-pink'
              )}
            />
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
