'use client'

/**
 * VariantSwitcher - 섹션 베리에이션 전환 컴포넌트
 * 개발 모드에서만 각 섹션에 오버레이로 표시되는 < > 버튼
 */

import React, { useMemo } from 'react'
import { getSkeleton } from '../skeletons/registry'
import type { SectionType, SkeletonVariant } from '../skeletons/types'

interface VariantSwitcherProps {
  sectionType: SectionType
  currentVariantId: string
  onVariantChange: (variantId: string) => void
  position?: 'top' | 'bottom'
  className?: string
}

export function VariantSwitcher({
  sectionType,
  currentVariantId,
  onVariantChange,
  position = 'top',
  className = '',
}: VariantSwitcherProps) {
  // 개발 모드에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const skeleton = useMemo(() => getSkeleton(sectionType), [sectionType])

  const variants = skeleton?.variants ?? []
  const currentIndex = variants.findIndex((v) => v.id === currentVariantId)
  const currentVariant = variants[currentIndex]

  if (variants.length <= 1) {
    return null
  }

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + variants.length) % variants.length
    onVariantChange(variants[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % variants.length
    onVariantChange(variants[nextIndex].id)
  }

  const positionClass = position === 'top' ? 'top-2' : 'bottom-2'

  return (
    <div
      className={`absolute left-0 right-0 top-[-24px] ${positionClass} flex items-center justify-start gap-2 z-20 pointer-events-none opacity-50 hover:opacity-100 ${className}`}
    >
      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 pointer-events-auto">
        <button
          onClick={handlePrev}
          className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          title="이전 베리에이션"
        >
          <ChevronLeftIcon />
        </button>

        <div className="px-2 min-w-[100px] text-center">
          <span className="text-xs text-white/60 block leading-none">{skeleton?.name}</span>
          <span className="text-sm text-white font-medium leading-tight">
            {currentVariant?.name ?? 'Unknown'}
          </span>
        </div>

        <button
          onClick={handleNext}
          className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          title="다음 베리에이션"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="flex gap-1 pointer-events-auto">
        {variants.map((v, idx) => (
          <button
            key={v.id}
            onClick={() => onVariantChange(v.id)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
            title={v.name}
          />
        ))}
      </div>
    </div>
  )
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function VariantInfo({ variant }: { variant: SkeletonVariant }) {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
      <h4 className="font-medium text-sm">{variant.name}</h4>
      {variant.description && <p className="text-xs text-white/70 mt-1">{variant.description}</p>}
      {variant.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {variant.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-white/20 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
