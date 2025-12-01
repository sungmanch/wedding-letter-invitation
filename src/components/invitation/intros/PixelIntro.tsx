'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * PixelIntro - 8-bit retro game style
 * Features: Pixel art, game title screen, press start prompt
 */
export function PixelIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const [blinkVisible, setBlinkVisible] = React.useState(true)
  const gameTitle = config.settings?.gameTitle || 'WEDDING QUEST'

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Title appears
      setTimeout(() => setPhase(2), 1500),  // Characters appear
      setTimeout(() => setPhase(3), 2500),  // Press start
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Blinking effect for "Press Start"
  React.useEffect(() => {
    if (phase >= 3) {
      const interval = setInterval(() => {
        setBlinkVisible(v => !v)
      }, 500)
      return () => clearInterval(interval)
    }
  }, [phase])

  // Simple pixel heart
  const PixelHeart = () => (
    <div className="grid grid-cols-7 gap-0.5">
      {[
        [0,1,1,0,1,1,0],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0],
      ].flat().map((filled, i) => (
        <div
          key={i}
          className="w-2 h-2"
          style={{
            backgroundColor: filled ? colors.accent : 'transparent',
          }}
        />
      ))}
    </div>
  )

  // Simple pixel character
  const PixelCharacter = ({ isGroom }: { isGroom: boolean }) => (
    <div className="grid grid-cols-5 gap-0.5">
      {(isGroom ? [
        [0,1,1,1,0],
        [1,1,1,1,1],
        [0,1,0,1,0],
        [0,1,1,1,0],
        [1,1,1,1,1],
        [0,1,0,1,0],
        [0,1,0,1,0],
      ] : [
        [0,1,1,1,0],
        [1,1,1,1,1],
        [0,1,0,1,0],
        [0,1,1,1,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [0,1,0,1,0],
      ]).flat().map((filled, i) => (
        <div
          key={i}
          className="w-3 h-3"
          style={{
            backgroundColor: filled ? (isGroom ? colors.primary : colors.accent) : 'transparent',
          }}
        />
      ))}
    </div>
  )

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Scanlines Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            ${colors.text} 0px,
            ${colors.text} 1px,
            transparent 1px,
            transparent 3px
          )`,
        }}
      />

      {/* Game Title */}
      <div
        className={cn(
          'text-center mb-12 transition-all duration-500',
          phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        )}
      >
        <h1
          className="text-2xl md:text-4xl tracking-wider mb-2"
          style={{
            color: colors.text,
            fontFamily: fonts.title.family,
            textShadow: `4px 4px 0 ${colors.secondary}`,
          }}
        >
          {gameTitle}
        </h1>
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2"
              style={{ backgroundColor: i < 3 ? colors.accent : `${colors.text}30` }}
            />
          ))}
        </div>
      </div>

      {/* Characters with Heart */}
      <div
        className={cn(
          'flex items-center gap-8 mb-12 transition-all duration-700',
          phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <PixelCharacter isGroom={true} />
          <p
            className="text-xs tracking-wider"
            style={{
              color: colors.text,
              fontFamily: fonts.body.family,
            }}
          >
            {groomName}
          </p>
        </div>

        <div className="animate-bounce">
          <PixelHeart />
        </div>

        <div className="flex flex-col items-center gap-2">
          <PixelCharacter isGroom={false} />
          <p
            className="text-xs tracking-wider"
            style={{
              color: colors.text,
              fontFamily: fonts.body.family,
            }}
          >
            {brideName}
          </p>
        </div>
      </div>

      {/* Press Start */}
      <div
        className={cn(
          'transition-all duration-500',
          phase >= 3 ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p
          className="text-sm tracking-[0.3em]"
          style={{
            color: colors.text,
            fontFamily: fonts.body.family,
            opacity: blinkVisible ? 1 : 0,
          }}
        >
          ▶ PRESS START
        </p>
      </div>

      {/* Bottom Stats */}
      <div
        className={cn(
          'absolute bottom-8 left-0 right-0 flex justify-center gap-8 transition-opacity duration-500',
          phase >= 2 ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="text-center">
          <p className="text-[10px]" style={{ color: colors.textMuted }}>LV</p>
          <p className="text-sm font-bold" style={{ color: colors.text }}>99</p>
        </div>
        <div className="text-center">
          <p className="text-[10px]" style={{ color: colors.textMuted }}>LOVE</p>
          <p className="text-sm font-bold" style={{ color: colors.accent }}>∞</p>
        </div>
        <div className="text-center">
          <p className="text-[10px]" style={{ color: colors.textMuted }}>HP</p>
          <p className="text-sm font-bold" style={{ color: colors.primary }}>MAX</p>
        </div>
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-4 left-4 text-xs"
        style={{ color: colors.textMuted }}
      >
        1P
      </div>
      <div
        className="absolute top-4 right-4 text-xs"
        style={{ color: colors.textMuted }}
      >
        2P
      </div>
    </div>
  )
}
