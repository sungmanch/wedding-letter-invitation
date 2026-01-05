'use client'

/**
 * Hero Section
 *
 * 감정적 Hook + Multi-Line Card Carousel (슬롯머신 정렬 방식)
 * - 캐치프레이즈: "당신만의 이야기를 담은 청첩장"
 * - 4개 라인이 독립적으로 흐르다 중앙 카드가 세로 정렬되면 멈춤
 * - Primary CTA: 스크롤 유도
 */

import { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { MiniHeroRenderer, MiniBlockRenderer } from '../subway/MiniBlockRenderer'
import { TEMPLATE_IDS } from '../subway/SubwayBuilderContext'
import { PaperInvitationModal } from './PaperInvitationModal'

// ============================================
// Constants
// ============================================

// 멈춤 없이 계속 흐르는 무한 캐러셀

// 4개 라인 데이터 정의 (슬롯머신 스타일)
const CAROUSEL_LINES: CarouselLineConfig[] = [
  {
    type: 'hero',
    ids: [...TEMPLATE_IDS],
    direction: 'right',
    label: '인트로',
    speed: 50, // px/sec
  },
  {
    type: 'preset',
    ids: [
      'greeting-parents-minimal',
      'greeting-parents-with-divider',
      'greeting-parents-natural-sparkle',
      'greeting-parents-balloon-heart',
      'greeting-parents-ribbon',
    ],
    direction: 'left',
    label: '인사말',
    speed: 40,
  },
  {
    type: 'preset',
    ids: [
      'calendar-korean-countdown-box',
      'calendar-heart-strip-countdown',
    ],
    direction: 'right',
    label: '예식일시',
    speed: 45,
  },
]

// ============================================
// Types
// ============================================

interface CarouselLineConfig {
  type: 'hero' | 'preset'
  ids: string[]
  direction: 'left' | 'right'
  label: string
  speed: number // px/sec
}

// ============================================
// Component
// ============================================

export function HeroSection() {
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false)

  // 스크롤 유도 버튼
  const handleScrollDown = useCallback(() => {
    const builderSection = document.getElementById('builder-section')
    if (builderSection) {
      builderSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--ivory-50)] via-[var(--ivory-100)] to-[var(--sage-50)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--sage-100)_0%,transparent_50%)] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--sand-100)_0%,transparent_50%)] opacity-40" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* 왼쪽: 텍스트 (40%) */}
        <div className="flex-shrink-0 lg:w-[40%] text-center lg:text-left max-w-xl">
          {/* 배지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--sage-100)] text-[var(--sage-700)] text-sm font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage-500)]" />
            프리미엄 청첩장 서비스
          </motion.div>

          {/* 헤드라인 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-heading, Noto Serif KR), serif' }}
          >
            <span className="text-[var(--text-primary)]">당신만의 이야기를</span>
            <br />
            <span className="text-[var(--sage-600)]">담은 청첩장</span>
          </motion.h1>

          {/* 서브헤드 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed mb-8"
          >
            섹션별로 골라 담는
            <br className="hidden sm:block" />
            나만의 청첩장을 만들어보세요
          </motion.p>

          {/* CTA 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col items-center lg:items-start gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="sage"
                size="lg"
                onClick={handleScrollDown}
                className="group"
              >
                지금 바로 시작하기
                <ChevronDown className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-1" />
              </Button>
            </div>

            {/* 종이 청첩장과 똑같이 만들기 버튼 */}
            <button
              onClick={() => setIsPaperModalOpen(true)}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--sand-200)] bg-white/80 hover:bg-white hover:border-[var(--sage-300)] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[var(--sage-500)]" />
              <span className="text-sm text-[var(--text-body)] group-hover:text-[var(--sage-600)]">
                종이 청첩장과 똑같이 만들기
              </span>
              <Badge className="bg-[var(--sage-100)] text-[var(--sage-700)] border-[var(--sage-200)] text-[10px] px-1.5 py-0.5">
                Beta
              </Badge>
            </button>
          </motion.div>

          {/* Paper Invitation Modal */}
          <PaperInvitationModal
            open={isPaperModalOpen}
            onOpenChange={setIsPaperModalOpen}
          />
        </div>

        {/* 오른쪽: Multi-Line Card Carousel (60%) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 lg:w-[60%] overflow-hidden"
        >
          <MultiLineCarousel />
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-2 text-[var(--text-light)] hover:text-[var(--sage-600)] transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  )
}

// ============================================
// Sub Components
// ============================================

// 카드 크기 설정: 인트로(Hero)는 크게, 나머지는 작게
interface CardSizeConfig {
  hero: { width: number; height: number; gap: number }
  preset: { width: number; height: number; gap: number }
}

function getCardSizes(screenWidth: number): CardSizeConfig {
  if (screenWidth < 640) {
    // 모바일
    return {
      hero: { width: 80, height: 142, gap: 12 },
      preset: { width: 64, height: 96, gap: 10 },
    }
  } else if (screenWidth < 1024) {
    // 태블릿
    return {
      hero: { width: 100, height: 178, gap: 16 },
      preset: { width: 80, height: 120, gap: 12 },
    }
  } else {
    // 데스크탑
    return {
      hero: { width: 120, height: 213, gap: 16 },
      preset: { width: 90, height: 135, gap: 14 },
    }
  }
}

/**
 * MultiLineCarousel: 4개 라인의 카드 캐러셀
 *
 * 멈춤 없이 계속 흐르는 무한 스크롤
 * - DOM 직접 조작으로 60fps 부드러운 애니메이션
 * - 각 라인별 독립 속도/방향
 * - 인트로는 크게, 나머지 섹션은 작게 (시각적 위계)
 */
function MultiLineCarousel() {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const offsetsRef = useRef<number[]>(CAROUSEL_LINES.map(() => 0))
  const lastTimeRef = useRef<number>(0)
  const animationRef = useRef<number>(0)

  // 반응형 카드 크기 (인트로/프리셋 구분)
  const [cardSizes, setCardSizes] = useState<CardSizeConfig>(getCardSizes(1024))

  // 반응형 카드 크기 업데이트
  useEffect(() => {
    const updateSize = () => {
      setCardSizes(getCardSizes(window.innerWidth))
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // 각 라인별 카드 크기 및 전체 너비 계산
  const lineMetrics = useMemo(() => {
    return CAROUSEL_LINES.map((line) => {
      const metrics = line.type === 'hero' ? cardSizes.hero : cardSizes.preset
      const cardTotalWidth = metrics.width + metrics.gap
      const lineWidth = line.ids.length * cardTotalWidth
      return { metrics, cardTotalWidth, lineWidth }
    })
  }, [cardSizes])

  // 애니메이션 루프 - DOM 직접 조작 (멈춤 없이 계속 흐름)
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }

      const delta = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      // 오프셋 업데이트
      offsetsRef.current = offsetsRef.current.map((offset, i) => {
        const line = CAROUSEL_LINES[i]
        const direction = line.direction === 'right' ? 1 : -1
        return offset + direction * line.speed * delta
      })

      // DOM 직접 업데이트 (React 리렌더 없음!)
      lineRefs.current.forEach((el, i) => {
        if (!el) return
        const { lineWidth } = lineMetrics[i]
        const normalizedOffset = ((offsetsRef.current[i] % lineWidth) + lineWidth) % lineWidth
        const adjustedOffset = normalizedOffset - lineWidth * 2
        el.style.transform = `translateX(${adjustedOffset}px)`
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [lineMetrics])

  return (
    <div className="relative flex flex-col gap-3 lg:gap-4">
      {CAROUSEL_LINES.map((line, lineIndex) => (
        <CardLine
          key={line.label}
          ref={(el) => {
            lineRefs.current[lineIndex] = el
          }}
          type={line.type}
          ids={line.ids}
          label={line.label}
          lineWidth={lineMetrics[lineIndex].lineWidth}
          cardMetrics={lineMetrics[lineIndex].metrics}
        />
      ))}
    </div>
  )
}

/**
 * CardLine: 단일 라인의 무한 스크롤 카드들
 *
 * forwardRef로 DOM 참조 전달 - 부모에서 직접 transform 조작
 * - 무한 스크롤을 위해 5배 복제 (양쪽으로 충분한 여유)
 * - 라벨은 카드 영역 바깥 왼쪽에 고정 (가독성 확보)
 */
interface CardLineProps {
  type: 'hero' | 'preset'
  ids: string[]
  label: string
  lineWidth: number // 원본 아이템들의 전체 너비
  cardMetrics: { width: number; height: number; gap: number }
}

const CardLine = forwardRef<HTMLDivElement, CardLineProps>(
  ({ type, ids, label, lineWidth, cardMetrics }, ref) => {
    // 무한 스크롤을 위해 아이템 5배 복제 (양쪽으로 충분한 여유)
    const duplicatedIds = useMemo(() => [...ids, ...ids, ...ids, ...ids, ...ids], [ids])

    // 초기 위치: 가운데 세트가 보이도록 2 세트 분량만큼 앞으로
    const initialOffset = -lineWidth * 2

    // 인트로(hero)는 더 큰 라벨
    const isHero = type === 'hero'

    return (
      <div className="relative flex items-center">
        {/* 라벨 - 왼쪽 고정, 세로 중앙 정렬 */}
        <div
          className="flex-shrink-0 z-20 flex items-center justify-center"
          style={{
            width: isHero ? 80 : 64, // Hero 라벨이 더 길어서 공간 확보 필요
            height: cardMetrics.height, // 카드 높이에 맞춤
          }}
        >
          <span
            className={`
              inline-flex items-center justify-center
              whitespace-nowrap
              border border-[var(--sage-200)]
              shadow-sm
              ${isHero
                ? 'text-xs lg:text-sm font-medium text-[var(--sage-700)] bg-[var(--sage-50)] px-3 py-1.5 rounded-md'
                : 'text-[10px] lg:text-xs text-[var(--text-muted)] bg-white/95 px-2.5 py-1 rounded-full'
              }
            `}
          >
            {label}
          </span>
        </div>

        {/* 스크롤 컨테이너 */}
        <div className="overflow-hidden flex-1">
          <div
            ref={ref}
            className="flex will-change-transform"
            style={{
              gap: cardMetrics.gap,
              transform: `translateX(${initialOffset}px)`,
            }}
          >
            {duplicatedIds.map((id, index) => (
              <div
                key={`${id}-${index}`}
                className={`flex-shrink-0 overflow-hidden ${isHero ? 'rounded-lg shadow-md' : 'rounded-md shadow-sm'}`}
                style={{
                  width: cardMetrics.width,
                  height: cardMetrics.height,
                }}
              >
                {type === 'hero' ? (
                  <MiniHeroRenderer
                    templateId={id}
                    width={cardMetrics.width}
                    height={cardMetrics.height}
                  />
                ) : (
                  <MiniBlockRenderer
                    presetId={id}
                    width={cardMetrics.width}
                    height={cardMetrics.height}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 페이드 마스크 (우측) */}
        <div className="absolute right-0 top-0 bottom-0 w-12 lg:w-20 bg-gradient-to-l from-[var(--ivory-100)] to-transparent pointer-events-none z-10" />
      </div>
    )
  }
)

CardLine.displayName = 'CardLine'
