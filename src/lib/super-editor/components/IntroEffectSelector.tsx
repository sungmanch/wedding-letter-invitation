'use client'

/**
 * IntroEffectSelector - 인트로 애니메이션 효과 선택 UI
 * 캘리그라피 효과 선택 시 템플릿 + 텍스트 설정 가능
 */

import React from 'react'
import {
  INTRO_EFFECT_PRESETS,
  type IntroEffectType,
  CALLIGRAPHY_TEMPLATES,
  DEFAULT_CALLIGRAPHY_CONFIG,
  type CalligraphyConfig,
  type CalligraphyTexts,
} from '../animations/intro-effects'

// Re-export CalligraphyConfig
export type { CalligraphyConfig, CalligraphyTexts }
export { DEFAULT_CALLIGRAPHY_CONFIG }

/** 슬롯별 라벨 */
const SLOT_LABELS: Record<keyof CalligraphyTexts, string> = {
  groom: '신랑 이름',
  and: '연결어',
  bride: '신부 이름',
  title: '타이틀',
}

interface IntroEffectSelectorProps {
  currentEffect: IntroEffectType
  onEffectChange: (effect: IntroEffectType) => void
  /** 캘리그라피 설정 (calligraphy 효과일 때) */
  calligraphyConfig?: CalligraphyConfig
  onCalligraphyConfigChange?: (config: CalligraphyConfig) => void
  className?: string
}

export function IntroEffectSelector({
  currentEffect,
  onEffectChange,
  calligraphyConfig,
  onCalligraphyConfigChange,
  className = '',
}: IntroEffectSelectorProps) {
  const currentPreset = INTRO_EFFECT_PRESETS.find((p) => p.id === currentEffect)
  const currentIndex = INTRO_EFFECT_PRESETS.findIndex((p) => p.id === currentEffect)

  // 캘리그라피 효과인지 확인
  const isCalligraphy = currentEffect === 'calligraphy'

  // 현재 템플릿
  const currentTemplate = calligraphyConfig
    ? CALLIGRAPHY_TEMPLATES.find((t) => t.id === calligraphyConfig.templateId)
    : CALLIGRAPHY_TEMPLATES[0]

  // 템플릿에서 사용하는 슬롯들
  const usedSlots = currentTemplate?.items.map((item) => item.slot) || []

  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + INTRO_EFFECT_PRESETS.length) % INTRO_EFFECT_PRESETS.length
    onEffectChange(INTRO_EFFECT_PRESETS[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % INTRO_EFFECT_PRESETS.length
    onEffectChange(INTRO_EFFECT_PRESETS[nextIndex].id)
  }

  const handleTemplateChange = (templateId: string) => {
    if (onCalligraphyConfigChange && calligraphyConfig) {
      onCalligraphyConfigChange({ ...calligraphyConfig, templateId })
    }
  }

  const handleTextChange = (slot: keyof CalligraphyTexts, value: string) => {
    if (onCalligraphyConfigChange && calligraphyConfig) {
      onCalligraphyConfigChange({
        ...calligraphyConfig,
        texts: { ...calligraphyConfig.texts, [slot]: value },
      })
    }
  }

  // 템플릿 순환
  const templateIndex = CALLIGRAPHY_TEMPLATES.findIndex((t) => t.id === calligraphyConfig?.templateId)
  const handlePrevTemplate = () => {
    const prevIdx = (templateIndex - 1 + CALLIGRAPHY_TEMPLATES.length) % CALLIGRAPHY_TEMPLATES.length
    handleTemplateChange(CALLIGRAPHY_TEMPLATES[prevIdx].id)
  }
  const handleNextTemplate = () => {
    const nextIdx = (templateIndex + 1) % CALLIGRAPHY_TEMPLATES.length
    handleTemplateChange(CALLIGRAPHY_TEMPLATES[nextIdx].id)
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
      {currentPreset && currentPreset.id !== 'none' && !isCalligraphy && (
        <div className="text-[10px] text-white/40 text-center mt-1.5">
          {currentPreset.description}
        </div>
      )}

      {/* Calligraphy Settings */}
      {isCalligraphy && calligraphyConfig && onCalligraphyConfigChange && (
        <div className="mt-3 space-y-3 border-t border-white/10 pt-2">
          {/* 템플릿 선택 */}
          <div>
            <div className="text-[10px] text-white/50 mb-1">레이아웃</div>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevTemplate}
                className="w-5 h-5 flex items-center justify-center text-white/60
                           hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <ChevronLeftIcon />
              </button>
              <span className="flex-1 text-center text-[11px] text-white truncate">
                {currentTemplate?.name}
              </span>
              <button
                onClick={handleNextTemplate}
                className="w-5 h-5 flex items-center justify-center text-white/60
                           hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
            <div className="text-[9px] text-white/30 text-center mt-0.5">
              {currentTemplate?.description}
            </div>
          </div>

          {/* 텍스트 입력 (템플릿에서 사용하는 슬롯만) */}
          <div className="space-y-2">
            <div className="text-[10px] text-white/50">텍스트</div>
            {(['groom', 'and', 'bride', 'title'] as const).map((slot) => {
              // 현재 템플릿에서 사용하는 슬롯만 표시
              if (!usedSlots.includes(slot)) return null

              return (
                <div key={slot} className="flex items-center gap-2">
                  <label className="text-[9px] text-white/40 w-14 shrink-0">
                    {SLOT_LABELS[slot]}
                  </label>
                  <input
                    type="text"
                    value={calligraphyConfig.texts[slot]}
                    onChange={(e) => handleTextChange(slot, e.target.value)}
                    placeholder={SLOT_LABELS[slot]}
                    maxLength={30}
                    className="flex-1 px-2 py-1 text-[11px] bg-white/10 border border-white/20
                               rounded text-white placeholder-white/30
                               focus:outline-none focus:border-white/40"
                  />
                </div>
              )
            })}
          </div>

          {/* 템플릿 미리보기 힌트 */}
          <div className="text-[9px] text-white/30 text-center pt-1 border-t border-white/5">
            프리뷰에서 애니메이션을 확인하세요
          </div>
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
