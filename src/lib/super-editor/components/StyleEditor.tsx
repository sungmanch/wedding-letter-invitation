'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { StyleSchema } from '../schema/style'

interface StyleEditorProps {
  style: StyleSchema
  onStyleChange: (style: StyleSchema) => void
  className?: string
  /** 실시간 업데이트 여부 (기본: true) */
  liveUpdate?: boolean
  /** 디바운스 시간 (ms, 기본: 300) */
  debounceMs?: number
}

// 색상 프리셋
const COLOR_PRESETS = [
  { name: '로즈 골드', primary: '#e11d48', accent: '#f43f5e', background: '#fff1f2' },
  { name: '라벤더', primary: '#8b5cf6', accent: '#a78bfa', background: '#faf5ff' },
  { name: '민트', primary: '#14b8a6', accent: '#2dd4bf', background: '#f0fdfa' },
  { name: '네이비', primary: '#1e40af', accent: '#3b82f6', background: '#eff6ff' },
  { name: '골드', primary: '#b45309', accent: '#d97706', background: '#fffbeb' },
  { name: '블러쉬', primary: '#ec4899', accent: '#f472b6', background: '#fdf2f8' },
  { name: '세이지', primary: '#65a30d', accent: '#84cc16', background: '#f7fee7' },
  { name: '버건디', primary: '#9f1239', accent: '#be123c', background: '#fff1f2' },
]

export function StyleEditor({
  style,
  onStyleChange,
  className = '',
  liveUpdate = true,
  debounceMs = 300,
}: StyleEditorProps) {
  const [activeSection, setActiveSection] = useState<'colors' | 'typography' | 'presets'>('presets')
  // 로컬 상태로 스타일 관리 (실시간 변경용)
  const [localStyle, setLocalStyle] = useState<StyleSchema>(style)
  const [isDirty, setIsDirty] = useState(false)
  const localStyleRef = useRef(localStyle)
  const isDirtyRef = useRef(isDirty)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // ref 업데이트
  useEffect(() => {
    localStyleRef.current = localStyle
    isDirtyRef.current = isDirty
  }, [localStyle, isDirty])

  // 외부 style이 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalStyle(style)
  }, [style])

  // 디바운스된 스타일 업데이트
  const debouncedStyleChange = useCallback((newStyle: StyleSchema) => {
    if (!liveUpdate) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onStyleChange(newStyle)
    }, debounceMs)
  }, [liveUpdate, debounceMs, onStyleChange])

  // 컴포넌트 언마운트 시 변경사항 저장 (디바운스 취소 후 즉시 저장)
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (isDirtyRef.current) {
        onStyleChange(localStyleRef.current)
      }
    }
  }, [onStyleChange])

  const updateColor = useCallback((path: string, value: string) => {
    setLocalStyle(prev => {
      const newStyle = JSON.parse(JSON.stringify(prev)) as StyleSchema
      const parts = path.split('.')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newStyle.theme.colors
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]]
      }
      current[parts[parts.length - 1]] = value

      // 실시간 프리뷰 업데이트
      debouncedStyleChange(newStyle)
      return newStyle
    })
    setIsDirty(true)
  }, [debouncedStyleChange])

  const applyPreset = useCallback((preset: typeof COLOR_PRESETS[0]) => {
    setLocalStyle(prev => {
      const newStyle = JSON.parse(JSON.stringify(prev)) as StyleSchema

      // Primary 색상 스케일 업데이트
      if (newStyle.theme.colors.primary) {
        newStyle.theme.colors.primary[500] = preset.primary
        newStyle.theme.colors.primary[400] = lightenColor(preset.primary, 0.2)
        newStyle.theme.colors.primary[600] = darkenColor(preset.primary, 0.2)
      }

      // Accent 색상
      if (newStyle.theme.colors.accent) {
        newStyle.theme.colors.accent[500] = preset.accent
      } else if (newStyle.theme.colors.secondary) {
        newStyle.theme.colors.secondary[500] = preset.accent
      }

      // 배경 색상
      newStyle.theme.colors.background.default = preset.background

      // 실시간 프리뷰 업데이트
      debouncedStyleChange(newStyle)
      return newStyle
    })
    setIsDirty(true)
  }, [debouncedStyleChange])

  // 타이포그래피 업데이트 헬퍼
  const updateTypography = useCallback((
    updater: (typography: StyleSchema['theme']['typography']) => void
  ) => {
    setLocalStyle(prev => {
      const newStyle = JSON.parse(JSON.stringify(prev)) as StyleSchema
      if (newStyle.theme.typography) {
        updater(newStyle.theme.typography)
      }
      debouncedStyleChange(newStyle)
      return newStyle
    })
    setIsDirty(true)
  }, [debouncedStyleChange])

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 섹션 탭 */}
      <div className="flex border-b border-gray-100 px-2 gap-1 py-2 flex-shrink-0">
        <button
          onClick={() => setActiveSection('presets')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSection === 'presets'
              ? 'bg-rose-100 text-rose-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          프리셋
        </button>
        <button
          onClick={() => setActiveSection('colors')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSection === 'colors'
              ? 'bg-rose-100 text-rose-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          색상
        </button>
        <button
          onClick={() => setActiveSection('typography')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeSection === 'typography'
              ? 'bg-rose-100 text-rose-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          글꼴
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'presets' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              색상 조합을 선택하세요
            </p>
            <div className="grid grid-cols-2 gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: preset.accent }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: preset.background }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'colors' && (
          <div className="space-y-6">
            {/* 메인 색상 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">메인 색상</h4>
              <ColorPicker
                label="기본 색상"
                value={localStyle.theme.colors.primary?.[500] ?? '#e11d48'}
                onChange={(v) => updateColor('primary.500', v)}
              />
              {localStyle.theme.colors.accent && (
                <ColorPicker
                  label="강조 색상"
                  value={localStyle.theme.colors.accent?.[500] ?? '#f43f5e'}
                  onChange={(v) => updateColor('accent.500', v)}
                />
              )}
              {localStyle.theme.colors.secondary && !localStyle.theme.colors.accent && (
                <ColorPicker
                  label="보조 색상"
                  value={localStyle.theme.colors.secondary?.[500] ?? '#6b7280'}
                  onChange={(v) => updateColor('secondary.500', v)}
                />
              )}
            </div>

            {/* 배경 색상 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">배경</h4>
              <ColorPicker
                label="기본 배경"
                value={localStyle.theme.colors.background?.default ?? '#ffffff'}
                onChange={(v) => updateColor('background.default', v)}
              />
              {localStyle.theme.colors.background?.paper && (
                <ColorPicker
                  label="카드 배경"
                  value={localStyle.theme.colors.background.paper}
                  onChange={(v) => updateColor('background.paper', v)}
                />
              )}
            </div>

            {/* 텍스트 색상 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">텍스트</h4>
              <ColorPicker
                label="기본 텍스트"
                value={localStyle.theme.colors.text?.primary ?? '#1f2937'}
                onChange={(v) => updateColor('text.primary', v)}
              />
              {localStyle.theme.colors.text?.secondary && (
                <ColorPicker
                  label="보조 텍스트"
                  value={localStyle.theme.colors.text.secondary}
                  onChange={(v) => updateColor('text.secondary', v)}
                />
              )}
            </div>
          </div>
        )}

        {activeSection === 'typography' && (
          <div className="space-y-6">
            {/* ========== 제목 설정 ========== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">제목 설정</h3>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  메인 타이틀, 섹션 제목
                </span>
              </div>

              {/* 제목 글꼴 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">글꼴</label>
                <FontSelector
                  value={localStyle.theme.typography?.fonts?.heading?.family ?? 'Pretendard'}
                  onChange={(family) => updateTypography((typo) => {
                    if (typo?.fonts?.heading) typo.fonts.heading.family = family
                  })}
                />
              </div>

              {/* 제목 굵기 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">굵기</label>
                <div className="grid grid-cols-3 gap-2">
                  {HEADING_WEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.weights) typo.weights.bold = opt.value
                      })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        localStyle.theme.typography?.weights?.bold === opt.value
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                      style={{ fontWeight: opt.value }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ========== 본문 설정 ========== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">본문 설정</h3>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  설명 텍스트, 내용
                </span>
              </div>

              {/* 본문 글꼴 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">글꼴</label>
                <FontSelector
                  value={localStyle.theme.typography?.fonts?.body?.family ?? 'Pretendard'}
                  onChange={(family) => updateTypography((typo) => {
                    if (typo?.fonts?.body) typo.fonts.body.family = family
                  })}
                />
              </div>

              {/* 본문 크기 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">기본 크기</label>
                  <span className="text-[10px] text-gray-400">본문(대), 소제목</span>
                </div>
                <SizeSelector
                  value={localStyle.theme.typography?.sizes?.base ?? '1rem'}
                  options={FONT_SIZE_OPTIONS}
                  onChange={(size) => updateTypography((typo) => {
                    if (typo?.sizes) typo.sizes.base = size
                  })}
                />
              </div>

              {/* 본문 굵기 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">굵기</label>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_WEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.weights) typo.weights.regular = opt.value
                      })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        localStyle.theme.typography?.weights?.regular === opt.value
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                      style={{ fontWeight: opt.value }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 줄 간격 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">줄 간격</label>
                <div className="grid grid-cols-2 gap-2">
                  {LINE_HEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.lineHeights) typo.lineHeights.relaxed = opt.value
                      })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        localStyle.theme.typography?.lineHeights?.relaxed === opt.value
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* ========== 공통 설정 ========== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">공통 설정</h3>
              </div>

              {/* 자간 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">자간</label>
                  <span className="text-[10px] text-gray-400">메인 타이틀</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {LETTER_SPACING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.letterSpacing) typo.letterSpacing.tight = opt.value
                      })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        localStyle.theme.typography?.letterSpacing?.tight === opt.value
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 색상 선택기 컴포넌트
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
        />
      </div>
      <div className="flex-1">
        <label className="text-xs text-gray-500">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm font-mono text-gray-700 bg-transparent border-none p-0 focus:outline-none"
        />
      </div>
    </div>
  )
}

// 글꼴 선택기 컴포넌트
const FONT_OPTIONS = [
  { value: 'Pretendard', label: 'Pretendard (기본)' },
  { value: 'Noto Sans KR', label: '노토 산스' },
  { value: 'Nanum Myeongjo', label: '나눔명조' },
  { value: 'Nanum Gothic', label: '나눔고딕' },
  { value: 'Gowun Dodum', label: '고운돋움' },
  { value: 'Gowun Batang', label: '고운바탕' },
  { value: 'Noto Serif KR', label: '노토 세리프' },
  { value: 'Gothic A1', label: 'Gothic A1' },
]

// 폰트 크기 옵션
const FONT_SIZE_OPTIONS = [
  { value: '0.875rem', label: '작게 (14px)' },
  { value: '1rem', label: '기본 (16px)' },
  { value: '1.125rem', label: '크게 (18px)' },
]

// 자간 옵션
const LETTER_SPACING_OPTIONS = [
  { value: '-0.025em', label: '좁게' },
  { value: '0', label: '기본' },
  { value: '0.05em', label: '넓게' },
]

// 줄 간격 옵션
const LINE_HEIGHT_OPTIONS = [
  { value: 1.4, label: '좁게 (1.4)' },
  { value: 1.6, label: '기본 (1.6)' },
  { value: 1.8, label: '넓게 (1.8)' },
  { value: 2.0, label: '여유 (2.0)' },
]

// 본문 굵기 옵션
const FONT_WEIGHT_OPTIONS = [
  { value: 300, label: '얇게' },
  { value: 400, label: '기본' },
  { value: 500, label: '굵게' },
]

// 제목 굵기 옵션
const HEADING_WEIGHT_OPTIONS = [
  { value: 600, label: '보통' },
  { value: 700, label: '굵게' },
  { value: 800, label: '매우 굵게' },
]

function FontSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
    >
      {FONT_OPTIONS.map((font) => (
        <option key={font.value} value={font.value}>
          {font.label}
        </option>
      ))}
    </select>
  )
}

// 색상 유틸리티 함수
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(255 * percent)
  const R = Math.min(255, (num >> 16) + amt)
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
  const B = Math.min(255, (num & 0x0000ff) + amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(255 * percent)
  const R = Math.max(0, (num >> 16) - amt)
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt)
  const B = Math.max(0, (num & 0x0000ff) - amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

// 크기 선택기 컴포넌트
function SizeSelector({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
            value === opt.value
              ? 'border-rose-500 bg-rose-50 text-rose-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
