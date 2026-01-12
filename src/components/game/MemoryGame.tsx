'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import { GameBoard } from './GameBoard'
import { GameTimer } from './GameTimer'
import { GameResult } from './GameResult'
import { useMemoryGame } from './hooks/useMemoryGame'

export function MemoryGame() {
  const {
    cards,
    phase,
    mistakes,
    matchedPairs,
    totalPairs,
    elapsedTime,
    scoreResult,
    matchedPresets,
    startGame,
    selectCard,
    resetGame,
  } = useMemoryGame()

  const [previewCountdown, setPreviewCountdown] = useState(5)

  // 미리보기 카운트다운
  useEffect(() => {
    if (phase !== 'preview') {
      setPreviewCountdown(5)
      return
    }

    const interval = setInterval(() => {
      setPreviewCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(to bottom, var(--bg-warm), var(--warm-100))' }}>
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            웨딩 카드 짝 맞추기
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            같은 섹션의 카드를 찾아 짝을 맞춰보세요!
          </p>
        </div>

        {/* 시작 전 화면 */}
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="mb-6" style={{ color: 'var(--text-body)' }}>
                14가지 청첩장 섹션의 짝을 맞춰보세요!<br />
                빠르게 맞출수록 높은 점수를 받을 수 있어요.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-full font-semibold shadow-lg transition-colors"
                style={{ background: 'var(--blush-500)' }}
              >
                <Play className="w-5 h-5" />
                게임 시작
              </motion.button>
            </motion.div>
          )}

          {/* 게임 진행 중 */}
          {(phase === 'preview' || phase === 'playing') && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameTimer
                elapsedTime={elapsedTime}
                mistakes={mistakes}
                matchedPairs={matchedPairs}
                totalPairs={totalPairs}
                phase={phase}
                previewCountdown={previewCountdown}
              />

              <GameBoard
                cards={cards}
                onCardClick={selectCard}
                disabled={phase === 'preview'}
              />

              <div className="text-center mt-6">
                <button
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 px-4 py-2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  다시 시작
                </button>
              </div>
            </motion.div>
          )}

          {/* 결과 화면 */}
          {phase === 'finished' && scoreResult && (
            <motion.div
              key="finished"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8"
            >
              <GameResult
                scoreResult={scoreResult}
                matchedPresets={matchedPresets}
                onRestart={resetGame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
