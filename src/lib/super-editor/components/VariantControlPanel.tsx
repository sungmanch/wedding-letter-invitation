'use client'

/**
 * VariantControlPanel - 섹션 스타일(variant) 전환 패널
 * PhoneFrame 오른쪽에 플로팅으로 표시되는 컨트롤 패널
 */

import React, { useMemo } from 'react'
import { getSkeleton } from '../skeletons/registry'
import type { SectionType } from '../skeletons/types'
import type { LayoutSchema } from '../schema/layout'

interface VariantControlPanelProps {
  activeSection: SectionType | null
  sectionVariants?: Record<SectionType, string>
  onVariantChange: (sectionType: SectionType, variantId: string) => void
  layout: LayoutSchema
  className?: string
}

export function VariantControlPanel({
  activeSection,
  sectionVariants,
  onVariantChange,
  layout,
  className = '',
}: VariantControlPanelProps) {
  // 현재 레이아웃에 있는 섹션들 (intro, music 제외 + 중복 제거)
  const sections = useMemo(() => {
    const seen = new Set<SectionType>()
    return layout.screens
      .filter((s) => {
        // intro, music 제외
        if (s.sectionType === 'intro' || s.sectionType === 'music') return false
        // 중복 제거
        const sectionType = s.sectionType as SectionType
        if (seen.has(sectionType)) return false
        seen.add(sectionType)
        return true
      })
      .map((s) => s.sectionType as SectionType)
  }, [layout.screens])

  // variant가 2개 이상인 섹션만 필터링
  const sectionsWithVariants = useMemo(() => {
    return sections.filter((sectionType) => {
      const skeleton = getSkeleton(sectionType)
      return skeleton && skeleton.variants && skeleton.variants.length > 1
    })
  }, [sections])

  if (sectionsWithVariants.length === 0) {
    return null
  }

  return (
    <div
      className={`w-48 bg-black/80 backdrop-blur-md rounded-2xl p-3
                  border border-white/10 shadow-xl ${className}`}
    >
      <h4 className="text-xs font-medium text-white/60 mb-3 px-1">섹션 스타일</h4>

      <div className="space-y-1">
        {sectionsWithVariants.map((sectionType) => (
          <SectionVariantItem
            key={sectionType}
            sectionType={sectionType}
            currentVariantId={sectionVariants?.[sectionType]}
            onVariantChange={onVariantChange}
            isActive={activeSection === sectionType}
          />
        ))}
      </div>
    </div>
  )
}

interface SectionVariantItemProps {
  sectionType: SectionType
  currentVariantId?: string
  onVariantChange: (sectionType: SectionType, variantId: string) => void
  isActive: boolean
}

function SectionVariantItem({
  sectionType,
  currentVariantId,
  onVariantChange,
  isActive,
}: SectionVariantItemProps) {
  const skeleton = useMemo(() => getSkeleton(sectionType), [sectionType])

  const variants = skeleton?.variants ?? []
  const currentIndex = variants.findIndex((v) => v.id === currentVariantId)
  const currentVariant = variants[currentIndex >= 0 ? currentIndex : 0]

  if (variants.length <= 1) {
    return null
  }

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + variants.length) % variants.length
    onVariantChange(sectionType, variants[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % variants.length
    onVariantChange(sectionType, variants[nextIndex].id)
  }

  return (
    <div
      className={`rounded-lg p-2 transition-colors ${
        isActive ? 'bg-white/15 ring-1 ring-white/20' : 'bg-transparent hover:bg-white/5'
      }`}
    >
      <div className="text-[11px] text-white/60 mb-1">{skeleton?.name}</div>
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          className="w-6 h-6 flex items-center justify-center text-white/60
                     hover:text-white hover:bg-white/10 rounded transition-colors"
          title="이전 스타일"
        >
          <ChevronLeftIcon />
        </button>

        <span className="flex-1 text-center text-xs text-white font-medium truncate px-1">
          {currentVariant?.name ?? 'Unknown'}
        </span>

        <button
          onClick={handleNext}
          className="w-6 h-6 flex items-center justify-center text-white/60
                     hover:text-white hover:bg-white/10 rounded transition-colors"
          title="다음 스타일"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Variant indicator dots */}
      <div className="flex justify-center gap-1 mt-1.5">
        {variants.map((v, idx) => (
          <button
            key={v.id}
            onClick={() => onVariantChange(sectionType, v.id)}
            className={`w-1 h-1 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
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
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
