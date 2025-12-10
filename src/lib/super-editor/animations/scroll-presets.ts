/**
 * Super Editor - Scroll Motion Presets
 * 스크롤 기반 애니메이션 프리셋 정의 (15개)
 */

// ============================================
// Scroll Motion Preset Types
// ============================================

export type ScrollMotionPreset =
  // 기본 등장 (6개)
  | 'scroll-fade-in'
  | 'scroll-slide-up'
  | 'scroll-slide-down'
  | 'scroll-slide-left'
  | 'scroll-slide-right'
  | 'scroll-scale-in'
  // PPT 스타일 (6개)
  | 'scroll-blur-in'
  | 'scroll-rotate-in'
  | 'scroll-flip-in'
  | 'clip-reveal-up'
  | 'clip-reveal-down'
  | 'clip-reveal-circle'
  // Parallax (3개)
  | 'parallax-slow'
  | 'parallax-fast'
  | 'parallax-zoom'
  // Corner Expand (4개 - Save The Date용)
  | 'corner-expand-tl'
  | 'corner-expand-tr'
  | 'corner-expand-bl'
  | 'corner-expand-br'
  // Blur Reveal (콘텐츠 블러 해제)
  | 'blur-reveal'

export type ScrollMotionCategory = 'reveal' | 'clip' | 'parallax' | 'corner'

// ============================================
// Scroll Keyframe Type
// ============================================

export interface ScrollKeyframe {
  offset: number // 0-1
  opacity?: number
  transform?: string
  filter?: string
  clipPath?: string
}

// ============================================
// Scroll Preset Config
// ============================================

export interface ScrollPresetConfig {
  name: ScrollMotionPreset
  label: string
  description: string
  category: ScrollMotionCategory
  keyframes: ScrollKeyframe[]
  defaultScrub?: boolean // true면 스크롤에 따라 연속 애니메이션
}

// ============================================
// Scroll Motion Presets
// ============================================

export const scrollPresets: Record<ScrollMotionPreset, ScrollPresetConfig> = {
  // ========== 기본 등장 (6개) ==========
  'scroll-fade-in': {
    name: 'scroll-fade-in',
    label: '페이드 인',
    description: '스크롤 시 서서히 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0 },
      { offset: 1, opacity: 1 },
    ],
  },
  'scroll-slide-up': {
    name: 'scroll-slide-up',
    label: '슬라이드 업',
    description: '아래에서 위로 올라오며 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, transform: 'translateY(60px)' },
      { offset: 1, opacity: 1, transform: 'translateY(0px)' },
    ],
  },
  'scroll-slide-down': {
    name: 'scroll-slide-down',
    label: '슬라이드 다운',
    description: '위에서 아래로 내려오며 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, transform: 'translateY(-60px)' },
      { offset: 1, opacity: 1, transform: 'translateY(0px)' },
    ],
  },
  'scroll-slide-left': {
    name: 'scroll-slide-left',
    label: '슬라이드 왼쪽',
    description: '오른쪽에서 왼쪽으로 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, transform: 'translateX(60px)' },
      { offset: 1, opacity: 1, transform: 'translateX(0px)' },
    ],
  },
  'scroll-slide-right': {
    name: 'scroll-slide-right',
    label: '슬라이드 오른쪽',
    description: '왼쪽에서 오른쪽으로 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, transform: 'translateX(-60px)' },
      { offset: 1, opacity: 1, transform: 'translateX(0px)' },
    ],
  },
  'scroll-scale-in': {
    name: 'scroll-scale-in',
    label: '스케일 인',
    description: '작은 상태에서 커지며 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, transform: 'scale(0.8)' },
      { offset: 1, opacity: 1, transform: 'scale(1)' },
    ],
  },

  // ========== PPT 스타일 (6개) ==========
  'scroll-blur-in': {
    name: 'scroll-blur-in',
    label: '블러 인',
    description: '흐릿한 상태에서 선명해짐',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, filter: 'blur(20px)' },
      { offset: 1, opacity: 1, filter: 'blur(0px)' },
    ],
  },
  'scroll-rotate-in': {
    name: 'scroll-rotate-in',
    label: '회전 인',
    description: '회전하며 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, transform: 'rotate(-15deg) scale(0.9)' },
      { offset: 1, opacity: 1, transform: 'rotate(0deg) scale(1)' },
    ],
  },
  'scroll-flip-in': {
    name: 'scroll-flip-in',
    label: '플립 인',
    description: '뒤집어지며 나타남',
    category: 'reveal',
    keyframes: [
      { offset: 0, opacity: 0, transform: 'perspective(1000px) rotateX(90deg)' },
      { offset: 1, opacity: 1, transform: 'perspective(1000px) rotateX(0deg)' },
    ],
  },
  'clip-reveal-up': {
    name: 'clip-reveal-up',
    label: '클립 업',
    description: '아래에서 위로 잘려서 나타남',
    category: 'clip',
    keyframes: [
      { offset: 0, clipPath: 'inset(100% 0 0 0)' },
      { offset: 1, clipPath: 'inset(0 0 0 0)' },
    ],
  },
  'clip-reveal-down': {
    name: 'clip-reveal-down',
    label: '클립 다운',
    description: '위에서 아래로 잘려서 나타남',
    category: 'clip',
    keyframes: [
      { offset: 0, clipPath: 'inset(0 0 100% 0)' },
      { offset: 1, clipPath: 'inset(0 0 0 0)' },
    ],
  },
  'clip-reveal-circle': {
    name: 'clip-reveal-circle',
    label: '원형 리빌',
    description: '중앙에서 원형으로 확장되며 나타남',
    category: 'clip',
    keyframes: [
      { offset: 0, clipPath: 'circle(0% at 50% 50%)' },
      { offset: 1, clipPath: 'circle(100% at 50% 50%)' },
    ],
  },

  // ========== Parallax (3개) ==========
  'parallax-slow': {
    name: 'parallax-slow',
    label: '패럴랙스 (느림)',
    description: '배경이 느리게 움직이는 효과',
    category: 'parallax',
    keyframes: [
      { offset: 0, transform: 'translateY(-20%)' },
      { offset: 1, transform: 'translateY(20%)' },
    ],
    defaultScrub: true,
  },
  'parallax-fast': {
    name: 'parallax-fast',
    label: '패럴랙스 (빠름)',
    description: '배경이 빠르게 움직이는 효과',
    category: 'parallax',
    keyframes: [
      { offset: 0, transform: 'translateY(-50%)' },
      { offset: 1, transform: 'translateY(50%)' },
    ],
    defaultScrub: true,
  },
  'parallax-zoom': {
    name: 'parallax-zoom',
    label: '패럴랙스 줌',
    description: '스크롤에 따라 줌 아웃되는 효과',
    category: 'parallax',
    keyframes: [
      { offset: 0, transform: 'scale(1.3)' },
      { offset: 1, transform: 'scale(1)' },
    ],
    defaultScrub: true,
  },

  // ========== Corner Expand (4개 - Save The Date용) ==========
  'corner-expand-tl': {
    name: 'corner-expand-tl',
    label: '코너 펼침 (좌상)',
    description: '좌상단 코너가 중앙에서 모서리로 펼쳐짐',
    category: 'corner',
    keyframes: [
      { offset: 0, transform: 'translate(80px, 80px)', opacity: 0 },
      { offset: 1, transform: 'translate(0px, 0px)', opacity: 1 },
    ],
    defaultScrub: true,
  },
  'corner-expand-tr': {
    name: 'corner-expand-tr',
    label: '코너 펼침 (우상)',
    description: '우상단 코너가 중앙에서 모서리로 펼쳐짐',
    category: 'corner',
    keyframes: [
      { offset: 0, transform: 'translate(-80px, 80px)', opacity: 0 },
      { offset: 1, transform: 'translate(0px, 0px)', opacity: 1 },
    ],
    defaultScrub: true,
  },
  'corner-expand-bl': {
    name: 'corner-expand-bl',
    label: '코너 펼침 (좌하)',
    description: '좌하단 코너가 중앙에서 모서리로 펼쳐짐',
    category: 'corner',
    keyframes: [
      { offset: 0, transform: 'translate(80px, -80px)', opacity: 0 },
      { offset: 1, transform: 'translate(0px, 0px)', opacity: 1 },
    ],
    defaultScrub: true,
  },
  'corner-expand-br': {
    name: 'corner-expand-br',
    label: '코너 펼침 (우하)',
    description: '우하단 코너가 중앙에서 모서리로 펼쳐짐',
    category: 'corner',
    keyframes: [
      { offset: 0, transform: 'translate(-80px, -80px)', opacity: 0 },
      { offset: 1, transform: 'translate(0px, 0px)', opacity: 1 },
    ],
    defaultScrub: true,
  },

  // ========== Blur Reveal (콘텐츠 블러 해제) ==========
  'blur-reveal': {
    name: 'blur-reveal',
    label: '블러 리빌',
    description: '흐릿한 상태에서 선명해지며 나타남 (Save The Date용)',
    category: 'reveal',
    keyframes: [
      { offset: 0, filter: 'blur(12px)', opacity: 0.3 },
      { offset: 1, filter: 'blur(0px)', opacity: 1 },
    ],
    defaultScrub: true,
  },
}

// ============================================
// Helper Functions
// ============================================

export function getScrollPreset(name: ScrollMotionPreset): ScrollPresetConfig | undefined {
  return scrollPresets[name]
}

export function getScrollPresetsByCategory(category: ScrollMotionCategory): ScrollPresetConfig[] {
  return Object.values(scrollPresets).filter((preset) => preset.category === category)
}

export function getAllScrollPresets(): ScrollPresetConfig[] {
  return Object.values(scrollPresets)
}
