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
  getSampleWeddingDataForTemplate,
} from '@/lib/super-editor-v2/schema'
import type { ThemePresetId } from '@/lib/super-editor-v2/schema/types'

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
  preset: BlockPreset,
  cssVariables?: Record<string, string>
): EditorDocument {
  // 프리셋의 recommendedThemes에서 테마 프리셋 ID 추출
  const themePresetId = preset.recommendedThemes?.[0] as ThemePresetId | undefined

  return {
    id: `mini-${block.id}`,
    version: 2,
    blocks: [block],
    style: {
      ...DEFAULT_STYLE_SYSTEM,
      // 프리셋에 추천 테마가 있으면 적용
      ...(themePresetId && { preset: themePresetId }),
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
    const document = createMiniDocument(block, preset, cssVariables)

    return { block, document }
  }, [preset, cssVariables])

  // 원본 뷰포트 크기 (모바일 기준)
  const ORIGINAL_WIDTH = 375
  const ORIGINAL_HEIGHT = 667

  // 블록 높이에 따른 내부 높이 계산
  const blockHeight = useMemo(() => {
    if (!block) return ORIGINAL_HEIGHT

    if (typeof block.height === 'number') {
      // vh를 px로 변환 (667px viewport 기준)
      return (block.height / 100) * ORIGINAL_HEIGHT
    }

    // SizeMode(hug 등)의 경우 기본값 사용
    return 300
  }, [block])

  // Scale factor 계산 - 너비와 높이 모두 고려하여 fit 되도록
  const scaleX = width / ORIGINAL_WIDTH
  const scaleY = height / blockHeight
  const scale = Math.min(scaleX, scaleY) // 둘 중 작은 값으로 fit

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

  // 스케일된 후의 실제 크기
  const scaledWidth = ORIGINAL_WIDTH * scale
  const scaledHeight = blockHeight * scale

  // 정렬을 위한 오프셋 (상단 10% 위치)
  const offsetX = (width - scaledWidth) / 2
  const offsetY = (height - scaledHeight) * 0.001 // 상단 근처

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
          position: 'absolute',
          left: offsetX,
          top: offsetY,
          width: ORIGINAL_WIDTH,
          height: blockHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none', // 썸네일 내부 클릭 이벤트 비활성화 (갤러리 라이트박스 방지)
          ...cssVariables,
        }}
      >
        <DocumentRenderer
          document={document}
          mode="preview"
          viewportOverride={{ width: ORIGINAL_WIDTH, height: blockHeight }}
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
 * 프리셋 시스템을 사용하여 hero 블록을 렌더링
 */
export function MiniHeroRenderer({
  templateId,
  cssVariables = {},
  width = 120,
  height = 200,
  className = '',
}: MiniHeroRendererProps) {
  // 프리셋 기반으로 문서 생성
  const document = useMemo(() => {
    // 템플릿 ID → Hero 프리셋 ID 매핑
    const { getHeroPresetIdForTemplate } = require('@/lib/super-editor-v2/config/template-preset-map')

    const heroPresetId = getHeroPresetIdForTemplate(templateId)
    if (!heroPresetId) return null

    const preset = getBlockPreset(heroPresetId)
    if (!preset) return null

    // 프리셋에서 블록 생성
    const block = createBlockFromPreset(preset)
    if (!block) return null

    // 템플릿별 샘플 이미지 사용 (unique1 → 1.png, unique2 → 2.png, ...)
    const sampleData = getSampleWeddingDataForTemplate(templateId)

    // 프리셋의 recommendedThemes에서 테마 프리셋 ID 추출
    const themePresetId = preset.recommendedThemes?.[0] as ThemePresetId | undefined

    return {
      id: `hero-${templateId}`,
      version: 2 as const,
      blocks: [block],
      style: {
        ...DEFAULT_STYLE_SYSTEM,
        // 프리셋에 추천 테마가 있으면 적용
        ...(themePresetId && { preset: themePresetId }),
      },
      data: sampleData,
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

  // 컨테이너에 맞는 스케일 계산 (width, height 둘 다 고려)
  const scaleX = width / ORIGINAL_WIDTH
  const scaleY = height / ORIGINAL_HEIGHT
  const scale = Math.min(scaleX, scaleY)

  // 스케일된 후의 실제 크기
  const scaledWidth = ORIGINAL_WIDTH * scale
  const scaledHeight = ORIGINAL_HEIGHT * scale

  // 정렬을 위한 오프셋 (상단 10% 위치)
  const offsetX = (width - scaledWidth) / 2
  const offsetY = (height - scaledHeight) * 0.1 // 상단 근처

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

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        backgroundColor: cssVariables['--bg-page'] || '#ffffff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: offsetX,
          top: offsetY,
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
