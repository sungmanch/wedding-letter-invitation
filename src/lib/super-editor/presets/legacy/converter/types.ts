/**
 * Legacy Preset Converter Types
 * 레거시 프리셋을 LayoutSchema + StyleSchema로 변환하기 위한 타입 정의
 */

import type { PredefinedTemplatePreset, LegacySectionDefinition } from '../types'
import type { LayoutSchema } from '../../../schema/layout'
import type { StyleSchema } from '../../../schema/style'
import type { PrimitiveNode } from '../../../schema/primitives'
import type { SectionType } from '../../../schema/section-types'

// ============================================
// Converter Options
// ============================================

export interface ConvertOptions {
  /** 프리셋 ID */
  presetId: string
  /** 사용자 데이터가 있는 경우 바인딩에 사용 */
  userData?: Record<string, unknown>
  /** 섹션 오버라이드 (특정 섹션만 변환) */
  includeSections?: string[]
  /** 섹션 제외 */
  excludeSections?: string[]
  /** 스타일 오버라이드 */
  styleOverrides?: Partial<StyleOverrides>
}

export interface StyleOverrides {
  colors?: {
    primary?: string
    secondary?: string
    background?: string
    text?: string
    accent?: string
  }
  fonts?: {
    heading?: string
    body?: string
  }
}

// ============================================
// Converter Result
// ============================================

export interface ConvertResult {
  layout: LayoutSchema
  style: StyleSchema
  /** 변환 메타데이터 */
  meta: {
    presetId: string
    presetName: string
    convertedAt: string
    sectionsCount: number
    warnings: string[]
  }
}

// ============================================
// Section Builder Types
// ============================================

export interface SectionBuilderContext {
  preset: PredefinedTemplatePreset
  section: LegacySectionDefinition
  sectionIndex: number
  options: ConvertOptions
}

export type SectionBuilder = (ctx: SectionBuilderContext) => PrimitiveNode

// ============================================
// Section Type Mapping
// ============================================

/**
 * 레거시 섹션 타입 → Super Editor 섹션 타입 매핑
 */
export const LEGACY_TO_SE_SECTION_TYPE: Record<string, SectionType> = {
  'hero': 'intro',
  'greeting': 'intro',
  'gallery': 'gallery',
  'calendar': 'date',
  'location': 'venue',
  'account': 'accounts',
  'message': 'guestbook',
  'closing': 'guestbook',
  'rsvp': 'guestbook',
  'story': 'gallery',
  'interview': 'gallery',
  'quest': 'guestbook',
}

/**
 * 레거시 레이아웃 → 스타일 매핑
 */
export const LEGACY_LAYOUT_STYLES: Record<string, Record<string, string | number>> = {
  'fullscreen': {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'centered': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  'stack': {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  'split': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  'overlay-text': {
    position: 'relative',
  },
  'chat-bubble': {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  'frame': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  'carousel': {
    overflow: 'hidden',
  },
  'masonry': {
    columns: 2,
    columnGap: '8px',
  },
  'grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
}

/**
 * 레거시 패딩 → CSS 값 매핑
 */
export const LEGACY_PADDING_VALUES: Record<string, string> = {
  'none': '0',
  'small': '16px',
  'medium': '24px',
  'large': '32px',
  'xlarge': '48px',
}
