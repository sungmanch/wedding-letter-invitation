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
      {/* 배경 그라데이션 - Clean Modern (2025 Redesign) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-pure)] via-[var(--bg-warm)] to-[var(--blush-50)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--blush-100)_0%,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--warm-100)_0%,transparent_50%)] opacity-30" />
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--blush-100)] text-[var(--blush-600)] text-sm font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--blush-400)]" />
            셀프 모바일 청첩장
          </motion.div>

          {/* 말풍선 1 - Pain Point */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="relative self-start lg:self-start mb-6"
          >
            <div className="relative bg-[var(--warm-100)] border border-[var(--warm-300)] rounded-2xl px-4 py-3 shadow-md transition-shadow hover:shadow-lg">
              <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
                "여기 인트로는 이쁜데
                <br />
                <span className="text-rose-400 font-medium">포토앨범 형식</span>이 별로야.."
              </p>
              {/* 말풍선 꼬리 */}
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-[var(--warm-100)] border-r border-b border-[var(--warm-300)] transform rotate-45" />
            </div>
          </motion.div>

          {/* 말풍선 2 - 공감 */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="relative self-end lg:self-end lg:ml-12 mb-8"
          >
            <div className="relative bg-[var(--blush-100)] border border-[var(--blush-300)] rounded-2xl px-4 py-3 shadow-md transition-shadow hover:shadow-lg">
              <p className="text-sm sm:text-base text-[var(--text-body)] leading-relaxed">
                "아, 여기 <span className="text-teal-400 font-medium">인터뷰 섹션</span>이
                <br />
                마음에 드는데..?"
              </p>
              {/* 말풍선 꼬리 */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[var(--blush-100)] border-r border-b border-[var(--blush-300)] transform rotate-45" />
            </div>
          </motion.div>

          {/* 해결책 헤드라인 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mb-8"
          >
            <p
              className="text-xl sm:text-2xl lg:text-3xl font-medium text-[var(--text-primary)] leading-snug"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              꽃다발 구성하듯,
              <br />
              <span className="text-[var(--blush-500)]">원하는 섹션만</span> 골라 담으세요.
            </p>
          </motion.div>

          {/* CTA 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="flex flex-col items-center lg:items-start gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="rose"
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
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--warm-200)] bg-white/80 hover:bg-white hover:border-[var(--blush-300)] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[var(--blush-400)]" />
              <span className="text-sm text-[var(--text-body)] group-hover:text-[var(--blush-500)]">
                종이 청첩장과 똑같이 만들기
              </span>
              <Badge className="bg-[var(--blush-100)] text-[var(--blush-600)] border-[var(--blush-200)] text-[10px] px-1.5 py-0.5">
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
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-2 text-[var(--text-light)] hover:text-[var(--blush-500)] transition-colors"
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

// 카드별 고정 회전각 생성 (일관된 시각적 리듬)
const CARD_ROTATIONS = [-2, 1.5, -1, 2, -1.5, 0.5, -2, 1, -0.5, 2]

const CardLine = forwardRef<HTMLDivElement, CardLineProps>(
  ({ type, ids, label, lineWidth, cardMetrics }, ref) => {
    // 무한 스크롤을 위해 아이템 5배 복제 (양쪽으로 충분한 여유)
    const duplicatedIds = useMemo(() => [...ids, ...ids, ...ids, ...ids, ...ids], [ids])

    // 초기 위치: 가운데 세트가 보이도록 2 세트 분량만큼 앞으로
    const initialOffset = -lineWidth * 2

    // 인트로(hero)는 더 큰 라벨
    const isHero = type === 'hero'

    return (
      <div className="relative flex flex-col gap-2">
        {/* 라벨 - 상단 배치 */}
        <div className="px-1">
          <span
            className={`
              text-xs lg:text-sm font-medium tracking-wide
              ${isHero ? 'text-[var(--blush-500)]' : 'text-[var(--text-muted)]'}
            `}
          >
            {label}
          </span>
        </div>

        {/* 스크롤 컨테이너 */}
        <div className="relative overflow-hidden py-2">
          <div
            ref={ref}
            className="flex will-change-transform"
            style={{
              gap: cardMetrics.gap,
              transform: `translateX(${initialOffset}px)`,
            }}
          >
            {duplicatedIds.map((id, index) => {
              const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length]
              return (
                <div
                  key={`${id}-${index}`}
                  className={`
                    flex-shrink-0 overflow-hidden transition-all duration-300 ease-out
                    ${isHero ? 'rounded-2xl shadow-lg hover:shadow-xl' : 'rounded-xl shadow-md hover:shadow-lg'}
                    hover:scale-105 hover:z-10
                  `}
                  style={{
                    width: cardMetrics.width,
                    height: cardMetrics.height,
                    transform: `rotate(${rotation}deg)`,
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
              )
            })}
          </div>

          {/* 페이드 마스크 (양쪽) */}
          <div className="absolute left-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-r from-[var(--bg-warm)] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 lg:w-16 bg-gradient-to-l from-[var(--bg-warm)] to-transparent pointer-events-none z-10" />
        </div>
      </div>
    )
  }
)

CardLine.displayName = 'CardLine'
