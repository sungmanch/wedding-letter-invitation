'use client'

import { useCallback, useMemo } from 'react'
import { SECTION_META } from '../schema/section-types'
import { extractSectionsFromLayout } from '../utils/variable-extractor'
import type { SectionType } from '../schema/section-types'
import type { LayoutSchema } from '../schema/layout'

interface SectionManagerProps {
  sectionOrder: SectionType[]
  sectionEnabled: Record<SectionType, boolean>
  onOrderChange: (newOrder: SectionType[]) => void
  onEnabledChange: (newEnabled: Record<SectionType, boolean>) => void
  className?: string
  /** Layout 스키마 - 제공되면 해당 레이아웃에 존재하는 섹션만 표시 */
  layout?: LayoutSchema
}

export function SectionManager({
  sectionOrder,
  sectionEnabled,
  onOrderChange,
  onEnabledChange,
  className = '',
  layout,
}: SectionManagerProps) {
  // Layout에서 실제 존재하는 섹션 추출
  const availableSections = useMemo(() => {
    if (!layout) return null // layout이 없으면 기존 방식 사용
    return new Set(extractSectionsFromLayout(layout))
  }, [layout])

  // 표시할 섹션 순서 (layout 기반 필터링)
  const displayOrder = useMemo(() => {
    if (!availableSections) return sectionOrder
    return sectionOrder.filter((s) => availableSections.has(s))
  }, [sectionOrder, availableSections])

  // intro/music 존재 여부
  const hasIntro = !availableSections || availableSections.has('intro')
  const hasMusic = !availableSections || availableSections.has('music')

  // 섹션 토글
  const toggleSection = useCallback(
    (sectionType: SectionType) => {
      onEnabledChange({
        ...sectionEnabled,
        [sectionType]: !sectionEnabled[sectionType],
      })
    },
    [sectionEnabled, onEnabledChange]
  )

  // 섹션 순서 변경
  const moveSection = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= sectionOrder.length) return

      const newOrder = [...sectionOrder]
      const [moved] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, moved)
      onOrderChange(newOrder)
    },
    [sectionOrder, onOrderChange]
  )

  return (
    <div className={`section-manager ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">섹션 관리</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          섹션 순서를 변경하거나 표시/숨김을 설정하세요
        </p>
      </div>

      <div className="p-4 space-y-2">
        {/* 고정 섹션: intro */}
        {hasIntro && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-700">{SECTION_META.intro.label}</p>
              <p className="text-xs text-gray-500">항상 첫 번째</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">고정</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sectionEnabled.intro}
                onChange={() => toggleSection('intro')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
            </label>
          </div>
        </div>
        )}

        {/* 순서 변경 가능한 섹션들 */}
        {displayOrder.map((sectionType, index) => {
          const meta = SECTION_META[sectionType]
          const isEnabled = sectionEnabled[sectionType]

          return (
            <div
              key={sectionType}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isEnabled
                  ? 'bg-white border-gray-200'
                  : 'bg-gray-50 border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* 순서 변경 핸들 */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveSection(index, index - 1)}
                    disabled={index === 0}
                    className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, index + 1)}
                    disabled={index === displayOrder.length - 1}
                    className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div>
                  <p className="font-medium text-gray-700">{meta.label}</p>
                  <p className="text-xs text-gray-500">{meta.description}</p>
                </div>
              </div>

              {/* 토글 */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleSection(sectionType)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
              </label>
            </div>
          )
        })}

        {/* 플로팅 섹션: music */}
        {hasMusic && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">플로팅 섹션</p>
          <div
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              sectionEnabled.music
                ? 'bg-white border-gray-200'
                : 'bg-gray-50 border-gray-100 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-700">{SECTION_META.music.label}</p>
                <p className="text-xs text-gray-500">화면 우측 하단 버튼</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sectionEnabled.music}
                onChange={() => toggleSection('music')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
            </label>
          </div>
        </div>
        )}

        {/* Layout에 섹션이 없는 경우 안내 */}
        {availableSections && availableSections.size === 0 && (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">레이아웃에 정의된 섹션이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
