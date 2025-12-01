'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * TypographyIntro - Minimalist kinetic typography
 * Features: Bold text animations, black & white, dynamic motion
 */
export function TypographyIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const colorScheme = config.settings?.colorScheme || 'bw'
  const motionIntensity = config.settings?.motionIntensity || 'dynamic'

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),   // First word
      setTimeout(() => setPhase(2), 800),   // Second word
      setTimeout(() => setPhase(3), 1400),  // Names
      setTimeout(() => setPhase(4), 2200),  // Date
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const getAnimationClass = () => {
    switch (motionIntensity) {
      case 'subtle': return 'duration-1000'
      case 'moderate': return 'duration-700'
      case 'dynamic': return 'duration-500'
      default: return 'duration-700'
    }
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Main Typography */}
      <div className="relative text-center px-8">
        {/* WE */}
        <div
          className={cn(
            'overflow-hidden transition-all',
            getAnimationClass(),
            phase >= 1 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <h1
            className={cn(
              'text-6xl md:text-8xl font-bold tracking-tighter transition-transform',
              getAnimationClass(),
              phase >= 1 ? 'translate-y-0' : 'translate-y-full'
            )}
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
            }}
          >
            WE
          </h1>
        </div>

        {/* ARE */}
        <div
          className={cn(
            'overflow-hidden transition-all -mt-4',
            getAnimationClass(),
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <h1
            className={cn(
              'text-6xl md:text-8xl font-bold tracking-tighter transition-transform',
              getAnimationClass(),
              phase >= 2 ? 'translate-y-0' : 'translate-y-full'
            )}
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
            }}
          >
            ARE
          </h1>
        </div>

        {/* GETTING MARRIED */}
        <div
          className={cn(
            'overflow-hidden transition-all -mt-2',
            getAnimationClass(),
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <h2
            className={cn(
              'text-xl md:text-2xl tracking-[0.3em] transition-transform delay-200',
              getAnimationClass(),
              phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            )}
            style={{
              color: colors.textMuted || colors.secondary,
              fontFamily: fonts.body.family,
            }}
          >
            GETTING MARRIED
          </h2>
        </div>

        {/* Divider Line */}
        <div
          className={cn(
            'mx-auto my-8 h-px transition-all',
            getAnimationClass(),
            phase >= 3 ? 'w-32 opacity-100' : 'w-0 opacity-0'
          )}
          style={{ backgroundColor: colors.text }}
        />

        {/* Names */}
        <div
          className={cn(
            'transition-all',
            getAnimationClass(),
            phase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <p
            className="text-3xl md:text-4xl font-medium tracking-wider"
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
            }}
          >
            {groomName}
            <span
              className="inline-block mx-4 text-2xl"
              style={{ color: colors.accent || colors.text }}
            >
              &
            </span>
            {brideName}
          </p>
        </div>

        {/* Date */}
        <div
          className={cn(
            'mt-8 transition-all',
            getAnimationClass(),
            phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <p
            className="text-sm tracking-[0.2em] font-mono"
            style={{
              color: colors.textMuted || colors.secondary,
              fontFamily: fonts.accent?.family || 'monospace',
            }}
          >
            {new Date(weddingDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).replace(/\//g, '.')}
          </p>
        </div>
      </div>

      {/* Corner Accents */}
      <div
        className={cn(
          'absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 transition-opacity',
          getAnimationClass(),
          phase >= 4 ? 'opacity-30' : 'opacity-0'
        )}
        style={{ borderColor: colors.text }}
      />
      <div
        className={cn(
          'absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 transition-opacity',
          getAnimationClass(),
          phase >= 4 ? 'opacity-30' : 'opacity-0'
        )}
        style={{ borderColor: colors.text }}
      />

      {/* Scrolling Text Background (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-5"
        style={{ color: colors.text }}
      >
        <div className="animate-marquee whitespace-nowrap text-[200px] font-bold">
          LOVE LOVE LOVE LOVE LOVE LOVE LOVE
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
