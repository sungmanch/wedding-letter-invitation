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
import { ko } from 'date-fns/locale'
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
    weekOnly = false,
    showMonth = true,
    variant = 'default',
  } = props

  // 레터프레스 스타일 (클래식 음각 효과)
  const isLetterpress = variant === 'letterpress'
  const letterpressColors = {
    background: '#F5F0E6', // 오래된 종이 색
    text: '#3D3D3D', // 잉크 색
    textMuted: '#8B8680', // 흐린 잉크
    accent: '#2C2C2C', // 진한 잉크
    highlight: '#E8E2D6', // 눌린 부분 배경
  }

  // 레터프레스 텍스트 스타일 (음각 효과)
  const getLetterpressTextStyle = (isHighlight = false): React.CSSProperties => {
    if (!isLetterpress) return {}
    return {
      textShadow: isHighlight
        ? '0 1px 0 rgba(255,255,255,0.3), 0 -1px 1px rgba(0,0,0,0.15)'
        : '0 1px 0 rgba(255,255,255,0.4), 0 -1px 1px rgba(0,0,0,0.1)',
      letterSpacing: '0.05em',
    }
  }

  // 달력 날짜 계산
  const calendarDays = useMemo(() => {
    if (weekOnly) {
      // 결혼식이 있는 주만 표시
      const weekStart = startOfWeek(weddingDate, { weekStartsOn })
      const weekEnd = endOfWeek(weddingDate, { weekStartsOn })
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    }

    const monthStart = startOfMonth(weddingDate)
    const monthEnd = endOfMonth(weddingDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [weddingDate, weekStartsOn, weekOnly])

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
    // 레터프레스 스타일인 경우 단색 사용
    if (isLetterpress) {
      return isCurrentMonth ? letterpressColors.text : letterpressColors.textMuted
    }

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

  // 월 이름 (weekOnly 모드에서 사용)
  const monthName = useMemo(() => {
    if (locale === 'ko') {
      return format(weddingDate, 'M월', { locale: ko })
    }
    return format(weddingDate, 'MMMM').toUpperCase()
  }, [weddingDate, locale])

  return (
    <div
      data-node-id={node.id}
      data-node-type="calendar"
      style={{
        width: '100%',
        ...(isLetterpress && {
          backgroundColor: letterpressColors.background,
          padding: '24px',
          borderRadius: '4px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06), inset 0 -1px 0 rgba(255,255,255,0.5)',
          border: '1px solid rgba(0,0,0,0.08)',
        }),
        ...mergedStyle,
      }}
    >
      {/* 월 이름 (weekOnly 모드에서 표시) */}
      {showMonth && weekOnly && (
        <div
          style={{
            textAlign: 'center',
            fontSize: isLetterpress ? '14px' : 'var(--typo-heading-md-font-size, 18px)',
            fontFamily: isLetterpress ? 'Georgia, "Times New Roman", serif' : 'var(--typo-heading-md-font-family)',
            fontWeight: isLetterpress ? 600 : 400,
            letterSpacing: '0.2em',
            color: isLetterpress ? letterpressColors.text : 'var(--color-text-secondary)',
            marginBottom: '24px',
            textTransform: isLetterpress ? 'uppercase' : undefined,
            ...getLetterpressTextStyle(),
          }}
        >
          {monthName}
        </div>
      )}
      {/* 요일 헤더 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: weekOnly ? '16px' : '8px',
          marginBottom: weekOnly ? '16px' : '12px',
          borderBottom: weekOnly
            ? 'none'
            : isLetterpress
              ? `1px solid ${letterpressColors.textMuted}40`
              : '1px solid var(--color-divider)',
          paddingBottom: weekOnly ? '0' : '12px',
        }}
      >
        {weekdays.map((day, index) => {
          const dayIndex = (weekStartsOn + index) % 7
          let color = isLetterpress ? letterpressColors.textMuted : 'var(--color-text-secondary)'
          if (!isLetterpress) {
            if (showHolidayColor && dayIndex === 0) color = '#EF4444'
            if (showSaturdayColor && dayIndex === 6) color = '#3B82F6'
          }

          return (
            <div
              key={day + index}
              style={{
                textAlign: 'center',
                fontSize: isLetterpress
                  ? '11px'
                  : weekOnly
                    ? 'var(--typo-body-sm-font-size, 12px)'
                    : 'var(--typo-body-md-font-size, 14px)',
                fontFamily: isLetterpress ? 'Georgia, "Times New Roman", serif' : 'var(--typo-body-md-font-family)',
                fontWeight: isLetterpress ? 500 : 400,
                fontStyle: weekOnly && !isLetterpress ? 'italic' : 'normal',
                color,
                textTransform: isLetterpress ? 'uppercase' : undefined,
                ...getLetterpressTextStyle(),
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
          gap: weekOnly ? '16px' : '6px',
          rowGap: weekOnly ? '0' : '10px',
        }}
      >
        {calendarDays.map((day) => {
          const isCurrentMonth = weekOnly ? true : isSameMonth(day, weddingDate)
          const isWeddingDay = isSameDay(day, weddingDate)
          const dayColor = getDayColor(day, isCurrentMonth)

          // 레터프레스 하이라이트 스타일 결정
          const showLetterpressHighlight = isLetterpress && isWeddingDay

          return (
            <div
              key={day.toISOString()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: weekOnly ? 'auto' : '1',
                position: 'relative',
                minHeight: weekOnly ? '48px' : '36px',
              }}
            >
              {/* 레터프레스 하이라이트 (음각 원형) */}
              {showLetterpressHighlight && (
                <div
                  style={{
                    position: 'absolute',
                    width: '34px',
                    height: '34px',
                    backgroundColor: letterpressColors.highlight,
                    borderRadius: '50%',
                    boxShadow:
                      'inset 0 2px 4px rgba(0,0,0,0.12), inset 0 1px 2px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6)',
                  }}
                />
              )}
              {/* 기본 하이라이트 스타일들 (레터프레스가 아닐 때) */}
              {!isLetterpress && isWeddingDay && highlightStyle === 'circle' && (
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
              {!isLetterpress && isWeddingDay && highlightStyle === 'filled' && (
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
              {!isLetterpress && isWeddingDay && highlightStyle === 'ring' && (
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
              {!isLetterpress && isWeddingDay && highlightStyle === 'heart' && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-brand, #3B82F6)"
                  strokeWidth="1.5"
                  style={{
                    position: 'absolute',
                    width: '42px',
                    height: '42px',
                  }}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {!isLetterpress && isWeddingDay && highlightStyle === 'heart-filled' && (
                <svg
                  viewBox="0 0 24 24"
                  fill="var(--color-brand, #3B82F6)"
                  style={{
                    position: 'absolute',
                    width: '42px',
                    height: '42px',
                  }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
              <span
                style={{
                  position: 'relative',
                  fontSize: isLetterpress ? '13px' : 'var(--typo-body-md-font-size, 14px)',
                  fontFamily: isLetterpress ? 'Georgia, "Times New Roman", serif' : 'var(--typo-body-md-font-family)',
                  fontWeight: isWeddingDay ? (isLetterpress ? 700 : 600) : 400,
                  color: isLetterpress
                    ? isWeddingDay
                      ? letterpressColors.accent
                      : dayColor
                    : isWeddingDay
                      ? highlightStyle === 'ring' || highlightStyle === 'heart'
                        ? 'var(--color-brand, #3B82F6)'
                        : highlightStyle === 'heart-filled'
                          ? '#FFFFFF'
                          : '#FFFFFF'
                      : dayColor,
                  zIndex: 1,
                  ...getLetterpressTextStyle(isWeddingDay),
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
      key: 'variant',
      label: '캘린더 스타일',
      type: 'select',
      options: [
        { value: 'default', label: '기본' },
        { value: 'letterpress', label: '레터프레스' },
      ],
      defaultValue: 'default',
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
        { value: 'heart', label: '하트 (테두리)' },
        { value: 'heart-filled', label: '하트 (채움)' },
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
    {
      key: 'weekOnly',
      label: '주간만 표시',
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'showMonth',
      label: '월 이름 표시',
      type: 'boolean',
      defaultValue: true,
    },
  ],
}
