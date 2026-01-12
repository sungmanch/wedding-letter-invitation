'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface MatchSparklesProps {
  show: boolean
  count?: number
}

export function MatchSparkles({ show, count = 5 }: MatchSparklesProps) {
  // 랜덤 위치/회전/딜레이를 가진 파티클 배열 생성
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 60,
    y: (Math.random() - 0.5) * 60,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.2,
    scale: 0.5 + Math.random() * 0.5,
  }))

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute top-1/2 left-1/2"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                x: sparkle.x,
                y: sparkle.y - 30,
                scale: sparkle.scale,
                opacity: [0, 1, 0],
                rotate: sparkle.rotate,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: sparkle.delay,
                ease: 'easeOut',
              }}
            >
              <Sparkles
                className="w-4 h-4"
                style={{ color: 'var(--wkw-gold)' }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
