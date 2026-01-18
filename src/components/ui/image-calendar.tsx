'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDate,
  getMonth,
} from 'date-fns'
import { cn } from '@/lib/utils'

// 스타일별 설정
export interface CalendarStyleConfig {
  id: number
  dateExt: 'svg' | 'png'
  monthExt?: 'png' | 'svg'
  hasDates?: boolean // dates 폴더 존재 여부 (없으면 스타일 1 사용)
}

export const CALENDAR_STYLES: CalendarStyleConfig[] = [
  { id: 1, dateExt: 'svg', monthExt: 'png', hasDates: true },
  { id: 2, dateExt: 'png', monthExt: 'png', hasDates: true },
  { id: 3, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 4, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 5, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 6, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 7, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 8, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 9, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 10, dateExt: 'png', monthExt: 'png', hasDates: false },
  { id: 11, dateExt: 'png', monthExt: 'png', hasDates: false },
]

// 에셋 경로 헬퍼
export const getMonthImagePath = (styleId: number, month: number, ext: 'png' | 'svg' = 'png') =>
  `/assets/calendar/months/calendar-months/${styleId}/${month}.${ext}`

export const getDateImagePath = (styleId: number, date: number, ext: 'svg' | 'png' = 'svg') => {
  const config = getStyleConfig(styleId)
  // dates 폴더가 없는 스타일은 스타일 1의 dates 사용
  const effectiveStyleId = config.hasDates ? styleId : 1
  const effectiveExt = config.hasDates ? ext : 'svg'
  return `/assets/calendar/months/calendar-months/${effectiveStyleId}/dates/${date}.${effectiveExt}`
}

// 요일 이미지 경로 (SUN, MON, TUE, WED, THU, FRI, SAT)
export const WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

export const getWeekdayImagePath = (
  styleId: number,
  weekday: string,
  ext: 'svg' | 'png' = 'png'
) => {
  const config = getStyleConfig(styleId)
  const effectiveStyleId = config.hasDates ? styleId : 1
  return `/assets/calendar/months/calendar-months/${effectiveStyleId}/dates/${weekday}.${ext}`
}

export const getStyleConfig = (styleId: number): CalendarStyleConfig => {
  return CALENDAR_STYLES.find((s) => s.id === styleId) || CALENDAR_STYLES[0]
}

// 요일 헤더 (일~토)
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export interface ImageCalendarProps {
  styleId: number
  month: Date
  selectedDate?: Date
  onSelect?: (date: Date) => void
  showOutsideDays?: boolean
  className?: string
  weekdayClassName?: string
  dateClassName?: string
  selectedClassName?: string
}

export function ImageCalendar({
  styleId,
  month,
  selectedDate,
  onSelect,
  showOutsideDays = false,
  className,
  weekdayClassName,
  dateClassName,
  selectedClassName,
}: ImageCalendarProps) {
  const styleConfig = getStyleConfig(styleId)

  // 달력 그리드 계산
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // 일요일 시작
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // 6주로 맞추기 (42일)
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const monthNumber = getMonth(month) + 1 // 1-12

  return (
    <div className={cn('w-full', className)}>
      {/* 월 헤더 */}
      <div className="flex justify-center mb-4">
        <Image
          src={getMonthImagePath(styleId, monthNumber, styleConfig.monthExt)}
          alt={`${monthNumber}월`}
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center text-sm font-medium py-1',
              index === 0 && 'text-red-400', // 일요일
              index === 6 && 'text-blue-400', // 토요일
              weekdayClassName
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isCurrentMonth = isSameMonth(day, month)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const dateNum = getDate(day)

            // outside days 처리
            if (!isCurrentMonth && !showOutsideDays) {
              return <div key={`${weekIndex}-${dayIndex}`} className="aspect-square" />
            }

            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                type="button"
                onClick={() => onSelect?.(day)}
                disabled={!isCurrentMonth}
                className={cn(
                  'aspect-square flex items-center justify-center p-1 relative',
                  'transition-all duration-200',
                  !isCurrentMonth && 'opacity-30',
                  isSelected && 'rounded-full bg-blush-pink/30',
                  isSelected && selectedClassName,
                  dateClassName
                )}
              >
                <Image
                  src={getDateImagePath(styleId, dateNum, styleConfig.dateExt)}
                  alt={String(dateNum)}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

ImageCalendar.displayName = 'ImageCalendar'

export { ImageCalendar as default }
