/**
 * Template Block Builder Service
 *
 * 템플릿의 프리셋 조합을 실제 Block 인스턴스로 변환하는 서비스
 * - 프리셋 기반 블록 생성
 * - WeddingData를 바인딩하여 실제 값 주입
 * - 결정론적 ID 생성 (SSR hydration 안정성)
 */

import type { Block, Element, WeddingData, SizeMode } from '../schema/types'
import type { TemplateV2 } from '../config/template-catalog-v2'
import { getBlockPreset, type BlockPreset, type PresetElement } from '../presets/blocks'
import { DEFAULT_BLOCK_HEIGHTS } from '../schema'

// ============================================
// Section Order (블록 생성 순서)
// ============================================

const SECTION_ORDER = [
  'hero',
  'greeting-parents',
  'calendar',
  'gallery',
  'location',
] as const

// ============================================
// Main Functions
// ============================================

/**
 * 템플릿으로부터 Block 배열 생성 (프리셋 기반)
 *
 * @param template - TemplateV2 객체
 * @param weddingData - 사용자 웨딩 데이터
 * @returns 실제 Block 배열 (편집 가능)
 */
export function buildBlocksFromTemplate(
  template: TemplateV2,
  weddingData: WeddingData
): Block[] {
  const blocks: Block[] = []

  for (const sectionType of SECTION_ORDER) {
    const presetId = template.defaultPresets[sectionType]
    if (!presetId) continue

    const preset = getBlockPreset(presetId)
    if (!preset) {
      console.warn(`Preset not found: ${presetId}`)
      continue
    }

    const block = createBlockFromPreset(preset, template.id, blocks.length)
    blocks.push(block)
  }

  return blocks
}

/**
 * 프리셋 ID 배열로부터 Block 배열 생성
 *
 * @param presetIds - 프리셋 ID 배열
 * @param templateId - 템플릿 ID (ID 생성용)
 * @returns Block 배열
 */
export function buildBlocksFromPresets(
  presetIds: string[],
  templateId: string = 'custom'
): Block[] {
  const blocks: Block[] = []

  for (const presetId of presetIds) {
    const preset = getBlockPreset(presetId)
    if (!preset) {
      console.warn(`Preset not found: ${presetId}`)
      continue
    }

    const block = createBlockFromPreset(preset, templateId, blocks.length)
    blocks.push(block)
  }

  return blocks
}

// ============================================
// Block Creation
// ============================================

/**
 * 프리셋 → Block 변환 (결정론적 ID 사용)
 */
function createBlockFromPreset(
  preset: BlockPreset,
  templateId: string,
  blockIndex: number
): Block {
  const blockId = `${templateId}-b${blockIndex}`

  let height: number | SizeMode = DEFAULT_BLOCK_HEIGHTS[preset.blockType] || 80

  if (preset.defaultHeight) {
    height = preset.defaultHeight
  }

  return {
    id: blockId,
    type: preset.blockType,
    enabled: true,
    presetId: preset.id,
    height,
    layout: preset.layout,
    elements: preset.defaultElements
      ? preset.defaultElements.map((el, index) =>
          convertPresetElement(el, blockId, index)
        )
      : [],
  }
}

/**
 * PresetElement → Element 변환 (결정론적 ID 사용)
 */
function convertPresetElement(
  el: PresetElement,
  blockId: string,
  elementIndex: number
): Element {
  const element: Element = {
    ...el,
    id: el.id || `${blockId}-e${elementIndex}`,
  } as Element

  // Group children 재귀 처리
  if (el.children && el.children.length > 0) {
    element.children = el.children.map((child, childIndex) =>
      convertPresetElement(child as PresetElement, blockId, elementIndex * 100 + childIndex)
    )
  }

  return element
}

// ============================================
// Color Utilities
// ============================================

/**
 * 템플릿 색상 팔레트로부터 색상 추론
 *
 * @param elementType - 요소 타입 (text, image, shape 등)
 * @param colorPalette - 템플릿 색상 팔레트
 * @param role - 색상 역할 ('text' | 'background' | 'accent')
 * @returns HEX 색상 코드
 */
export function inferColorFromPalette(
  elementType: string,
  colorPalette: {
    primary: [string, string, string]
    secondary: [string, string, string]
    tertiary: [string, string, string]
  },
  role: 'text' | 'background' | 'accent' = 'text'
): string {
  switch (role) {
    case 'text':
      return colorPalette.primary[0] // 가장 진한 색상
    case 'background':
      return colorPalette.secondary[0] // 가장 밝은 색상
    case 'accent':
      return colorPalette.tertiary[0] // 중간 색상
    default:
      return colorPalette.primary[0]
  }
}

/**
 * 템플릿 색상 팔레트 커스터마이징
 *
 * 사용자가 색상을 변경할 때 모든 블록에 새 색상 적용
 *
 * @param blocks - 기존 블록 배열
 * @param newPalette - 새로운 색상 팔레트
 * @returns 색상이 업데이트된 블록 배열
 */
export function updateBlocksWithCustomPalette(
  blocks: Block[],
  newPalette: {
    primary: [string, string, string]
    secondary: [string, string, string]
    tertiary: [string, string, string]
  }
): Block[] {
  return blocks.map((block) => ({
    ...block,
    elements: block.elements.map((element) => {
      if (!element.style) return element

      const updatedStyle = { ...element.style }

      // 배경색 매핑 (background가 string인 경우만 처리)
      if (typeof updatedStyle.background === 'string') {
        // Primary 색상이면 교체
        if (isColorInPalette(updatedStyle.background, 'primary')) {
          updatedStyle.background = newPalette.primary[0]
        }
        // Secondary 색상이면 교체
        else if (isColorInPalette(updatedStyle.background, 'secondary')) {
          updatedStyle.background = newPalette.secondary[0]
        }
        // Tertiary 색상이면 교체
        else if (isColorInPalette(updatedStyle.background, 'tertiary')) {
          updatedStyle.background = newPalette.tertiary[0]
        }
      }

      // 텍스트 색상 매핑
      if (updatedStyle.text?.color) {
        if (isColorInPalette(updatedStyle.text.color, 'primary')) {
          updatedStyle.text = { ...updatedStyle.text, color: newPalette.primary[0] }
        } else if (isColorInPalette(updatedStyle.text.color, 'secondary')) {
          updatedStyle.text = { ...updatedStyle.text, color: newPalette.secondary[0] }
        } else if (isColorInPalette(updatedStyle.text.color, 'tertiary')) {
          updatedStyle.text = { ...updatedStyle.text, color: newPalette.tertiary[0] }
        }
      }

      return {
        ...element,
        style: updatedStyle,
      }
    }),
  }))
}

/**
 * 색상이 특정 팔레트 그룹에 속하는지 확인
 * (간단한 휴리스틱: 밝기 기준)
 */
function isColorInPalette(
  color: string,
  paletteType: 'primary' | 'secondary' | 'tertiary'
): boolean {
  // 간단한 구현: 흰색 계열은 secondary, 어두운 색은 primary, 중간은 tertiary
  const brightness = getColorBrightness(color)

  if (paletteType === 'primary') {
    return brightness < 0.3 // 어두운 색
  } else if (paletteType === 'secondary') {
    return brightness > 0.7 // 밝은 색
  } else {
    return brightness >= 0.3 && brightness <= 0.7 // 중간 색
  }
}

/**
 * 색상의 밝기 계산 (0~1)
 */
function getColorBrightness(hex: string): number {
  // #RRGGBB 형식에서 RGB 추출
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5

  // 상대 밝기 공식
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255
}

/**
 * HEX 색상을 RGB로 변환
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
