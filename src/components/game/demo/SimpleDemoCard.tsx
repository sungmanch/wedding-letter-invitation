'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Check, X, Grid3X3, CalendarDays, Users, MapPin } from 'lucide-react'
import { DEMO_SECTIONS, CARD_SIZE } from './constants'

// Section type to icon mapping
const SECTION_ICONS = {
  gallery: Grid3X3,
  calendar: CalendarDays,
  profile: Users,
  location: MapPin,
} as const

interface SimpleDemoCardProps {
  sectionKey: keyof typeof DEMO_SECTIONS
  isFlipped: boolean
  isMatched: boolean
  isWrong: boolean
}

export function SimpleDemoCard({
  sectionKey,
  isFlipped,
  isMatched,
  isWrong,
}: SimpleDemoCardProps) {
  const section = DEMO_SECTIONS[sectionKey]
  const Icon = SECTION_ICONS[sectionKey]

  return (
    <motion.div
      className="relative"
      style={{
        width: CARD_SIZE.width,
        height: CARD_SIZE.height,
        perspective: 600,
      }}
      animate={isWrong ? { x: [-3, 3, -3, 3, 0] } : {}}
      transition={isWrong ? { duration: 0.4 } : {}}
    >
      {/* Card inner (rotating part) */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Back side (default) - Simplified Art Deco */}
        <div
          className="absolute inset-0 rounded card-back-pattern card-back-grain flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid var(--warm-300)',
          }}
        >
          {/* Mini frame */}
          <div
            className="absolute rounded"
            style={{
              inset: 3,
              border: '1px solid var(--wkw-gold)',
              opacity: 0.3,
            }}
          />
          {/* Center heart */}
          <Heart
            className="w-3 h-3"
            style={{ color: 'var(--blush-400)' }}
            fill="var(--blush-200)"
          />
        </div>

        {/* Front side (section icon + label) */}
        <div
          className="absolute inset-0 rounded flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: section.color,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Icon className="w-4 h-4 text-white mb-0.5" strokeWidth={2} />
          <span className="text-[7px] text-white font-medium tracking-tight">
            {section.name}
          </span>
        </div>
      </motion.div>

      {/* Match success overlay */}
      <AnimatePresence>
        {isMatched && (
          <motion.div
            className="absolute inset-0 rounded flex items-center justify-center z-10"
            style={{ background: 'rgba(16, 185, 129, 0.2)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgb(16, 185, 129)' }}
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mismatch failure overlay */}
      <AnimatePresence>
        {isWrong && (
          <motion.div
            className="absolute inset-0 rounded flex items-center justify-center z-10"
            style={{ background: 'rgba(244, 63, 94, 0.2)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgb(244, 63, 94)' }}
            >
              <X className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
