'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * PassportIntro - Travel/Passport themed intro
 * Features: Passport opening animation, stamp effect
 */
export function PassportIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  images,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const passportColor = config.settings?.passportColor || 'navy'

  const passportColors: Record<string, string> = {
    navy: '#1E3A5F',
    burgundy: '#722F37',
    green: '#1B4D3E',
    black: '#1A1A1A',
  }

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Passport appears
      setTimeout(() => setPhase(2), 1000),  // Opens
      setTimeout(() => setPhase(3), 2000),  // Stamp effect
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Passport Book */}
      <div
        className={cn(
          'relative transition-all duration-1000 ease-out',
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
          phase >= 2 ? 'rotate-0' : 'rotate-y-90'
        )}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Passport Cover */}
        <div
          className={cn(
            'relative w-72 h-96 rounded-lg shadow-2xl transition-transform duration-1000',
            phase >= 2 ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          )}
          style={{
            backgroundColor: passportColors[passportColor],
          }}
        >
          {/* Gold Embossing */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div
              className="w-16 h-16 mb-4 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: colors.secondary }}
            >
              <span className="text-2xl">✈️</span>
            </div>
            <h2
              className="text-lg tracking-[0.2em] mb-2"
              style={{
                color: colors.secondary,
                fontFamily: fonts.title.family,
              }}
            >
              PASSPORT
            </h2>
            <p
              className="text-xs tracking-wider"
              style={{ color: `${colors.secondary}80` }}
            >
              WEDDING JOURNEY
            </p>
          </div>
        </div>

        {/* Inside Page */}
        <div
          className={cn(
            'absolute inset-0 w-72 h-96 rounded-lg shadow-2xl transition-all duration-500',
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ backgroundColor: colors.surface || '#FFFFFF' }}
        >
          {/* Visa Page Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                ${colors.text} 0,
                ${colors.text} 1px,
                transparent 0,
                transparent 50%
              )`,
              backgroundSize: '10px 10px',
            }}
          />

          <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
            {/* Photo Area */}
            <div
              className="w-24 h-32 mb-6 overflow-hidden"
              style={{
                border: `2px solid ${colors.text}20`,
              }}
            >
              {images?.[0] ? (
                <Image
                  src={images[0]}
                  alt="Wedding"
                  width={96}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.text}10` }}
                >
                  <span style={{ color: colors.textMuted }}>PHOTO</span>
                </div>
              )}
            </div>

            {/* Names */}
            <p
              className="text-xs tracking-wider mb-1"
              style={{ color: colors.textMuted }}
            >
              NAMES
            </p>
            <h1
              className="text-xl font-bold mb-4"
              style={{
                color: colors.text,
                fontFamily: fonts.title.family,
              }}
            >
              {groomName} & {brideName}
            </h1>

            {/* Date */}
            <p
              className="text-xs tracking-wider mb-1"
              style={{ color: colors.textMuted }}
            >
              DEPARTURE DATE
            </p>
            <p
              className="text-sm font-mono"
              style={{ color: colors.text }}
            >
              {new Date(weddingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              }).toUpperCase()}
            </p>

            {/* Stamp */}
            <div
              className={cn(
                'absolute bottom-8 right-8 w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-500 rotate-[-15deg]',
                phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-150'
              )}
              style={{
                borderColor: colors.accent,
                color: colors.accent,
              }}
            >
              <div className="text-center">
                <p className="text-[8px] font-bold">APPROVED</p>
                <p className="text-[6px]">LOVE ♥</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Text */}
      <div
        className={cn(
          'absolute bottom-12 left-0 right-0 text-center transition-all duration-1000',
          phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <p
          className="text-sm tracking-wider"
          style={{ color: colors.textMuted }}
        >
          DESTINATION: HAPPILY EVER AFTER
        </p>
      </div>
    </div>
  )
}
