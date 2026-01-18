'use client'

/**
 * Calendar Element - 캘린더 요소
 *
 * 결혼식 날짜를 표시하는 미니 캘린더
 * imageStyle이 설정되면 이미지 기반 캘린더를 사용
 */

import { useMemo, type CSSProperties } from 'react'
import Image from 'next/image'
import type { ElementStyle } from '../../schema/types'
import { calculateDday, getDayOfWeek } from '../../utils/binding-resolver'
import {
  getMonthImagePath,
  getDateImagePath,
  getWeekdayImagePath,
  getStyleConfig,
  WEEKDAYS_EN,
} from '@/components/ui/image-calendar'

// ============================================
// Types
// ============================================

export interface CalendarElementProps {
  value?: unknown // ISO 날짜 문자열 "2025-03-15"
  showDday?: boolean
  showHeader?: boolean // 년월 헤더 표시 여부
  showFooter?: boolean // 하단 날짜 표시 여부
  highlightColor?: string
  highlightTextColor?: string // 하이라이트된 날짜의 텍스트 색상
  markerType?: 'circle' | 'heart' // 날짜 선택 마커 타입
  imageStyle?: number // 이미지 캘린더 스타일 (1-11)
  style?: ElementStyle
  className?: string
}

// ============================================
// Component
// ============================================

// 하트 마커 SVG 컴포넌트 (calendar1.svg 기반)
function HeartMarker({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 35) / 30}
      viewBox="0 0 30 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <path
        d="M29.7373 12.1109C29.7077 12.2319 29.6741 12.3515 29.6391 12.4679C26.646 22.3557 19.463 29.007 12.1953 34.5734C10.9434 28.2759 6.6406 23.6347 4.43138 17.7843C3.2118 14.5556 2.19123 10.9948 2.86085 7.55968C3.53182 4.12301 6.50883 1.07595 9.46836 1.93435C12.2773 2.74772 13.6394 6.33806 14.6048 9.49067C16.5976 6.39394 18.9171 3.46486 21.8685 1.65805C27.4312 -1.74758 31.0308 6.90618 29.7373 12.1124V12.1109Z"
        fill={color}
      />
    </svg>
  )
}

export function CalendarElement({
  value,
  showDday = true,
  showHeader = false,
  showFooter = false,
  highlightColor = 'var(--accent-default)',
  highlightTextColor,
  markerType = 'circle',
  imageStyle,
  style,
  className = '',
}: CalendarElementProps) {
  // 날짜 파싱
  const dateInfo = useMemo(() => {
    if (!value) return null

    const dateStr = String(value)
    const date = new Date(dateStr)

    if (isNaN(date.getTime())) return null

    const year = date.getFullYear()
    const month = date.getMonth() // 0-indexed
    const day = date.getDate()
    const dayOfWeek = getDayOfWeek(dateStr)
    const dday = calculateDday(dateStr)

    // 해당 월의 첫째 날 요일과 마지막 날
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate()

    return {
      year,
      month: month + 1, // 1-indexed
      day,
      dayOfWeek,
      dday,
      firstDayOfMonth,
      lastDateOfMonth,
    }
  }, [value])

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px', // py-0, px-16
      backgroundColor: (style?.background as string) ?? 'transparent',
      color: style?.text?.color ?? 'var(--fg-default)',
      fontFamily: style?.text?.fontFamily ?? 'var(--font-body)',
    }),
    [style]
  )

  // 달력 그리드 생성 (Hook 순서 보장을 위해 조건부 return 전에 배치)
  const calendarGrid = useMemo(() => {
    if (!dateInfo) return []

    const grid: (number | null)[] = []

    // 첫 주 빈 칸
    for (let i = 0; i < dateInfo.firstDayOfMonth; i++) {
      grid.push(null)
    }

    // 날짜 채우기
    for (let d = 1; d <= dateInfo.lastDateOfMonth; d++) {
      grid.push(d)
    }

    return grid
  }, [dateInfo])

  // 날짜 정보가 없는 경우
  if (!dateInfo) {
    return (
      <div
        className={`se2-calendar-element se2-calendar-element--empty ${className}`}
        style={containerStyle}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--fg-muted)',
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="16" y1="2" x2="16" y2="6" />
          </svg>
          <span style={{ fontSize: '14px' }}>날짜를 설정하세요</span>
        </div>
      </div>
    )
  }

  const DAYS = ['일', '월', '화', '수', '목', '금', '토']

  // 이미지 스타일이 설정된 경우 이미지 기반 캘린더 렌더링
  if (imageStyle) {
    const styleConfig = getStyleConfig(imageStyle)

    return (
      <div className={`se2-calendar-element se2-calendar-element--image ${className}`} style={containerStyle}>
        {/* 월 헤더 이미지 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
            height: '40px',
          }}
        >
          <Image
            src={getMonthImagePath(imageStyle, dateInfo.month, styleConfig.monthExt)}
            alt={`${dateInfo.month}월`}
            width={200}
            height={40}
            style={{ objectFit: 'contain', width: 'auto', height: '100%' }}
          />
        </div>

        {/* 요일 헤더 (이미지) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            width: '100%',
            maxWidth: '280px',
            marginBottom: '4px',
          }}
        >
          {WEEKDAYS_EN.map((day) => (
            <div
              key={day}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '20px',
              }}
            >
              <Image
                src={getWeekdayImagePath(imageStyle, day)}
                alt={day}
                width={32}
                height={16}
                style={{ objectFit: 'contain', width: 'auto', height: '100%' }}
              />
            </div>
          ))}
        </div>

        {/* 이미지 달력 그리드 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            width: '100%',
            maxWidth: '280px',
          }}
        >
          {calendarGrid.map((d, i) => {
            const isSelected = d === dateInfo.day

            if (d === null) {
              return <div key={i} style={{ aspectRatio: '1' }} />
            }

            return (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px',
                  position: 'relative',
                  borderRadius: isSelected ? '50%' : 0,
                  backgroundColor: isSelected ? highlightColor : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Image
                  src={getDateImagePath(imageStyle, d, styleConfig.dateExt)}
                  alt={String(d)}
                  width={28}
                  height={28}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    filter: isSelected ? 'brightness(0) invert(1)' : 'none',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* D-day */}
        {showDday && (
          <div
            style={{
              marginTop: '16px',
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              color: highlightColor,
            }}
          >
            {dateInfo.dday}
          </div>
        )}

        {/* 예식일 요일 */}
        {showFooter && (
          <div
            style={{
              marginTop: '4px',
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-muted)',
            }}
          >
            {dateInfo.year}년 {dateInfo.month}월 {dateInfo.day}일 {dateInfo.dayOfWeek}요일
          </div>
        )}
      </div>
    )
  }

  // 기본 텍스트 기반 캘린더
  return (
    <div className={`se2-calendar-element ${className}`} style={containerStyle}>
      {/* 헤더: 년월 */}
      {showHeader && (
        <div
          style={{
            marginBottom: '12px',
            fontSize: 'var(--text-lg)',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {dateInfo.year}년 {dateInfo.month}월
        </div>
      )}

      {/* 요일 헤더 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          width: '100%',
          maxWidth: '280px',
          marginBottom: '8px',
        }}
      >
        {DAYS.map((day, i) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : 'var(--fg-muted)',
              padding: '4px 0',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          width: '100%',
          maxWidth: '280px',
        }}
      >
        {calendarGrid.map((d, i) => {
          const isSelected = d === dateInfo.day
          const dayIndex = i % 7
          const useHeartMarker = isSelected && markerType === 'heart'

          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: isSelected ? 600 : 400,
                color: isSelected
                  ? useHeartMarker
                    ? (highlightTextColor ?? '#FFFFFF')
                    : (highlightTextColor ?? 'var(--fg-on-accent)')
                  : d === null
                    ? 'transparent'
                    : dayIndex === 0
                      ? highlightColor
                      : dayIndex === 6
                        ? '#3b82f6'
                        : 'var(--fg-default)',
                backgroundColor: isSelected && !useHeartMarker ? highlightColor : 'transparent',
                borderRadius: isSelected && !useHeartMarker ? '50%' : 0,
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {useHeartMarker && <HeartMarker color={highlightColor} size={32} />}
              <span style={{ position: 'relative', zIndex: 1 }}>{d}</span>
            </div>
          )
        })}
      </div>

      {/* D-day */}
      {showDday && (
        <div
          style={{
            marginTop: '16px',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: highlightColor,
          }}
        >
          {dateInfo.dday}
        </div>
      )}

      {/* 예식일 요일 */}
      {showFooter && (
        <div
          style={{
            marginTop: '4px',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-muted)',
          }}
        >
          {dateInfo.year}년 {dateInfo.month}월 {dateInfo.day}일 {dateInfo.dayOfWeek}요일
        </div>
      )}
    </div>
  )
}

// ============================================
// Exports
// ============================================

export { CalendarElement as default }
