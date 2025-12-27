'use client'

/**
 * Super Editor v2 - Design Tab
 *
 * 3-Level 스타일 시스템 구현
 * Level 1: 프리셋 선택 (초보자)
 * Level 2: 빠른 설정 (중급자)
 * Level 3: 고급 설정 (AI/전문가)
 */

import { useState, useCallback, useMemo, type ReactNode } from 'react'
import type {
  StyleSystem,
  ThemePresetId,
  QuickStyleConfig,
  TypographyConfig,
  TypographyPresetId,
  SemanticTokens,
} from '../../../schema/types'
import {
  THEME_PRESETS,
  getAllThemePresets,
  getPresetsByCategory,
  isDarkBackground,
  type ThemePreset,
} from '../../../presets/theme-presets'
import {
  TYPOGRAPHY_PRESETS,
  getAllTypographyPresets,
  getTypographyPresetsByCategory,
  type TypographyPreset,
} from '../../../presets/typography-presets'

// ============================================
// Types
// ============================================

export interface DesignTabProps {
  /** 현재 스타일 */
  style: StyleSystem
  /** 스타일 변경 콜백 */
  onStyleChange: (style: StyleSystem) => void
  /** 추가 className */
  className?: string
}

type DesignLevel = 'preset' | 'quick' | 'advanced'

// ============================================
// Component
// ============================================

export function DesignTab({
  style,
  onStyleChange,
  className = '',
}: DesignTabProps) {
  // 현재 편집 레벨
  const [activeLevel, setActiveLevel] = useState<DesignLevel>('preset')

  // 프리셋 변경
  const handlePresetChange = useCallback((presetId: ThemePresetId) => {
    const preset = THEME_PRESETS[presetId]
    const newStyle: StyleSystem = {
      ...style,
      preset: presetId,
      typography: {
        ...style.typography,
        preset: preset.recommendedTypography as TypographyPresetId | undefined,
      },
    }
    onStyleChange(newStyle)
  }, [style, onStyleChange])

  // 타이포그래피 프리셋 변경
  const handleTypographyChange = useCallback((presetId: TypographyPresetId) => {
    const newStyle: StyleSystem = {
      ...style,
      typography: {
        ...style.typography,
        preset: presetId,
      },
    }
    onStyleChange(newStyle)
  }, [style, onStyleChange])

  // 빠른 설정 변경
  const handleQuickChange = useCallback((quick: Partial<QuickStyleConfig>) => {
    const newStyle: StyleSystem = {
      ...style,
      quick: {
        ...style.quick,
        ...quick,
      },
    }
    onStyleChange(newStyle)
  }, [style, onStyleChange])

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 레벨 선택 탭 */}
      <LevelTabs activeLevel={activeLevel} onLevelChange={setActiveLevel} />

      {/* 레벨별 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeLevel === 'preset' && (
          <PresetLevel
            currentPreset={style.preset}
            currentTypography={style.typography.preset}
            onPresetChange={handlePresetChange}
            onTypographyChange={handleTypographyChange}
          />
        )}

        {activeLevel === 'quick' && (
          <QuickLevel
            quick={style.quick}
            onChange={handleQuickChange}
          />
        )}

        {activeLevel === 'advanced' && (
          <AdvancedLevel
            style={style}
            onChange={onStyleChange}
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// Level Tabs
// ============================================

interface LevelTabsProps {
  activeLevel: DesignLevel
  onLevelChange: (level: DesignLevel) => void
}

function LevelTabs({ activeLevel, onLevelChange }: LevelTabsProps) {
  const levels: { id: DesignLevel; label: string; description: string }[] = [
    { id: 'preset', label: '프리셋', description: '추천 스타일' },
    { id: 'quick', label: '빠른 설정', description: '색상/무드' },
    { id: 'advanced', label: '고급', description: '세부 설정' },
  ]

  return (
    <div className="flex border-b border-white/10 px-2 shrink-0">
      {levels.map(level => (
        <button
          key={level.id}
          onClick={() => onLevelChange(level.id)}
          className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors ${
            activeLevel === level.id
              ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
              : 'text-[#F5E6D3]/60 hover:text-[#F5E6D3]'
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  )
}

// ============================================
// Level 1: Preset Selection
// ============================================

interface PresetLevelProps {
  currentPreset?: ThemePresetId
  currentTypography?: TypographyPresetId
  onPresetChange: (presetId: ThemePresetId) => void
  onTypographyChange: (presetId: TypographyPresetId) => void
}

function PresetLevel({
  currentPreset,
  currentTypography,
  onPresetChange,
  onTypographyChange,
}: PresetLevelProps) {
  const themeCategories = [
    { id: 'simple', label: '1컬러' },
    { id: 'basic', label: '기본' },
    { id: 'classic', label: '클래식' },
    { id: 'modern', label: '모던' },
    { id: 'romantic', label: '로맨틱' },
    { id: 'special', label: '특수' },
  ] as const

  const typographyCategories = [
    { id: 'classic', label: '클래식' },
    { id: 'modern', label: '모던' },
    { id: 'romantic', label: '로맨틱' },
    { id: 'natural', label: '내추럴' },
  ] as const

  return (
    <div className="space-y-6">
      {/* 테마 프리셋 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">테마 프리셋</h3>

        {themeCategories.map(category => {
          const presets = getPresetsByCategory(category.id)
          if (presets.length === 0) return null

          return (
            <div key={category.id} className="mb-4">
              <h4 className="text-xs text-[#F5E6D3]/60 mb-2">{category.label}</h4>
              <div className="grid grid-cols-2 gap-2">
                {presets.map(preset => (
                  <ThemePresetCard
                    key={preset.id}
                    preset={preset}
                    selected={currentPreset === preset.id}
                    onClick={() => onPresetChange(preset.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* 타이포그래피 프리셋 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">타이포그래피</h3>

        {typographyCategories.map(category => {
          const presets = getTypographyPresetsByCategory(category.id)
          if (presets.length === 0) return null

          return (
            <div key={category.id} className="mb-4">
              <h4 className="text-xs text-[#F5E6D3]/60 mb-2">{category.label}</h4>
              <div className="grid grid-cols-1 gap-2">
                {presets.map(preset => (
                  <TypographyPresetCard
                    key={preset.id}
                    preset={preset}
                    selected={currentTypography === preset.id}
                    onClick={() => onTypographyChange(preset.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

// ============================================
// Theme Preset Card
// ============================================

interface ThemePresetCardProps {
  preset: ThemePreset
  selected: boolean
  onClick: () => void
}

function ThemePresetCard({ preset, selected, onClick }: ThemePresetCardProps) {
  const bgColor = preset.tokens['bg-page']
  const fgColor = preset.tokens['fg-default']
  const accentColor = preset.tokens['accent-default']

  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-lg border transition-all ${
        selected
          ? 'border-[#C9A962] ring-1 ring-[#C9A962]'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* 색상 미리보기 */}
      <div className="flex gap-1 mb-2">
        <div
          className="w-6 h-6 rounded-full border border-white/10"
          style={{ backgroundColor: bgColor }}
        />
        <div
          className="w-6 h-6 rounded-full border border-white/10"
          style={{ backgroundColor: fgColor }}
        />
        <div
          className="w-6 h-6 rounded-full border border-white/10"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* 프리셋 이름 */}
      <p className="text-xs font-medium text-[#F5E6D3] text-left">
        {preset.nameKo}
      </p>

      {/* 선택 표시 */}
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckIcon className="w-4 h-4 text-[#C9A962]" />
        </div>
      )}
    </button>
  )
}

// ============================================
// Typography Preset Card
// ============================================

interface TypographyPresetCardProps {
  preset: TypographyPreset
  selected: boolean
  onClick: () => void
}

function TypographyPresetCard({ preset, selected, onClick }: TypographyPresetCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-lg border transition-all text-left ${
        selected
          ? 'border-[#C9A962] ring-1 ring-[#C9A962]'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* 폰트 미리보기 */}
      <p
        className="text-lg mb-1"
        style={{ fontFamily: preset.fontStacks.heading.family.join(', ') }}
      >
        {preset.nameKo}
      </p>
      <p
        className="text-xs text-[#F5E6D3]/60"
        style={{ fontFamily: preset.fontStacks.body.family.join(', ') }}
      >
        {preset.description}
      </p>

      {/* 선택 표시 */}
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckIcon className="w-4 h-4 text-[#C9A962]" />
        </div>
      )}
    </button>
  )
}

// ============================================
// Level 2: Quick Settings
// ============================================

interface QuickLevelProps {
  quick?: QuickStyleConfig
  onChange: (quick: Partial<QuickStyleConfig>) => void
}

function QuickLevel({ quick, onChange }: QuickLevelProps) {
  return (
    <div className="space-y-6">
      {/* 색상 조정 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">색상 조정</h3>

        <div className="space-y-4">
          <ColorPicker
            label="메인 색상"
            value={quick?.dominantColor ?? '#FFFFFF'}
            onChange={(color) => onChange({ dominantColor: color })}
          />
          <ColorPicker
            label="강조 색상"
            value={quick?.accentColor ?? '#C9A962'}
            onChange={(color) => onChange({ accentColor: color })}
          />
          <ColorPicker
            label="보조 색상"
            value={quick?.secondaryColor ?? '#6B7280'}
            onChange={(color) => onChange({ secondaryColor: color })}
          />
        </div>
      </section>

      {/* 무드 설정 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">무드</h3>

        <div className="grid grid-cols-3 gap-2">
          {(['warm', 'neutral', 'cool'] as const).map(mood => (
            <button
              key={mood}
              onClick={() => onChange({ mood })}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                quick?.mood === mood
                  ? 'bg-[#C9A962] text-[#0A0806]'
                  : 'bg-white/5 text-[#F5E6D3]/60 hover:bg-white/10'
              }`}
            >
              {mood === 'warm' ? '따뜻한' : mood === 'neutral' ? '중립' : '차가운'}
            </button>
          ))}
        </div>
      </section>

      {/* 대비 설정 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">대비</h3>

        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'high'] as const).map(contrast => (
            <button
              key={contrast}
              onClick={() => onChange({ contrast })}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                quick?.contrast === contrast
                  ? 'bg-[#C9A962] text-[#0A0806]'
                  : 'bg-white/5 text-[#F5E6D3]/60 hover:bg-white/10'
              }`}
            >
              {contrast === 'low' ? '낮음' : contrast === 'medium' ? '중간' : '높음'}
            </button>
          ))}
        </div>
      </section>

      {/* 채도 설정 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">채도</h3>

        <div className="grid grid-cols-3 gap-2">
          {(['muted', 'normal', 'vivid'] as const).map(saturation => (
            <button
              key={saturation}
              onClick={() => onChange({ saturation })}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                quick?.saturation === saturation
                  ? 'bg-[#C9A962] text-[#0A0806]'
                  : 'bg-white/5 text-[#F5E6D3]/60 hover:bg-white/10'
              }`}
            >
              {saturation === 'muted' ? '차분한' : saturation === 'normal' ? '기본' : '선명한'}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

// ============================================
// Level 3: Advanced Settings
// ============================================

interface AdvancedLevelProps {
  style: StyleSystem
  onChange: (style: StyleSystem) => void
}

function AdvancedLevel({ style, onChange }: AdvancedLevelProps) {
  // 토큰 변경
  const handleTokenChange = useCallback((tokenKey: keyof SemanticTokens, value: string) => {
    const currentTokens = style.advanced?.tokens ?? THEME_PRESETS[style.preset ?? 'minimal-light'].tokens
    const newStyle: StyleSystem = {
      ...style,
      advanced: {
        ...style.advanced,
        palette: style.advanced?.palette ?? [],
        tokens: {
          ...currentTokens,
          [tokenKey]: value,
        },
      },
    }
    onChange(newStyle)
  }, [style, onChange])

  const tokens = style.advanced?.tokens ?? THEME_PRESETS[style.preset ?? 'minimal-light'].tokens

  return (
    <div className="space-y-6">
      {/* 배경 색상 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">배경</h3>
        <div className="space-y-3">
          <ColorPicker
            label="페이지 배경"
            value={tokens['bg-page']}
            onChange={(color) => handleTokenChange('bg-page', color)}
          />
          <ColorPicker
            label="섹션 배경"
            value={tokens['bg-section']}
            onChange={(color) => handleTokenChange('bg-section', color)}
          />
          <ColorPicker
            label="카드 배경"
            value={tokens['bg-card']}
            onChange={(color) => handleTokenChange('bg-card', color)}
          />
        </div>
      </section>

      {/* 텍스트 색상 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">텍스트</h3>
        <div className="space-y-3">
          <ColorPicker
            label="기본 텍스트"
            value={tokens['fg-default']}
            onChange={(color) => handleTokenChange('fg-default', color)}
          />
          <ColorPicker
            label="보조 텍스트"
            value={tokens['fg-muted']}
            onChange={(color) => handleTokenChange('fg-muted', color)}
          />
          <ColorPicker
            label="강조 텍스트"
            value={tokens['fg-emphasis']}
            onChange={(color) => handleTokenChange('fg-emphasis', color)}
          />
        </div>
      </section>

      {/* 강조 색상 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">강조</h3>
        <div className="space-y-3">
          <ColorPicker
            label="기본 강조"
            value={tokens['accent-default']}
            onChange={(color) => handleTokenChange('accent-default', color)}
          />
          <ColorPicker
            label="호버 강조"
            value={tokens['accent-hover']}
            onChange={(color) => handleTokenChange('accent-hover', color)}
          />
          <ColorPicker
            label="보조 강조"
            value={tokens['accent-secondary']}
            onChange={(color) => handleTokenChange('accent-secondary', color)}
          />
        </div>
      </section>

      {/* 테두리 */}
      <section>
        <h3 className="text-sm font-medium text-[#F5E6D3] mb-3">테두리</h3>
        <div className="space-y-3">
          <ColorPicker
            label="기본 테두리"
            value={tokens['border-default']}
            onChange={(color) => handleTokenChange('border-default', color)}
          />
          <ColorPicker
            label="강조 테두리"
            value={tokens['border-emphasis']}
            onChange={(color) => handleTokenChange('border-emphasis', color)}
          />
        </div>
      </section>
    </div>
  )
}

// ============================================
// Color Picker
// ============================================

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
        />
        <div
          className="w-8 h-8 rounded-lg border border-white/20"
          style={{ backgroundColor: value }}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm text-[#F5E6D3]">{label}</p>
        <p className="text-xs text-[#F5E6D3]/50 font-mono">{value}</p>
      </div>
    </div>
  )
}

// ============================================
// Icons
// ============================================

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
