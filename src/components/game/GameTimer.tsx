'use client'

import { motion } from 'framer-motion'
import { Clock, AlertCircle } from 'lucide-react'
import { formatTime } from '@/lib/game/score-calculator'

interface GameTimerProps {
  elapsedTime: number
  mistakes: number
  matchedPairs: number
  totalPairs: number
  phase: 'idle' | 'preview' | 'playing' | 'finished'
  previewCountdown?: number  // 미리보기 남은 시간 (초)
}

export function GameTimer({
  elapsedTime,
  mistakes,
  matchedPairs,
  totalPairs,
  phase,
  previewCountdown,
}: GameTimerProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-4 px-4">
      {/* 타이머 */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        <span className="text-lg font-mono font-semibold" style={{ color: 'var(--text-body)' }}>
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* 미리보기 카운트다운 */}
      {phase === 'preview' && previewCountdown !== undefined && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>카드를 외우세요!</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--blush-500)' }}>{previewCountdown}</p>
        </motion.div>
      )}

      {/* 진행 상황 */}
      <div className="flex items-center gap-4">
        {/* 실수 횟수 */}
        <div className="flex items-center gap-1">
          <AlertCircle className="w-4 h-4" style={{ color: 'var(--blush-400)' }} />
          <span className="text-sm" style={{ color: 'var(--text-body)' }}>{mistakes}</span>
        </div>

        {/* 매칭 진행률 */}
        <div className="text-sm" style={{ color: 'var(--text-body)' }}>
          {matchedPairs}/{totalPairs}
        </div>
      </div>
    </div>
  )
}
