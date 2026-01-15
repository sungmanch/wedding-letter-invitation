'use client'

/**
 * Mobile Preview Sheet
 *
 * 모바일용 드래그 가능한 하단 프리뷰 시트
 * - 3단계 snap point: 축소(120px) → 중간(50vh) → 확장(90vh)
 * - 축소 상태: 미니 프리뷰 + CTA 버튼
 * - 확장 상태: 전체 프리뷰 (PhoneFrame)
 */

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { ArrowRight, Loader2, Gamepad2, X, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useSubwayBuilder } from '../../subway/SubwayBuilderContext'
import { MobilePreviewContent } from './MobilePreviewContent'
import { MiniHeroRenderer } from '../../subway/MiniBlockRenderer'

// ============================================
// Types & Constants
// ============================================

type SnapPoint = 'collapsed' | 'half' | 'expanded'

const COLLAPSED_HEIGHT = 140 // 축소 높이 (px)
const HALF_RATIO = 0.5 // 중간 높이 비율
const EXPANDED_RATIO = 0.9 // 확장 높이 비율
const DRAG_THRESHOLD = 50 // 드래그 임계값 (px)

// Spring 설정
const SPRING_CONFIG = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 300,
  mass: 0.8,
}

// ============================================
// Component
// ============================================

interface MobilePreviewSheetProps {
  className?: string
}

function MobilePreviewSheetInner({ className = '' }: MobilePreviewSheetProps) {
  const { state, saveAndCreateDocument, isCreating } = useSubwayBuilder()
  const [snapPoint, setSnapPoint] = useState<SnapPoint>('collapsed')
  const [showGameBanner, setShowGameBanner] = useState(true)
  const [windowHeight, setWindowHeight] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // 윈도우 높이 측정
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // sessionStorage에서 배너 닫힘 상태 복원
  useEffect(() => {
    const dismissed = sessionStorage.getItem('game-banner-dismissed')
    if (dismissed === 'true') {
      setShowGameBanner(false)
    }
  }, [])

  const dismissGameBanner = useCallback(() => {
    setShowGameBanner(false)
    sessionStorage.setItem('game-banner-dismissed', 'true')
  }, [])

  // Snap point별 높이 계산
  const snapHeights = useMemo(() => ({
    collapsed: COLLAPSED_HEIGHT,
    half: windowHeight * HALF_RATIO,
    expanded: windowHeight * EXPANDED_RATIO,
  }), [windowHeight])

  // Motion value for sheet height
  const sheetHeight = useMotionValue(COLLAPSED_HEIGHT)

  // 현재 snap point의 높이로 애니메이션
  useEffect(() => {
    if (windowHeight === 0) return
    animate(sheetHeight, snapHeights[snapPoint], SPRING_CONFIG)
  }, [snapPoint, snapHeights, sheetHeight, windowHeight])

  // 드래그 핸들러
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const velocity = info.velocity.y
      const currentHeight = sheetHeight.get()

      // 빠른 스와이프 감지
      if (Math.abs(velocity) > 500) {
        if (velocity < 0) {
          // 위로 스와이프
          if (snapPoint === 'collapsed') {
            setSnapPoint('half')
          } else if (snapPoint === 'half') {
            setSnapPoint('expanded')
          }
        } else {
          // 아래로 스와이프
          if (snapPoint === 'expanded') {
            setSnapPoint('half')
          } else if (snapPoint === 'half') {
            setSnapPoint('collapsed')
          }
        }
        return
      }

      // 위치 기반 snap point 결정
      const midToExpanded = (snapHeights.half + snapHeights.expanded) / 2
      const collapsedToMid = (snapHeights.collapsed + snapHeights.half) / 2

      if (currentHeight > midToExpanded) {
        setSnapPoint('expanded')
      } else if (currentHeight > collapsedToMid) {
        setSnapPoint('half')
      } else {
        setSnapPoint('collapsed')
      }
    },
    [snapPoint, snapHeights, sheetHeight]
  )

  // 드래그 중 높이 업데이트
  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentHeight = sheetHeight.get()
      const newHeight = currentHeight - info.delta.y

      // 높이 범위 제한
      const clampedHeight = Math.max(
        COLLAPSED_HEIGHT,
        Math.min(snapHeights.expanded, newHeight)
      )
      sheetHeight.set(clampedHeight)
    },
    [sheetHeight, snapHeights]
  )

  // 토글 버튼 핸들러
  const toggleSnapPoint = useCallback(() => {
    if (snapPoint === 'collapsed') {
      setSnapPoint('half')
    } else if (snapPoint === 'half') {
      setSnapPoint('expanded')
    } else {
      setSnapPoint('collapsed')
    }
  }, [snapPoint])

  // 배경 불투명도 (확장 시 더 어둡게)
  const backdropOpacity = useTransform(
    sheetHeight,
    [COLLAPSED_HEIGHT, snapHeights.expanded],
    [0, 0.5]
  )

  // Safe area padding
  const safeAreaStyle = useMemo(() => ({
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  }), [])

  if (windowHeight === 0) {
    return null // SSR 또는 초기 렌더링 시 숨김
  }

  return (
    <>
      {/* 배경 오버레이 (확장 시) */}
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-40 lg:hidden"
        style={{ opacity: backdropOpacity }}
      />

      {/* 시트 */}
      <motion.div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          bg-white/98 backdrop-blur-md
          border-t border-[var(--warm-100)]
          shadow-[0_-4px_30px_rgba(0,0,0,0.12)]
          rounded-t-3xl
          ${className}
        `}
        style={{
          height: sheetHeight,
          ...safeAreaStyle,
        }}
      >
        {/* 게임 배너 */}
        {showGameBanner && snapPoint === 'collapsed' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden absolute -top-10 left-0 right-0"
          >
            <div className="relative bg-gradient-to-r from-[var(--blush-400)] to-[var(--blush-500)] rounded-t-2xl">
              <Link
                href="/game/memory"
                className="flex items-center justify-center gap-2 px-4 py-2 text-white text-xs font-medium"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>청첩장 섹션 맞추고 50% 할인!</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dismissGameBanner()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="배너 닫기"
              >
                <X className="w-3.5 h-3.5 text-white/80 hover:text-white" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 드래그 핸들 */}
        <motion.div
          className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          aria-label="프리뷰 시트 드래그 핸들"
          role="slider"
          aria-valuetext={snapPoint === 'collapsed' ? '축소됨' : snapPoint === 'half' ? '절반 확장' : '전체 확장'}
        >
          <div className="w-10 h-1 bg-[var(--warm-300)] rounded-full" />
          <button
            onClick={toggleSnapPoint}
            className="mt-1 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label={snapPoint === 'expanded' ? '시트 축소' : '시트 확장'}
          >
            {snapPoint === 'expanded' ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </motion.div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden px-4">
          {snapPoint === 'collapsed' ? (
            // 축소 상태: 미니 프리뷰 + CTA
            <CollapsedContent
              templateId={state.selectedTemplateId}
              cssVariables={state.cssVariables}
              onCreateDocument={saveAndCreateDocument}
              isCreating={isCreating}
            />
          ) : (
            // 확장 상태: 전체 프리뷰
            <ExpandedContent
              snapPoint={snapPoint}
              onCreateDocument={saveAndCreateDocument}
              isCreating={isCreating}
            />
          )}
        </div>
      </motion.div>
    </>
  )
}

// ============================================
// Collapsed Content (축소 상태)
// ============================================

interface CollapsedContentProps {
  templateId: string
  cssVariables: Record<string, string>
  onCreateDocument: () => Promise<void>
  isCreating: boolean
}

function CollapsedContent({
  templateId,
  cssVariables,
  onCreateDocument,
  isCreating,
}: CollapsedContentProps) {
  return (
    <div className="flex items-center gap-4 h-full pb-2">
      {/* 미니 프리뷰 (100x133px - 9:16 비율) */}
      <div className="flex-shrink-0">
        <div className="w-[75px] h-[100px] rounded-xl overflow-hidden border border-[var(--warm-200)] shadow-sm bg-white">
          <MiniHeroRenderer
            templateId={templateId}
            cssVariables={cssVariables}
            width={75}
            height={100}
          />
        </div>
        <p className="text-[10px] text-center text-[var(--text-muted)] mt-1">
          위로 드래그
        </p>
      </div>

      {/* CTA 버튼 */}
      <div className="flex-1 space-y-2">
        <button
          onClick={onCreateDocument}
          disabled={isCreating}
          className="
            w-full h-12
            bg-[var(--blush-400)] hover:bg-[var(--blush-500)]
            text-white font-medium text-sm
            rounded-full shadow-md
            flex items-center justify-center gap-2
            transition-all duration-300
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              편집 시작하기
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-xs text-center text-[var(--text-muted)]">
          카드 등록 없이 무료 체험
        </p>
      </div>
    </div>
  )
}

// ============================================
// Expanded Content (확장 상태)
// ============================================

interface ExpandedContentProps {
  snapPoint: SnapPoint
  onCreateDocument: () => Promise<void>
  isCreating: boolean
}

function ExpandedContent({
  snapPoint,
  onCreateDocument,
  isCreating,
}: ExpandedContentProps) {
  return (
    <div className="flex flex-col h-full pb-4">
      {/* 라벨 */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-[var(--text-primary)]">
          실시간 미리보기
        </h4>
        <span className="text-xs text-[var(--text-muted)]">
          선택에 따라 변경됩니다
        </span>
      </div>

      {/* 프리뷰 콘텐츠 */}
      <div className="flex-1 flex justify-center items-start overflow-hidden">
        <MobilePreviewContent isHalfHeight={snapPoint === 'half'} />
      </div>

      {/* CTA 버튼 */}
      <div className="mt-4 px-2">
        <button
          onClick={onCreateDocument}
          disabled={isCreating}
          className="
            w-full h-12
            bg-[var(--blush-400)] hover:bg-[var(--blush-500)]
            text-white font-medium text-sm
            rounded-full shadow-md
            flex items-center justify-center gap-2
            transition-all duration-300
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              편집 시작하기
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export const MobilePreviewSheet = memo(MobilePreviewSheetInner)
