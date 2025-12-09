'use client'

import { useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  getDay,
} from 'date-fns'
import type { PrimitiveNode, CalendarProps } from '../../schema/primitives'
import type { RenderContext, PrimitiveRenderer } from '../types'
import { getNodeProps, resolveDataBinding, mergeNodeStyles } from '../types'

// 한국 공휴일 (간단 버전 - 고정 공휴일만)
const KOREAN_HOLIDAYS: Record<string, string> = {
  '01-01': '신정',
  '03-01': '삼일절',
  '05-05': '어린이날',
  '06-06': '현충일',
  '08-15': '광복절',
  '10-03': '개천절',
  '10-09': '한글날',
  '12-25': '성탄절',
}

// 확장된 노드 타입
interface ExtendedNode extends PrimitiveNode {
  tokenStyle?: Record<string, unknown>
}

export function Calendar({
  node,
  context,
}: {
  node: PrimitiveNode
  context: RenderContext
}) {
  const extNode = node as ExtendedNode
  const props = getNodeProps<CalendarProps>(node)
  const mergedStyle = mergeNodeStyles(extNode, context)

  // 데이터 바인딩 해결
  const dateString = resolveDataBinding(props.date || '', context.data) as string
  const weddingDate = useMemo(() => {
    if (!dateString) return new Date()
    try {
      return parseISO(dateString)
    } catch {
      return new Date()
    }
  }, [dateString])

  const {
    weekStartsOn = 0,
    weekdayFormat = 'narrow',
    locale = 'ko',
    highlightStyle = 'circle',
    showHolidayColor = true,
    showSaturdayColor = true,
  } = props

  // 달력 날짜 계산
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(weddingDate)
    const monthEnd = endOfMonth(weddingDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [weddingDate, weekStartsOn])

  // 요일 헤더
  const weekdays = useMemo(() => {
    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      const dayIndex = (weekStartsOn + i) % 7
      if (locale === 'ko') {
        const koreanDays = ['일', '월', '화', '수', '목', '금', '토']
        days.push(koreanDays[dayIndex])
      } else {
        const englishDays =
          weekdayFormat === 'narrow'
            ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            : weekdayFormat === 'short'
              ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
              : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        days.push(englishDays[dayIndex])
      }
    }
    return days
  }, [weekStartsOn, weekdayFormat, locale])

  // 날짜가 공휴일인지 확인
  const isHoliday = (date: Date): boolean => {
    const key = format(date, 'MM-dd')
    return !!KOREAN_HOLIDAYS[key]
  }

  // 요일 색상 결정
  const getDayColor = (date: Date, isCurrentMonth: boolean): string | undefined => {
    if (!isCurrentMonth) return 'var(--color-text-muted)'

    const dayOfWeek = getDay(date)

    // 일요일 또는 공휴일
    if (showHolidayColor && (dayOfWeek === 0 || isHoliday(date))) {
      return '#EF4444' // red-500
    }

    // 토요일
    if (showSaturdayColor && dayOfWeek === 6) {
      return '#3B82F6' // blue-500
    }

    return 'var(--color-text-primary)'
  }

  return (
    <div
      data-node-id={node.id}
      data-node-type="calendar"
      style={{
        width: '100%',
        ...mergedStyle,
      }}
    >
      {/* 요일 헤더 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--color-divider)',
          paddingBottom: '12px',
        }}
      >
        {weekdays.map((day, index) => {
          const dayIndex = (weekStartsOn + index) % 7
          let color = 'var(--color-text-secondary)'
          if (showHolidayColor && dayIndex === 0) color = '#EF4444'
          if (showSaturdayColor && dayIndex === 6) color = '#3B82F6'

          return (
            <div
              key={day + index}
              style={{
                textAlign: 'center',
                fontSize: 'var(--typo-body-md-font-size, 14px)',
                fontFamily: 'var(--typo-body-md-font-family)',
                fontWeight: 500,
                color,
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* 날짜 그리드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          rowGap: '10px',
        }}
      >
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, weddingDate)
          const isWeddingDay = isSameDay(day, weddingDate)
          const dayColor = getDayColor(day, isCurrentMonth)

          return (
            <div
              key={day.toISOString()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                position: 'relative',
                minHeight: '36px',
              }}
            >
              {isWeddingDay && highlightStyle === 'circle' && (
                <div
                  style={{
                    position: 'absolute',
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--color-brand, #3B82F6)',
                    borderRadius: '50%',
                  }}
                />
              )}
              {isWeddingDay && highlightStyle === 'filled' && (
                <div
                  style={{
                    position: 'absolute',
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--color-brand, #3B82F6)',
                    borderRadius: '8px',
                  }}
                />
              )}
              {isWeddingDay && highlightStyle === 'ring' && (
                <div
                  style={{
                    position: 'absolute',
                    width: '36px',
                    height: '36px',
                    border: '2px solid var(--color-brand, #3B82F6)',
                    borderRadius: '50%',
                  }}
                />
              )}
              <span
                style={{
                  position: 'relative',
                  fontSize: 'var(--typo-body-md-font-size, 14px)',
                  fontFamily: 'var(--typo-body-md-font-family)',
                  fontWeight: isWeddingDay ? 600 : 400,
                  color: isWeddingDay
                    ? highlightStyle === 'ring'
                      ? 'var(--color-brand, #3B82F6)'
                      : '#FFFFFF'
                    : dayColor,
                  zIndex: 1,
                }}
              >
                {format(day, 'd')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const calendarRenderer: PrimitiveRenderer<CalendarProps> = {
  type: 'calendar',
  render: (node, context) => <Calendar key={node.id} node={node} context={context} />,
  editableProps: [
    {
      key: 'date',
      label: '결혼 날짜',
      type: 'text',
    },
    {
      key: 'locale',
      label: '언어',
      type: 'select',
      options: [
        { value: 'ko', label: '한국어' },
        { value: 'en', label: 'English' },
      ],
      defaultValue: 'ko',
    },
    {
      key: 'highlightStyle',
      label: '하이라이트 스타일',
      type: 'select',
      options: [
        { value: 'circle', label: '원형' },
        { value: 'filled', label: '채움' },
        { value: 'ring', label: '테두리' },
      ],
      defaultValue: 'circle',
    },
    {
      key: 'showHolidayColor',
      label: '공휴일 색상',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'showSaturdayColor',
      label: '토요일 색상',
      type: 'boolean',
      defaultValue: true,
    },
  ],
}
