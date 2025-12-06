'use client'

import * as React from 'react'
import type { IntroConfig, ColorPalette, FontSet } from '@/lib/themes/schema'
import { CinematicIntro } from './CinematicIntro'
import { ExhibitionIntro } from './ExhibitionIntro'
import { MagazineIntro } from './MagazineIntro'
import { ChatIntro } from './ChatIntro'
import type { IntroProps } from './types'

interface IntroRendererProps {
  intro: IntroConfig
  colors: ColorPalette
  fonts: FontSet
  groomName: string
  brideName: string
  weddingDate: string
  venueName?: string
  images?: string[]
  onComplete: () => void
}

export function IntroRenderer({
  intro,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  venueName,
  images,
  onComplete,
}: IntroRendererProps) {
  const [showIntro, setShowIntro] = React.useState(true)
  const [canSkip, setCanSkip] = React.useState(false)

  // Enable skip after delay
  React.useEffect(() => {
    if (intro.skipEnabled && intro.skipDelay) {
      const timer = setTimeout(() => {
        setCanSkip(true)
      }, intro.skipDelay)
      return () => clearTimeout(timer)
    } else if (intro.skipEnabled) {
      setCanSkip(true)
    }
  }, [intro.skipEnabled, intro.skipDelay])

  // Auto-complete after duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete()
    }, intro.duration)
    return () => clearTimeout(timer)
  }, [intro.duration])

  const handleComplete = () => {
    setShowIntro(false)
    onComplete()
  }

  const handleSkip = () => {
    if (canSkip) {
      handleComplete()
    }
  }

  if (!showIntro) return null

  const commonProps: IntroProps = {
    config: intro,
    colors,
    fonts,
    groomName,
    brideName,
    weddingDate,
    venueName,
    images,
    onComplete: handleComplete,
    onSkip: handleSkip,
  }

  const renderIntro = () => {
    switch (intro.type) {
      case 'cinematic':
        return <CinematicIntro {...commonProps} />
      case 'exhibition':
        return <ExhibitionIntro {...commonProps} />
      case 'magazine':
        return <MagazineIntro {...commonProps} />
      case 'chat':
        return <ChatIntro {...commonProps} />
      case 'gothic-romance':
      case 'old-money':
      case 'monogram':
      case 'jewel-velvet':
        // These themes use CinematicIntro with different styling
        return <CinematicIntro {...commonProps} />
      default:
        // For custom or unknown types, auto-complete
        handleComplete()
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50">
      {/* Mobile-first container */}
      <div className="relative w-full max-w-[480px] h-full overflow-hidden">
        {renderIntro()}

        {/* Skip Button */}
        {canSkip && (
          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-4 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 opacity-70 hover:opacity-100"
            style={{
              backgroundColor: `${colors.text}20`,
              color: colors.text,
              backdropFilter: 'blur(8px)',
            }}
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  )
}
