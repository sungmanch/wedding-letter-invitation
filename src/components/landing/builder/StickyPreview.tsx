'use client'

/**
 * Sticky Preview
 *
 * 우측 고정 프리뷰 (CenterPreview 확장)
 * - position: sticky로 스크롤 따라감
 * - 선택된 템플릿+섹션 실시간 반영
 */

import { useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import type { EditorDocument, Block } from '@/lib/super-editor-v2/schema/types'
import { useSubwayBuilder, SECTION_ORDER } from '../subway/SubwayBuilderContext'
import {
  DEFAULT_STYLE_SYSTEM,
  getSampleWeddingDataForTemplate,
} from '@/lib/super-editor-v2/schema'
import { getBlockPreset } from '@/lib/super-editor-v2/presets/blocks'
import { getTemplateV2ById } from '@/lib/super-editor-v2/config/template-catalog-v2'
import { buildStyleSystemFromTemplate } from '@/lib/super-editor-v2/services/template-applier'
import type { PresetElement } from '@/lib/super-editor-v2/presets/blocks/types'
import type { Element, SizeMode } from '@/lib/super-editor-v2/schema/types'
import { PhoneFrame } from '@/components/phone-frame'

// 고정된 타임스탬프 (hydration 불일치 방지)
const STATIC_TIMESTAMP = '2025-01-01T00:00:00.000Z'

// ============================================
// Helpers
// ============================================

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

function createBlockFromPresetData(presetId: string): Block | null {
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

function StickyPreviewInner() {
  const { state } = useSubwayBuilder()

  // 프리뷰 문서 생성
  const document = useMemo<EditorDocument | null>(() => {
    const template = getTemplateV2ById(state.selectedTemplateId)
    if (!template) return null

    // 템플릿별 샘플 이미지 사용 (unique1 → 1.png, unique2 → 2.png, ...)
    const sampleData = getSampleWeddingDataForTemplate(state.selectedTemplateId)

    // 선택된 프리셋으로 블록 생성 (hero 포함)
    const blocks: Block[] = []
    for (const sectionType of SECTION_ORDER) {
      const presetId = state.selectedPresets[sectionType]
      if (presetId) {
        const block = createBlockFromPresetData(presetId)
        if (block) {
          blocks.push(block)
        }
      }
    }

    const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)

    return {
      id: 'preview',
      version: 2 as const,
      blocks,
      style,
      data: sampleData,
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

  // 프레임 크기 (iPhone 14 비율: 390×844)
  const frameWidth = 320
  const frameHeight = 692 // 320 * (844/390) ≈ 692

  // 원본 뷰포트 크기 (iPhone 14 기준)
  const ORIGINAL_WIDTH = 390
  const ORIGINAL_HEIGHT = 844

  const scale = frameWidth / ORIGINAL_WIDTH

  // 문서의 총 높이 계산
  const totalContentHeight = useMemo(() => {
    if (!document) return ORIGINAL_HEIGHT

    const viewportHeight = ORIGINAL_HEIGHT // 기준 뷰포트 높이
    let total = 0

    for (const block of document.blocks) {
      if (typeof block.height === 'number') {
        // vh를 px로 변환
        total += (block.height / 100) * viewportHeight
      } else if (block.height && typeof block.height === 'object') {
        // SizeMode 처리
        const sizeMode = block.height as SizeMode
        if (sizeMode.type === 'fixed') {
          // px 단위인 경우 그대로 사용, vh인 경우 변환
          if (sizeMode.unit === 'vh') {
            total += (sizeMode.value / 100) * viewportHeight
          } else {
            // px (기본값)
            total += sizeMode.value
          }
        } else if (sizeMode.type === 'hug' || sizeMode.type === 'fill') {
          // hug/fill은 뷰포트 높이의 50%로 추정
          total += viewportHeight * 0.5
        } else {
          total += viewportHeight * 0.5
        }
      } else {
        total += viewportHeight * 0.5
      }
    }

    return Math.max(total, viewportHeight)
  }, [document])

  // 스케일 적용 후 실제 표시 높이
  const scaledContentHeight = totalContentHeight * scale

  if (!document) {
    return (
      <div className="sticky top-24">
        <div
          className="flex items-center justify-center bg-[var(--sand-50)] rounded-2xl"
          style={{ width: frameWidth + 24, height: frameHeight + 24 }}
        >
          <span className="text-sm text-[var(--text-muted)]">로딩 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-24">
      {/* 라벨 */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-[var(--text-primary)]">
          실시간 미리보기
        </h4>
        <span className="text-xs text-[var(--text-muted)]">
          선택에 따라 변경됩니다
        </span>
      </div>

      {/* 폰 프레임 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.selectedTemplateId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <PhoneFrame
            width={frameWidth + 24}
            height={frameHeight + 24}
            frameColor="black"
            showNotch={true}
            showHomeIndicator={true}
            scrollable={true}
          >
            {/* 스크롤 영역 - 스케일된 콘텐츠 높이만큼 확보 */}
            <div
              style={{
                width: frameWidth,
                height: scaledContentHeight,
                position: 'relative',
              }}
            >
              {/* 스케일된 문서 렌더러 */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: ORIGINAL_WIDTH,
                  height: totalContentHeight,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  ...state.cssVariables,
                }}
              >
                <DocumentRenderer
                  document={document}
                  mode="preview"
                  viewportOverride={{
                    width: ORIGINAL_WIDTH,
                    height: ORIGINAL_HEIGHT,
                  }}
                />
              </div>
            </div>
          </PhoneFrame>

          {/* 그림자 */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/10 rounded-full blur-xl -z-10"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export const StickyPreview = memo(StickyPreviewInner)
