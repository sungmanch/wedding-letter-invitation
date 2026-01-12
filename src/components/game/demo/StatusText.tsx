'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { DemoPhase } from './constants'

interface StatusTextProps {
  phase: DemoPhase
}

export function StatusText({ phase }: StatusTextProps) {
  const showMatch = phase === 'match-success'
  const showMismatch = phase === 'mismatch-fail'

  return (
    <div className="h-6 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showMatch && (
          <motion.div
            key="match"
            className="flex items-center gap-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="w-3.5 h-3.5" style={{ color: 'rgb(16, 185, 129)' }} strokeWidth={2.5} />
            <span
              className="text-xs font-medium"
              style={{ color: 'rgb(16, 185, 129)' }}
            >
              매칭!
            </span>
          </motion.div>
        )}

        {showMismatch && (
          <motion.div
            key="mismatch"
            className="flex items-center gap-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-3.5 h-3.5" style={{ color: 'rgb(244, 63, 94)' }} strokeWidth={2.5} />
            <span
              className="text-xs font-medium"
              style={{ color: 'rgb(244, 63, 94)' }}
            >
              다시 시도!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
