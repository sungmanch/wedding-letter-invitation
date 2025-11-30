'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * MagazineIntro - Vogue/Kinfolk editorial style
 * Features: Bold typography overlay, magazine cover layout
 */
export function MagazineIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  images,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const coverStyle = config.settings?.coverStyle || 'vogue'

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),   // Image
      setTimeout(() => setPhase(2), 800),   // Magazine title
      setTimeout(() => setPhase(3), 1200),  // Names
      setTimeout(() => setPhase(4), 1800),  // Details
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const weddingDateObj = new Date(weddingDate)
  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background Image */}
      {images?.[0] && (
        <div
          className={cn(
            'absolute inset-0 transition-all duration-1000',
            phase >= 1 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={images[0]}
            alt="Cover"
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${colors.background}40 0%, transparent 30%, transparent 60%, ${colors.background}90 100%)`,
            }}
          />
        </div>
      )}

      {/* Magazine Logo */}
      <div
        className={cn(
          'absolute top-8 left-0 right-0 text-center transition-all duration-700',
          phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        )}
      >
        <h2
          className="text-3xl md:text-4xl tracking-[0.2em]"
          style={{
            color: colors.text,
            fontFamily: fonts.title.family,
            fontWeight: fonts.title.weight,
            fontStyle: fonts.title.style,
          }}
        >
          {coverStyle === 'vogue' ? 'WEDDING' : 'love story'}
        </h2>
      </div>

      {/* Issue Info */}
      <div
        className={cn(
          'absolute top-20 left-0 right-0 text-center transition-all duration-700',
          phase >= 2 ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p
          className="text-xs tracking-[0.15em]"
          style={{ color: colors.textMuted }}
        >
          {monthNames[weddingDateObj.getMonth()]} {weddingDateObj.getFullYear()}
        </p>
      </div>

      {/* Main Title - Names */}
      <div
        className={cn(
          'absolute bottom-32 left-0 right-0 text-center px-6 transition-all duration-1000',
          phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <h1
          className="text-4xl md:text-6xl leading-tight"
          style={{
            color: colors.text,
            fontFamily: fonts.title.family,
            fontWeight: fonts.title.weight,
            fontStyle: fonts.title.style,
          }}
        >
          {groomName}
          <span className="block text-2xl md:text-3xl my-2" style={{ color: colors.accent }}>
            &
          </span>
          {brideName}
        </h1>
      </div>

      {/* Tagline */}
      <div
        className={cn(
          'absolute bottom-16 left-0 right-0 text-center transition-all duration-700',
          phase >= 4 ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p
          className="text-sm tracking-wider"
          style={{
            color: colors.textMuted,
            fontFamily: fonts.accent?.family || fonts.body.family,
          }}
        >
          THE LOVE STORY CONTINUES
        </p>
      </div>

      {/* Barcode-like decoration */}
      <div
        className={cn(
          'absolute bottom-4 right-4 flex gap-0.5 transition-opacity duration-500',
          phase >= 4 ? 'opacity-30' : 'opacity-0'
        )}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-0.5 bg-current"
            style={{
              height: `${8 + Math.random() * 16}px`,
              color: colors.text,
            }}
          />
        ))}
      </div>
    </div>
  )
}
