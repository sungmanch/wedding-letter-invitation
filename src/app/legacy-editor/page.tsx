'use client'

import { useState, useMemo, useCallback } from 'react'
import { legacyPresets, categoryLabels } from '@/lib/super-editor/presets/legacy'
import type { LegacyTemplatePreset, LegacyTemplateCategory, LegacyColorPalette } from '@/lib/super-editor/presets/legacy/types'
import { IntroPreview } from '@/components/invitation/intros/IntroPreview'
import type { IntroConfig, ColorPalette, FontSet } from '@/lib/themes/schema'

// 색상 팔레트를 배열로 변환
function getColorArray(colors: LegacyColorPalette): string[] {
  return [colors.primary, colors.secondary, colors.accent, colors.background, colors.text]
}

// LegacyColorPalette를 ColorPalette로 변환
function toColorPalette(colors: LegacyColorPalette): ColorPalette {
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    textMuted: colors.textMuted,
    accent: colors.accent,
  }
}

// LegacyTemplatePreset에서 FontSet 추출
function toFontSet(preset: LegacyTemplatePreset): FontSet {
  return {
    title: {
      family: preset.defaultFonts.title.family,
      weight: preset.defaultFonts.title.weight,
      letterSpacing: preset.defaultFonts.title.letterSpacing,
    },
    body: {
      family: preset.defaultFonts.body.family,
      weight: preset.defaultFonts.body.weight,
    },
  }
}

// LegacyIntroConfig를 IntroConfig로 변환
function toIntroConfig(preset: LegacyTemplatePreset): IntroConfig {
  return {
    type: preset.intro.type,
    duration: preset.intro.duration,
    skipEnabled: preset.intro.skipEnabled,
    skipDelay: preset.intro.skipDelay,
    settings: preset.intro.settings as IntroConfig['settings'],
  }
}

// 샘플 데이터
const SAMPLE_DATA = {
  groomName: '김민준',
  brideName: '이서연',
  weddingDate: '2025-03-15',
  venueName: '그랜드 웨딩홀',
  userImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
}

type EditorTab = 'preset' | 'colors'

export default function LegacyEditorPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('keynote')
  const [activeTab, setActiveTab] = useState<EditorTab>('preset')
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({})

  const selectedPreset = legacyPresets[selectedPresetId]

  // 색상 오버라이드 적용
  const effectiveColors = useMemo(() => {
    if (!selectedPreset) return null
    const base = selectedPreset.defaultColors
    return toColorPalette({
      ...base,
      ...colorOverrides,
    } as LegacyColorPalette)
  }, [selectedPreset, colorOverrides])

  const handleColorChange = useCallback((key: string, value: string) => {
    setColorOverrides(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleResetColors = useCallback(() => {
    setColorOverrides({})
  }, [])

  const categories = useMemo(() => {
    const grouped: Record<LegacyTemplateCategory, LegacyTemplatePreset[]> = {
      modern: [],
      cinematic: [],
      artistic: [],
      retro: [],
      playful: [],
      classic: [],
    }

    Object.values(legacyPresets).forEach(preset => {
      grouped[preset.category].push(preset)
    })

    return grouped
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Legacy Preset Editor</h1>
            <p className="text-sm text-gray-500 mt-1">
              레거시 템플릿 인트로를 미리보고 수정합니다
            </p>
          </div>
          {selectedPreset && (
            <div className="text-sm text-gray-500">
              {selectedPreset.nameKo} ({selectedPreset.intro.type})
            </div>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 에디터 패널 */}
        <div className="w-[400px] flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {(['preset', 'colors'] as EditorTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab === 'preset' && '프리셋'}
                {tab === 'colors' && '색상'}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'preset' && (
              <PresetSelector
                categories={categories}
                selectedId={selectedPresetId}
                onSelect={(id) => {
                  setSelectedPresetId(id)
                  setColorOverrides({}) // 프리셋 변경 시 색상 초기화
                }}
              />
            )}

            {activeTab === 'colors' && selectedPreset && (
              <ColorEditor
                preset={selectedPreset}
                overrides={colorOverrides}
                onChange={handleColorChange}
                onReset={handleResetColors}
              />
            )}
          </div>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div className="flex-1 flex flex-col bg-gray-200">
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {selectedPreset && effectiveColors ? (
              <div className="relative">
                {/* 모바일 프레임 */}
                <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                  <div
                    className="relative bg-white rounded-[2.5rem] overflow-hidden"
                    style={{ width: 375, height: 667 }}
                  >
                    <IntroPreview
                      intro={toIntroConfig(selectedPreset)}
                      colors={effectiveColors}
                      fonts={toFontSet(selectedPreset)}
                      groomName={SAMPLE_DATA.groomName}
                      brideName={SAMPLE_DATA.brideName}
                      weddingDate={SAMPLE_DATA.weddingDate}
                      venueName={SAMPLE_DATA.venueName}
                      userImageUrl={SAMPLE_DATA.userImageUrl}
                    />
                  </div>
                </div>
                {/* 프리셋 정보 라벨 */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {selectedPreset.nameKo}
                  </p>
                  <p className="text-xs text-gray-500">
                    {categoryLabels[selectedPreset.category].ko}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">프리셋을 선택해주세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Sub Components
// ============================================

interface PresetSelectorProps {
  categories: Record<LegacyTemplateCategory, LegacyTemplatePreset[]>
  selectedId: string
  onSelect: (id: string) => void
}

function PresetSelector({ categories, selectedId, onSelect }: PresetSelectorProps) {
  return (
    <div className="space-y-6">
      {(Object.entries(categories) as [LegacyTemplateCategory, LegacyTemplatePreset[]][]).map(
        ([category, presets]) =>
          presets.length > 0 && (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {categoryLabels[category].ko}
              </h3>
              <div className="space-y-2">
                {presets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => onSelect(preset.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedId === preset.id
                        ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{preset.nameKo}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{preset.name}</p>
                      </div>
                      {/* 색상 미리보기 */}
                      <div className="flex gap-1">
                        {getColorArray(preset.preview.colors).slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {preset.descriptionKo}
                    </p>
                    {/* 무드 태그 */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {preset.preview.mood.slice(0, 3).map(mood => (
                        <span
                          key={mood}
                          className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded"
                        >
                          {mood}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  )
}

interface ColorEditorProps {
  preset: LegacyTemplatePreset
  overrides: Record<string, string>
  onChange: (key: string, value: string) => void
  onReset: () => void
}

function ColorEditor({ preset, overrides, onChange, onReset }: ColorEditorProps) {
  const colors = preset.defaultColors
  const colorKeys: { key: keyof typeof colors; label: string }[] = [
    { key: 'primary', label: '주요 색상' },
    { key: 'secondary', label: '보조 색상' },
    { key: 'accent', label: '강조 색상' },
    { key: 'background', label: '배경' },
    { key: 'surface', label: '표면' },
    { key: 'text', label: '텍스트' },
    { key: 'textMuted', label: '보조 텍스트' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">색상 커스터마이징</h3>
        {Object.keys(overrides).length > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-rose-600 hover:text-rose-700"
          >
            초기화
          </button>
        )}
      </div>

      <div className="space-y-4">
        {colorKeys.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-sm text-gray-600">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={overrides[key] ?? colors[key]}
                onChange={e => onChange(key, e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={overrides[key] ?? colors[key]}
                onChange={e => onChange(key, e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono border border-gray-200 rounded"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 원본 색상 참조 */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">원본 팔레트</p>
        <div className="flex gap-1">
          {getColorArray(preset.preview.colors).map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
