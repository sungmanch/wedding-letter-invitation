'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Heart } from 'lucide-react'
import { MiniBlockRenderer } from '@/components/landing/subway/MiniBlockRenderer'
import { MatchSparkles } from './MatchSparkles'
import type { GameCard } from '@/lib/game/preset-selector'

interface MemoryCardProps {
  card: GameCard
  status: 'hidden' | 'revealed' | 'matched'
  isWrong: boolean
  onClick: () => void
  disabled: boolean
  width?: number
  height?: number
}

export function MemoryCard({
  card,
  status,
  isWrong,
  onClick,
  disabled,
  width = 80,
  height = 120,
}: MemoryCardProps) {
  const isFlipped = status === 'revealed' || status === 'matched'

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{
        width,
        height,
        perspective: 1000,
      }}
      onClick={() => !disabled && onClick()}
      animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={isWrong ? { duration: 0.4 } : {}}
    >
      {/* 카드 내부 (회전하는 부분) */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* 뒷면 (기본 상태) - Art Deco Design */}
        <div
          className="absolute inset-0 rounded-lg shadow-lg card-back-pattern card-back-grain flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            border: '1px solid var(--warm-300)',
          }}
        >
          {/* Inner frame */}
          <div className="card-back-frame" />

          {/* Corner decorations */}
          <div className="card-back-corner card-back-corner--tl" />
          <div className="card-back-corner card-back-corner--tr" />
          <div className="card-back-corner card-back-corner--bl" />
          <div className="card-back-corner card-back-corner--br" />

          {/* Center logo */}
          <div className="card-back-logo">
            {/* Wedding card icon */}
            <div
              className="w-8 h-10 mx-auto mb-2 rounded-sm flex items-center justify-center"
              style={{
                background: 'linear-gradient(180deg, var(--warm-100) 0%, var(--warm-200) 100%)',
                border: '1px solid var(--wkw-gold)',
                boxShadow: '0 2px 8px rgba(201, 169, 98, 0.2)',
              }}
            >
              <Heart
                style={{ color: 'var(--blush-400)', width: 14, height: 14 }}
                strokeWidth={1.5}
                fill="var(--blush-200)"
              />
            </div>

            <div
              className="text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--wkw-gold)' }}
            >
              Maison de
            </div>
            <div
              className="text-sm font-semibold tracking-wide"
              style={{ color: 'var(--blush-500)' }}
            >
              Letter
            </div>
          </div>
        </div>

        {/* 앞면 (프리셋 렌더링) */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden shadow-md"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <MiniBlockRenderer
            presetId={card.gamePreset.preset.id}
            width={width}
            height={height}
          />

          {/* 섹션 이름 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2">
            <p className="text-[10px] text-white text-center truncate">
              {card.gamePreset.sectionName}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 매칭 완료 효과 */}
      <AnimatePresence>
        {status === 'matched' && (
          <>
            {/* Sparkle particles */}
            <MatchSparkles show={true} count={5} />

            {/* Check mark overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(223, 160, 172, 0.2)' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--blush-500)' }}>
                <Check className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
