/**
 * Super Editor - Animation Presets
 * 30+ 애니메이션 프리셋 정의
 */

import type { AnimationPreset, EasingType } from '../schema/primitives'

// ============================================
// Animation Preset Definitions
// ============================================

export interface AnimationPresetConfig {
  name: AnimationPreset
  label: string
  description: string
  category: AnimationCategory
  keyframes: Keyframe[]
  defaultDuration: number
  defaultEasing: EasingType
  // 텍스트 애니메이션용
  textAnimation?: boolean
  // 루프 여부
  loop?: boolean
}

export type AnimationCategory =
  | 'entrance'      // 등장 애니메이션
  | 'entrance-advanced'  // 고급 등장
  | 'text'          // 텍스트 특화
  | 'stagger'       // 연속 효과
  | 'loop'          // 루프 효과
  | 'exit'          // 퇴장 애니메이션

export interface Keyframe {
  offset: number    // 0 ~ 1
  [property: string]: string | number | undefined
}

// ============================================
// Entrance Animations (8개)
// ============================================

export const fadeIn: AnimationPresetConfig = {
  name: 'fade-in',
  label: '페이드 인',
  description: '부드럽게 나타나는 효과',
  category: 'entrance',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0 },
    { offset: 1, opacity: 1 },
  ],
}

export const fadeOut: AnimationPresetConfig = {
  name: 'fade-out',
  label: '페이드 아웃',
  description: '부드럽게 사라지는 효과',
  category: 'exit',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 1 },
    { offset: 1, opacity: 0 },
  ],
}

export const slideUp: AnimationPresetConfig = {
  name: 'slide-up',
  label: '슬라이드 업',
  description: '아래에서 위로 나타나는 효과',
  category: 'entrance',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(30px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const slideDown: AnimationPresetConfig = {
  name: 'slide-down',
  label: '슬라이드 다운',
  description: '위에서 아래로 나타나는 효과',
  category: 'entrance',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(-30px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const slideLeft: AnimationPresetConfig = {
  name: 'slide-left',
  label: '슬라이드 레프트',
  description: '오른쪽에서 왼쪽으로 나타나는 효과',
  category: 'entrance',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateX(30px)' },
    { offset: 1, opacity: 1, transform: 'translateX(0)' },
  ],
}

export const slideRight: AnimationPresetConfig = {
  name: 'slide-right',
  label: '슬라이드 라이트',
  description: '왼쪽에서 오른쪽으로 나타나는 효과',
  category: 'entrance',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateX(-30px)' },
    { offset: 1, opacity: 1, transform: 'translateX(0)' },
  ],
}

export const scaleIn: AnimationPresetConfig = {
  name: 'scale-in',
  label: '스케일 인',
  description: '작은 크기에서 커지며 나타나는 효과',
  category: 'entrance',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'scale(0.8)' },
    { offset: 1, opacity: 1, transform: 'scale(1)' },
  ],
}

export const scaleOut: AnimationPresetConfig = {
  name: 'scale-out',
  label: '스케일 아웃',
  description: '커지면서 사라지는 효과',
  category: 'exit',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 1, transform: 'scale(1)' },
    { offset: 1, opacity: 0, transform: 'scale(1.2)' },
  ],
}

// ============================================
// Advanced Entrance Animations (8개)
// ============================================

export const bounceIn: AnimationPresetConfig = {
  name: 'bounce-in',
  label: '바운스 인',
  description: '통통 튀면서 나타나는 효과',
  category: 'entrance-advanced',
  defaultDuration: 700,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'scale(0.3)' },
    { offset: 0.5, opacity: 1, transform: 'scale(1.05)' },
    { offset: 0.7, transform: 'scale(0.95)' },
    { offset: 1, opacity: 1, transform: 'scale(1)' },
  ],
}

export const elasticIn: AnimationPresetConfig = {
  name: 'elastic-in',
  label: '일래스틱 인',
  description: '탄성있게 튕기며 나타나는 효과',
  category: 'entrance-advanced',
  defaultDuration: 800,
  defaultEasing: 'elastic',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'scale(0)' },
    { offset: 0.55, opacity: 1, transform: 'scale(1.1)' },
    { offset: 0.75, transform: 'scale(0.95)' },
    { offset: 1, opacity: 1, transform: 'scale(1)' },
  ],
}

export const flipIn: AnimationPresetConfig = {
  name: 'flip-in',
  label: '플립 인',
  description: '뒤집어지며 나타나는 효과',
  category: 'entrance-advanced',
  defaultDuration: 600,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'perspective(400px) rotateY(90deg)' },
    { offset: 0.4, transform: 'perspective(400px) rotateY(-15deg)' },
    { offset: 0.7, transform: 'perspective(400px) rotateY(10deg)' },
    { offset: 1, opacity: 1, transform: 'perspective(400px) rotateY(0)' },
  ],
}

export const rotateIn: AnimationPresetConfig = {
  name: 'rotate-in',
  label: '로테이트 인',
  description: '회전하며 나타나는 효과',
  category: 'entrance-advanced',
  defaultDuration: 600,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'rotate(-180deg) scale(0.5)' },
    { offset: 1, opacity: 1, transform: 'rotate(0) scale(1)' },
  ],
}

export const blurIn: AnimationPresetConfig = {
  name: 'blur-in',
  label: '블러 인',
  description: '흐릿했다가 선명해지는 효과',
  category: 'entrance-advanced',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, filter: 'blur(20px)' },
    { offset: 1, opacity: 1, filter: 'blur(0)' },
  ],
}

export const zoomIn: AnimationPresetConfig = {
  name: 'zoom-in',
  label: '줌 인',
  description: '멀리서 가까이 다가오는 효과',
  category: 'entrance-advanced',
  defaultDuration: 600,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'scale(0.3)' },
    { offset: 0.5, opacity: 1 },
    { offset: 1, opacity: 1, transform: 'scale(1)' },
  ],
}

export const dropIn: AnimationPresetConfig = {
  name: 'drop-in',
  label: '드롭 인',
  description: '위에서 떨어지며 나타나는 효과',
  category: 'entrance-advanced',
  defaultDuration: 700,
  defaultEasing: 'bounce',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(-100px)' },
    { offset: 0.6, opacity: 1, transform: 'translateY(10px)' },
    { offset: 0.8, transform: 'translateY(-5px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const swingIn: AnimationPresetConfig = {
  name: 'swing-in',
  label: '스윙 인',
  description: '흔들리며 나타나는 효과',
  category: 'entrance-advanced',
  defaultDuration: 700,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'rotateZ(-10deg) translateY(-30px)' },
    { offset: 0.3, transform: 'rotateZ(5deg)' },
    { offset: 0.6, transform: 'rotateZ(-3deg)' },
    { offset: 0.8, transform: 'rotateZ(2deg)' },
    { offset: 1, opacity: 1, transform: 'rotateZ(0) translateY(0)' },
  ],
}

// ============================================
// Text Animations (6개)
// ============================================

export const typewriter: AnimationPresetConfig = {
  name: 'typewriter',
  label: '타이프라이터',
  description: '타이핑 효과',
  category: 'text',
  defaultDuration: 50, // 글자당
  defaultEasing: 'linear',
  textAnimation: true,
  keyframes: [
    { offset: 0, opacity: 0, width: '0' },
    { offset: 1, opacity: 1, width: '100%' },
  ],
}

export const typewriterCursor: AnimationPresetConfig = {
  name: 'typewriter-cursor',
  label: '타이프라이터 + 커서',
  description: '타이핑 효과 + 깜빡이는 커서',
  category: 'text',
  defaultDuration: 50,
  defaultEasing: 'linear',
  textAnimation: true,
  keyframes: [
    { offset: 0, opacity: 0 },
    { offset: 1, opacity: 1 },
  ],
}

export const letterByLetter: AnimationPresetConfig = {
  name: 'letter-by-letter',
  label: '글자별 등장',
  description: '각 글자가 순차적으로 나타남',
  category: 'text',
  defaultDuration: 30,
  defaultEasing: 'ease-out',
  textAnimation: true,
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(10px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const wordByWord: AnimationPresetConfig = {
  name: 'word-by-word',
  label: '단어별 등장',
  description: '각 단어가 순차적으로 나타남',
  category: 'text',
  defaultDuration: 100,
  defaultEasing: 'ease-out',
  textAnimation: true,
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(15px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const lineByLine: AnimationPresetConfig = {
  name: 'line-by-line',
  label: '줄별 등장',
  description: '각 줄이 순차적으로 나타남',
  category: 'text',
  defaultDuration: 300,
  defaultEasing: 'ease-out',
  textAnimation: true,
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(20px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const glitchText: AnimationPresetConfig = {
  name: 'glitch-text',
  label: '글리치 텍스트',
  description: '디지털 글리치 효과',
  category: 'text',
  defaultDuration: 500,
  defaultEasing: 'linear',
  textAnimation: true,
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translate(0)' },
    { offset: 0.1, opacity: 1, transform: 'translate(-2px, 2px)', filter: 'hue-rotate(90deg)' },
    { offset: 0.2, transform: 'translate(2px, -2px)', filter: 'hue-rotate(180deg)' },
    { offset: 0.3, transform: 'translate(-1px, 1px)', filter: 'hue-rotate(270deg)' },
    { offset: 0.4, transform: 'translate(1px, -1px)', filter: 'hue-rotate(360deg)' },
    { offset: 1, opacity: 1, transform: 'translate(0)', filter: 'none' },
  ],
}

// ============================================
// Stagger Animations (4개)
// ============================================

export const stagger: AnimationPresetConfig = {
  name: 'stagger',
  label: '스태거',
  description: '자식 요소가 순차적으로 나타남',
  category: 'stagger',
  defaultDuration: 400,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(20px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const cascade: AnimationPresetConfig = {
  name: 'cascade',
  label: '캐스케이드',
  description: '폭포수처럼 연속 등장',
  category: 'stagger',
  defaultDuration: 500,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(-30px) scale(0.9)' },
    { offset: 0.6, opacity: 1, transform: 'translateY(5px) scale(1.02)' },
    { offset: 1, opacity: 1, transform: 'translateY(0) scale(1)' },
  ],
}

export const wave: AnimationPresetConfig = {
  name: 'wave',
  label: '웨이브',
  description: '파도처럼 물결치는 효과',
  category: 'stagger',
  defaultDuration: 600,
  defaultEasing: 'ease-in-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'translateY(20px)' },
    { offset: 0.3, opacity: 1, transform: 'translateY(-5px)' },
    { offset: 0.5, transform: 'translateY(3px)' },
    { offset: 1, opacity: 1, transform: 'translateY(0)' },
  ],
}

export const ripple: AnimationPresetConfig = {
  name: 'ripple',
  label: '리플',
  description: '중앙에서 퍼져나가는 효과',
  category: 'stagger',
  defaultDuration: 600,
  defaultEasing: 'ease-out',
  keyframes: [
    { offset: 0, opacity: 0, transform: 'scale(0.5)' },
    { offset: 0.6, opacity: 1, transform: 'scale(1.05)' },
    { offset: 1, opacity: 1, transform: 'scale(1)' },
  ],
}

// ============================================
// Loop Animations (4개)
// ============================================

export const pulse: AnimationPresetConfig = {
  name: 'pulse',
  label: '펄스',
  description: '반복적으로 커졌다 작아지는 효과',
  category: 'loop',
  defaultDuration: 1500,
  defaultEasing: 'ease-in-out',
  loop: true,
  keyframes: [
    { offset: 0, transform: 'scale(1)' },
    { offset: 0.5, transform: 'scale(1.05)' },
    { offset: 1, transform: 'scale(1)' },
  ],
}

export const float: AnimationPresetConfig = {
  name: 'float',
  label: '플로트',
  description: '위아래로 떠다니는 효과',
  category: 'loop',
  defaultDuration: 3000,
  defaultEasing: 'ease-in-out',
  loop: true,
  keyframes: [
    { offset: 0, transform: 'translateY(0)' },
    { offset: 0.5, transform: 'translateY(-10px)' },
    { offset: 1, transform: 'translateY(0)' },
  ],
}

export const shake: AnimationPresetConfig = {
  name: 'shake',
  label: '쉐이크',
  description: '흔들리는 효과',
  category: 'loop',
  defaultDuration: 500,
  defaultEasing: 'linear',
  loop: true,
  keyframes: [
    { offset: 0, transform: 'translateX(0)' },
    { offset: 0.1, transform: 'translateX(-5px)' },
    { offset: 0.2, transform: 'translateX(5px)' },
    { offset: 0.3, transform: 'translateX(-5px)' },
    { offset: 0.4, transform: 'translateX(5px)' },
    { offset: 0.5, transform: 'translateX(-5px)' },
    { offset: 0.6, transform: 'translateX(5px)' },
    { offset: 0.7, transform: 'translateX(-5px)' },
    { offset: 0.8, transform: 'translateX(5px)' },
    { offset: 0.9, transform: 'translateX(-5px)' },
    { offset: 1, transform: 'translateX(0)' },
  ],
}

export const glow: AnimationPresetConfig = {
  name: 'glow',
  label: '글로우',
  description: '반복적으로 빛나는 효과',
  category: 'loop',
  defaultDuration: 2000,
  defaultEasing: 'ease-in-out',
  loop: true,
  keyframes: [
    { offset: 0, boxShadow: '0 0 5px rgba(255,255,255,0.2)' },
    { offset: 0.5, boxShadow: '0 0 20px rgba(255,255,255,0.6)' },
    { offset: 1, boxShadow: '0 0 5px rgba(255,255,255,0.2)' },
  ],
}

// ============================================
// Exit Animations (4개)
// ============================================

export const fadeOutUp: AnimationPresetConfig = {
  name: 'fade-out-up',
  label: '페이드 아웃 업',
  description: '위로 올라가며 사라지는 효과',
  category: 'exit',
  defaultDuration: 500,
  defaultEasing: 'ease-in',
  keyframes: [
    { offset: 0, opacity: 1, transform: 'translateY(0)' },
    { offset: 1, opacity: 0, transform: 'translateY(-30px)' },
  ],
}

export const fadeOutDown: AnimationPresetConfig = {
  name: 'fade-out-down',
  label: '페이드 아웃 다운',
  description: '아래로 내려가며 사라지는 효과',
  category: 'exit',
  defaultDuration: 500,
  defaultEasing: 'ease-in',
  keyframes: [
    { offset: 0, opacity: 1, transform: 'translateY(0)' },
    { offset: 1, opacity: 0, transform: 'translateY(30px)' },
  ],
}

export const scaleOutCenter: AnimationPresetConfig = {
  name: 'scale-out-center',
  label: '스케일 아웃 센터',
  description: '중앙에서 작아지며 사라지는 효과',
  category: 'exit',
  defaultDuration: 500,
  defaultEasing: 'ease-in',
  keyframes: [
    { offset: 0, opacity: 1, transform: 'scale(1)' },
    { offset: 1, opacity: 0, transform: 'scale(0)' },
  ],
}

export const blurOut: AnimationPresetConfig = {
  name: 'blur-out',
  label: '블러 아웃',
  description: '흐려지며 사라지는 효과',
  category: 'exit',
  defaultDuration: 500,
  defaultEasing: 'ease-in',
  keyframes: [
    { offset: 0, opacity: 1, filter: 'blur(0)' },
    { offset: 1, opacity: 0, filter: 'blur(20px)' },
  ],
}

// ============================================
// All Presets Export
// ============================================

export const animationPresets: Record<AnimationPreset, AnimationPresetConfig> = {
  // Entrance (8)
  'fade-in': fadeIn,
  'fade-out': fadeOut,
  'slide-up': slideUp,
  'slide-down': slideDown,
  'slide-left': slideLeft,
  'slide-right': slideRight,
  'scale-in': scaleIn,
  'scale-out': scaleOut,
  // Advanced Entrance (8)
  'bounce-in': bounceIn,
  'elastic-in': elasticIn,
  'flip-in': flipIn,
  'rotate-in': rotateIn,
  'blur-in': blurIn,
  'zoom-in': zoomIn,
  'drop-in': dropIn,
  'swing-in': swingIn,
  // Text (6)
  'typewriter': typewriter,
  'typewriter-cursor': typewriterCursor,
  'letter-by-letter': letterByLetter,
  'word-by-word': wordByWord,
  'line-by-line': lineByLine,
  'glitch-text': glitchText,
  // Stagger (4)
  'stagger': stagger,
  'cascade': cascade,
  'wave': wave,
  'ripple': ripple,
  // Loop (4)
  'pulse': pulse,
  'float': float,
  'shake': shake,
  'glow': glow,
  // Exit (4)
  'fade-out-up': fadeOutUp,
  'fade-out-down': fadeOutDown,
  'scale-out-center': scaleOutCenter,
  'blur-out': blurOut,
}

export function getAnimationPreset(name: AnimationPreset): AnimationPresetConfig | undefined {
  return animationPresets[name]
}

export function getPresetsByCategory(category: AnimationCategory): AnimationPresetConfig[] {
  return Object.values(animationPresets).filter(preset => preset.category === category)
}

export function getTextAnimations(): AnimationPresetConfig[] {
  return Object.values(animationPresets).filter(preset => preset.textAnimation)
}

export function getLoopAnimations(): AnimationPresetConfig[] {
  return Object.values(animationPresets).filter(preset => preset.loop)
}
