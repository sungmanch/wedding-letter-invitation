'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * ExhibitionIntro - Virtual gallery/museum style
 * Features: Frame entrance, minimal typography, horizontal navigation hint
 */
export function ExhibitionIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  images,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const frameStyle = config.settings?.frameStyle || 'minimal'

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Frame appears
      setTimeout(() => setPhase(2), 1000),  // Image fades in
      setTimeout(() => setPhase(3), 2000),  // Text appears
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Exhibition Title */}
      <div
        className={cn(
          'absolute top-8 left-0 right-0 text-center transition-all duration-1000',
          phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        )}
      >
        <p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: colors.textMuted }}
        >
          Exhibition
        </p>
      </div>

      {/* Main Frame */}
      <div
        className={cn(
          'relative transition-all duration-1000 ease-out',
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {/* Frame Border */}
        <div
          className={cn(
            'p-4 md:p-6',
            frameStyle === 'minimal' && 'border border-gray-200',
            frameStyle === 'classic' && 'border-4 border-gray-800',
            frameStyle === 'ornate' && 'border-8 border-double border-amber-700'
          )}
          style={{
            backgroundColor: colors.surface || '#FFFFFF',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          }}
        >
          {/* Image Container */}
          <div
            className={cn(
              'relative w-64 h-80 md:w-72 md:h-96 overflow-hidden transition-opacity duration-1000',
              phase >= 2 ? 'opacity-100' : 'opacity-0'
            )}
          >
            {images?.[0] ? (
              <Image
                src={images[0]}
                alt="Wedding"
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: colors.background }}
              >
                <span style={{ color: colors.textMuted }}>사진</span>
              </div>
            )}
          </div>
        </div>

        {/* Museum Label */}
        <div
          className={cn(
            'mt-6 text-center transition-all duration-1000',
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <h1
            className="text-xl md:text-2xl mb-2"
            style={{
              color: colors.text,
              fontFamily: fonts.title.family,
              fontStyle: fonts.title.style || 'normal',
            }}
          >
            {groomName} & {brideName}
          </h1>
          <p
            className="text-sm"
            style={{
              color: colors.textMuted,
              fontFamily: fonts.body.family,
            }}
          >
            {new Date(weddingDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Navigation Hint */}
      <div
        className={cn(
          'absolute bottom-8 left-0 right-0 flex justify-center gap-2 transition-opacity duration-1000',
          phase >= 3 ? 'opacity-100' : 'opacity-0'
        )}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === 0 ? 'w-6' : ''
            )}
            style={{
              backgroundColor: i === 0 ? colors.text : `${colors.text}30`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
