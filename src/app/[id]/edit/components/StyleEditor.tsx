'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'
import type { ColorPalette, FontSet, FontConfig } from '@/lib/themes/schema'

// ============================================
// Types
// ============================================

interface StyleEditorProps {
  colors: ColorPalette
  fonts: FontSet
  onColorsChange: (colors: ColorPalette) => void
  onFontsChange: (fonts: FontSet) => void
}

// ============================================
// Preset Colors
// ============================================

const COLOR_PRESETS = [
  {
    name: '클래식 로즈',
    colors: {
      primary: '#D4768A',
      secondary: '#FFB6C1',
      background: '#FFFBFC',
      text: '#1F2937',
      accent: '#D4768A',
    },
  },
  {
    name: '모던 네이비',
    colors: {
      primary: '#1E3A5F',
      secondary: '#4A6FA5',
      background: '#F8FAFC',
      text: '#0F172A',
      accent: '#1E3A5F',
    },
  },
  {
    name: '내추럴 그린',
    colors: {
      primary: '#4A7C59',
      secondary: '#8FBC8F',
      background: '#F9FBF7',
      text: '#1F2937',
      accent: '#4A7C59',
    },
  },
  {
    name: '로맨틱 퍼플',
    colors: {
      primary: '#7C5295',
      secondary: '#B39DDB',
      background: '#FAF8FC',
      text: '#1F2937',
      accent: '#7C5295',
    },
  },
  {
    name: '엘레강트 골드',
    colors: {
      primary: '#B8860B',
      secondary: '#DAA520',
      background: '#FFFEF5',
      text: '#1F2937',
      accent: '#B8860B',
    },
  },
  {
    name: '미니멀 모노',
    colors: {
      primary: '#333333',
      secondary: '#666666',
      background: '#FFFFFF',
      text: '#1F2937',
      accent: '#333333',
    },
  },
]

// ============================================
// Font Options
// ============================================

const FONT_OPTIONS = [
  { value: 'Pretendard', label: '프리텐다드', category: 'sans' },
  { value: 'Noto Sans KR', label: '노토 산스', category: 'sans' },
  { value: 'Spoqa Han Sans Neo', label: '스포카 한 산스', category: 'sans' },
  { value: 'Noto Serif KR', label: '노토 세리프', category: 'serif' },
  { value: 'Nanum Myeongjo', label: '나눔 명조', category: 'serif' },
  { value: 'Gowun Batang', label: '고운 바탕', category: 'serif' },
  { value: 'MaruBuri', label: '마루 부리', category: 'serif' },
  { value: 'KoPubWorld Batang', label: '코펍월드 바탕', category: 'serif' },
  { value: 'Lora', label: 'Lora', category: 'serif' },
  { value: 'Playfair Display', label: 'Playfair', category: 'serif' },
]

const FONT_WEIGHTS = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'SemiBold' },
  { value: 700, label: 'Bold' },
]

// ============================================
// Color Input Component
// ============================================

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

function ColorInput({ label, value, onChange, className }: ColorInputProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
          />
        </div>
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
              onChange(val)
            }
          }}
          className="flex-1 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg uppercase"
          maxLength={7}
        />
      </div>
    </div>
  )
}

// ============================================
// Font Select Component
// ============================================

interface FontSelectProps {
  label: string
  config: FontConfig
  onChange: (config: FontConfig) => void
}

function FontSelect({ label, config, onChange }: FontSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedFont = FONT_OPTIONS.find((f) => f.value === config.family)

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-600">{label}</label>

      {/* Font Family Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2',
            'border border-gray-200 rounded-lg text-sm',
            'hover:border-gray-300 transition-colors'
          )}
          style={{ fontFamily: config.family }}
        >
          <span>{selectedFont?.label || config.family}</span>
          <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-1">
              <div className="px-2 py-1.5 text-[10px] font-medium text-gray-400 uppercase">산스세리프</div>
              {FONT_OPTIONS.filter((f) => f.category === 'sans').map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => {
                    onChange({ ...config, family: font.value })
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm',
                    'hover:bg-gray-50',
                    config.family === font.value && 'bg-[#D4768A]/10 text-[#D4768A]'
                  )}
                  style={{ fontFamily: font.value }}
                >
                  <span>{font.label}</span>
                  {config.family === font.value && <Check className="w-4 h-4" />}
                </button>
              ))}
              <div className="px-2 py-1.5 text-[10px] font-medium text-gray-400 uppercase mt-2">세리프</div>
              {FONT_OPTIONS.filter((f) => f.category === 'serif').map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => {
                    onChange({ ...config, family: font.value })
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1.5 rounded text-sm',
                    'hover:bg-gray-50',
                    config.family === font.value && 'bg-[#D4768A]/10 text-[#D4768A]'
                  )}
                  style={{ fontFamily: font.value }}
                >
                  <span>{font.label}</span>
                  {config.family === font.value && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Font Weight */}
      <div className="flex gap-1">
        {FONT_WEIGHTS.map((weight) => (
          <button
            key={weight.value}
            type="button"
            onClick={() => onChange({ ...config, weight: weight.value })}
            className={cn(
              'flex-1 px-2 py-1 text-[10px] rounded border transition-colors',
              config.weight === weight.value
                ? 'border-[#D4768A] bg-[#D4768A]/10 text-[#D4768A]'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            )}
          >
            {weight.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================

export function StyleEditor({ colors, fonts, onColorsChange, onFontsChange }: StyleEditorProps) {
  const updateColor = (key: keyof ColorPalette, value: string) => {
    onColorsChange({ ...colors, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Color Presets */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">색상 프리셋</h4>
        <div className="grid grid-cols-3 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              colors.primary === preset.colors.primary &&
              colors.secondary === preset.colors.secondary
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onColorsChange({ ...colors, ...preset.colors })}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg border transition-all',
                  isSelected
                    ? 'border-[#D4768A] bg-[#D4768A]/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex gap-0.5 mb-1.5">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-100"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-100"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                </div>
                <span className="text-[10px] text-gray-600">{preset.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">커스텀 색상</h4>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="메인 색상"
            value={colors.primary}
            onChange={(v) => updateColor('primary', v)}
          />
          <ColorInput
            label="보조 색상"
            value={colors.secondary}
            onChange={(v) => updateColor('secondary', v)}
          />
          <ColorInput
            label="배경 색상"
            value={colors.background}
            onChange={(v) => updateColor('background', v)}
          />
          <ColorInput
            label="텍스트 색상"
            value={colors.text}
            onChange={(v) => updateColor('text', v)}
          />
          <ColorInput
            label="강조 색상"
            value={colors.accent}
            onChange={(v) => updateColor('accent', v)}
          />
        </div>
      </div>

      {/* Color Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">미리보기</h4>
        <div
          className="rounded-xl p-4 border"
          style={{ backgroundColor: colors.background }}
        >
          <div
            className="text-lg font-semibold mb-2"
            style={{ color: colors.primary, fontFamily: fonts.title.family, fontWeight: fonts.title.weight }}
          >
            민수 & 수진
          </div>
          <div
            className="text-sm mb-3"
            style={{ color: colors.text, fontFamily: fonts.body.family }}
          >
            2025년 5월 24일 토요일 오후 2시
          </div>
          <div
            className="inline-block px-3 py-1 rounded-full text-xs"
            style={{ backgroundColor: colors.secondary, color: colors.background }}
          >
            청첩장 보기
          </div>
        </div>
      </div>

      {/* Fonts */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">폰트 설정</h4>
        <div className="space-y-4">
          <FontSelect
            label="제목 폰트"
            config={fonts.title}
            onChange={(config) => onFontsChange({ ...fonts, title: config })}
          />
          <FontSelect
            label="본문 폰트"
            config={fonts.body}
            onChange={(config) => onFontsChange({ ...fonts, body: config })}
          />
        </div>
      </div>
    </div>
  )
}
