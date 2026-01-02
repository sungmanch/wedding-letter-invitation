'use client'

/**
 * Mini Block Renderer
 *
 * 프리셋 썸네일용 축소 블록 렌더러
 * - DocumentRenderer를 scale로 축소하여 표시
 * - CSS 변수를 외부에서 주입받아 테마 색상 적용
 */

import { useMemo, memo } from 'react'
import { DocumentRenderer } from '@/lib/super-editor-v2/renderer/document-renderer'
import type {
  EditorDocument,
  Block,
  Element,
  BlockType,
  SizeMode,
} from '@/lib/super-editor-v2/schema/types'
import {
  getBlockPreset,
  type BlockPreset,
  type PresetElement,
} from '@/lib/super-editor-v2/presets/blocks'
import {
  SAMPLE_WEDDING_DATA,
  DEFAULT_STYLE_SYSTEM,
  DEFAULT_BLOCK_HEIGHTS,
} from '@/lib/super-editor-v2/schema'

// ============================================
// Constants for Hydration Safety
// ============================================

// 고정된 타임스탬프 사용 (hydration 불일치 방지)
const STATIC_TIMESTAMP = '2025-01-01T00:00:00.000Z'

// ============================================
// Types
// ============================================

interface MiniBlockRendererProps {
  /** 프리셋 ID */
  presetId: string
  /** CSS 변수 (테마 색상) */
  cssVariables?: Record<string, string>
  /** 썸네일 너비 (px) */
  width?: number
  /** 썸네일 높이 (px) */
  height?: number
  /** 추가 className */
  className?: string
}

// ============================================
// Helpers
// ============================================

/** 결정론적 ID 생성 (presetId + index 기반) */
function generateDeterministicId(prefix: string, index: number): string {
  return `${prefix}-${index}`
}

/** PresetElement → Element 변환 (결정론적 ID 사용) */
function convertPresetElement(el: PresetElement, presetId: string, index: number): Element {
  const element: Element = {
    ...el,
    id: el.id || generateDeterministicId(`${presetId}-el`, index),
  } as Element

  // Group children 재귀 처리
  if (el.children && el.children.length > 0) {
    element.children = el.children.map((child, childIndex) =>
      convertPresetElement(child as PresetElement, presetId, index * 100 + childIndex)
    )
  }

  return element
}

/** 프리셋 → Block 변환 (결정론적 ID 사용) */
function createBlockFromPreset(preset: BlockPreset): Block {
  let height: number | SizeMode = DEFAULT_BLOCK_HEIGHTS[preset.blockType] || 80

  if (preset.defaultHeight) {
    if (typeof preset.defaultHeight === 'number') {
      height = preset.defaultHeight
    } else {
      height = preset.defaultHeight
    }
  }

  return {
    id: `block-${preset.id}`,
    type: preset.blockType,
    enabled: true,
    presetId: preset.id,
    height,
    layout: preset.layout,
    elements: preset.defaultElements
      ? preset.defaultElements.map((el, index) => convertPresetElement(el, preset.id, index))
      : [],
  }
}

/** 단일 블록용 미니 문서 생성 */
function createMiniDocument(
  block: Block,
  cssVariables?: Record<string, string>
): EditorDocument {
  return {
    id: `mini-${block.id}`,
    version: 2,
    blocks: [block],
    style: {
      ...DEFAULT_STYLE_SYSTEM,
      // CSS 변수가 있으면 advanced tokens으로 적용
    },
    data: SAMPLE_WEDDING_DATA,
    animation: {
      mood: 'minimal',
      speed: 1,
      floatingElements: [],
    },
    meta: {
      title: '미니 프리뷰',
      createdAt: STATIC_TIMESTAMP,
      updatedAt: STATIC_TIMESTAMP,
      templateVersion: 2,
    },
  }
}

// ============================================
// Component
// ============================================

function MiniBlockRendererInner({
  presetId,
  cssVariables = {},
  width = 100,
  height = 160,
  className = '',
}: MiniBlockRendererProps) {
  // 프리셋 가져오기
  const preset = useMemo(() => getBlockPreset(presetId), [presetId])

  // Block 및 Document 생성
  const { block, document } = useMemo(() => {
    if (!preset) {
      return { block: null, document: null }
    }

    const block = createBlockFromPreset(preset)
    const document = createMiniDocument(block, cssVariables)

    return { block, document }
  }, [preset, cssVariables])

  // Scale factor 계산 (375px viewport 기준)
  const scale = width / 375

  // 블록 높이에 따른 내부 높이 계산
  const blockHeight = useMemo(() => {
    if (!block) return 667 // 기본 전체 높이

    if (typeof block.height === 'number') {
      // vh를 px로 변환 (667px viewport 기준)
      return (block.height / 100) * 667
    }

    // SizeMode의 경우 기본값 사용
    return 300
  }, [block])

  if (!preset || !document) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-xs text-gray-400">No preset</span>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        width,
        height,
        backgroundColor: cssVariables['--bg-page'] || '#ffffff',
      }}
    >
      {/* 스케일된 렌더러 컨테이너 */}
      <div
        style={{
          width: 375,
          height: blockHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          ...cssVariables,
        }}
      >
        <DocumentRenderer
          document={document}
          mode="preview"
          viewportOverride={{ width: 375, height: blockHeight }}
        />
      </div>
    </div>
  )
}

export const MiniBlockRenderer = memo(MiniBlockRendererInner)

// ============================================
// Hero용 렌더러
// ============================================

interface MiniHeroRendererProps {
  /** 템플릿 ID (unique1 ~ unique6) */
  templateId: string
  /** CSS 변수 */
  cssVariables?: Record<string, string>
  /** 너비 */
  width?: number
  /** 높이 */
  height?: number
  /** className */
  className?: string
}

/**
 * Hero 템플릿 전용 미니 렌더러
 * template-catalog-v2에서 가져온 hero 블록을 렌더링
 */
export function MiniHeroRenderer({
  templateId,
  cssVariables = {},
  width = 120,
  height = 200,
  className = '',
}: MiniHeroRendererProps) {
  // 동적 import로 순환 의존성 방지
  const document = useMemo(() => {
    // Lazy import
    const {
      getTemplateV2ById,
    } = require('@/lib/super-editor-v2/config/template-catalog-v2')
    const {
      buildBlocksFromTemplate,
    } = require('@/lib/super-editor-v2/services/template-block-builder')

    const template = getTemplateV2ById(templateId)
    if (!template) return null

    const blocks = buildBlocksFromTemplate(template, SAMPLE_WEDDING_DATA)
    const heroBlock = blocks.find((b: Block) => b.type === 'hero')

    if (!heroBlock) return null

    return {
      id: `hero-${templateId}`,
      version: 2 as const,
      blocks: [heroBlock],
      style: DEFAULT_STYLE_SYSTEM,
      data: SAMPLE_WEDDING_DATA,
      animation: { mood: 'minimal' as const, speed: 1, floatingElements: [] },
      meta: {
        title: '히어로 미리보기',
        createdAt: STATIC_TIMESTAMP,
        updatedAt: STATIC_TIMESTAMP,
        templateVersion: 2 as const,
      },
    }
  }, [templateId])

  // 종횡비 유지하면서 컨테이너에 맞게 스케일 계산
  // 원본 비율: 375:667 (모바일 뷰포트)
  const ORIGINAL_WIDTH = 375
  const ORIGINAL_HEIGHT = 667

  // 컨테이너에 맞는 스케일 계산 (width 기준)
  const scale = width / ORIGINAL_WIDTH

  if (!document) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-xs text-gray-400">No template</span>
      </div>
    )
  }

  // 스케일 후 실제 렌더링 너비
  const scaledWidth = ORIGINAL_WIDTH * scale
  // 컨테이너 중앙 정렬을 위한 left 값
  const leftOffset = (width - scaledWidth) / 2

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        width,
        height,
        backgroundColor: cssVariables['--bg-page'] || '#ffffff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          top: 0,
          width: ORIGINAL_WIDTH,
          height: ORIGINAL_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          ...cssVariables,
        }}
      >
        <DocumentRenderer
          document={document}
          mode="preview"
          viewportOverride={{ width: ORIGINAL_WIDTH, height: ORIGINAL_HEIGHT }}
        />
      </div>
    </div>
  )
}
