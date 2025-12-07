/**
 * Predefined Template Preset Types
 * 사전 정의된 청첩장 템플릿 프리셋 타입 정의
 */

import type { LayoutCategory } from '../../schema/layout'
import type { StyleMood } from '../../schema/style'
import type { AnimationPreset, TransitionPreset } from '../../schema/primitives'

// ============================================
// Predefined Template Category
// ============================================

export type PredefinedTemplateCategory =
  | 'modern'      // magazine
  | 'cinematic'   // cinematic, gothic-romance, jewel-velvet
  | 'artistic'    // exhibition
  | 'retro'       // (unused)
  | 'playful'     // (unused)
  | 'classic'     // old-money, monogram

// ============================================
// Legacy Intro Types
// ============================================

export type LegacyIntroType =
  | 'cinematic'       // 영화 스타일 (화양연화)
  | 'exhibition'      // 갤러리 스타일
  | 'magazine'        // 매거진 스타일
  | 'gothic-romance'  // 고딕 로맨스 (버건디/에메랄드, 빅토리안)
  | 'old-money'       // 올드 머니 (레터프레스, 왁스씰)
  | 'monogram'        // 모노그램 (쉴드 엠블럼, 포일)
  | 'jewel-velvet'    // 주얼 벨벳 (에메랄드/버건디, 벨벳 텍스처)

// ============================================
// Legacy Interaction Types
// ============================================

export type LegacyInteractionType =
  | 'sticky-scroll'   // 스티키 스크롤
  | 'scroll'          // 기본 스크롤
  | 'horizontal'      // 가로 스크롤
  | 'swipe'           // 스와이프
  | 'track-list'      // 트랙리스트 네비게이션
  | 'chat-flow'       // 채팅 플로우
  | 'game-progress'   // 게임 진행 방식

// ============================================
// Legacy BGM Config
// ============================================

export interface LegacyBgmConfig {
  trackId: string
  volume: number
  fadeIn?: number
  fadeOut?: number
  syncWithScroll?: boolean
  loop?: boolean
}

// ============================================
// Legacy Intro Config
// ============================================

export interface LegacyIntroConfig {
  type: LegacyIntroType
  duration: number
  skipEnabled: boolean
  skipDelay: number
  bgm?: LegacyBgmConfig
  settings?: Record<string, unknown>
}

// ============================================
// Legacy Section Animation
// ============================================

export interface LegacySectionAnimation {
  type: string
  trigger: 'on-scroll' | 'on-enter' | 'on-click'
  duration?: number
  stagger?: number
}

// ============================================
// Legacy Section Style
// ============================================

export interface LegacySectionStyle {
  padding?: 'none' | 'medium' | 'large' | 'xlarge'
  backgroundColor?: string
  textColor?: string
  backgroundEffect?: string
  glassmorphism?: boolean
}

// ============================================
// Legacy Section Definition
// ============================================

export interface LegacySectionDefinition {
  id: string
  type: string
  enabled: boolean
  order: number
  layout: string
  animation: LegacySectionAnimation
  style: LegacySectionStyle
  content?: {
    titleSize?: string
    titleAnimation?: string
    decorationType?: string
    themeSpecific?: Record<string, unknown>
  }
}

// ============================================
// Legacy Effects Config
// ============================================

export interface LegacyEffectsConfig {
  background?: {
    type: 'solid' | 'gradient' | 'pattern' | 'aurora'
    value: string
    animation?: string
  }
  particles?: {
    enabled: boolean
    type: string
    density: string
  }
  cursor?: {
    type: string
    asset?: string
  }
  scrollBehavior: {
    smooth: boolean
    indicator?: boolean
    indicatorStyle?: 'progress' | 'dot' | 'line'
    snapToSection?: boolean
  }
  transition?: {
    type: string
    duration: number
  }
  soundEffects?: {
    enabled: boolean
    onClick?: string
    onScroll?: string
  }
}

// ============================================
// Legacy Color Palette
// ============================================

export interface LegacyColorPalette {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textMuted: string
  accent: string
  overlay?: string
}

// ============================================
// Legacy Font Config
// ============================================

export interface LegacyFontConfig {
  family: string
  weight: number
  letterSpacing?: string
  style?: string
}

// ============================================
// Predefined Template Preset
// ============================================

export interface PredefinedTemplatePreset {
  id: string
  version: string
  source: 'static' | 'ai-generated'

  // 메타 정보
  name: string
  nameKo: string
  category: PredefinedTemplateCategory
  description: string
  descriptionKo: string
  matchKeywords: string[]
  recommendedFor: string
  recommendedForKo: string

  // 프리뷰 정보
  preview: {
    colors: LegacyColorPalette
    mood: string[]
  }

  // 인트로 설정
  intro: LegacyIntroConfig

  // 인터랙션 방식
  interaction: LegacyInteractionType

  // 기본 스타일
  defaultColors: LegacyColorPalette
  defaultFonts: {
    title: LegacyFontConfig
    body: LegacyFontConfig
    accent?: LegacyFontConfig
  }

  // 섹션 정의
  sections: LegacySectionDefinition[]

  // 효과 설정
  effects: LegacyEffectsConfig

  // 커스터마이징 가능 여부
  customizable: {
    colors: boolean
    fonts: boolean
    sectionOrder: boolean
    sectionToggle: boolean
    introSettings: boolean
    effects: boolean
  }
}

// ============================================
// Conversion Helpers
// ============================================

/**
 * Legacy animation type을 Super Editor AnimationPreset으로 변환
 */
export function mapLegacyAnimation(legacyType: string): AnimationPreset {
  const mapping: Record<string, AnimationPreset> = {
    'fade': 'fade-in',
    'slide-up': 'slide-up',
    'slide-down': 'slide-down',
    'slide-left': 'slide-left',
    'slide-right': 'slide-right',
    'scale': 'scale-in',
    'zoom-in': 'zoom-in',
    'bounce': 'bounce-in',
    'typewriter': 'typewriter',
    'rotate': 'rotate-in',
    'flip': 'flip-in',
    'stamp': 'scale-in',
    'pixel-appear': 'scale-in',
    'kinetic-text': 'typewriter',
    'sticky-reveal': 'fade-in',
    'film-grain': 'fade-in',
    'page-turn': 'flip-in',
    'parallax': 'fade-in',
  }
  return mapping[legacyType] || 'fade-in'
}

/**
 * Legacy transition type을 Super Editor TransitionPreset으로 변환
 */
export function mapLegacyTransition(legacyType: string): TransitionPreset {
  const mapping: Record<string, TransitionPreset> = {
    'fade': 'crossfade',
    'slide': 'slide-horizontal',
    'flip': 'flip',
    'zoom': 'zoom',
  }
  return mapping[legacyType] || 'crossfade'
}

/**
 * Predefined category를 Super Editor LayoutCategory로 변환
 */
export function mapPredefinedCategory(category: PredefinedTemplateCategory): LayoutCategory {
  const mapping: Record<PredefinedTemplateCategory, LayoutCategory> = {
    'modern': 'minimal',
    'cinematic': 'story',
    'artistic': 'album',
    'retro': 'album',
    'playful': 'chat',
    'classic': 'letter',
  }
  return mapping[category] || 'scroll'
}

/**
 * Legacy mood를 Super Editor StyleMood로 변환
 */
export function mapLegacyMood(moods: string[]): StyleMood[] {
  const mapping: Record<string, StyleMood> = {
    '세련된': 'elegant',
    '프리미엄': 'luxury',
    '다이나믹': 'modern',
    '감성적인': 'romantic',
    '빈티지': 'vintage',
    '영화같은': 'romantic',
    '예술적인': 'elegant',
    '정적인': 'minimal',
    '우아한': 'elegant',
    '트렌디한': 'modern',
    '감각적인': 'modern',
    '에디토리얼': 'modern',
    '힙한': 'modern',
    '레트로': 'vintage',
    '음악적인': 'playful',
    '친근한': 'cozy',
    '유쾌한': 'playful',
    '인터랙티브': 'playful',
    '몽환적인': 'romantic',
    '미래적인': 'modern',
    '여행': 'natural',
    '모험적인': 'playful',
    '클래식': 'formal',
    '귀여운': 'playful',
    '게임같은': 'playful',
    '시크한': 'elegant',
    '미니멀': 'minimal',
    '아티스틱': 'elegant',
  }

  return moods
    .map(mood => mapping[mood])
    .filter((mood): mood is StyleMood => mood !== undefined)
}
