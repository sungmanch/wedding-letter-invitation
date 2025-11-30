'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * VinylIntro - LP Record player style
 * Features: Spinning vinyl, album art, retro aesthetics
 */
export function VinylIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  images,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const [isSpinning, setIsSpinning] = React.useState(false)
  const vinylColor = config.settings?.vinylColor || '#1A1A1A'

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Album appears
      setTimeout(() => { setPhase(2); setIsSpinning(true) }, 1000),  // Start spinning
      setTimeout(() => setPhase(3), 2000),  // Text appears
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Vinyl Record */}
      <div
        className={cn(
          'relative transition-all duration-1000',
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        )}
      >
        {/* Vinyl Disc */}
        <div
          className={cn(
            'relative w-64 h-64 md:w-80 md:h-80 rounded-full',
            isSpinning && 'animate-spin'
          )}
          style={{
            backgroundColor: vinylColor,
            animationDuration: '3s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {/* Vinyl Grooves */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gray-700"
              style={{
                top: `${10 + i * 5}%`,
                left: `${10 + i * 5}%`,
                right: `${10 + i * 5}%`,
                bottom: `${10 + i * 5}%`,
              }}
            />
          ))}

          {/* Center Label */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.accent }}
          >
            {images?.[0] ? (
              <Image
                src={images[0]}
                alt="Album"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="text-xs text-center px-2"
                  style={{ color: colors.text }}
                >
                  {groomName}
                  <br />&<br />
                  {brideName}
                </span>
              </div>
            )}
          </div>

          {/* Center Hole */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.background }}
          />
        </div>

        {/* Tonearm */}
        <div
          className={cn(
            'absolute -right-8 top-0 w-32 h-2 origin-right transition-transform duration-1000',
            isSpinning ? 'rotate-[-25deg]' : 'rotate-0'
          )}
        >
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
      </div>

      {/* Album Info */}
      <div
        className={cn(
          'mt-12 text-center transition-all duration-1000',
          phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: colors.textMuted }}
        >
          Now Playing
        </p>
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{
            color: colors.text,
            fontFamily: fonts.title.family,
          }}
        >
          {groomName} & {brideName}
        </h1>
        <p
          className="text-sm mt-2"
          style={{
            color: colors.textMuted,
            fontFamily: fonts.body.family,
          }}
        >
          Wedding Album • {new Date(weddingDate).getFullYear()}
        </p>
      </div>

      {/* Equalizer Animation */}
      <div
        className={cn(
          'absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8 transition-opacity duration-500',
          phase >= 2 ? 'opacity-100' : 'opacity-0'
        )}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full animate-pulse"
            style={{
              backgroundColor: colors.accent,
              height: `${8 + Math.random() * 24}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.5s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
