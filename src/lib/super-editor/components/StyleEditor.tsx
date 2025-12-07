'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { StyleSchema } from '../schema/style'
import type { LegacyIntroType } from '../presets/legacy/types'
import { INTRO_STYLE_PRESETS, applyIntroStyleToSchema } from '../presets/intro-style-presets'

interface StyleEditorProps {
  style: StyleSchema
  onStyleChange: (style: StyleSchema) => void
  className?: string
  /** 실시간 업데이트 여부 (기본: true) */
  liveUpdate?: boolean
  /** 디바운스 시간 (ms, 기본: 300) */
  debounceMs?: number
  /** 현재 선택된 인트로 타입 (추천 스타일용) */
  introType?: LegacyIntroType
}

// 컬러 칩 프리셋
const TEXT_COLOR_PRESETS = [
  '#1f2937',  // 차콜 (기본)
  '#F5E6D3',  // 크림 (다크 배경용)
  '#722F37',  // 버건디
  '#1E3A5F',  // 네이비
  '#2F4538',  // 에메랄드
  '#36454F',  // 차콜 그레이
]

const BG_COLOR_PRESETS = [
  '#FFFFFF',  // 화이트
  '#1A1A1A',  // 다크
  '#FAFAFA',  // 라이트 그레이
  '#F5E6D3',  // 크림
  '#FFFEF5',  // 아이보리
  '#0D0D0D',  // 블랙
]

// 글꼴 옵션
const FONT_OPTIONS = [
  { value: 'Pretendard', label: 'Pretendard (기본)' },
  { value: 'Noto Sans KR', label: '노토 산스' },
  { value: 'Nanum Myeongjo', label: '나눔명조' },
  { value: 'Nanum Gothic', label: '나눔고딕' },
  { value: 'Gowun Dodum', label: '고운돋움' },
  { value: 'Gowun Batang', label: '고운바탕' },
  { value: 'Noto Serif KR', label: '노토 세리프' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Playfair Display', label: 'Playfair Display' },
]

// 굵기 옵션
const TITLE_WEIGHT_OPTIONS = [
  { value: 400, label: '보통' },
  { value: 600, label: '굵게' },
  { value: 700, label: '매우 굵게' },
]

const BODY_WEIGHT_OPTIONS = [
  { value: 300, label: '얇게' },
  { value: 400, label: '보통' },
  { value: 500, label: '굵게' },
]

// 자간 옵션
const LETTER_SPACING_OPTIONS = [
  { value: '-0.025em', label: '좁게' },
  { value: '0', label: '기본' },
  { value: '0.05em', label: '넓게' },
]

// 줄 간격 옵션
const LINE_HEIGHT_OPTIONS = [
  { value: 1.4, label: '좁게' },
  { value: 1.6, label: '기본' },
  { value: 1.8, label: '넓게' },
  { value: 2.0, label: '여유' },
]

export function StyleEditor({
  style,
  onStyleChange,
  className = '',
  liveUpdate = true,
  debounceMs = 300,
  introType,
}: StyleEditorProps) {
  const [localStyle, setLocalStyle] = useState<StyleSchema>(style)
  const [isDirty, setIsDirty] = useState(false)
  const [textAdvancedOpen, setTextAdvancedOpen] = useState(false)
  const [bgAdvancedOpen, setBgAdvancedOpen] = useState(false)

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

  // 컴포넌트 언마운트 시 변경사항 저장
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

  // 색상 업데이트
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

      debouncedStyleChange(newStyle)
      return newStyle
    })
    setIsDirty(true)
  }, [debouncedStyleChange])

  // 타이포그래피 업데이트
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

  // 추천 스타일 적용
  const applyRecommendedStyle = useCallback(() => {
    if (!introType) return
    const preset = INTRO_STYLE_PRESETS[introType]
    if (!preset) return

    const newStyle = applyIntroStyleToSchema(localStyle, preset)
    setLocalStyle(newStyle)
    debouncedStyleChange(newStyle)
    setIsDirty(true)
  }, [introType, localStyle, debouncedStyleChange])

  const currentPreset = introType ? INTRO_STYLE_PRESETS[introType] : null

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 추천 스타일 적용 */}
        {currentPreset && (
          <div className="p-4 bg-gradient-to-r from-[#C9A962]/10 to-[#C9A962]/5 rounded-xl border border-[#C9A962]/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">✨</span>
              <span className="text-sm font-medium text-[#C9A962]">
                {currentPreset.label}
              </span>
            </div>
            <p className="text-xs text-[#F5E6D3]/60 mb-3">
              {currentPreset.description}
            </p>
            <button
              onClick={applyRecommendedStyle}
              className="w-full py-2.5 bg-[#C9A962] text-[#0A0806] rounded-lg text-sm font-medium hover:bg-[#B8A052] transition-colors"
            >
              추천 스타일 적용
            </button>
          </div>
        )}

        {/* 글 스타일 섹션 */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#F5E6D3] flex items-center gap-2">
            <span>📝</span>
            글 스타일
          </h3>

          {/* 제목 글꼴 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#F5E6D3]/60">제목 글꼴</label>
            <FontSelector
              value={localStyle.theme.typography?.fonts?.heading?.family ?? 'Pretendard'}
              onChange={(family) => updateTypography((typo) => {
                if (typo?.fonts?.heading) typo.fonts.heading.family = family
              })}
            />
          </div>

          {/* 본문 글꼴 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#F5E6D3]/60">본문 글꼴</label>
            <FontSelector
              value={localStyle.theme.typography?.fonts?.body?.family ?? 'Pretendard'}
              onChange={(family) => updateTypography((typo) => {
                if (typo?.fonts?.body) typo.fonts.body.family = family
              })}
            />
          </div>

          {/* 글씨 색상 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#F5E6D3]/60">글씨 색상</label>
            <ColorChipSelector
              value={localStyle.theme.colors.text?.primary ?? '#1f2937'}
              presets={TEXT_COLOR_PRESETS}
              onChange={(color) => updateColor('text.primary', color)}
            />
          </div>

          {/* 고급 설정 토글 */}
          <DisclosurePanel
            label="상세 설정"
            isOpen={textAdvancedOpen}
            onToggle={() => setTextAdvancedOpen(!textAdvancedOpen)}
          >
            <div className="space-y-4 pt-2">
              {/* 제목 굵기 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#F5E6D3]/60">제목 굵기</label>
                <div className="grid grid-cols-3 gap-2">
                  {TITLE_WEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.weights) {
                          typo.weights.bold = opt.value
                          typo.weights.semibold = Math.max(400, opt.value - 100)
                        }
                      })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        localStyle.theme.typography?.weights?.bold === opt.value
                          ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]'
                          : 'border-white/10 hover:border-white/20 text-[#F5E6D3]/60'
                      }`}
                      style={{ fontWeight: opt.value }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 본문 굵기 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#F5E6D3]/60">본문 굵기</label>
                <div className="grid grid-cols-3 gap-2">
                  {BODY_WEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.weights) typo.weights.regular = opt.value
                      })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        localStyle.theme.typography?.weights?.regular === opt.value
                          ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]'
                          : 'border-white/10 hover:border-white/20 text-[#F5E6D3]/60'
                      }`}
                      style={{ fontWeight: opt.value }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 자간 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#F5E6D3]/60">자간</label>
                <div className="grid grid-cols-3 gap-2">
                  {LETTER_SPACING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.letterSpacing) typo.letterSpacing.tight = opt.value
                      })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        localStyle.theme.typography?.letterSpacing?.tight === opt.value
                          ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]'
                          : 'border-white/10 hover:border-white/20 text-[#F5E6D3]/60'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </section>

        <div className="border-t border-white/10" />

        {/* 배경 스타일 섹션 */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-[#F5E6D3] flex items-center gap-2">
            <span>🎨</span>
            배경 스타일
          </h3>

          {/* 배경 색상 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#F5E6D3]/60">배경 색상</label>
            <ColorChipSelector
              value={localStyle.theme.colors.background?.default ?? '#ffffff'}
              presets={BG_COLOR_PRESETS}
              onChange={(color) => updateColor('background.default', color)}
            />
          </div>

          {/* 고급 설정 토글 */}
          <DisclosurePanel
            label="상세 설정"
            isOpen={bgAdvancedOpen}
            onToggle={() => setBgAdvancedOpen(!bgAdvancedOpen)}
          >
            <div className="space-y-4 pt-2">
              {/* 줄 간격 */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#F5E6D3]/60">줄 간격</label>
                <div className="grid grid-cols-2 gap-2">
                  {LINE_HEIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTypography((typo) => {
                        if (typo?.lineHeights) typo.lineHeights.relaxed = opt.value
                      })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        localStyle.theme.typography?.lineHeights?.relaxed === opt.value
                          ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]'
                          : 'border-white/10 hover:border-white/20 text-[#F5E6D3]/60'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 강조 색상 */}
              {localStyle.theme.colors.accent && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#F5E6D3]/60">강조 색상</label>
                  <ColorChipSelector
                    value={localStyle.theme.colors.accent?.[500] ?? '#C9A962'}
                    presets={['#C9A962', '#e11d48', '#8b5cf6', '#14b8a6', '#1e40af', '#ec4899']}
                    onChange={(color) => updateColor('accent.500', color)}
                  />
                </div>
              )}
            </div>
          </DisclosurePanel>
        </section>
      </div>
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

// 글꼴 선택기
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
      className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-lg bg-white/5 text-[#F5E6D3] focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50 focus:border-transparent"
      style={{ fontFamily: value }}
    >
      {FONT_OPTIONS.map((font) => (
        <option
          key={font.value}
          value={font.value}
          className="bg-[#1A1A1A] text-[#F5E6D3]"
          style={{ fontFamily: font.value }}
        >
          {font.label}
        </option>
      ))}
    </select>
  )
}

// 컬러 칩 선택기
function ColorChipSelector({
  value,
  presets,
  onChange,
}: {
  value: string
  presets: string[]
  onChange: (color: string) => void
}) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-lg border-2 transition-all ${
              value.toLowerCase() === color.toLowerCase()
                ? 'border-[#C9A962] ring-2 ring-[#C9A962]/30 scale-110'
                : 'border-white/20 hover:border-white/40'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center text-xs ${
            showPicker
              ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]'
              : 'border-white/20 hover:border-white/40 text-[#F5E6D3]/60'
          }`}
          title="직접 선택"
        >
          +
        </button>
      </div>

      {showPicker && (
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border border-white/20"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-2 py-1 text-sm font-mono text-[#F5E6D3] bg-transparent border border-white/10 rounded focus:outline-none focus:border-[#C9A962]/50"
            placeholder="#000000"
          />
        </div>
      )}
    </div>
  )
}

// 접기/펼치기 패널
function DisclosurePanel({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-medium text-[#F5E6D3]/60 hover:bg-white/5 transition-colors"
      >
        <span>{isOpen ? '▾' : '▸'} {label}</span>
        <span className="text-[10px] text-[#F5E6D3]/40">
          {isOpen ? '접기' : '펼치기'}
        </span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 border-t border-white/10">
          {children}
        </div>
      )}
    </div>
  )
}
