'use client'

/**
 * CalligraphyEditor - 캘리그라피 효과 편집 UI
 * EditorPanel의 intro 섹션에서 사용
 */

import React, { useCallback, useMemo } from 'react'
import {
  INTRO_EFFECT_PRESETS,
  CALLIGRAPHY_TEMPLATES,
  type IntroEffectType,
} from '../animations/intro-effects'
import {
  CALLIGRAPHY_FONT_PRESETS,
  CALLIGRAPHY_FONTS,
  DEFAULT_CALLIGRAPHY_CONFIG,
  type CalligraphyConfig,
  type CalligraphySlot,
  type CalligraphyFontPreset,
  type CalligraphyTexts,
} from '../animations/calligraphy-text'

/** 슬롯별 라벨 */
const SLOT_LABELS: Record<CalligraphySlot, string> = {
  groom: '신랑 이름',
  and: '연결어',
  bride: '신부 이름',
  title: '타이틀',
}

interface CalligraphyEditorProps {
  /** 현재 인트로 효과 */
  introEffect: IntroEffectType
  /** 효과 변경 콜백 */
  onIntroEffectChange: (effect: IntroEffectType) => void
  /** 캘리그라피 설정 */
  calligraphyConfig: CalligraphyConfig
  /** 설정 변경 콜백 */
  onCalligraphyConfigChange: (config: CalligraphyConfig) => void
  className?: string
}

export function CalligraphyEditor({
  introEffect,
  onIntroEffectChange,
  calligraphyConfig,
  onCalligraphyConfigChange,
  className = '',
}: CalligraphyEditorProps) {
  // 캘리그라피 효과인지 확인
  const isCalligraphy = introEffect === 'calligraphy'

  // 현재 템플릿
  const currentTemplate = useMemo(
    () =>
      CALLIGRAPHY_TEMPLATES.find((t) => t.id === calligraphyConfig.templateId) ||
      CALLIGRAPHY_TEMPLATES[0],
    [calligraphyConfig.templateId]
  )

  // 템플릿에서 사용하는 슬롯들
  const usedSlots = useMemo(
    () => currentTemplate.items.map((item) => item.slot),
    [currentTemplate]
  )

  // 텍스트 변경
  const handleTextChange = useCallback(
    (slot: CalligraphySlot, value: string) => {
      onCalligraphyConfigChange({
        ...calligraphyConfig,
        texts: { ...calligraphyConfig.texts, [slot]: value },
      })
    },
    [calligraphyConfig, onCalligraphyConfigChange]
  )

  // 폰트 변경
  const handleFontChange = useCallback(
    (slot: CalligraphySlot, fontId: CalligraphyFontPreset) => {
      onCalligraphyConfigChange({
        ...calligraphyConfig,
        overrides: {
          ...calligraphyConfig.overrides,
          [slot]: {
            ...calligraphyConfig.overrides?.[slot],
            fontId,
          },
        },
      })
    },
    [calligraphyConfig, onCalligraphyConfigChange]
  )

  // 위치 변경
  const handlePositionChange = useCallback(
    (slot: CalligraphySlot, axis: 'x' | 'y', value: number) => {
      const currentPos =
        calligraphyConfig.overrides?.[slot]?.position ||
        currentTemplate.items.find((i) => i.slot === slot)?.position ||
        { x: 50, y: 50 }

      onCalligraphyConfigChange({
        ...calligraphyConfig,
        overrides: {
          ...calligraphyConfig.overrides,
          [slot]: {
            ...calligraphyConfig.overrides?.[slot],
            position: {
              ...currentPos,
              [axis]: value,
            },
          },
        },
      })
    },
    [calligraphyConfig, currentTemplate, onCalligraphyConfigChange]
  )

  // 폰트 크기 변경
  const handleFontSizeChange = useCallback(
    (slot: CalligraphySlot, fontSize: number) => {
      onCalligraphyConfigChange({
        ...calligraphyConfig,
        overrides: {
          ...calligraphyConfig.overrides,
          [slot]: {
            ...calligraphyConfig.overrides?.[slot],
            fontSize,
          },
        },
      })
    },
    [calligraphyConfig, onCalligraphyConfigChange]
  )

  // 현재 슬롯의 값 가져오기 (오버라이드 또는 템플릿 기본값)
  const getSlotValue = useCallback(
    (slot: CalligraphySlot) => {
      const templateItem = currentTemplate.items.find((i) => i.slot === slot)
      const override = calligraphyConfig.overrides?.[slot]

      return {
        fontId: override?.fontId ?? templateItem?.fontId ?? 'greatVibes',
        fontSize: override?.fontSize ?? templateItem?.fontSize ?? 36,
        position: override?.position ?? templateItem?.position ?? { x: 50, y: 50 },
      }
    },
    [calligraphyConfig.overrides, currentTemplate]
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 애니메이션 효과 선택 */}
      <div>
        <label className="block text-xs text-[#F5E6D3]/60 mb-2">인트로 애니메이션</label>
        <select
          value={introEffect}
          onChange={(e) => onIntroEffectChange(e.target.value as IntroEffectType)}
          className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg
                     text-[#F5E6D3] focus:outline-none focus:border-[#C9A962]/50"
        >
          {INTRO_EFFECT_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id} className="bg-[#2A2A2A]">
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* 캘리그라피 설정 (calligraphy 효과일 때만) */}
      {isCalligraphy && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          {/* 템플릿 선택 */}
          <div>
            <label className="block text-xs text-[#F5E6D3]/60 mb-2">레이아웃</label>
            <select
              value={calligraphyConfig.templateId}
              onChange={(e) =>
                onCalligraphyConfigChange({
                  ...calligraphyConfig,
                  templateId: e.target.value,
                  // 템플릿 변경 시 오버라이드 초기화
                  overrides: undefined,
                })
              }
              className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg
                         text-[#F5E6D3] focus:outline-none focus:border-[#C9A962]/50"
            >
              {CALLIGRAPHY_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id} className="bg-[#2A2A2A]">
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
          </div>

          {/* 슬롯별 설정 */}
          {(['groom', 'and', 'bride', 'title'] as const).map((slot) => {
            if (!usedSlots.includes(slot)) return null

            const slotValue = getSlotValue(slot)

            return (
              <div key={slot} className="p-3 bg-white/5 rounded-lg space-y-3">
                <div className="text-xs font-medium text-[#C9A962]">{SLOT_LABELS[slot]}</div>

                {/* 텍스트 입력 */}
                <div>
                  <label className="block text-[10px] text-[#F5E6D3]/40 mb-1">텍스트</label>
                  <input
                    type="text"
                    value={calligraphyConfig.texts[slot]}
                    onChange={(e) => handleTextChange(slot, e.target.value)}
                    placeholder={SLOT_LABELS[slot]}
                    maxLength={30}
                    className="w-full px-2 py-1.5 text-sm bg-white/10 border border-white/20
                               rounded text-[#F5E6D3] placeholder-white/30
                               focus:outline-none focus:border-[#C9A962]/50"
                  />
                </div>

                {/* 폰트 선택 */}
                <div>
                  <label className="block text-[10px] text-[#F5E6D3]/40 mb-1">폰트</label>
                  <select
                    value={slotValue.fontId}
                    onChange={(e) => handleFontChange(slot, e.target.value as CalligraphyFontPreset)}
                    className="w-full px-2 py-1.5 text-sm bg-white/10 border border-white/20
                               rounded text-[#F5E6D3] focus:outline-none focus:border-[#C9A962]/50"
                  >
                    {CALLIGRAPHY_FONT_PRESETS.map((font) => (
                      <option key={font.id} value={font.id} className="bg-[#2A2A2A]">
                        {font.name} ({font.category === 'korean' ? '한글' : '영문'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 폰트 크기 */}
                <div>
                  <label className="block text-[10px] text-[#F5E6D3]/40 mb-1">
                    크기: {slotValue.fontSize}px
                  </label>
                  <input
                    type="range"
                    min={16}
                    max={80}
                    value={slotValue.fontSize}
                    onChange={(e) => handleFontSizeChange(slot, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A962]"
                  />
                </div>

                {/* 위치 조정 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#F5E6D3]/40 mb-1">
                      가로: {slotValue.position.x}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={slotValue.position.x}
                      onChange={(e) => handlePositionChange(slot, 'x', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer
                                 [&::-webkit-slider-thumb]:appearance-none
                                 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A962]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#F5E6D3]/40 mb-1">
                      세로: {slotValue.position.y}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={slotValue.position.y}
                      onChange={(e) => handlePositionChange(slot, 'y', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer
                                 [&::-webkit-slider-thumb]:appearance-none
                                 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A962]"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
