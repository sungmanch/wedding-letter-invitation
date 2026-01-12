'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Sparkles } from 'lucide-react'

interface ConfettiProps {
  show: boolean
  particleCount?: number
}

const ICONS = [Heart, Star, Sparkles]
const COLORS = [
  'var(--blush-300)',
  'var(--blush-400)',
  'var(--wkw-gold)',
  'var(--warm-400)',
]

interface Particle {
  id: number
  Icon: typeof Heart
  color: string
  startX: number
  startY: number
  endX: number
  endY: number
  rotate: number
  delay: number
  duration: number
  scale: number
}

export function Confetti({ show, particleCount = 20 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (show) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        startX: Math.random() * 100,
        startY: -10,
        endX: (Math.random() - 0.5) * 40 + 50,
        endY: 110,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
        scale: 0.5 + Math.random() * 0.5,
      }))
      setParticles(newParticles)
    }
  }, [show, particleCount])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: particle.scale,
                rotate: particle.rotate,
                x: `${particle.endX - particle.startX}vw`,
                y: `${particle.endY - particle.startY}vh`,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            >
              <particle.Icon
                className="w-6 h-6"
                style={{ color: particle.color }}
                fill={particle.color}
                strokeWidth={1}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
