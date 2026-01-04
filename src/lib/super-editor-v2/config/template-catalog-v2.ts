/**
 * Template Catalog v2 - Preset-Based Structure
 *
 * 템플릿을 프리셋 참조 방식으로 정의합니다.
 * - 인라인 블록 구조 대신 프리셋 ID 참조
 * - Single Source of Truth: presets/blocks/ 디렉토리
 */

import type { BlockType, VariablePath } from '../schema/types'
import type { TemplateMetadata } from '../schema/template-metadata'
import {
  TEMPLATE_DEFAULT_PRESETS,
  TEMPLATE_IDS,
  type TemplateId,
  type TemplatePresetConfig,
} from './template-preset-map'

// ============================================
// Types
// ============================================

/**
 * 템플릿 v2 인터페이스 (경량화)
 * - 기존 메타데이터 + 프리셋 참조
 */
export interface TemplateV2 extends TemplateMetadata {
  /**
   * 기본 프리셋 조합
   * - 각 섹션에 사용할 프리셋 ID 참조
   */
  defaultPresets: TemplatePresetConfig

  /**
   * 편집 가능한 필드 매핑
   * - UI에서 자동으로 편집 폼 생성
   */
  editableFields: EditableFieldMap
}

/**
 * 편집 가능한 필드 매핑
 */
export interface EditableFieldMap {
  [key: string]: {
    blockType: BlockType
    binding: VariablePath
    label: string
    description?: string
  }
}

// ============================================
// Legacy Types (backward compatibility)
// ============================================

/**
 * @deprecated Use preset-based approach instead
 * 블록 템플릿 (하위 호환성을 위해 유지)
 */
export interface BlockTemplate {
  type: BlockType
  enabled: boolean
  height: number // vh
  layout?: any
  elements: ElementTemplate[]
}

/**
 * @deprecated Use preset-based approach instead
 * 요소 템플릿 (하위 호환성을 위해 유지)
 */
export interface ElementTemplate {
  type: 'text' | 'image' | 'shape' | 'button' | 'icon' | 'divider' | 'map' | 'calendar'
  x: number // vw
  y: number // vh
  width: number // vw
  height: number // vh
  zIndex: number
  binding?: VariablePath
  value?: string | number
  props: any
  style?: any
}

// ============================================
// Editable Fields (공통)
// ============================================

const COMMON_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: {
    blockType: 'hero',
    binding: 'photos.main',
    label: '메인 사진',
    description: '청첩장 메인 화면에 표시될 사진',
  },
  groomName: {
    blockType: 'hero',
    binding: 'couple.groom.name',
    label: '신랑 이름',
  },
  brideName: {
    blockType: 'hero',
    binding: 'couple.bride.name',
    label: '신부 이름',
  },
  weddingDate: {
    blockType: 'hero',
    binding: 'wedding.date',
    label: '예식 날짜',
  },
  greetingTitle: {
    blockType: 'greeting-parents',
    binding: 'greeting.title',
    label: '인사말 제목',
  },
  greetingContent: {
    blockType: 'greeting-parents',
    binding: 'greeting.content',
    label: '인사말 내용',
    description: '청첩장 인사말 본문',
  },
  venueName: {
    blockType: 'location',
    binding: 'venue.name',
    label: '예식장 이름',
  },
  venueHall: {
    blockType: 'location',
    binding: 'venue.hall',
    label: '예식장 홀 이름',
  },
  venueAddress: {
    blockType: 'location',
    binding: 'venue.address',
    label: '예식장 주소',
  },
  gallery: {
    blockType: 'gallery',
    binding: 'photos.gallery',
    label: '갤러리 사진',
    description: '청첩장에 표시될 웨딩 사진들',
  },
}

// ============================================
// Template Metadata Import
// ============================================

import { getTemplateById } from './template-catalog'

// ============================================
// Template Definitions (Preset-Based)
// ============================================

/**
 * Unique1: 클래식 엘레강스
 */
export const UNIQUE1_TEMPLATE_V2: TemplateV2 = {
  ...getTemplateById('unique1')!,
  defaultPresets: TEMPLATE_DEFAULT_PRESETS.unique1,
  editableFields: COMMON_EDITABLE_FIELDS,
}

/**
 * Unique2: 캐주얼 플레이풀
 */
export const UNIQUE2_TEMPLATE_V2: TemplateV2 = {
  ...getTemplateById('unique2')!,
  defaultPresets: TEMPLATE_DEFAULT_PRESETS.unique2,
  editableFields: COMMON_EDITABLE_FIELDS,
}

/**
 * Unique3: 미니멀 오버레이
 */
export const UNIQUE3_TEMPLATE_V2: TemplateV2 = {
  ...getTemplateById('unique3')!,
  defaultPresets: TEMPLATE_DEFAULT_PRESETS.unique3,
  editableFields: COMMON_EDITABLE_FIELDS,
}

/**
 * Unique4: 다크 로맨틱
 */
export const UNIQUE4_TEMPLATE_V2: TemplateV2 = {
  ...getTemplateById('unique4')!,
  defaultPresets: TEMPLATE_DEFAULT_PRESETS.unique4,
  editableFields: COMMON_EDITABLE_FIELDS,
}

/**
 * Unique5: 브라이트 캐주얼
 */
export const UNIQUE5_TEMPLATE_V2: TemplateV2 = {
  ...getTemplateById('unique5')!,
  defaultPresets: TEMPLATE_DEFAULT_PRESETS.unique5,
  editableFields: COMMON_EDITABLE_FIELDS,
}

/**
 * Unique6: 모노크롬 볼드
 */
export const UNIQUE6_TEMPLATE_V2: TemplateV2 = {
  ...getTemplateById('unique6')!,
  defaultPresets: TEMPLATE_DEFAULT_PRESETS.unique6,
  editableFields: COMMON_EDITABLE_FIELDS,
}

// ============================================
// Catalog
// ============================================

/**
 * 템플릿 v2 카탈로그 (전체 6개)
 */
export const TEMPLATE_CATALOG_V2: TemplateV2[] = [
  UNIQUE1_TEMPLATE_V2,
  UNIQUE2_TEMPLATE_V2,
  UNIQUE3_TEMPLATE_V2,
  UNIQUE4_TEMPLATE_V2,
  UNIQUE5_TEMPLATE_V2,
  UNIQUE6_TEMPLATE_V2,
]

// ============================================
// Helper Functions
// ============================================

/**
 * 템플릿 ID로 v2 템플릿 조회
 */
export function getTemplateV2ById(id: string): TemplateV2 | undefined {
  return TEMPLATE_CATALOG_V2.find((t) => t.id === id)
}

/**
 * v2로 변환 가능한 템플릿인지 확인
 */
export function isTemplateV2Available(id: string): boolean {
  return TEMPLATE_CATALOG_V2.some((t) => t.id === id)
}

/**
 * 템플릿의 기본 프리셋 조합 조회
 */
export function getTemplateDefaultPresets(id: string): TemplatePresetConfig | undefined {
  const template = getTemplateV2ById(id)
  return template?.defaultPresets
}

// ============================================
// Re-exports for convenience
// ============================================

export { TEMPLATE_IDS, type TemplateId } from './template-preset-map'
