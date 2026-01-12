'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { MiniBlockRenderer } from '@/components/landing/subway/MiniBlockRenderer'
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
        {/* 뒷면 (기본 상태) */}
        <div
          className="absolute inset-0 rounded-lg shadow-md flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
            border: '1px solid #d6d3d1',
          }}
        >
          <div className="text-center">
            <div className="text-xs font-medium text-stone-400">Maison de</div>
            <div className="text-sm font-semibold text-stone-500">Letter</div>
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

      {/* 매칭 완료 체크마크 */}
      <AnimatePresence>
        {status === 'matched' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
