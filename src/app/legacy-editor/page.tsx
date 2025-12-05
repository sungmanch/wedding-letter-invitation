'use client'

import { useState, useMemo, useCallback } from 'react'
import { InvitationRenderer } from '@/lib/super-editor/renderers'
import { convertLegacyPreset } from '@/lib/super-editor/presets/legacy/converter'
import { legacyPresets, categoryLabels } from '@/lib/super-editor/presets/legacy'
import type { LegacyTemplatePreset, LegacyTemplateCategory, LegacyColorPalette } from '@/lib/super-editor/presets/legacy/types'
import type { UserData } from '@/lib/super-editor/schema/user-data'
import type { SectionType } from '@/lib/super-editor/schema/section-types'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED } from '@/lib/super-editor/schema/section-types'

// 색상 팔레트를 배열로 변환
function getColorArray(colors: LegacyColorPalette): string[] {
  return [colors.primary, colors.secondary, colors.accent, colors.background, colors.text]
}

// 샘플 유저 데이터
const SAMPLE_USER_DATA: UserData = {
  version: '1.0',
  meta: {
    id: 'sample-1',
    templateId: 'legacy-preview',
    layoutId: 'layout-1',
    styleId: 'style-1',
    editorId: 'editor-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  data: {
    couple: {
      groom: {
        name: '김민준',
        nameEn: 'Minjun Kim',
        role: '신랑',
        parentLabel: '장남',
      },
      bride: {
        name: '이서연',
        nameEn: 'Seoyeon Lee',
        role: '신부',
        parentLabel: '장녀',
      },
      together: '민준 & 서연',
      coupleName: '민준 그리고 서연',
    },
    wedding: {
      date: '2025-03-15',
      time: '14:00',
      dateDisplay: '2025년 3월 15일 토요일',
      timeDisplay: '오후 2시',
      dday: 100,
    },
    venue: {
      name: '그랜드 웨딩홀',
      hall: '그랜드볼룸',
      floor: '2층',
      address: '서울특별시 강남구 테헤란로 123',
      addressDetail: '그랜드빌딩 2층',
      lat: 37.5665,
      lng: 126.978,
      phone: '02-1234-5678',
      parking: '건물 지하주차장 이용 (2시간 무료)',
      transport: [
        { type: 'subway', description: '2호선 강남역 3번출구 도보 5분' },
        { type: 'bus', description: '146, 341, 360번 강남역 정류장 하차' },
      ],
    },
    photos: {
      main: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600',
        'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600',
        'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600',
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600',
      ],
    },
    greeting: {
      title: '소중한 분들을 초대합니다',
      content: '서로 다른 길을 걸어온 저희 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n귀한 걸음 하시어 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.',
    },
    accounts: {
      groom: [
        { bank: '신한은행', accountNumber: '110-123-456789', holder: '김민준' },
        { bank: '국민은행', accountNumber: '123-45-678901', holder: '김철수 (부)' },
      ],
      bride: [
        { bank: '우리은행', accountNumber: '1002-123-456789', holder: '이서연' },
        { bank: '하나은행', accountNumber: '123-456789-01234', holder: '이영희 (모)' },
      ],
    },
    parents: {
      groom: {
        father: { name: '김철수' },
        mother: { name: '박영희' },
      },
      bride: {
        father: { name: '이대호' },
        mother: { name: '최미영' },
      },
    },
    guestbook: {
      enabled: true,
      title: '축하 메시지를 남겨주세요',
    },
    bgm: {
      enabled: true,
      title: 'Can\'t Help Falling in Love',
      artist: 'Elvis Presley',
    },
  },
}

type EditorTab = 'preset' | 'colors' | 'sections'

export default function LegacyEditorPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('keynote')
  const [activeTab, setActiveTab] = useState<EditorTab>('preset')
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({})
  const [sectionOrder, setSectionOrder] = useState<SectionType[]>(DEFAULT_SECTION_ORDER)
  const [sectionEnabled, setSectionEnabled] = useState<Record<SectionType, boolean>>(DEFAULT_SECTION_ENABLED)

  const selectedPreset = legacyPresets[selectedPresetId]

  // 프리셋 변환
  const convertedData = useMemo(() => {
    if (!selectedPreset) return null

    try {
      return convertLegacyPreset({
        presetId: selectedPresetId,
        styleOverrides: Object.keys(colorOverrides).length > 0 ? { colors: colorOverrides } : undefined,
      })
    } catch (e) {
      console.error('Failed to convert preset:', e)
      return null
    }
  }, [selectedPresetId, selectedPreset, colorOverrides])

  const handleColorChange = useCallback((key: string, value: string) => {
    setColorOverrides(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleResetColors = useCallback(() => {
    setColorOverrides({})
  }, [])

  const handleSectionToggle = useCallback((section: SectionType) => {
    setSectionEnabled(prev => ({ ...prev, [section]: !prev[section] }))
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
              레거시 템플릿 프리셋을 미리보고 수정합니다
            </p>
          </div>
          <div className="flex items-center gap-4">
            {convertedData && (
              <div className="text-sm text-gray-500">
                {convertedData.meta.sectionsCount}개 섹션 |{' '}
                {convertedData.meta.warnings.length > 0 && (
                  <span className="text-amber-600">
                    {convertedData.meta.warnings.length}개 경고
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 에디터 패널 */}
        <div className="w-[400px] flex flex-col bg-white border-r border-gray-200 flex-shrink-0">
          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            {(['preset', 'colors', 'sections'] as EditorTab[]).map(tab => (
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
                {tab === 'sections' && '섹션'}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'preset' && (
              <PresetSelector
                categories={categories}
                selectedId={selectedPresetId}
                onSelect={setSelectedPresetId}
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

            {activeTab === 'sections' && (
              <SectionEditor
                sectionEnabled={sectionEnabled}
                onToggle={handleSectionToggle}
              />
            )}
          </div>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div className="flex-1 flex flex-col bg-gray-200">
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {convertedData ? (
              <div className="relative">
                {/* 모바일 프레임 */}
                <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
                  <div
                    className="bg-white rounded-[2.5rem] overflow-hidden overflow-y-auto"
                    style={{ width: 375, height: 667 }}
                  >
                    <InvitationRenderer
                      layout={convertedData.layout}
                      style={convertedData.style}
                      userData={SAMPLE_USER_DATA}
                      sectionOrder={sectionOrder}
                      sectionEnabled={sectionEnabled}
                      mode="preview"
                    />
                  </div>
                </div>
                {/* 프리셋 정보 라벨 */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {selectedPreset?.nameKo}
                  </p>
                  <p className="text-xs text-gray-500">
                    {categoryLabels[selectedPreset?.category ?? 'modern'].ko}
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

interface SectionEditorProps {
  sectionEnabled: Record<SectionType, boolean>
  onToggle: (section: SectionType) => void
}

function SectionEditor({ sectionEnabled, onToggle }: SectionEditorProps) {
  const sections: { type: SectionType; label: string; description: string }[] = [
    { type: 'intro', label: '인트로', description: '메인 사진과 커플 이름' },
    { type: 'date', label: '날짜/시간', description: '예식 일시 및 D-day' },
    { type: 'venue', label: '예식장', description: '장소 정보 및 지도' },
    { type: 'gallery', label: '갤러리', description: '사진 갤러리' },
    { type: 'parents', label: '혼주 소개', description: '양가 부모님 정보' },
    { type: 'accounts', label: '마음 전하기', description: '축의금 계좌 정보' },
    { type: 'guestbook', label: '방명록', description: '축하 메시지' },
    { type: 'music', label: 'BGM', description: '배경 음악 플레이어' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">섹션 표시 설정</h3>

      <div className="space-y-2">
        {sections.map(({ type, label, description }) => (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              sectionEnabled[type]
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  sectionEnabled[type] ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 mt-0.5 rounded-full bg-white shadow transition-transform ${
                    sectionEnabled[type] ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
