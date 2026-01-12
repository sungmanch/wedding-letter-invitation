'use client'

import { motion } from 'framer-motion'
import { MemoryCard } from './MemoryCard'
import { useMediaQuery, BREAKPOINTS } from '@/lib/super-editor-v2/hooks/useMediaQuery'
import type { GameCard } from '@/lib/game/preset-selector'

interface CardState {
  card: GameCard
  status: 'hidden' | 'revealed' | 'matched'
  isWrong: boolean
}

interface GameBoardProps {
  cards: CardState[]
  onCardClick: (cardId: number) => void
  disabled: boolean
}

// 반응형 레이아웃 설정
const LAYOUT_CONFIG = {
  mobile: { columns: 3, cardWidth: 90, cardHeight: 135, gap: 8 },
  tablet: { columns: 4, cardWidth: 110, cardHeight: 165, gap: 10 },
  desktop: { columns: 7, cardWidth: 120, cardHeight: 180, gap: 12 },
} as const

export function GameBoard({
  cards,
  onCardClick,
  disabled,
}: GameBoardProps) {
  // 반응형 브레이크포인트 감지
  const isMobile = useMediaQuery(BREAKPOINTS.mobile)
  const isTablet = useMediaQuery(BREAKPOINTS.tablet)

  // 화면 크기에 따른 레이아웃 선택
  const layout = isMobile
    ? LAYOUT_CONFIG.mobile
    : isTablet
      ? LAYOUT_CONFIG.tablet
      : LAYOUT_CONFIG.desktop

  const { columns, cardWidth, cardHeight, gap } = layout

  return (
    <motion.div
      className="flex justify-center px-2 sm:px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${cardWidth}px)`,
          gap: `${gap}px`,
        }}
      >
        {cards.map((cardState, index) => (
          <motion.div
            key={cardState.card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
          >
            <MemoryCard
              card={cardState.card}
              status={cardState.status}
              isWrong={cardState.isWrong}
              onClick={() => onCardClick(cardState.card.id)}
              disabled={disabled}
              width={cardWidth}
              height={cardHeight}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
