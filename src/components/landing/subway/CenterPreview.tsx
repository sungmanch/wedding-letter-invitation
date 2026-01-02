'use client'

/**
 * Center Preview
 *
 * 중앙 프리뷰 패널 - 선택된 프리셋들의 스택 표시
 * - Hero + 선택된 섹션 프리셋들을 세로로 스택
 * - 폰 목업 프레임
 * - 실시간 업데이트
 */

import { useMemo, memo } from 'react'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import type { EditorDocument, Block } from '@/lib/super-editor-v2/schema/types'
import { useSubwayBuilder, SECTION_ORDER } from './SubwayBuilderContext'
import {
  SAMPLE_WEDDING_DATA,
  DEFAULT_STYLE_SYSTEM,
} from '@/lib/super-editor-v2/schema'
import { getBlockPreset } from '@/lib/super-editor-v2/presets/blocks'
import { getTemplateV2ById } from '@/lib/super-editor-v2/config/template-catalog-v2'
import { buildBlocksFromTemplate } from '@/lib/super-editor-v2/services/template-block-builder'
import { buildStyleSystemFromTemplate } from '@/lib/super-editor-v2/services/template-applier'
import type { PresetElement } from '@/lib/super-editor-v2/presets/blocks/types'
import type { Element, SizeMode } from '@/lib/super-editor-v2/schema/types'

// 고정된 타임스탬프 (hydration 불일치 방지)
const STATIC_TIMESTAMP = '2025-01-01T00:00:00.000Z'

// ============================================
// Types
// ============================================

interface CenterPreviewProps {
  /** 프레임 너비 */
  frameWidth?: number
  /** 프레임 높이 */
  frameHeight?: number
  /** 추가 className */
  className?: string
}

// ============================================
// Helpers
// ============================================

/** PresetElement → Element 변환 (결정론적 ID 사용) */
function convertPresetElement(el: PresetElement, presetId: string, index: number): Element {
  const element: Element = {
    ...el,
    id: el.id || `${presetId}-el-${index}`,
  } as Element

  if (el.children && el.children.length > 0) {
    element.children = el.children.map((child, childIndex) =>
      convertPresetElement(child as PresetElement, presetId, index * 100 + childIndex)
    )
  }

  return element
}

/** 프리셋에서 Block 생성 (결정론적 ID 사용) */
function createBlockFromPresetData(
  presetId: string,
  blockType: string
): Block | null {
  const preset = getBlockPreset(presetId)
  if (!preset) return null

  let height: number | SizeMode = 80
  if (preset.defaultHeight) {
    height =
      typeof preset.defaultHeight === 'number'
        ? preset.defaultHeight
        : preset.defaultHeight
  }

  return {
    id: `preview-block-${presetId}`,
    type: preset.blockType,
    enabled: true,
    presetId: preset.id,
    height,
    layout: preset.layout,
    elements: preset.defaultElements
      ? preset.defaultElements.map((el, index) => convertPresetElement(el, presetId, index))
      : [],
  }
}

// ============================================
// Component
// ============================================

function CenterPreviewInner({
  frameWidth = 280,
  frameHeight = 500,
  className = '',
}: CenterPreviewProps) {
  const { state } = useSubwayBuilder()

  // 프리뷰 문서 생성
  const document = useMemo<EditorDocument | null>(() => {
    // 1. Hero 블록 가져오기
    const template = getTemplateV2ById(state.selectedTemplateId)
    if (!template) return null

    const templateBlocks = buildBlocksFromTemplate(template, SAMPLE_WEDDING_DATA)
    const heroBlock = templateBlocks.find((b) => b.type === 'hero')

    // 2. 선택된 프리셋으로 섹션 블록 생성
    const sectionBlocks: Block[] = []
    for (const sectionType of SECTION_ORDER) {
      const presetId = state.selectedPresets[sectionType]
      if (presetId) {
        const block = createBlockFromPresetData(presetId, sectionType)
        if (block) {
          sectionBlocks.push(block)
        }
      }
    }

    // 3. 전체 블록 조합
    const blocks: Block[] = heroBlock
      ? [heroBlock, ...sectionBlocks]
      : sectionBlocks

    // 4. 스타일 시스템 생성
    const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)

    return {
      id: 'preview',
      version: 2 as const,
      blocks,
      style,
      data: SAMPLE_WEDDING_DATA,
      animation: {
        mood: 'minimal' as const,
        speed: 1,
        floatingElements: [],
      },
      meta: {
        title: '미리보기',
        createdAt: STATIC_TIMESTAMP,
        updatedAt: STATIC_TIMESTAMP,
        templateId: state.selectedTemplateId,
        templateVersion: 2 as const,
      },
    }
  }, [state.selectedTemplateId, state.selectedPresets])

  // 스케일 계산
  const scale = frameWidth / 375

  if (!document) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--sand-50)] rounded-2xl ${className}`}
        style={{ width: frameWidth, height: frameHeight }}
      >
        <span className="text-sm text-[var(--text-muted)]">로딩 중...</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* 폰 프레임 */}
      <div
        className="relative rounded-[2rem] bg-[var(--sand-200)] p-1.5 shadow-xl"
        style={{ width: frameWidth + 16, height: frameHeight + 16 }}
      >
        {/* 노치 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/80 rounded-full z-10" />

        {/* 스크린 */}
        <div
          className="relative rounded-[1.5rem] overflow-hidden bg-white"
          style={{ width: frameWidth, height: frameHeight }}
        >
          {/* 스크롤 컨테이너 */}
          <div
            className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* 스케일된 문서 렌더러 */}
            <div
              style={{
                width: 375,
                minHeight: 667,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                ...state.cssVariables,
              }}
            >
              <DocumentRenderer document={document} mode="preview" />
            </div>
          </div>
        </div>
      </div>

      {/* 라벨 */}
      <p className="text-center mt-3 text-xs text-[var(--text-muted)]">
        실시간 미리보기
      </p>
    </div>
  )
}

export const CenterPreview = memo(CenterPreviewInner)
