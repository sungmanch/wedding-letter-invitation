'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Heart, Calendar } from 'lucide-react'
import type { ColorPalette, FontSet } from '@/lib/themes/schema'
import type { DdaySettings } from '@/lib/types/invitation-design'

interface DdaySectionProps {
  settings: DdaySettings
  weddingDate: string
  weddingTime?: string
  colors: ColorPalette
  fonts: FontSet
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

export function DdaySection({
  settings,
  weddingDate,
  weddingTime,
  colors,
  fonts,
  className,
}: DdaySectionProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  })

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(weddingDate)
      if (weddingTime) {
        const [hours, minutes] = weddingTime.split(':').map(Number)
        targetDate.setHours(hours, minutes, 0, 0)
      }

      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      const isPast = difference < 0
      const absDiff = Math.abs(difference)

      return {
        days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((absDiff % (1000 * 60)) / 1000),
        isPast,
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [weddingDate, weddingTime])

  const renderFlipStyle = () => (
    <div className="flex justify-center gap-2">
      {settings.showDays && (
        <div className="text-center">
          <div
            className="bg-white rounded-xl p-4 shadow-lg min-w-[80px]"
            style={{ borderTop: `3px solid ${colors.primary}` }}
          >
            <span
              className="text-3xl font-bold tabular-nums"
              style={{ fontFamily: 'monospace', color: colors.text }}
            >
              {String(timeLeft.days).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">DAYS</span>
        </div>
      )}
      {settings.showHours && (
        <div className="text-center">
          <div
            className="bg-white rounded-xl p-4 shadow-lg min-w-[80px]"
            style={{ borderTop: `3px solid ${colors.primary}` }}
          >
            <span
              className="text-3xl font-bold tabular-nums"
              style={{ fontFamily: 'monospace', color: colors.text }}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">HOURS</span>
        </div>
      )}
      {settings.showMinutes && (
        <div className="text-center">
          <div
            className="bg-white rounded-xl p-4 shadow-lg min-w-[80px]"
            style={{ borderTop: `3px solid ${colors.primary}` }}
          >
            <span
              className="text-3xl font-bold tabular-nums"
              style={{ fontFamily: 'monospace', color: colors.text }}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">MINS</span>
        </div>
      )}
      {settings.showSeconds && (
        <div className="text-center">
          <div
            className="bg-white rounded-xl p-4 shadow-lg min-w-[80px]"
            style={{ borderTop: `3px solid ${colors.primary}` }}
          >
            <span
              className="text-3xl font-bold tabular-nums"
              style={{ fontFamily: 'monospace', color: colors.text }}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block">SECS</span>
        </div>
      )}
    </div>
  )

  const renderDigitalStyle = () => (
    <div className="flex justify-center items-center gap-1">
      {settings.showDays && (
        <>
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ fontFamily: 'monospace', color: colors.primary }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-lg text-gray-400">:</span>
        </>
      )}
      {settings.showHours && (
        <>
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ fontFamily: 'monospace', color: colors.primary }}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-lg text-gray-400">:</span>
        </>
      )}
      {settings.showMinutes && (
        <>
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ fontFamily: 'monospace', color: colors.primary }}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          {settings.showSeconds && <span className="text-lg text-gray-400">:</span>}
        </>
      )}
      {settings.showSeconds && (
        <span
          className="text-4xl font-bold tabular-nums"
          style={{ fontFamily: 'monospace', color: colors.primary }}
        >
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      )}
    </div>
  )

  const renderTextStyle = () => {
    const parts: string[] = []
    if (settings.showDays && timeLeft.days > 0) {
      parts.push(`${timeLeft.days}일`)
    }
    if (settings.showHours && timeLeft.hours > 0) {
      parts.push(`${timeLeft.hours}시간`)
    }
    if (settings.showMinutes && timeLeft.minutes > 0) {
      parts.push(`${timeLeft.minutes}분`)
    }
    if (settings.showSeconds) {
      parts.push(`${timeLeft.seconds}초`)
    }

    return (
      <p
        className="text-2xl font-medium text-center"
        style={{ fontFamily: fonts.title.family, color: colors.text }}
      >
        {timeLeft.isPast ? '결혼한 지 ' : '결혼까지 '}
        <span style={{ color: colors.primary }}>{parts.join(' ')}</span>
        {timeLeft.isPast ? ' 됐어요' : ' 남았어요'}
      </p>
    )
  }

  const renderAnalogStyle = () => (
    <div className="relative w-48 h-48 mx-auto">
      {/* Circular progress */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={`${colors.primary}20`}
          strokeWidth="8"
        />
        {/* Progress circle - assuming 100 days max */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colors.primary}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${Math.min((1 - timeLeft.days / 100) * 283, 283)} 283`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold"
          style={{ color: colors.text }}
        >
          {timeLeft.isPast ? '+' : '-'}{timeLeft.days}
        </span>
        <span className="text-sm text-gray-400">DAYS</span>
      </div>
    </div>
  )

  // D-Day 이후 메시지 표시
  if (timeLeft.isPast && timeLeft.days === 0 && settings.endMessage) {
    return (
      <section
        className={cn('py-12 px-6 text-center', className)}
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-6 w-6 fill-current" style={{ color: colors.primary }} />
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: fonts.title.family, color: colors.primary }}
          >
            D-Day
          </span>
          <Heart className="h-6 w-6 fill-current" style={{ color: colors.primary }} />
        </div>
        <p style={{ color: colors.text }}>{settings.endMessage}</p>
      </section>
    )
  }

  return (
    <section
      className={cn('py-8 px-6', className)}
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
        <h2
          className="text-lg font-medium"
          style={{ fontFamily: fonts.title.family, color: colors.text }}
        >
          {timeLeft.isPast ? '함께한 시간' : 'D-Day'}
        </h2>
      </div>

      {settings.displayMode === 'simple' && (
        <div className="text-center">
          <span
            className="text-5xl font-bold"
            style={{ color: colors.primary }}
          >
            D{timeLeft.isPast ? '+' : '-'}{timeLeft.days}
          </span>
        </div>
      )}

      {settings.displayMode === 'countdown' && (
        <>
          {settings.style === 'flip' && renderFlipStyle()}
          {settings.style === 'digital' && renderDigitalStyle()}
          {settings.style === 'text' && renderTextStyle()}
          {settings.style === 'analog' && renderAnalogStyle()}
        </>
      )}

      {settings.displayMode === 'detailed' && (
        <div className="space-y-4">
          {renderFlipStyle()}
          <p
            className="text-center text-sm"
            style={{ color: colors.textMuted || colors.text }}
          >
            {new Date(weddingDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
            {weddingTime && ` ${weddingTime}`}
          </p>
        </div>
      )}
    </section>
  )
}
