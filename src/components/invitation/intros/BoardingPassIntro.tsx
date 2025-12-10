'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * BoardingPassIntro - Letterpress embossed boarding pass style
 * Features: Ticket shape with notch, barcode, embossed typography, travel theme
 */

// 바코드 높이 패턴 (레터프레스 스타일)
const BARCODE_HEIGHTS = Array.from({ length: 30 }, (_, i) => 20 + ((i * 11 + 5) % 24))

export function BoardingPassIntro({
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  venueName,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Ticket appears
      setTimeout(() => setPhase(2), 800),   // Header stamps in
      setTimeout(() => setPhase(3), 1300),  // Names letterpress
      setTimeout(() => setPhase(4), 1800),  // Flight info
      setTimeout(() => setPhase(5), 2300),  // Barcode & details
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const weddingDateObj = new Date(weddingDate)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // 날짜 포맷팅
  const month = monthNames[weddingDateObj.getMonth()]
  const day = weddingDateObj.getDate()
  const year = weddingDateObj.getFullYear()
  const dayOfWeek = dayNames[weddingDateObj.getDay()]

  // 시간 (기본값)
  const hours = weddingDateObj.getHours()
  const minutes = weddingDateObj.getMinutes()
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  const ampm = hours >= 12 ? 'pm' : 'am'

  // 장소명에서 간단한 코드 생성
  const venueCode = venueName
    ? venueName.slice(0, 3).toUpperCase()
    : 'WED'

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden p-4"
      style={{
        backgroundColor: colors.background,
        // 종이 텍스처 효과
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, ${colors.surface}40 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, ${colors.surface}30 0%, transparent 50%)
        `,
      }}
    >
      {/* Ticket Container */}
      <div
        className={cn(
          'relative w-full max-w-[360px] transition-all duration-700',
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Main Ticket */}
        <div
          className="relative rounded-2xl overflow-visible"
          style={{
            backgroundColor: colors.surface,
            // 종이 그림자
            boxShadow: `
              0 2px 8px ${colors.text}10,
              0 8px 24px ${colors.text}08,
              inset 0 1px 0 rgba(255,255,255,0.8)
            `,
          }}
        >
          {/* 노치 장식 (왼쪽/오른쪽) */}
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
            style={{ backgroundColor: colors.background }}
          />
          <div
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
            style={{ backgroundColor: colors.background }}
          />

          {/* 점선 구분선 */}
          <div
            className="absolute left-6 right-6 top-1/2 -translate-y-1/2 border-t-2 border-dashed"
            style={{ borderColor: `${colors.textMuted}30` }}
          />

          {/* Upper Section - Header */}
          <div className="px-6 pt-6 pb-16">
            {/* First Class Badge */}
            <div
              className={cn(
                'flex items-center justify-between mb-4 transition-all duration-500',
                phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              )}
            >
              <span
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{
                  color: colors.textMuted,
                  // 레터프레스 효과
                  textShadow: `0 1px 0 rgba(255,255,255,0.8)`,
                }}
              >
                ✦✦ First Class Ticket ✦✦
              </span>
            </div>

            {/* Boarding Pass Title */}
            <div
              className={cn(
                'text-center mb-6 transition-all duration-700',
                phase >= 2 ? 'opacity-100' : 'opacity-0'
              )}
            >
              <h2
                className="text-xl tracking-[0.25em] uppercase"
                style={{
                  color: colors.primary,
                  fontFamily: fonts.title.family,
                  fontWeight: fonts.title.weight,
                  // 레터프레스 엠보싱 효과
                  textShadow: `
                    0 1px 1px rgba(255,255,255,0.9),
                    0 -1px 1px ${colors.primary}20
                  `,
                }}
              >
                Boarding Pass
              </h2>
            </div>

            {/* Names Section */}
            <div
              className={cn(
                'text-center space-y-2 transition-all duration-700',
                phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <p
                className="text-[10px] tracking-[0.15em] uppercase"
                style={{ color: colors.textMuted }}
              >
                You are cordially invited to the wedding of
              </p>

              {/* Groom Name */}
              <div className="relative">
                <p
                  className="text-[10px] tracking-wider uppercase mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Groom
                </p>
                <h1
                  className="text-3xl leading-none"
                  style={{
                    color: colors.primary,
                    fontFamily: fonts.title.family,
                    fontWeight: fonts.title.weight,
                    fontStyle: fonts.title.style,
                    letterSpacing: '0.08em',
                    // 깊은 레터프레스 효과
                    textShadow: `
                      0 2px 2px rgba(255,255,255,0.95),
                      0 -1px 1px ${colors.primary}15,
                      1px 1px 0 rgba(255,255,255,0.5)
                    `,
                  }}
                >
                  {groomName}
                </h1>
              </div>

              {/* & Symbol */}
              <div
                className="py-2"
                style={{
                  color: colors.accent,
                  fontFamily: fonts.accent?.family || fonts.title.family,
                  fontSize: '1.5rem',
                }}
              >
                ♥
              </div>

              {/* Bride Name */}
              <div className="relative">
                <p
                  className="text-[10px] tracking-wider uppercase mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Bride
                </p>
                <h1
                  className="text-3xl leading-none"
                  style={{
                    color: colors.primary,
                    fontFamily: fonts.title.family,
                    fontWeight: fonts.title.weight,
                    fontStyle: fonts.title.style,
                    letterSpacing: '0.08em',
                    textShadow: `
                      0 2px 2px rgba(255,255,255,0.95),
                      0 -1px 1px ${colors.primary}15,
                      1px 1px 0 rgba(255,255,255,0.5)
                    `,
                  }}
                >
                  {brideName}
                </h1>
              </div>
            </div>
          </div>

          {/* Lower Section - Flight Info */}
          <div className="px-6 pt-12 pb-6">
            {/* Flight Details Grid */}
            <div
              className={cn(
                'grid grid-cols-3 gap-4 mb-6 transition-all duration-700',
                phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              {/* Date */}
              <div className="text-center">
                <p
                  className="text-[9px] tracking-wider uppercase mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Date
                </p>
                <p
                  className="text-lg font-medium"
                  style={{
                    color: colors.primary,
                    fontFamily: fonts.title.family,
                    textShadow: `0 1px 0 rgba(255,255,255,0.8)`,
                  }}
                >
                  {month} {day}th
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: colors.textMuted }}
                >
                  {year}
                </p>
              </div>

              {/* Time */}
              <div className="text-center">
                <p
                  className="text-[9px] tracking-wider uppercase mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Time
                </p>
                <p
                  className="text-lg font-medium"
                  style={{
                    color: colors.primary,
                    fontFamily: fonts.title.family,
                    textShadow: `0 1px 0 rgba(255,255,255,0.8)`,
                  }}
                >
                  {timeStr}{ampm}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: colors.textMuted }}
                >
                  {dayOfWeek}
                </p>
              </div>

              {/* Destination */}
              <div className="text-center">
                <p
                  className="text-[9px] tracking-wider uppercase mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Destination
                </p>
                <p
                  className="text-lg font-medium"
                  style={{
                    color: colors.primary,
                    fontFamily: fonts.title.family,
                    textShadow: `0 1px 0 rgba(255,255,255,0.8)`,
                  }}
                >
                  {venueCode}
                </p>
                <p
                  className="text-[10px] truncate"
                  style={{ color: colors.textMuted }}
                >
                  Seoul
                </p>
              </div>
            </div>

            {/* Venue Name */}
            {venueName && (
              <div
                className={cn(
                  'text-center mb-4 transition-all duration-500',
                  phase >= 4 ? 'opacity-100' : 'opacity-0'
                )}
              >
                <p
                  className="text-[9px] tracking-wider uppercase mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Venue
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: colors.text,
                    fontFamily: fonts.body.family,
                  }}
                >
                  {venueName}
                </p>
              </div>
            )}

            {/* Barcode */}
            <div
              className={cn(
                'flex justify-center gap-[1px] mt-4 transition-all duration-700',
                phase >= 5 ? 'opacity-60' : 'opacity-0'
              )}
            >
              {BARCODE_HEIGHTS.map((height, i) => (
                <div
                  key={i}
                  className="w-[2px]"
                  style={{
                    height: `${height}px`,
                    backgroundColor: colors.primary,
                  }}
                />
              ))}
            </div>

            {/* Barcode Number */}
            <div
              className={cn(
                'text-center mt-2 transition-all duration-500',
                phase >= 5 ? 'opacity-40' : 'opacity-0'
              )}
            >
              <p
                className="text-[8px] tracking-[0.3em] font-mono"
                style={{ color: colors.text }}
              >
                {year}{(weddingDateObj.getMonth() + 1).toString().padStart(2, '0')}{day.toString().padStart(2, '0')} • {groomName.toUpperCase()} & {brideName.toUpperCase()} • WEDDING
              </p>
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <div
            className={cn(
              'absolute top-4 right-4 transition-all duration-500',
              phase >= 2 ? 'opacity-30' : 'opacity-0'
            )}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4h6v2H6v4H4V4zm16 0h-6v2h4v4h2V4zM4 20h6v-2H6v-4H4v6zm16 0h-6v-2h4v-4h2v6z"
                fill={colors.primary}
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Welcome Stamp */}
          <div
            className={cn(
              'absolute -bottom-2 -right-2 w-20 h-20 transition-all duration-500',
              phase >= 5 ? 'opacity-20 rotate-[-15deg] scale-100' : 'opacity-0 rotate-0 scale-50'
            )}
          >
            <svg viewBox="0 0 80 80" fill="none">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke={colors.primary}
                strokeWidth="3"
                strokeDasharray="4 2"
              />
              <text
                x="40"
                y="36"
                textAnchor="middle"
                fill={colors.primary}
                fontSize="10"
                fontWeight="bold"
                style={{ fontFamily: fonts.title.family }}
              >
                WELCOME
              </text>
              <text
                x="40"
                y="48"
                textAnchor="middle"
                fill={colors.primary}
                fontSize="8"
              >
                TO OUR
              </text>
              <text
                x="40"
                y="58"
                textAnchor="middle"
                fill={colors.primary}
                fontSize="8"
              >
                WEDDING
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
