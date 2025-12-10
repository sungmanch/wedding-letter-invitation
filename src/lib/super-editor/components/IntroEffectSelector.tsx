'use client'

/**
 * IntroEffectSelector - 인트로 애니메이션 효과 선택 UI
 */

import React from 'react'
import {
  INTRO_EFFECT_PRESETS,
  type IntroEffectType,
} from '../animations/intro-effects'

interface IntroEffectSelectorProps {
  currentEffect: IntroEffectType
  onEffectChange: (effect: IntroEffectType) => void
  className?: string
}

export function IntroEffectSelector({
  currentEffect,
  onEffectChange,
  className = '',
}: IntroEffectSelectorProps) {
  const currentPreset = INTRO_EFFECT_PRESETS.find((p) => p.id === currentEffect)
  const currentIndex = INTRO_EFFECT_PRESETS.findIndex((p) => p.id === currentEffect)

  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + INTRO_EFFECT_PRESETS.length) % INTRO_EFFECT_PRESETS.length
    onEffectChange(INTRO_EFFECT_PRESETS[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % INTRO_EFFECT_PRESETS.length
    onEffectChange(INTRO_EFFECT_PRESETS[nextIndex].id)
  }

  return (
    <div className={`rounded-lg p-2 bg-transparent hover:bg-white/5 ${className}`}>
      <div className="text-[11px] text-white/60 mb-1">애니메이션 효과</div>
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          className="w-6 h-6 flex items-center justify-center text-white/60
                     hover:text-white hover:bg-white/10 rounded transition-colors"
          title="이전 효과"
        >
          <ChevronLeftIcon />
        </button>

        <span className="flex-1 text-center text-xs text-white font-medium truncate px-1">
          {currentPreset?.name ?? '없음'}
        </span>

        <button
          onClick={handleNext}
          className="w-6 h-6 flex items-center justify-center text-white/60
                     hover:text-white hover:bg-white/10 rounded transition-colors"
          title="다음 효과"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Effect indicator dots */}
      <div className="flex justify-center gap-1 mt-1.5">
        {INTRO_EFFECT_PRESETS.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => onEffectChange(preset.id)}
            className={`w-1 h-1 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
            }`}
            title={preset.name}
          />
        ))}
      </div>

      {/* Description */}
      {currentPreset && currentPreset.id !== 'none' && (
        <div className="text-[10px] text-white/40 text-center mt-1.5">
          {currentPreset.description}
        </div>
      )}
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
