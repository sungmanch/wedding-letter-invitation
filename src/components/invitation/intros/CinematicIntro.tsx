'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * CinematicIntro - Wong Kar-wai / 화양연화 style
 * Features: Film grain animation, red/teal color overlay, vintage typography
 */
export function CinematicIntro({
  config,
  colors: _colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  venueName,
  images,
}: IntroProps) {
  const [phase, setPhase] = React.useState(0)
  const showFilmGrain = config.settings?.filmGrain ?? true

  // Wong Kar-wai signature colors
  const wkwColors = {
    red: '#8B2635',
    gold: '#C9A962',
    cream: '#F5E6D3',
    teal: '#1A4D4D',
  }

  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Fade in starts
      setTimeout(() => setPhase(2), 600),   // Line decoration
      setTimeout(() => setPhase(3), 900),   // Names
      setTimeout(() => setPhase(4), 1500),  // Date
      setTimeout(() => setPhase(5), 2100),  // Location
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
    return { formatted: `${year}. ${month}. ${day}`, weekday }
  }

  const { formatted: dateFormatted, weekday } = formatDate(weddingDate)

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Background Image Layer with flicker effect */}
      {images?.[0] && (
        <div className="absolute inset-0 film-flicker">
          <Image
            src={images[0]}
            alt="Wedding"
            fill
            className={cn(
              'object-cover transition-opacity duration-1000',
              phase >= 1 ? 'opacity-100' : 'opacity-0'
            )}
            style={{ filter: 'brightness(0.7) contrast(1.2) saturate(1.1)' }}
            priority
          />
        </div>
      )}

      {/* Red/Teal Gradient Overlay (Wong Kar-wai signature look) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(139, 38, 53, 0.4) 0%,
            rgba(180, 60, 60, 0.3) 30%,
            rgba(26, 77, 77, 0.2) 70%,
            rgba(0, 0, 0, 0.6) 100%
          )`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Gold Highlight Layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at 30% 20%,
            rgba(201, 169, 98, 0.15) 0%,
            transparent 50%
          )`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Vignette Effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.7) 100%)',
        }}
      />

      {/* Animated Film Grain Overlay */}
      {showFilmGrain && (
        <div className="absolute inset-0 grain pointer-events-none" />
      )}

      {/* Content Layer */}
      <div className="relative z-40 h-full flex flex-col justify-between px-6 py-10">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Left vertical text */}
          <div
            className={cn(
              'vertical-text text-xs tracking-widest transition-all duration-1000',
              phase >= 1 ? 'opacity-60' : 'opacity-0'
            )}
            style={{
              color: wkwColors.cream,
              fontFamily: fonts.body.family,
            }}
          >
            우리의 시작
          </div>

          {/* Right corner - Wedding label */}
          <div
            className={cn(
              'text-right transition-all duration-1000',
              phase >= 1 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: `${wkwColors.cream}80` }}
            >
              Wedding Ceremony
            </p>
          </div>
        </div>

        {/* Middle Section - Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center -mt-10">
          {/* Top decorative line */}
          <div
            className={cn(
              'transition-all duration-1000',
              phase >= 2 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div
              className="w-px h-12 mb-6"
              style={{
                background: `linear-gradient(to bottom, transparent, ${wkwColors.gold}99, transparent)`,
              }}
            />
          </div>

          {/* Names */}
          <div
            className={cn(
              'transition-all duration-1000',
              phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <h1
              className="font-light tracking-[0.2em] text-glow"
              style={{
                fontSize: '2.5rem',
                lineHeight: 1.1,
                color: wkwColors.cream,
                fontFamily: fonts.title.family,
              }}
            >
              {groomName}
            </h1>
            <p
              className="text-lg my-3 tracking-widest"
              style={{ color: `${wkwColors.gold}cc` }}
            >
              &
            </p>
            <h1
              className="font-light tracking-[0.2em] text-glow"
              style={{
                fontSize: '2.5rem',
                lineHeight: 1.1,
                color: wkwColors.cream,
                fontFamily: fonts.title.family,
              }}
            >
              {brideName}
            </h1>
          </div>

          {/* Decorative divider */}
          <div
            className={cn(
              'my-8 transition-all duration-1000',
              phase >= 4 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${wkwColors.gold}80)`,
                }}
              />
              <div
                className="w-1.5 h-1.5 rotate-45"
                style={{ backgroundColor: `${wkwColors.gold}99` }}
              />
              <div
                className="w-12 h-px"
                style={{
                  background: `linear-gradient(to left, transparent, ${wkwColors.gold}80)`,
                }}
              />
            </div>
          </div>

          {/* Date */}
          <div
            className={cn(
              'transition-all duration-1000',
              phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <p
              className="text-sm tracking-[0.25em] mb-1"
              style={{
                color: `${wkwColors.cream}e6`,
                fontFamily: fonts.title.family,
              }}
            >
              {dateFormatted}
            </p>
            <p
              className="text-xs tracking-[0.3em]"
              style={{ color: `${wkwColors.cream}99` }}
            >
              {weekday}
            </p>
          </div>
        </div>

        {/* Bottom Section - Location */}
        <div
          className={cn(
            'transition-all duration-1000',
            phase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div
            className="border-t pt-6"
            style={{ borderColor: `${wkwColors.gold}33` }}
          >
            <p
              className="text-[10px] tracking-[0.4em] uppercase mb-2"
              style={{ color: `${wkwColors.cream}66` }}
            >
              Location
            </p>
            {venueName && (
              <>
                <p
                  className="text-sm tracking-wider"
                  style={{
                    color: `${wkwColors.cream}e6`,
                    fontFamily: fonts.body.family,
                  }}
                >
                  {venueName}
                </p>
              </>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex flex-col items-center gap-2 opacity-50">
              <p
                className="text-[8px] tracking-[0.3em] uppercase"
                style={{ color: `${wkwColors.cream}80` }}
              >
                Scroll
              </p>
              <div
                className="w-px h-6 animate-pulse"
                style={{
                  background: `linear-gradient(to bottom, ${wkwColors.cream}80, transparent)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Film frame edges */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-40"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1 z-40"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
        }}
      />

      {/* Styles */}
      <style jsx>{`
        /* Film grain animation */
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        .grain::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.15;
          pointer-events: none;
          animation: grain 0.5s steps(10) infinite;
          z-index: 50;
        }

        /* Film flicker effect */
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
          75% { opacity: 0.99; }
        }

        .film-flicker {
          animation: flicker 0.15s infinite;
        }

        /* Vertical text */
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        /* Text glow effect */
        .text-glow {
          text-shadow:
            0 0 40px rgba(220, 38, 38, 0.3),
            0 0 80px rgba(220, 38, 38, 0.2);
        }
      `}</style>
    </div>
  )
}
