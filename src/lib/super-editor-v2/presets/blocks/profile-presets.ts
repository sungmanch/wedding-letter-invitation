/**
 * Super Editor v2 - Profile Block Presets
 *
 * profile skeleton → profile block 마이그레이션
 * About Us / 커플 소개 섹션
 */

import type { BlockPreset, PresetElement } from './types'

// ============================================
// Profile Preset IDs
// ============================================

export type ProfilePresetId = 'profile-dual-card'

// ============================================
// Default Elements for Dual Card Preset
// ============================================

const DUAL_CARD_ELEMENTS: PresetElement[] = [
  // Section Title (English) - centered: x = (100-60)/2 = 20
  {
    type: 'text',
    x: 20,
    y: 3,
    width: 60,
    height: 4,
    zIndex: 1,
    value: 'About Us',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'Cormorant Garamond',
        fontSize: 18,
        fontWeight: 400,
        color: 'var(--accent-default)',
        textAlign: 'center',
        letterSpacing: 0.1,
      },
    },
  },
  // Section Title (Korean) - centered: x = (100-80)/2 = 10
  {
    type: 'text',
    x: 10,
    y: 8,
    width: 80,
    height: 5,
    zIndex: 1,
    value: '저희를 소개합니다',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'Noto Serif KR',
        fontSize: 22,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // Groom Photo - left side: x = 5
  {
    type: 'image',
    x: 5,
    y: 16,
    width: 42,
    height: 30,
    zIndex: 1,
    binding: 'couple.groom.photo',
    props: { type: 'image', objectFit: 'cover' },
  },
  // Groom Label - right side: x = 52
  {
    type: 'text',
    x: 52,
    y: 17,
    width: 15,
    height: 3,
    zIndex: 1,
    value: '신랑',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
      },
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 12,
      },
    },
  },
  // Groom Name
  {
    type: 'text',
    x: 52,
    y: 22,
    width: 43,
    height: 4,
    zIndex: 1,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'Noto Serif KR',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Groom Parents
  {
    type: 'text',
    x: 52,
    y: 28,
    width: 43,
    height: 3,
    zIndex: 1,
    value: '아버지 · 어머니의 아들',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // Groom Birth Date
  {
    type: 'text',
    x: 52,
    y: 33,
    width: 43,
    height: 3,
    zIndex: 1,
    binding: 'couple.groom.birthDate',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // Groom MBTI
  {
    type: 'text',
    x: 52,
    y: 37,
    width: 20,
    height: 3,
    zIndex: 1,
    binding: 'couple.groom.mbti',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Groom Tags
  {
    type: 'text',
    x: 52,
    y: 42,
    width: 43,
    height: 3,
    zIndex: 1,
    value: '#캠핑 #러닝',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // Bride Photo - right side: x = 53
  {
    type: 'image',
    x: 53,
    y: 54,
    width: 42,
    height: 30,
    zIndex: 1,
    binding: 'couple.bride.photo',
    props: { type: 'image', objectFit: 'cover' },
  },
  // Bride Label - left side: x = 5
  {
    type: 'text',
    x: 5,
    y: 55,
    width: 15,
    height: 3,
    zIndex: 1,
    value: '신부',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
      },
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 12,
      },
    },
  },
  // Bride Name
  {
    type: 'text',
    x: 5,
    y: 60,
    width: 43,
    height: 4,
    zIndex: 1,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'Noto Serif KR',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Bride Parents
  {
    type: 'text',
    x: 5,
    y: 66,
    width: 43,
    height: 3,
    zIndex: 1,
    value: '아버지 · 어머니의 딸',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // Bride Birth Date
  {
    type: 'text',
    x: 5,
    y: 71,
    width: 43,
    height: 3,
    zIndex: 1,
    binding: 'couple.bride.birthDate',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // Bride MBTI
  {
    type: 'text',
    x: 5,
    y: 76,
    width: 20,
    height: 3,
    zIndex: 1,
    binding: 'couple.bride.mbti',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Bride Tags
  {
    type: 'text',
    x: 5,
    y: 81,
    width: 43,
    height: 3,
    zIndex: 1,
    value: '#스노우보드 #캠핑',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
]

// ============================================
// Profile Block Presets
// ============================================

export const PROFILE_PRESETS: Record<ProfilePresetId, BlockPreset> = {
  'profile-dual-card': {
    id: 'profile-dual-card',
    blockType: 'profile',
    variant: 'dual-card',
    name: 'Dual Card',
    nameKo: '듀얼 카드',
    description: '신랑/신부 프로필을 교차 배치 카드로 보여주는 카드 형식',
    tags: ['elegant', 'minimal', 'modern', 'card', 'dual', 'alternate', 'light'],
    complexity: 'medium',
    bindings: [
      'couple.groom.name',
      'couple.groom.photo',
      'couple.groom.birthDate',
      'couple.groom.mbti',
      'couple.groom.tags',
      'couple.bride.name',
      'couple.bride.photo',
      'couple.bride.birthDate',
      'couple.bride.mbti',
      'couple.bride.tags',
      'parents.groom.father.name',
      'parents.groom.mother.name',
      'parents.bride.father.name',
      'parents.bride.mother.name',
    ],
    defaultHeight: 100,
    defaultElements: DUAL_CARD_ELEMENTS,
    specialComponents: ['card', 'badge', 'tag-list'],
    recommendedAnimations: ['fade-in', 'stagger-fade-up', 'slide-in-left', 'slide-in-right'],
    recommendedThemes: ['classic-ivory', 'minimal-light', 'romantic-blush'],
    aiHints: {
      mood: ['elegant', 'warm', 'friendly'],
      style: ['card-layout', 'alternating', 'clean'],
      useCase: ['커플 소개', 'About Us', '프로필 정보'],
    },
  },
}

// ============================================
// Helper Functions
// ============================================

export function getProfilePreset(id: ProfilePresetId): BlockPreset {
  return PROFILE_PRESETS[id]
}

export function getProfilePresetIds(): ProfilePresetId[] {
  return Object.keys(PROFILE_PRESETS) as ProfilePresetId[]
}

export function getProfilePresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(PROFILE_PRESETS).filter(p => p.complexity === complexity)
}
