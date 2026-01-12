'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Clock, Gift, Heart, Layers } from 'lucide-react'
import { GameBoard } from './GameBoard'
import { GameTimer } from './GameTimer'
import { GameResult } from './GameResult'
import { GameDemo } from './demo/GameDemo'
import { useMemoryGame } from './hooks/useMemoryGame'

// ============================================
// Game Rules Data
// ============================================

const GAME_RULES = [
  {
    icon: Layers,
    title: '짝을 찾으세요',
    description: '같은 청첩장 섹션의 카드 2장을 찾아요',
  },
  {
    icon: Clock,
    title: '빠를수록 좋아요',
    description: '시간과 실수가 적을수록 높은 점수',
  },
  {
    icon: Gift,
    title: '할인코드 획득',
    description: 'B등급 이상이면 최대 50% 할인!',
  },
]

const GRADE_INFO = [
  { grade: 'S', discount: 50, color: '#C9A962' }, // WKW Gold
  { grade: 'A', discount: 30, color: '#BE6B7C' }, // Blush-600
  { grade: 'B', discount: 20, color: '#DFA0AC' }, // Blush-400
]

// ============================================
// Sub Components
// ============================================

/**
 * 카드 뒷면 일러스트 (Art Deco 스타일)
 */
function CardBackPreview({ showHeart = false, className = '' }: { showHeart?: boolean; className?: string }) {
  return (
    <div
      className={`rounded-lg card-back-pattern card-back-grain flex items-center justify-center shadow-lg border border-[var(--warm-300)] relative overflow-hidden ${className}`}
    >
      {/* 프레임 */}
      <div className="card-back-frame" />

      {/* 코너 장식 */}
      <div className="card-back-corner card-back-corner--tl" />
      <div className="card-back-corner card-back-corner--tr" />
      <div className="card-back-corner card-back-corner--bl" />
      <div className="card-back-corner card-back-corner--br" />

      {/* 중앙 하트 아이콘 */}
      {showHeart && (
        <Heart
          className="w-6 h-6 relative z-10"
          style={{ color: 'var(--blush-400)' }}
          fill="var(--blush-200)"
        />
      )}
    </div>
  )
}

/**
 * 3장의 카드가 겹쳐진 일러스트
 */
function StackedCardsIllustration() {
  return (
    <motion.div
      className="relative w-28 h-36 mx-auto mb-8"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 뒤쪽 카드 (왼쪽으로 회전) */}
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: -15, x: -10 }}
        animate={{
          rotate: [-15, -12, -15],
          x: [-10, -8, -10],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <CardBackPreview className="w-full h-full opacity-60" />
      </motion.div>

      {/* 중간 카드 (오른쪽으로 회전) */}
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 10, x: 10 }}
        animate={{
          rotate: [10, 13, 10],
          x: [10, 12, 10],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <CardBackPreview className="w-full h-full opacity-75" />
      </motion.div>

      {/* 앞쪽 카드 (정면) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <CardBackPreview showHeart className="w-full h-full" />
      </motion.div>
    </motion.div>
  )
}

/**
 * 게임 규칙 설명 섹션
 */
function GameRules() {
  return (
    <div className="space-y-3 mb-8 max-w-sm mx-auto">
      {GAME_RULES.map((rule, index) => (
        <motion.div
          key={rule.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.15 }}
          className="flex items-start gap-3 text-left"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--blush-100)' }}
          >
            <rule.icon className="w-5 h-5" style={{ color: 'var(--blush-500)' }} />
          </div>
          <div>
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {rule.title}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {rule.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * 등급별 할인율 미리보기
 */
function GradePreview() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="flex items-center justify-center gap-4 text-xs"
      style={{ color: 'var(--text-light)' }}
    >
      {GRADE_INFO.map((info) => (
        <span key={info.grade} className="inline-flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: info.color }}
          />
          <span className="font-medium" style={{ color: info.color }}>
            {info.grade}
          </span>
          <span>{info.discount}%</span>
        </span>
      ))}
    </motion.div>
  )
}

// ============================================
// Main Component
// ============================================

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
      <div className="max-w-5xl mx-auto">
        {/* 시작 전 화면 - 헤더 없이 전체 디자인 */}
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              {/* 카드 일러스트 */}
              <StackedCardsIllustration />

              {/* 타이틀 */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                웨딩 카드 짝 맞추기
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm mb-6"
                style={{ color: 'var(--text-muted)' }}
              >
                7가지 청첩장 섹션의 짝을 맞춰 할인코드를 받으세요!
              </motion.p>

              {/* 데모 애니메이션 (타이틀 바로 아래) */}
              <GameDemo />

              {/* 규칙 설명 */}
              <GameRules />

              {/* 등급별 할인율 미리보기 */}
              <GradePreview />

              {/* 게임 시작 버튼 (데모 아래) */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-full font-semibold shadow-lg transition-colors mt-8"
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
              {/* 헤더 (게임 중에만 표시) */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  웨딩 카드 짝 맞추기
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  같은 섹션의 카드를 찾아 짝을 맞춰보세요!
                </p>
              </div>

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
