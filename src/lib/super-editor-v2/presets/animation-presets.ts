/**
 * Super Editor v2 - Animation Presets
 *
 * Entrance, Scroll, Hover 애니메이션 프리셋 정의
 */

import type {
  AnimationMood,
  BlockType,
  TweenAction,
  SpringAction,
  SequenceAction,
  TimelineAction,
  StaggerAction,
  ScrollTrigger,
  AnimationProperties,
  EasingFunction,
} from '../schema/types'

// ============================================
// Animation Preset Types
// ============================================

export interface AnimationPreset {
  id: string
  name: string
  nameKo: string
  description: string
  meta: {
    mood: AnimationMood[]
    suitableFor: (BlockType | 'any')[]
    intensity: 'subtle' | 'medium' | 'dramatic'
    keywords: { ko: string[]; en: string[] }
    pairsWith?: string[]
  }
  action: TweenAction | SpringAction | SequenceAction | TimelineAction | StaggerAction
}

export interface ScrollPreset {
  id: string
  name: string
  nameKo: string
  description: string
  trigger: Partial<ScrollTrigger>
  action: TweenAction | TimelineAction
}

// ============================================
// Entrance Presets
// ============================================

export const ENTRANCE_PRESETS: AnimationPreset[] = [
  // ─── Subtle (은은한) ───
  {
    id: 'fade-in',
    name: 'Fade In',
    nameKo: '페이드 인',
    description: '부드럽게 나타나기',
    meta: {
      mood: ['minimal', 'subtle', 'elegant'],
      suitableFor: ['any'],
      intensity: 'subtle',
      keywords: {
        ko: ['부드러운', '은은한', '기본'],
        en: ['soft', 'gentle', 'basic'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 500,
      easing: 'ease-out',
    },
  },
  {
    id: 'fade-slide-up',
    name: 'Fade Slide Up',
    nameKo: '페이드 슬라이드 업',
    description: '아래에서 부드럽게 올라오기',
    meta: {
      mood: ['minimal', 'subtle', 'elegant'],
      suitableFor: ['any'],
      intensity: 'subtle',
      keywords: {
        ko: ['올라오는', '슬라이드'],
        en: ['slide', 'up'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, y: 30 },
      to: { opacity: 1, y: 0 },
      duration: 600,
      easing: 'ease-out',
    },
  },
  {
    id: 'fade-slide-down',
    name: 'Fade Slide Down',
    nameKo: '페이드 슬라이드 다운',
    description: '위에서 부드럽게 내려오기',
    meta: {
      mood: ['minimal', 'subtle'],
      suitableFor: ['any'],
      intensity: 'subtle',
      keywords: {
        ko: ['내려오는', '슬라이드'],
        en: ['slide', 'down'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, y: -30 },
      to: { opacity: 1, y: 0 },
      duration: 600,
      easing: 'ease-out',
    },
  },

  // ─── Medium (중간) ───
  {
    id: 'scale-fade-in',
    name: 'Scale Fade In',
    nameKo: '스케일 페이드 인',
    description: '작아지면서 나타나기',
    meta: {
      mood: ['elegant', 'subtle'],
      suitableFor: ['hero', 'gallery', 'greeting'],
      intensity: 'medium',
      keywords: {
        ko: ['확대', '스케일'],
        en: ['scale', 'zoom'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, scale: 1.1 },
      to: { opacity: 1, scale: 1 },
      duration: 700,
      easing: 'ease-out',
    },
  },
  {
    id: 'blur-fade-in',
    name: 'Blur Fade In',
    nameKo: '블러 페이드 인',
    description: '흐림에서 선명하게',
    meta: {
      mood: ['elegant', 'cinematic'],
      suitableFor: ['hero', 'gallery'],
      intensity: 'medium',
      keywords: {
        ko: ['블러', '흐림', '선명'],
        en: ['blur', 'focus', 'sharp'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, blur: 10 },
      to: { opacity: 1, blur: 0 },
      duration: 800,
      easing: 'ease-out',
    },
  },
  {
    id: 'spring-pop',
    name: 'Spring Pop',
    nameKo: '스프링 팝',
    description: '탄성 있게 튀어나오기',
    meta: {
      mood: ['playful'],
      suitableFor: ['gallery', 'message', 'rsvp'],
      intensity: 'medium',
      keywords: {
        ko: ['탄성', '튀어나오는', '생동감'],
        en: ['spring', 'pop', 'bounce'],
      },
    },
    action: {
      type: 'spring',
      target: 'self',
      to: { opacity: 1, scale: 1 },
      stiffness: 200,
      damping: 15,
      mass: 1,
    },
  },
  {
    id: 'slide-fade-left',
    name: 'Slide Fade Left',
    nameKo: '슬라이드 왼쪽',
    description: '오른쪽에서 슬라이드',
    meta: {
      mood: ['subtle', 'elegant'],
      suitableFor: ['any'],
      intensity: 'medium',
      keywords: {
        ko: ['왼쪽', '슬라이드'],
        en: ['left', 'slide'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, x: 50 },
      to: { opacity: 1, x: 0 },
      duration: 600,
      easing: 'ease-out',
    },
  },
  {
    id: 'slide-fade-right',
    name: 'Slide Fade Right',
    nameKo: '슬라이드 오른쪽',
    description: '왼쪽에서 슬라이드',
    meta: {
      mood: ['subtle', 'elegant'],
      suitableFor: ['any'],
      intensity: 'medium',
      keywords: {
        ko: ['오른쪽', '슬라이드'],
        en: ['right', 'slide'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, x: -50 },
      to: { opacity: 1, x: 0 },
      duration: 600,
      easing: 'ease-out',
    },
  },

  // ─── Dramatic (극적인) ───
  {
    id: 'cinematic-fade',
    name: 'Cinematic Fade',
    nameKo: '시네마틱 페이드',
    description: '영화적인 등장 효과',
    meta: {
      mood: ['cinematic', 'dramatic', 'elegant'],
      suitableFor: ['hero'],
      intensity: 'dramatic',
      keywords: {
        ko: ['영화', '시네마틱', '드라마틱'],
        en: ['cinematic', 'dramatic', 'movie'],
      },
    },
    action: {
      type: 'timeline',
      tracks: [
        {
          at: 0,
          action: {
            type: 'tween',
            target: 'self',
            from: { opacity: 0, scale: 1.15, blur: 15 },
            to: { opacity: 1, scale: 1, blur: 0 },
            duration: 1200,
            easing: 'ease-out',
          },
        },
      ],
      totalDuration: 1200,
    },
  },
  {
    id: 'clip-reveal-up',
    name: 'Clip Reveal Up',
    nameKo: '클립 리빌 업',
    description: '아래에서 드러나기',
    meta: {
      mood: ['dramatic', 'cinematic'],
      suitableFor: ['hero', 'greeting', 'gallery'],
      intensity: 'dramatic',
      keywords: {
        ko: ['드러나는', '리빌', '클립'],
        en: ['reveal', 'clip', 'mask'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { clipPath: 'inset(100% 0 0 0)' },
      to: { clipPath: 'inset(0% 0 0 0)' },
      duration: 800,
      easing: 'ease-out',
    },
  },
  {
    id: 'clip-reveal-center',
    name: 'Clip Reveal Center',
    nameKo: '클립 리빌 센터',
    description: '중앙에서 확장',
    meta: {
      mood: ['dramatic', 'elegant'],
      suitableFor: ['hero', 'gallery'],
      intensity: 'dramatic',
      keywords: {
        ko: ['중앙', '확장', '리빌'],
        en: ['center', 'expand', 'reveal'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { clipPath: 'inset(50% 50% 50% 50%)' },
      to: { clipPath: 'inset(0% 0% 0% 0%)' },
      duration: 900,
      easing: 'ease-out',
    },
  },
  {
    id: 'rotate-fade-in',
    name: 'Rotate Fade In',
    nameKo: '회전 페이드 인',
    description: '회전하며 나타나기',
    meta: {
      mood: ['playful', 'dramatic'],
      suitableFor: ['gallery', 'message'],
      intensity: 'dramatic',
      keywords: {
        ko: ['회전', '돌아가는'],
        en: ['rotate', 'spin'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, rotate: -10, scale: 0.9 },
      to: { opacity: 1, rotate: 0, scale: 1 },
      duration: 700,
      easing: 'ease-out',
    },
  },
  {
    id: 'flip-in',
    name: 'Flip In',
    nameKo: '플립 인',
    description: '뒤집히며 나타나기',
    meta: {
      mood: ['playful', 'dramatic'],
      suitableFor: ['gallery', 'account'],
      intensity: 'dramatic',
      keywords: {
        ko: ['플립', '뒤집기'],
        en: ['flip', '3d'],
      },
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, rotateY: -90 },
      to: { opacity: 1, rotateY: 0 },
      duration: 600,
      easing: 'ease-out',
    },
  },

  // ─── Stagger (연속) ───
  {
    id: 'stagger-fade-up',
    name: 'Stagger Fade Up',
    nameKo: '순차 페이드 업',
    description: '요소들이 순차적으로 올라오기',
    meta: {
      mood: ['elegant', 'subtle'],
      suitableFor: ['gallery', 'parents', 'account', 'message'],
      intensity: 'medium',
      keywords: {
        ko: ['순차', '연속', '차례'],
        en: ['stagger', 'sequence', 'cascade'],
      },
    },
    action: {
      type: 'stagger',
      targets: 'children',
      action: {
        type: 'tween',
        target: '',
        from: { opacity: 0, y: 20 },
        to: { opacity: 1, y: 0 },
        duration: 500,
        easing: 'ease-out',
      },
      stagger: {
        each: 100,
        from: 'first',
      },
    },
  },
  {
    id: 'stagger-scale-in',
    name: 'Stagger Scale In',
    nameKo: '순차 스케일 인',
    description: '요소들이 순차적으로 커지며 나타나기',
    meta: {
      mood: ['playful', 'elegant'],
      suitableFor: ['gallery', 'parents'],
      intensity: 'medium',
      keywords: {
        ko: ['순차', '스케일'],
        en: ['stagger', 'scale'],
      },
    },
    action: {
      type: 'stagger',
      targets: 'children',
      action: {
        type: 'tween',
        target: '',
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
        duration: 400,
        easing: 'ease-out',
      },
      stagger: {
        each: 80,
        from: 'center',
      },
    },
  },
]

// ============================================
// Scroll Animation Presets
// ============================================

export const SCROLL_PRESETS: ScrollPreset[] = [
  // ─── Reveal (등장) ───
  {
    id: 'scroll-fade-in',
    name: 'Scroll Fade In',
    nameKo: '스크롤 페이드 인',
    description: '스크롤 시 페이드 인',
    trigger: {
      type: 'scroll',
      start: 'top 80%',
      once: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 600,
      easing: 'ease-out',
    },
  },
  {
    id: 'scroll-slide-up',
    name: 'Scroll Slide Up',
    nameKo: '스크롤 슬라이드 업',
    description: '스크롤 시 아래에서 올라오기',
    trigger: {
      type: 'scroll',
      start: 'top 80%',
      once: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 0 },
      duration: 700,
      easing: 'ease-out',
    },
  },
  {
    id: 'scroll-blur-reveal',
    name: 'Scroll Blur Reveal',
    nameKo: '스크롤 블러 리빌',
    description: '스크롤 시 흐림에서 선명하게',
    trigger: {
      type: 'scroll',
      start: 'top 75%',
      once: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, blur: 10, y: 30 },
      to: { opacity: 1, blur: 0, y: 0 },
      duration: 800,
      easing: 'ease-out',
    },
  },
  {
    id: 'scroll-scale-in',
    name: 'Scroll Scale In',
    nameKo: '스크롤 스케일 인',
    description: '스크롤 시 확대되며 나타나기',
    trigger: {
      type: 'scroll',
      start: 'top 80%',
      once: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0, scale: 0.9 },
      to: { opacity: 1, scale: 1 },
      duration: 600,
      easing: 'ease-out',
    },
  },

  // ─── Parallax (패럴랙스) ───
  {
    id: 'parallax-slow',
    name: 'Parallax Slow',
    nameKo: '패럴랙스 슬로우',
    description: '배경이 천천히 따라오기',
    trigger: {
      type: 'scroll',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { y: '-10%' },
      to: { y: '10%' },
      duration: 1000,
    },
  },
  {
    id: 'parallax-fast',
    name: 'Parallax Fast',
    nameKo: '패럴랙스 패스트',
    description: '전경이 빠르게 이동',
    trigger: {
      type: 'scroll',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { y: '-30%' },
      to: { y: '30%' },
      duration: 1000,
    },
  },
  {
    id: 'parallax-zoom',
    name: 'Parallax Zoom',
    nameKo: '패럴랙스 줌',
    description: '스크롤에 따라 확대',
    trigger: {
      type: 'scroll',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { scale: 1 },
      to: { scale: 1.2 },
      duration: 1000,
    },
  },

  // ─── Scrub (연동) ───
  {
    id: 'scrub-fade',
    name: 'Scrub Fade',
    nameKo: '스크럽 페이드',
    description: '스크롤에 1:1 연동 페이드',
    trigger: {
      type: 'scroll',
      start: 'top 80%',
      end: 'top 30%',
      scrub: true,
    },
    action: {
      type: 'tween',
      target: 'self',
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 1000,
    },
  },
  {
    id: 'scrub-blur-reveal',
    name: 'Scrub Blur Reveal',
    nameKo: '스크럽 블러 리빌',
    description: '스크롤 연동 블러 해제',
    trigger: {
      type: 'scroll',
      start: 'top 80%',
      end: 'top 30%',
      scrub: true,
    },
    action: {
      type: 'timeline',
      tracks: [
        {
          at: 0,
          action: {
            type: 'tween',
            target: 'self',
            from: { blur: 15, opacity: 0.3, y: 30 },
            to: { blur: 0, opacity: 1, y: 0 },
            duration: 1000,
          },
        },
      ],
      totalDuration: 1000,
    },
  },
  {
    id: 'scrub-clip-reveal',
    name: 'Scrub Clip Reveal',
    nameKo: '스크럽 클립 리빌',
    description: '스크롤 연동 클립 해제',
    trigger: {
      type: 'scroll',
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
    },
    action: {
      type: 'timeline',
      tracks: [
        {
          at: 0,
          action: {
            type: 'tween',
            target: 'self',
            from: { clipPath: 'inset(50% 50% 50% 50%)', blur: 10 },
            to: { clipPath: 'inset(0% 0% 0% 0%)', blur: 0 },
            duration: 1000,
          },
        },
      ],
      totalDuration: 1000,
    },
  },
]

// ============================================
// Hover Presets
// ============================================

export interface HoverPreset {
  id: string
  name: string
  nameKo: string
  action: TweenAction | SpringAction
}

export const HOVER_PRESETS: HoverPreset[] = [
  {
    id: 'hover-lift',
    name: 'Hover Lift',
    nameKo: '호버 리프트',
    action: {
      type: 'tween',
      target: 'self',
      to: { y: -5 },
      duration: 200,
      easing: 'ease-out',
    },
  },
  {
    id: 'hover-scale',
    name: 'Hover Scale',
    nameKo: '호버 스케일',
    action: {
      type: 'tween',
      target: 'self',
      to: { scale: 1.05 },
      duration: 200,
      easing: 'ease-out',
    },
  },
  {
    id: 'hover-glow',
    name: 'Hover Glow',
    nameKo: '호버 글로우',
    action: {
      type: 'tween',
      target: 'self',
      to: { brightness: 1.1 },
      duration: 200,
      easing: 'ease-out',
    },
  },
  {
    id: 'hover-spring',
    name: 'Hover Spring',
    nameKo: '호버 스프링',
    action: {
      type: 'spring',
      target: 'self',
      to: { scale: 1.08 },
      stiffness: 300,
      damping: 15,
    },
  },
]

// ============================================
// Helper Functions
// ============================================

/**
 * Entrance 프리셋 ID로 가져오기
 */
export function getEntrancePreset(presetId: string): AnimationPreset | undefined {
  return ENTRANCE_PRESETS.find(p => p.id === presetId)
}

/**
 * Scroll 프리셋 ID로 가져오기
 */
export function getScrollPreset(presetId: string): ScrollPreset | undefined {
  return SCROLL_PRESETS.find(p => p.id === presetId)
}

/**
 * Hover 프리셋 ID로 가져오기
 */
export function getHoverPreset(presetId: string): HoverPreset | undefined {
  return HOVER_PRESETS.find(p => p.id === presetId)
}

/**
 * 무드에 맞는 Entrance 프리셋 필터
 */
export function getEntrancePresetsByMood(mood: AnimationMood): AnimationPreset[] {
  return ENTRANCE_PRESETS.filter(p => p.meta.mood.includes(mood))
}

/**
 * 블록 타입에 적합한 Entrance 프리셋 필터
 */
export function getEntrancePresetsForBlock(blockType: BlockType): AnimationPreset[] {
  return ENTRANCE_PRESETS.filter(
    p => p.meta.suitableFor.includes('any') || p.meta.suitableFor.includes(blockType)
  )
}

/**
 * 강도별 Entrance 프리셋 필터
 */
export function getEntrancePresetsByIntensity(
  intensity: 'subtle' | 'medium' | 'dramatic'
): AnimationPreset[] {
  return ENTRANCE_PRESETS.filter(p => p.meta.intensity === intensity)
}
