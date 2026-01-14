'use client'

/**
 * Preset Thumbnail
 *
 * 개별 프리셋 썸네일 카드
 * - MiniBlockRenderer로 실시간 렌더링
 * - 선택 상태 표시
 * - 호버 효과
 */

import { memo, useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { MiniBlockRenderer } from './MiniBlockRenderer'
import type { BlockPreset } from '@/lib/super-editor-v2/presets/blocks'

// ============================================
// Types
// ============================================

interface PresetThumbnailProps {
  /** 프리셋 데이터 */
  preset: BlockPreset
  /** 선택 상태 */
  isSelected: boolean
  /** 클릭 핸들러 */
  onClick: () => void
  /** CSS 변수 (테마 색상) */
  cssVariables: Record<string, string>
  /** 썸네일 너비 */
  width?: number
  /** 썸네일 높이 */
  height?: number
  /** 추가 className */
  className?: string
}

// ============================================
// Component
// ============================================

function PresetThumbnailInner({
  preset,
  isSelected,
  onClick,
  cssVariables,
  width = 100,
  height = 140,
  className = '',
}: PresetThumbnailProps) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Intersection Observer로 뷰포트 진입 감지
  // 아코디언 애니메이션(200ms) 완료 후 observer 설정해야 정상 감지됨
  useEffect(() => {
    const element = ref.current
    if (!element) return

    let observer: IntersectionObserver | null = null

    // 아코디언 애니메이션 완료 대기 (250ms)
    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer?.disconnect()
          }
        },
        {
          rootMargin: '100px',
          threshold: 0,
        }
      )
      observer.observe(element)
    }, 250)

    return () => {
      clearTimeout(timer)
      observer?.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`
        relative flex-shrink-0 group cursor-pointer
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {/* 썸네일 컨테이너 */}
      <div
        className={`
          relative overflow-hidden transition-all duration-300
          ${
            isSelected
              ? 'rounded-xl border-2 border-[var(--blush-400)] shadow-lg shadow-[var(--blush-400)]/20'
              : 'rounded-lg border border-[var(--warm-200)] hover:border-[var(--blush-300)] hover:shadow-md'
          }
        `}
        style={{ width, height }}
      >
        {/* 렌더링 (뷰포트 진입 시) */}
        {isInView ? (
          <MiniBlockRenderer
            presetId={preset.id}
            cssVariables={cssVariables}
            width={width}
            height={height}
          />
        ) : (
          // Placeholder
          <div
            className="w-full h-full bg-[var(--warm-50)] animate-pulse"
            style={{ width, height }}
          />
        )}

        {/* 선택 체크 표시 */}
        {isSelected && (
          <div
            className="
              absolute top-2 right-2 w-6 h-6 rounded-full
              bg-[var(--blush-400)] flex items-center justify-center
              shadow-md ring-2 ring-white
            "
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
        )}

        {/* 호버 오버레이 */}
        <div
          className={`
            absolute inset-0 transition-colors duration-200 pointer-events-none
            ${isSelected ? '' : 'bg-black/0 group-hover:bg-black/[0.03]'}
          `}
        />
      </div>

      {/* 프리셋 이름 */}
      <p
        className={`
          mt-2 text-[11px] text-center truncate leading-tight
          transition-colors duration-200
          ${isSelected ? 'text-[var(--blush-600)] font-semibold' : 'text-[var(--text-muted)] font-medium'}
        `}
        style={{ width }}
      >
        {preset.nameKo || preset.name}
      </p>
    </div>
  )
}

export const PresetThumbnail = memo(PresetThumbnailInner)
