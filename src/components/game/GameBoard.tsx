'use client'

import { motion } from 'framer-motion'
import { MemoryCard } from './MemoryCard'
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
  columns?: number  // 기본 7열
}

export function GameBoard({
  cards,
  onCardClick,
  disabled,
  columns = 7,
}: GameBoardProps) {
  // 카드 크기 (7열 2행에 맞게 크게)
  const cardWidth = 120
  const cardHeight = 180
  const gap = 12

  return (
    <motion.div
      className="flex justify-center overflow-x-auto px-4"
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
