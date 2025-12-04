/**
 * Super Editor - Transition Presets
 * 15+ 화면 전환 효과 정의
 */

import type { TransitionPreset, EasingType } from '../schema/primitives'

// ============================================
// Transition Preset Definitions
// ============================================

export interface TransitionPresetConfig {
  name: TransitionPreset
  label: string
  description: string
  category: TransitionCategory
  // 두 화면 간의 전환 정의
  enterKeyframes: TransitionKeyframe[]
  exitKeyframes: TransitionKeyframe[]
  defaultDuration: number
  defaultEasing: EasingType
  // 양방향 지원
  reversible?: boolean
  // 스크롤 기반 전환 지원
  scrollBased?: boolean
}

export type TransitionCategory =
  | 'basic'         // 기본 전환
  | 'advanced'      // 고급 전환

export interface TransitionKeyframe {
  offset: number    // 0 ~ 1
  [property: string]: string | number | undefined
}

// ============================================
// Basic Transitions (5개)
// ============================================

export const crossfade: TransitionPresetConfig = {
  name: 'crossfade',
  label: '크로스페이드',
  description: '부드러운 페이드 전환',
  category: 'basic',
  defaultDuration: 500,
  defaultEasing: 'ease-in-out',
  reversible: true,
  enterKeyframes: [
    { offset: 0, opacity: 0 },
    { offset: 1, opacity: 1 },
  ],
  exitKeyframes: [
    { offset: 0, opacity: 1 },
    { offset: 1, opacity: 0 },
  ],
}

export const slideHorizontal: TransitionPresetConfig = {
  name: 'slide-horizontal',
  label: '가로 슬라이드',
  description: '좌우로 슬라이드하는 전환',
  category: 'basic',
  defaultDuration: 400,
  defaultEasing: 'ease-out',
  reversible: true,
  scrollBased: true,
  enterKeyframes: [
    { offset: 0, transform: 'translateX(100%)', opacity: 0 },
    { offset: 1, transform: 'translateX(0)', opacity: 1 },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'translateX(0)', opacity: 1 },
    { offset: 1, transform: 'translateX(-100%)', opacity: 0 },
  ],
}

export const slideVertical: TransitionPresetConfig = {
  name: 'slide-vertical',
  label: '세로 슬라이드',
  description: '위아래로 슬라이드하는 전환',
  category: 'basic',
  defaultDuration: 400,
  defaultEasing: 'ease-out',
  reversible: true,
  scrollBased: true,
  enterKeyframes: [
    { offset: 0, transform: 'translateY(100%)', opacity: 0 },
    { offset: 1, transform: 'translateY(0)', opacity: 1 },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'translateY(0)', opacity: 1 },
    { offset: 1, transform: 'translateY(-100%)', opacity: 0 },
  ],
}

export const zoom: TransitionPresetConfig = {
  name: 'zoom',
  label: '줌',
  description: '확대/축소 전환',
  category: 'basic',
  defaultDuration: 500,
  defaultEasing: 'ease-in-out',
  reversible: true,
  enterKeyframes: [
    { offset: 0, transform: 'scale(0.8)', opacity: 0 },
    { offset: 1, transform: 'scale(1)', opacity: 1 },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'scale(1)', opacity: 1 },
    { offset: 1, transform: 'scale(1.2)', opacity: 0 },
  ],
}

export const flip: TransitionPresetConfig = {
  name: 'flip',
  label: '플립',
  description: '카드 뒤집기 전환',
  category: 'basic',
  defaultDuration: 600,
  defaultEasing: 'ease-in-out',
  reversible: true,
  enterKeyframes: [
    { offset: 0, transform: 'perspective(1000px) rotateY(-90deg)', opacity: 0 },
    { offset: 1, transform: 'perspective(1000px) rotateY(0)', opacity: 1 },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'perspective(1000px) rotateY(0)', opacity: 1 },
    { offset: 1, transform: 'perspective(1000px) rotateY(90deg)', opacity: 0 },
  ],
}

// ============================================
// Advanced Transitions (10개)
// ============================================

export const morph: TransitionPresetConfig = {
  name: 'morph',
  label: '모프',
  description: '부드럽게 변형되는 전환',
  category: 'advanced',
  defaultDuration: 700,
  defaultEasing: 'ease-in-out',
  reversible: true,
  enterKeyframes: [
    { offset: 0, transform: 'scale(0.95) translateY(10px)', opacity: 0, filter: 'blur(10px)' },
    { offset: 0.5, transform: 'scale(1.02)', opacity: 0.8, filter: 'blur(2px)' },
    { offset: 1, transform: 'scale(1) translateY(0)', opacity: 1, filter: 'blur(0)' },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'scale(1)', opacity: 1, filter: 'blur(0)' },
    { offset: 0.5, transform: 'scale(0.98)', opacity: 0.5, filter: 'blur(5px)' },
    { offset: 1, transform: 'scale(0.9) translateY(-10px)', opacity: 0, filter: 'blur(10px)' },
  ],
}

export const revealUp: TransitionPresetConfig = {
  name: 'reveal-up',
  label: '리빌 업',
  description: '아래에서 위로 드러나는 전환',
  category: 'advanced',
  defaultDuration: 600,
  defaultEasing: 'ease-out',
  scrollBased: true,
  enterKeyframes: [
    { offset: 0, transform: 'translateY(100%)', clipPath: 'inset(100% 0 0 0)' },
    { offset: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'translateY(0)', opacity: 1 },
    { offset: 1, transform: 'translateY(-30%)', opacity: 0 },
  ],
}

export const revealDown: TransitionPresetConfig = {
  name: 'reveal-down',
  label: '리빌 다운',
  description: '위에서 아래로 드러나는 전환',
  category: 'advanced',
  defaultDuration: 600,
  defaultEasing: 'ease-out',
  scrollBased: true,
  enterKeyframes: [
    { offset: 0, transform: 'translateY(-100%)', clipPath: 'inset(0 0 100% 0)' },
    { offset: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'translateY(0)', opacity: 1 },
    { offset: 1, transform: 'translateY(30%)', opacity: 0 },
  ],
}

export const curtain: TransitionPresetConfig = {
  name: 'curtain',
  label: '커튼',
  description: '커튼이 열리듯 좌우로 펼쳐지는 전환',
  category: 'advanced',
  defaultDuration: 700,
  defaultEasing: 'ease-in-out',
  enterKeyframes: [
    { offset: 0, clipPath: 'inset(0 50% 0 50%)' },
    { offset: 1, clipPath: 'inset(0 0 0 0)' },
  ],
  exitKeyframes: [
    { offset: 0, clipPath: 'inset(0 0 0 0)', opacity: 1 },
    { offset: 1, clipPath: 'inset(0 50% 0 50%)', opacity: 0 },
  ],
}

export const iris: TransitionPresetConfig = {
  name: 'iris',
  label: '아이리스',
  description: '원형으로 열리는 전환',
  category: 'advanced',
  defaultDuration: 700,
  defaultEasing: 'ease-in-out',
  reversible: true,
  enterKeyframes: [
    { offset: 0, clipPath: 'circle(0% at 50% 50%)' },
    { offset: 1, clipPath: 'circle(100% at 50% 50%)' },
  ],
  exitKeyframes: [
    { offset: 0, clipPath: 'circle(100% at 50% 50%)', opacity: 1 },
    { offset: 1, clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
  ],
}

export const wipeLeft: TransitionPresetConfig = {
  name: 'wipe-left',
  label: '와이프 레프트',
  description: '왼쪽으로 닦아내는 전환',
  category: 'advanced',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  enterKeyframes: [
    { offset: 0, clipPath: 'inset(0 100% 0 0)' },
    { offset: 1, clipPath: 'inset(0 0 0 0)' },
  ],
  exitKeyframes: [
    { offset: 0, clipPath: 'inset(0 0 0 0)' },
    { offset: 1, clipPath: 'inset(0 0 0 100%)' },
  ],
}

export const wipeRight: TransitionPresetConfig = {
  name: 'wipe-right',
  label: '와이프 라이트',
  description: '오른쪽으로 닦아내는 전환',
  category: 'advanced',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  enterKeyframes: [
    { offset: 0, clipPath: 'inset(0 0 0 100%)' },
    { offset: 1, clipPath: 'inset(0 0 0 0)' },
  ],
  exitKeyframes: [
    { offset: 0, clipPath: 'inset(0 0 0 0)' },
    { offset: 1, clipPath: 'inset(0 100% 0 0)' },
  ],
}

export const dissolve: TransitionPresetConfig = {
  name: 'dissolve',
  label: '디졸브',
  description: '픽셀이 흩어지듯 사라지는 전환',
  category: 'advanced',
  defaultDuration: 600,
  defaultEasing: 'ease-in-out',
  reversible: true,
  enterKeyframes: [
    { offset: 0, opacity: 0, filter: 'blur(10px) saturate(0)' },
    { offset: 0.5, opacity: 0.5, filter: 'blur(5px) saturate(0.5)' },
    { offset: 1, opacity: 1, filter: 'blur(0) saturate(1)' },
  ],
  exitKeyframes: [
    { offset: 0, opacity: 1, filter: 'blur(0) saturate(1)' },
    { offset: 0.5, opacity: 0.5, filter: 'blur(5px) saturate(0.5)' },
    { offset: 1, opacity: 0, filter: 'blur(10px) saturate(0)' },
  ],
}

export const blurTransition: TransitionPresetConfig = {
  name: 'blur-transition',
  label: '블러 트랜지션',
  description: '흐려졌다가 선명해지는 전환',
  category: 'advanced',
  defaultDuration: 600,
  defaultEasing: 'ease-in-out',
  reversible: true,
  enterKeyframes: [
    { offset: 0, opacity: 0, filter: 'blur(20px)' },
    { offset: 0.5, opacity: 0.8, filter: 'blur(10px)' },
    { offset: 1, opacity: 1, filter: 'blur(0)' },
  ],
  exitKeyframes: [
    { offset: 0, opacity: 1, filter: 'blur(0)' },
    { offset: 0.5, opacity: 0.8, filter: 'blur(10px)' },
    { offset: 1, opacity: 0, filter: 'blur(20px)' },
  ],
}

export const parallaxScroll: TransitionPresetConfig = {
  name: 'parallax-scroll',
  label: '패럴랙스 스크롤',
  description: '깊이감 있는 스크롤 전환',
  category: 'advanced',
  defaultDuration: 800,
  defaultEasing: 'ease-out',
  scrollBased: true,
  reversible: true,
  enterKeyframes: [
    { offset: 0, transform: 'translateY(50%) scale(0.9)', opacity: 0, filter: 'blur(5px)' },
    { offset: 0.5, transform: 'translateY(20%) scale(0.95)', opacity: 0.5, filter: 'blur(2px)' },
    { offset: 1, transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0)' },
  ],
  exitKeyframes: [
    { offset: 0, transform: 'translateY(0) scale(1)', opacity: 1 },
    { offset: 0.5, transform: 'translateY(-20%) scale(0.95)', opacity: 0.5 },
    { offset: 1, transform: 'translateY(-50%) scale(0.9)', opacity: 0 },
  ],
}

// ============================================
// All Transitions Export
// ============================================

export const transitionPresets: Record<TransitionPreset, TransitionPresetConfig> = {
  // Basic (5)
  'crossfade': crossfade,
  'slide-horizontal': slideHorizontal,
  'slide-vertical': slideVertical,
  'zoom': zoom,
  'flip': flip,
  // Advanced (10)
  'morph': morph,
  'reveal-up': revealUp,
  'reveal-down': revealDown,
  'curtain': curtain,
  'iris': iris,
  'wipe-left': wipeLeft,
  'wipe-right': wipeRight,
  'dissolve': dissolve,
  'blur-transition': blurTransition,
  'parallax-scroll': parallaxScroll,
}

export function getTransitionPreset(name: TransitionPreset): TransitionPresetConfig | undefined {
  return transitionPresets[name]
}

export function getTransitionsByCategory(category: TransitionCategory): TransitionPresetConfig[] {
  return Object.values(transitionPresets).filter(preset => preset.category === category)
}

export function getScrollBasedTransitions(): TransitionPresetConfig[] {
  return Object.values(transitionPresets).filter(preset => preset.scrollBased)
}

export function getReversibleTransitions(): TransitionPresetConfig[] {
  return Object.values(transitionPresets).filter(preset => preset.reversible)
}

// ============================================
// Easing Functions
// ============================================

export const easingFunctions: Record<EasingType, string> = {
  'linear': 'linear',
  'ease': 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  'cubic-bezier(string)': 'cubic-bezier(0.4, 0, 0.2, 1)', // fallback
}

export function getEasingFunction(easing: EasingType): string {
  if (easing.startsWith('cubic-bezier')) {
    return easing
  }
  return easingFunctions[easing] || 'ease'
}
