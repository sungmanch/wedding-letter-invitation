'use client'

/**
 * IntroEffectSelector - 인트로 애니메이션 효과 선택 UI
 * 캘리그라피 효과 선택 시 텍스트/폰트 설정 가능
 */

import React from 'react'
import {
  INTRO_EFFECT_PRESETS,
  type IntroEffectType,
} from '../animations/intro-effects'
import {
  CALLIGRAPHY_FONT_PRESETS,
  CALLIGRAPHY_FONTS,
  type CalligraphyFontPreset,
} from '../animations/calligraphy-text'

/** 캘리그라피 설정 */
export interface CalligraphyConfig {
  text: string
  fontId: CalligraphyFontPreset
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

  // 현재 캘리그라피 폰트 정보
  const currentFontMeta = calligraphyConfig
    ? CALLIGRAPHY_FONT_PRESETS.find((f) => f.id === calligraphyConfig.fontId)
    : CALLIGRAPHY_FONT_PRESETS[0]

  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + INTRO_EFFECT_PRESETS.length) % INTRO_EFFECT_PRESETS.length
    onEffectChange(INTRO_EFFECT_PRESETS[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % INTRO_EFFECT_PRESETS.length
    onEffectChange(INTRO_EFFECT_PRESETS[nextIndex].id)
  }

  const handleTextChange = (text: string) => {
    if (onCalligraphyConfigChange && calligraphyConfig) {
      onCalligraphyConfigChange({ ...calligraphyConfig, text })
    }
  }

  const handleFontChange = (fontId: CalligraphyFontPreset) => {
    if (onCalligraphyConfigChange && calligraphyConfig) {
      onCalligraphyConfigChange({ ...calligraphyConfig, fontId })
    }
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
        <div className="mt-3 space-y-2 border-t border-white/10 pt-2">
          {/* 텍스트 입력 */}
          <div>
            <label className="text-[10px] text-white/50 block mb-1">텍스트</label>
            <input
              type="text"
              value={calligraphyConfig.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="And"
              maxLength={20}
              className="w-full px-2 py-1 text-xs bg-white/10 border border-white/20
                         rounded text-white placeholder-white/30
                         focus:outline-none focus:border-white/40"
            />
          </div>

          {/* 폰트 선택 */}
          <div>
            <label className="text-[10px] text-white/50 block mb-1">폰트</label>
            <select
              value={calligraphyConfig.fontId}
              onChange={(e) => handleFontChange(e.target.value as CalligraphyFontPreset)}
              className="w-full px-2 py-1 text-xs bg-white/10 border border-white/20
                         rounded text-white appearance-none cursor-pointer
                         focus:outline-none focus:border-white/40"
              style={{ backgroundImage: 'none' }}
            >
              <optgroup label="영문 캘리그라피">
                {CALLIGRAPHY_FONT_PRESETS.filter((f) => f.category === 'english').map((font) => (
                  <option key={font.id} value={font.id} className="bg-gray-800">
                    {font.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="한글 손글씨">
                {CALLIGRAPHY_FONT_PRESETS.filter((f) => f.category === 'korean').map((font) => (
                  <option key={font.id} value={font.id} className="bg-gray-800">
                    {font.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* 폰트 미리보기 */}
          <div className="text-center py-2">
            <span
              className="text-lg text-white/80"
              style={{
                fontFamily:
                  currentFontMeta?.category === 'korean'
                    ? `'${currentFontMeta.name}', sans-serif`
                    : `'${currentFontMeta?.name}', cursive`,
              }}
            >
              {calligraphyConfig.text || currentFontMeta?.sample || 'And'}
            </span>
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
