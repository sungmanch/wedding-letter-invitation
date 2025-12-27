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

export type ProfilePresetId = 'profile-dual-card' | 'profile-split-photo'

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
// Default Elements for Split Photo Preset
// ============================================

const SPLIT_PHOTO_ELEMENTS: PresetElement[] = [
  // Section Title (English) - centered
  {
    type: 'text',
    x: 0,
    y: 4,
    width: 100,
    height: 4,
    zIndex: 1,
    value: 'ABOUT US',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.2,
      },
    },
  },
  // Section Title (Korean) - centered
  {
    type: 'text',
    x: 0,
    y: 8,
    width: 100,
    height: 5,
    zIndex: 1,
    value: '저희를 소개합니다',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 20,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // ═══════════════════════════════════════
  // 신랑 섹션: y 18~48 (photo height 30)
  // 사진 왼쪽, 정보 오른쪽
  // ═══════════════════════════════════════
  // Groom Photo (left)
  {
    type: 'image',
    x: 0,
    y: 18,
    width: 48,
    height: 30,
    zIndex: 1,
    binding: 'couple.groom.photo',
    props: { type: 'image', objectFit: 'cover' },
  },
  // Groom Name
  {
    type: 'text',
    x: 52,
    y: 22,
    width: 45,
    height: 4,
    zIndex: 1,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Groom Birth Date
  {
    type: 'text',
    x: 52,
    y: 28,
    width: 45,
    height: 3,
    zIndex: 1,
    binding: 'couple.groom.birthDate',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // Groom Job
  {
    type: 'text',
    x: 52,
    y: 33,
    width: 45,
    height: 3,
    zIndex: 1,
    binding: 'custom.groomJob',
    value: '직업',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Groom MBTI
  {
    type: 'text',
    x: 52,
    y: 38,
    width: 20,
    height: 3,
    zIndex: 1,
    binding: 'couple.groom.mbti',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--accent-default)',
        textAlign: 'left',
      },
    },
  },
  // Groom Tags
  {
    type: 'text',
    x: 52,
    y: 42,
    width: 45,
    height: 3,
    zIndex: 1,
    binding: 'couple.groom.tags',
    value: '#취미 #관심사',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // ═══════════════════════════════════════
  // 신부 섹션: y 54~84 (간격 6vh, photo height 30)
  // 사진 오른쪽, 정보 왼쪽
  // ═══════════════════════════════════════
  // Bride Photo (right)
  {
    type: 'image',
    x: 52,
    y: 54,
    width: 48,
    height: 30,
    zIndex: 1,
    binding: 'couple.bride.photo',
    props: { type: 'image', objectFit: 'cover' },
  },
  // Bride Name
  {
    type: 'text',
    x: 4,
    y: 58,
    width: 45,
    height: 4,
    zIndex: 1,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Bride Birth Date
  {
    type: 'text',
    x: 4,
    y: 64,
    width: 45,
    height: 3,
    zIndex: 1,
    binding: 'couple.bride.birthDate',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'left',
      },
    },
  },
  // Bride Job
  {
    type: 'text',
    x: 4,
    y: 69,
    width: 45,
    height: 3,
    zIndex: 1,
    binding: 'custom.brideJob',
    value: '직업',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Bride MBTI
  {
    type: 'text',
    x: 4,
    y: 74,
    width: 20,
    height: 3,
    zIndex: 1,
    binding: 'couple.bride.mbti',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--accent-default)',
        textAlign: 'left',
      },
    },
  },
  // Bride Tags
  {
    type: 'text',
    x: 4,
    y: 78,
    width: 45,
    height: 3,
    zIndex: 1,
    binding: 'couple.bride.tags',
    value: '#취미 #관심사',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 11,
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
  'profile-split-photo': {
    id: 'profile-split-photo',
    blockType: 'profile',
    variant: 'split-photo',
    name: 'Split Photo',
    nameKo: '스플릿 포토',
    description: '신랑/신부 사진과 정보를 좌우 교차 배치하는 미니멀한 프로필 레이아웃',
    tags: ['minimal', 'clean', 'split', 'alternating', 'light', 'modern', 'profile', 'about-us'],
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
    ],
    defaultHeight: 90,
    defaultElements: SPLIT_PHOTO_ELEMENTS,
    specialComponents: ['photo-info-pair'],
    recommendedAnimations: ['fade-in', 'slide-in-left', 'slide-in-right', 'stagger-fade-up'],
    recommendedThemes: ['minimal-light', 'classic-ivory', 'modern-mono'],
    aiHints: {
      mood: ['minimal', 'clean', 'friendly'],
      style: ['split-layout', 'alternating', 'photo-info-pair'],
      useCase: ['커플 소개', 'About Us', '프로필 정보', '신랑신부 소개'],
    },
    relatedPresets: ['profile-dual-card'],
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
  return Object.values(PROFILE_PRESETS).filter((p) => p.complexity === complexity)
}
