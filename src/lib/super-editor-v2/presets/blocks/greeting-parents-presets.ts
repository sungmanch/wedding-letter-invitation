/**
 * Super Editor v2 - Greeting Parents Block Presets
 *
 * 인사말 + 혼주정보 블록 프리셋
 */

import type { BlockPreset, PresetElement } from './types'

// ============================================
// Greeting Parents Preset IDs
// ============================================

export type GreetingParentsPresetId =
  | 'greeting-parents-with-divider'
  | 'greeting-parents-natural-sparkle'

// ============================================
// Default Elements
// ============================================

const WITH_DIVIDER_ELEMENTS: PresetElement[] = [
  // 1. 제목 (width: 80 → x: 10으로 중앙 정렬)
  {
    type: 'text',
    x: 10,
    y: 8,
    width: 80,
    height: 6,
    zIndex: 1,
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 24,
        fontWeight: 400,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0.02,
      },
    },
  },
  // 2. 구분선 (width: 60 → x: 20으로 중앙 정렬)
  {
    type: 'divider',
    x: 20,
    y: 18,
    width: 60,
    height: 0.5,
    zIndex: 1,
    props: {
      type: 'divider',
      dividerStyle: 'solid',
    },
    style: {
      background: 'var(--border-muted)',
    },
  },
  // 3. 인사말 본문 (width: 86 → x: 7으로 중앙 정렬)
  {
    type: 'text',
    x: 7,
    y: 28,
    width: 86,
    height: 45,
    zIndex: 1,
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.8,
        letterSpacing: 0.01,
      },
    },
  },
  // 4. 신랑측 혼주 (width: 70 → x: 15으로 중앙 정렬)
  {
    type: 'text',
    x: 15,
    y: 78,
    width: 70,
    height: 8,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name}·{parents.groom.mother.name}의 {parents.groom.birthOrder} {couple.groom.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 5. 신부측 혼주 (width: 70 → x: 15으로 중앙 정렬)
  {
    type: 'text',
    x: 15,
    y: 88,
    width: 70,
    height: 8,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name}·{parents.bride.mother.name}의 {parents.bride.birthOrder} {couple.bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
]

// ============================================
// Natural Sparkle Elements (이미지 분석 기반)
// ============================================

const NATURAL_SPARKLE_ELEMENTS: PresetElement[] = [
  // 1. 제목 "소중한 분들을 초대합니다." (올리브 그린 강조)
  {
    type: 'text',
    x: 10,
    y: 3,
    width: 80,
    height: 5,
    zIndex: 1,
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 20,
        fontWeight: 500,
        color: 'var(--accent-secondary)',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0.02,
      },
    },
  },
  // 2. 인사말 본문 (3단락 구조)
  {
    type: 'text',
    x: 10,
    y: 12,
    width: 80,
    height: 40,
    zIndex: 1,
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 2.0,
        letterSpacing: 0.01,
      },
    },
  },
  // 3. 신랑측 혼주 정보
  {
    type: 'text',
    x: 10,
    y: 58,
    width: 80,
    height: 5,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name} · {parents.groom.mother.name}의 {parents.groom.birthOrder} {couple.groom.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 4. 신부측 혼주 정보
  {
    type: 'text',
    x: 10,
    y: 65,
    width: 80,
    height: 5,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name} · {parents.bride.mother.name}의 {parents.bride.birthOrder} {couple.bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 5. 연락하기 버튼 (contact-modal)
  {
    type: 'button',
    x: 20,
    y: 78,
    width: 60,
    height: 7,
    zIndex: 1,
    props: {
      type: 'button',
      label: '연락하기',
      action: 'contact-modal',
    },
    style: {
      background: 'var(--bg-card)',
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 24,
      },
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
  // 6~11. 별 장식 (sparkle) - 랜덤 위치
  {
    type: 'shape',
    x: 8,
    y: 60,
    width: 4,
    height: 4,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    x: 85,
    y: 65,
    width: 3,
    height: 3,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    x: 12,
    y: 85,
    width: 2.5,
    height: 2.5,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    x: 82,
    y: 80,
    width: 3.5,
    height: 3.5,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    x: 5,
    y: 75,
    width: 2,
    height: 2,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
  {
    type: 'shape',
    x: 90,
    y: 88,
    width: 2.5,
    height: 2.5,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: 'var(--accent-secondary)',
      svgPath: 'M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z',
    },
  },
]

// ============================================
// Greeting Parents Block Presets
// ============================================

export const GREETING_PARENTS_PRESETS: Record<GreetingParentsPresetId, BlockPreset> = {
  'greeting-parents-with-divider': {
    id: 'greeting-parents-with-divider',
    blockType: 'greeting-parents',
    variant: 'with-divider',
    name: 'With Divider',
    nameKo: '클래식 구분선',
    description: '제목과 본문 사이에 구분선이 있는 클래식한 인사말 레이아웃',
    tags: ['classic', 'minimal', 'centered', 'with-divider', 'serif'],
    complexity: 'low',
    bindings: [
      'greeting.title',
      'greeting.content',
      'couple.groom.name',
      'couple.bride.name',
      'parents.groom.birthOrder',
      'parents.groom.father.name',
      'parents.groom.mother.name',
      'parents.bride.birthOrder',
      'parents.bride.father.name',
      'parents.bride.mother.name',
    ],
    defaultHeight: 100,
    defaultElements: WITH_DIVIDER_ELEMENTS,
    recommendedAnimations: ['fade-in', 'slide-up'],
    recommendedThemes: ['classic-ivory', 'minimal-light'],
    aiHints: {
      mood: ['elegant', 'traditional', 'formal'],
      style: ['clean', 'simple', 'timeless'],
      useCase: ['traditional-wedding', 'classic-invitation', 'formal-ceremony'],
    },
  },

  'greeting-parents-natural-sparkle': {
    id: 'greeting-parents-natural-sparkle',
    blockType: 'greeting-parents',
    variant: 'natural-sparkle',
    name: 'Natural Sparkle',
    nameKo: '내추럴 스파클',
    description: '올리브 그린 강조와 별 장식이 있는 자연스러운 인사말 레이아웃. 연락하기 버튼 포함.',
    tags: ['natural', 'elegant', 'sparkle', 'olive', 'contact-button', 'warm'],
    complexity: 'medium',
    bindings: [
      'greeting.title',
      'greeting.content',
      'couple.groom.name',
      'couple.groom.phone',
      'couple.bride.name',
      'couple.bride.phone',
      'parents.groom.birthOrder',
      'parents.groom.father.name',
      'parents.groom.father.phone',
      'parents.groom.mother.name',
      'parents.groom.mother.phone',
      'parents.bride.birthOrder',
      'parents.bride.father.name',
      'parents.bride.father.phone',
      'parents.bride.mother.name',
      'parents.bride.mother.phone',
    ],
    defaultHeight: 100,
    defaultElements: NATURAL_SPARKLE_ELEMENTS,
    specialComponents: ['contact-modal'],
    recommendedAnimations: ['fade-in', 'stagger-fade'],
    recommendedThemes: ['classic-ivory', 'romantic-garden'],
    aiHints: {
      mood: ['natural', 'warm', 'elegant', 'romantic'],
      style: ['organic', 'fresh', 'inviting', 'decorated'],
      useCase: ['garden-wedding', 'outdoor-ceremony', 'spring-wedding', 'natural-theme'],
    },
  },
}

// ============================================
// Helper Functions
// ============================================

export function getGreetingParentsPreset(id: GreetingParentsPresetId): BlockPreset {
  return GREETING_PARENTS_PRESETS[id]
}

export function getGreetingParentsPresetIds(): GreetingParentsPresetId[] {
  return Object.keys(GREETING_PARENTS_PRESETS) as GreetingParentsPresetId[]
}

export function getGreetingParentsPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(GREETING_PARENTS_PRESETS).filter((p) => p.complexity === complexity)
}
