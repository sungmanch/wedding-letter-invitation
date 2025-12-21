/**
 * Super Editor v2 - Greeting Parents Block Presets
 *
 * 인사말 + 혼주정보 블록 프리셋
 */

import type { BlockPreset, PresetElement } from './types'

// ============================================
// Greeting Parents Preset IDs
// ============================================

export type GreetingParentsPresetId = 'greeting-parents-with-divider'

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
