'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * KeynoteIntro - Apple Keynote style intro
 * Features: Sticky scroll text reveals, zoom effects, minimal design
 */
export function KeynoteIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  images,
  onComplete,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const stickyTexts = config.settings?.stickyTexts || ['우리의 사랑', '그 완전히 새로운 시작']

  React.useEffect(() => {
    // Phase progression
    const phases = [
      { delay: 0, duration: 1500 },      // Phase 0: First text
      { delay: 1500, duration: 1500 },   // Phase 1: Second text
      { delay: 3000, duration: 1000 },   // Phase 2: Names reveal
    ]

    phases.forEach((p, index) => {
      setTimeout(() => setPhase(index + 1), p.delay)
    })
  }, [])

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background Image with Zoom */}
      {images?.[0] && (
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-[3000ms] ease-out',
            phase >= 2 ? 'scale-110' : 'scale-100'
          )}
        >
          <Image
            src={images[0]}
            alt="Wedding"
            fill
            className="object-cover opacity-20"
          />
        </div>
      )}

      {/* Sticky Text Reveals */}
      <div className="relative z-10 text-center px-8">
        {/* First Line */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-1000 ease-out',
            phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h2
            className="text-2xl md:text-4xl font-light tracking-wide mb-4"
            style={{
              color: colors.textMuted || colors.secondary,
              fontFamily: fonts.body.family,
            }}
          >
            {stickyTexts[0]}
          </h2>
        </div>

        {/* Second Line */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-1000 ease-out delay-300',
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
            }}
          >
            {stickyTexts[1]}
          </h1>
        </div>

        {/* Names */}
        <div
          className={cn(
            'mt-12 transition-all duration-1000 ease-out',
            phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <p
            className="text-xl md:text-2xl font-medium"
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
            }}
          >
            {groomName}
            <span className="mx-4" style={{ color: colors.accent || colors.primary }}>♥</span>
            {brideName}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div
          className="w-24 h-0.5 rounded-full overflow-hidden"
          style={{ backgroundColor: `${colors.text}20` }}
        >
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              backgroundColor: colors.text,
              width: `${(phase / 3) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
