'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * CinematicIntro - Film/In the Mood for Love style
 * Features: Letterbox format, film grain, subtitle-like text
 */
export function CinematicIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  images,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const showFilmGrain = config.settings?.filmGrain ?? true
  const aspectRatio = config.settings?.aspectRatio || '21:9'

  React.useEffect(() => {
    // Phase progression for typewriter effect
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Show image
      setTimeout(() => setPhase(2), 1500),  // First subtitle
      setTimeout(() => setPhase(3), 3000),  // Second subtitle
      setTimeout(() => setPhase(4), 4000),  // Names
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Calculate letterbox padding based on aspect ratio
  const getLetterboxPadding = () => {
    switch (aspectRatio) {
      case '21:9': return '12%'
      case '16:9': return '6%'
      case '4:3': return '0%'
      default: return '12%'
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Letterbox Top */}
      <div
        className="absolute top-0 left-0 right-0 bg-black z-20"
        style={{ height: getLetterboxPadding() }}
      />

      {/* Letterbox Bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-black z-20"
        style={{ height: getLetterboxPadding() }}
      />

      {/* Main Image */}
      {images?.[0] && (
        <div
          className={cn(
            'absolute inset-0 transition-all duration-[2000ms] ease-out',
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          )}
        >
          <Image
            src={images[0]}
            alt="Wedding"
            fill
            className="object-cover"
            style={{ filter: 'saturate(0.8) contrast(1.1)' }}
          />
          {/* Vignette Effect */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />
        </div>
      )}

      {/* Film Grain Overlay */}
      {showFilmGrain && (
        <div
          className="absolute inset-0 z-10 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Subtitle Area */}
      <div className="absolute bottom-[20%] left-0 right-0 z-30 text-center px-8">
        {/* First Line */}
        <div
          className={cn(
            'transition-all duration-1000',
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <p
            className="text-lg md:text-xl mb-2 tracking-wider"
            style={{
              color: colors.text,
              fontFamily: fonts.body.family,
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            우리가 함께한 모든 순간들
          </p>
        </div>

        {/* Second Line */}
        <div
          className={cn(
            'transition-all duration-1000',
            phase >= 3 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <p
            className="text-lg md:text-xl mb-6 tracking-wider"
            style={{
              color: colors.text,
              fontFamily: fonts.body.family,
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            그 이야기의 새로운 시작
          </p>
        </div>

        {/* Names - Korean movie subtitle style */}
        <div
          className={cn(
            'transition-all duration-1000',
            phase >= 4 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <p
            className="text-2xl md:text-3xl font-medium tracking-[0.2em]"
            style={{
              color: colors.accent || colors.primary,
              fontFamily: fonts.title.family,
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {groomName} & {brideName}
          </p>
        </div>
      </div>

      {/* Film Frame Lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent z-30" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent z-30" />
    </div>
  )
}
