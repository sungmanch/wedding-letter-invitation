'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { MiniBlockRenderer } from '@/components/landing/subway/MiniBlockRenderer'
import { PhoneFrame } from './PhoneFrame'
import { Confetti } from './Confetti'
import { useMediaQuery, BREAKPOINTS } from '@/lib/super-editor-v2/hooks/useMediaQuery'
import type { ScoreResult } from '@/lib/game/score-calculator'
import type { GamePreset } from '@/lib/game/preset-selector'
import {
  getGradeColor,
  getGradeMessage,
  formatTime,
} from '@/lib/game/score-calculator'
import { DiscountCodeReveal } from './DiscountCodeReveal'

interface GameResultProps {
  scoreResult: ScoreResult
  matchedPresets: GamePreset[]
  onRestart: () => void
}

export function GameResult({
  scoreResult,
  matchedPresets,
  onRestart,
}: GameResultProps) {
  const [showInvitation, setShowInvitation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  // 반응형 프리뷰 크기
  const isMobile = useMediaQuery(BREAKPOINTS.mobile)
  const isTablet = useMediaQuery(BREAKPOINTS.tablet)

  // PhoneFrame 내부 스크롤 영역에 맞춰 블록 높이 계산
  // 6개 블록이 스크롤 가능하도록 blockHeight를 적절히 설정
  const previewConfig = isMobile
    ? { phoneWidth: 240, phoneHeight: 480, blockWidth: 224, blockHeight: 100 }
    : isTablet
      ? { phoneWidth: 300, phoneHeight: 600, blockWidth: 284, blockHeight: 120 }
      : { phoneWidth: 340, phoneHeight: 680, blockWidth: 324, blockHeight: 140 }

  const { phoneWidth, phoneHeight, blockWidth, blockHeight } = previewConfig

  // 결과 표시 후 청첩장 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => setShowInvitation(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Confetti 3초 후 중지
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // 섹션 순서대로 정렬 및 중복 제거 (hero가 먼저, ending이 마지막)
  const orderedPresets = [...new Map(matchedPresets.map(p => [p.sectionType, p])).values()]

  return (
    <div className="text-center">
      {/* Confetti 축하 효과 */}
      <Confetti show={showConfetti} particleCount={25} />

      {/* 점수 및 등급 */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 mb-2">
          <Trophy className="w-8 h-8" style={{ color: getGradeColor(scoreResult.grade) }} />
          <span
            className="text-5xl font-bold"
            style={{ color: getGradeColor(scoreResult.grade) }}
          >
            {scoreResult.grade}
          </span>
        </div>
        <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {scoreResult.score.toLocaleString()}점
        </p>
        <p style={{ color: 'var(--text-body)' }}>{getGradeMessage(scoreResult.grade)}</p>
        <div className="flex justify-center gap-4 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <span>시간: {formatTime(scoreResult.timeSeconds * 1000)}</span>
          <span>실수: {scoreResult.mistakes}회</span>
        </div>
      </motion.div>

      {/* 할인코드 (B등급 이상) */}
      <div className="mb-8">
        <DiscountCodeReveal
          score={scoreResult.score}
          grade={scoreResult.grade}
          discountPercent={scoreResult.discountPercent}
        />
      </div>

      {/* 청첩장 조립 애니메이션 */}
      {showInvitation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <p className="text-sm mb-6" style={{ color: 'var(--text-body)' }}>
            이렇게 섹션을 조합해서 나만의 청첩장을 만들 수 있어요!
          </p>

          {/* Phone Frame 미니 청첩장 프리뷰 */}
          <div className="flex justify-center">
            <PhoneFrame width={phoneWidth} height={phoneHeight}>
              {orderedPresets.slice(0, 6).map((preset, index) => (
                <motion.div
                  key={preset.preset.id}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.15, type: 'spring' }}
                >
                  <MiniBlockRenderer
                    presetId={preset.preset.id}
                    width={blockWidth}
                    height={blockHeight}
                  />
                </motion.div>
              ))}
            </PhoneFrame>
          </div>
        </motion.div>
      )}

      {/* CTA 버튼 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-full font-semibold transition-colors"
          style={{ background: 'var(--blush-500)' }}
        >
          내 청첩장 만들기
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors"
          style={{ border: '1px solid var(--border-default)', color: 'var(--text-body)', background: 'var(--bg-pure)' }}
        >
          <RotateCcw className="w-4 h-4" />
          다시 하기
        </button>
      </motion.div>
    </div>
  )
}
