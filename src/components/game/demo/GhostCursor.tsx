'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface GhostCursorProps {
  x: number
  y: number
  isTapping: boolean
  visible: boolean
}

export function GhostCursor({ x, y, isTapping, visible }: GhostCursorProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute pointer-events-none z-30"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            x,
            y,
            opacity: 0.9,
            scale: isTapping ? 0.75 : 1,
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            x: { type: 'spring', stiffness: 200, damping: 25 },
            y: { type: 'spring', stiffness: 200, damping: 25 },
            scale: { duration: 0.1 },
            opacity: { duration: 0.2 },
          }}
          style={{
            width: 24,
            height: 24,
            marginLeft: -12,
            marginTop: -12,
          }}
        >
          {/* Main cursor circle */}
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'var(--blush-400)',
              boxShadow: '0 2px 8px rgba(223, 160, 172, 0.4)',
            }}
          />

          {/* Pulse rings on tap */}
          <AnimatePresence>
            {isTapping && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid var(--blush-300)' }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid var(--blush-200)' }}
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
