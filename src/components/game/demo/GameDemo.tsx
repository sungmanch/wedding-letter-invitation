'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SimpleDemoCard } from './SimpleDemoCard'
import { GhostCursor } from './GhostCursor'
import { StatusText } from './StatusText'
import { useDemoAnimation } from './useDemoAnimation'
import { DEMO_CARDS, CARD_SIZE } from './constants'

// Check for reduced motion preference
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

// Static fallback for reduced motion
function StaticDemoFallback() {
  return (
    <div className="text-center py-4">
      <div className="flex items-center justify-center gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgb(16, 185, 129)' }} />
          <span>같은 섹션 = 매칭!</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: 'rgb(244, 63, 94)' }} />
          <span>다른 섹션 = 다시 시도</span>
        </div>
      </div>
    </div>
  )
}

export function GameDemo() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Intersection Observer - only animate when visible
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '50px', threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Page visibility - pause when tab hidden
  useEffect(() => {
    const handleVisibility = () => setIsPaused(document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const shouldAnimate = isVisible && !isPaused && !reducedMotion
  const {
    phase,
    flippedCards,
    matchedCards,
    wrongCards,
    cursorPosition,
    isTapping,
    showCursor,
  } = useDemoAnimation(shouldAnimate)

  // Calculate grid dimensions
  const gridWidth = DEMO_CARDS.length * CARD_SIZE.width + (DEMO_CARDS.length - 1) * CARD_SIZE.gap

  if (reducedMotion) {
    return <StaticDemoFallback />
  }

  return (
    <motion.div
      ref={containerRef}
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      role="img"
      aria-label="게임 데모: 같은 섹션의 카드를 매칭하면 성공, 다른 섹션이면 실패하고 다시 시도합니다"
    >

      {/* Card grid with cursor */}
      <div className="flex justify-center">
        <div
          className="relative"
          style={{
            width: gridWidth,
            height: CARD_SIZE.height,
            opacity: 0.85,
          }}
        >
          {/* Cards */}
          <div
            className="flex gap-2"
            style={{ gap: CARD_SIZE.gap }}
          >
            {DEMO_CARDS.map((card) => (
              <SimpleDemoCard
                key={card.id}
                sectionKey={card.sectionKey}
                isFlipped={flippedCards.includes(card.id)}
                isMatched={matchedCards.includes(card.id)}
                isWrong={wrongCards.includes(card.id)}
              />
            ))}
          </div>

          {/* Ghost cursor */}
          <GhostCursor
            x={cursorPosition.x}
            y={cursorPosition.y}
            isTapping={isTapping}
            visible={showCursor}
          />
        </div>
      </div>

      {/* Status text */}
      <div className="mt-3">
        <StatusText phase={phase} />
      </div>
    </motion.div>
  )
}
