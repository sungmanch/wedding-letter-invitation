/**
 * Super Editor v2 - Typography Presets
 *
 * 12개 타이포그래피 프리셋 정의
 * Level 1 타이포그래피 설정용
 */

import type { TypographyPresetId, TypeScale } from '../schema/types'

// ============================================
// Typography Preset 정의
// ============================================

export interface FontStack {
  family: string[]
  fallback: string
  googleFonts?: string[] // Google Fonts 로드용 이름
}

export interface TypographyPreset {
  id: TypographyPresetId
  name: string
  nameKo: string
  description: string
  category: 'classic' | 'modern' | 'romantic' | 'natural'
  fontStacks: {
    heading: FontStack
    body: FontStack
    accent?: FontStack
  }
  weights: {
    heading: number
    body: number
    accent?: number
  }
  scale: TypeScale
  // 추천 테마 프리셋
  recommendedThemes?: string[]
}

// ============================================
// Font Stacks
// ============================================

const FONT_STACKS = {
  // 영문 세리프
  playfair: {
    family: ['Playfair Display', 'Georgia', 'serif'],
    fallback: 'serif',
    googleFonts: ['Playfair Display:400,500,600,700'],
  },
  cormorant: {
    family: ['Cormorant Garamond', 'Garamond', 'serif'],
    fallback: 'serif',
    googleFonts: ['Cormorant Garamond:400,500,600,700'],
  },
  cinzel: {
    family: ['Cinzel', 'Times New Roman', 'serif'],
    fallback: 'serif',
    googleFonts: ['Cinzel:400,500,600,700'],
  },

  // 영문 산세리프
  montserrat: {
    family: ['Montserrat', 'Helvetica Neue', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Montserrat:400,500,600,700'],
  },
  inter: {
    family: ['Inter', 'system-ui', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Inter:400,500,600,700'],
  },
  poppins: {
    family: ['Poppins', 'Helvetica Neue', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Poppins:400,500,600,700'],
  },

  // 영문 스크립트
  greatVibes: {
    family: ['Great Vibes', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Great Vibes:400'],
  },
  italianno: {
    family: ['Italianno', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Italianno:400'],
  },
  pinyonScript: {
    family: ['Pinyon Script', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Pinyon Script:400'],
  },
  dancingScript: {
    family: ['Dancing Script', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Dancing Script:400,500,600,700'],
  },
  alexBrush: {
    family: ['Alex Brush', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Alex Brush:400'],
  },
  highSummit: {
    family: ['High Summit', 'cursive'],
    fallback: 'cursive',
    googleFonts: [], // 로컬 폰트
  },

  // 한글 명조
  notoSerifKr: {
    family: ['Noto Serif KR', 'Batang', 'serif'],
    fallback: 'serif',
    googleFonts: ['Noto Serif KR:400,500,600,700'],
  },
  nanumMyeongjo: {
    family: ['Nanum Myeongjo', 'Batang', 'serif'],
    fallback: 'serif',
    googleFonts: ['Nanum Myeongjo:400,700'],
  },
  gowunBatang: {
    family: ['Gowun Batang', 'Batang', 'serif'],
    fallback: 'serif',
    googleFonts: ['Gowun Batang:400,700'],
  },
  hahmlet: {
    family: ['Hahmlet', 'Batang', 'serif'],
    fallback: 'serif',
    googleFonts: ['Hahmlet:400,500,600,700'],
  },

  // 한글 고딕
  pretendard: {
    family: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: [], // CDN 별도 로드
  },
  notoSansKr: {
    family: ['Noto Sans KR', 'Apple SD Gothic Neo', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Noto Sans KR:400,500,600,700'],
  },
  gowunDodum: {
    family: ['Gowun Dodum', 'Apple SD Gothic Neo', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Gowun Dodum:400'],
  },

  // 한글 손글씨
  mapoGoldNaru: {
    family: ['MapoGoldenPier', 'cursive'],
    fallback: 'cursive',
    googleFonts: [], // 로컬 폰트
  },
  nanumPen: {
    family: ['Nanum Pen Script', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Nanum Pen Script:400'],
  },
} as const

// ============================================
// Default Type Scale
// ============================================

const DEFAULT_SCALE: TypeScale = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
}

const ELEGANT_SCALE: TypeScale = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.375rem',
  '2xl': '1.75rem',
  '3xl': '2.25rem',
  '4xl': '3rem',
}

const COMPACT_SCALE: TypeScale = {
  xs: '0.7rem',
  sm: '0.8rem',
  base: '0.9rem',
  lg: '1rem',
  xl: '1.125rem',
  '2xl': '1.375rem',
  '3xl': '1.625rem',
  '4xl': '2rem',
}

// ============================================
// Typography Presets
// ============================================

export const TYPOGRAPHY_PRESETS: Record<TypographyPresetId, TypographyPreset> = {
  // ─── 클래식/우아 (Classic/Elegant) ───
  'classic-elegant': {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    nameKo: '클래식 엘레강스',
    description: 'Playfair Display와 Noto Serif KR의 우아한 조합',
    category: 'classic',
    fontStacks: {
      heading: FONT_STACKS.playfair,
      body: FONT_STACKS.notoSerifKr,
    },
    weights: {
      heading: 600,
      body: 400,
    },
    scale: ELEGANT_SCALE,
    recommendedThemes: ['classic-ivory', 'classic-gold', 'cinematic-dark'],
  },

  'classic-traditional': {
    id: 'classic-traditional',
    name: 'Classic Traditional',
    nameKo: '클래식 전통',
    description: 'Cinzel과 나눔명조의 격조 있는 조합',
    category: 'classic',
    fontStacks: {
      heading: FONT_STACKS.cinzel,
      body: FONT_STACKS.nanumMyeongjo,
    },
    weights: {
      heading: 500,
      body: 400,
    },
    scale: ELEGANT_SCALE,
    recommendedThemes: ['classic-gold', 'classic-ivory'],
  },

  'classic-romantic': {
    id: 'classic-romantic',
    name: 'Classic Romantic',
    nameKo: '클래식 로맨틱',
    description: 'Cormorant와 고운바탕의 로맨틱한 조합',
    category: 'classic',
    fontStacks: {
      heading: FONT_STACKS.cormorant,
      body: FONT_STACKS.gowunBatang,
    },
    weights: {
      heading: 500,
      body: 400,
    },
    scale: ELEGANT_SCALE,
    recommendedThemes: ['romantic-blush', 'classic-ivory'],
  },

  // ─── 모던/미니멀 (Modern/Minimal) ───
  'modern-minimal': {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    nameKo: '모던 미니멀',
    description: 'Montserrat과 Pretendard의 깔끔한 조합',
    category: 'modern',
    fontStacks: {
      heading: FONT_STACKS.montserrat,
      body: FONT_STACKS.pretendard,
    },
    weights: {
      heading: 600,
      body: 400,
    },
    scale: DEFAULT_SCALE,
    recommendedThemes: ['minimal-light', 'minimal-dark', 'modern-mono'],
  },

  'modern-clean': {
    id: 'modern-clean',
    name: 'Modern Clean',
    nameKo: '모던 클린',
    description: 'Inter와 Noto Sans KR의 가독성 좋은 조합',
    category: 'modern',
    fontStacks: {
      heading: FONT_STACKS.inter,
      body: FONT_STACKS.notoSansKr,
    },
    weights: {
      heading: 600,
      body: 400,
    },
    scale: DEFAULT_SCALE,
    recommendedThemes: ['minimal-light', 'modern-contrast', 'gradient-hero'],
  },

  'modern-geometric': {
    id: 'modern-geometric',
    name: 'Modern Geometric',
    nameKo: '모던 지오메트릭',
    description: 'Poppins과 Pretendard의 기하학적 조합',
    category: 'modern',
    fontStacks: {
      heading: FONT_STACKS.poppins,
      body: FONT_STACKS.pretendard,
    },
    weights: {
      heading: 600,
      body: 400,
    },
    scale: DEFAULT_SCALE,
    recommendedThemes: ['modern-mono', 'duotone'],
  },

  // ─── 로맨틱/감성 (Romantic/Emotional) ───
  'romantic-script': {
    id: 'romantic-script',
    name: 'Romantic Script',
    nameKo: '로맨틱 스크립트',
    description: 'Great Vibes와 고운바탕의 감성적 조합',
    category: 'romantic',
    fontStacks: {
      heading: FONT_STACKS.greatVibes,
      body: FONT_STACKS.gowunBatang,
      accent: FONT_STACKS.playfair,
    },
    weights: {
      heading: 400,
      body: 400,
      accent: 500,
    },
    scale: ELEGANT_SCALE,
    recommendedThemes: ['romantic-blush', 'romantic-garden'],
  },

  'romantic-italian': {
    id: 'romantic-italian',
    name: 'Romantic Italian',
    nameKo: '로맨틱 이탈리안',
    description: 'Italianno와 Noto Serif KR의 화려한 조합',
    category: 'romantic',
    fontStacks: {
      heading: FONT_STACKS.italianno,
      body: FONT_STACKS.notoSerifKr,
      accent: FONT_STACKS.cormorant,
    },
    weights: {
      heading: 400,
      body: 400,
      accent: 500,
    },
    scale: ELEGANT_SCALE,
    recommendedThemes: ['cinematic-warm', 'classic-gold'],
  },

  'romantic-soft': {
    id: 'romantic-soft',
    name: 'Romantic Soft',
    nameKo: '로맨틱 소프트',
    description: 'Pinyon Script와 함렛의 부드러운 조합',
    category: 'romantic',
    fontStacks: {
      heading: FONT_STACKS.pinyonScript,
      body: FONT_STACKS.hahmlet,
    },
    weights: {
      heading: 400,
      body: 400,
    },
    scale: ELEGANT_SCALE,
    recommendedThemes: ['romantic-blush', 'classic-ivory'],
  },

  // ─── 내추럴/손글씨 (Natural/Handwritten) ───
  'natural-handwritten': {
    id: 'natural-handwritten',
    name: 'Natural Handwritten',
    nameKo: '내추럴 손글씨',
    description: 'High Summit과 마포금빛나루의 자연스러운 조합',
    category: 'natural',
    fontStacks: {
      heading: FONT_STACKS.highSummit,
      body: FONT_STACKS.mapoGoldNaru,
    },
    weights: {
      heading: 400,
      body: 400,
    },
    scale: COMPACT_SCALE,
    recommendedThemes: ['romantic-garden', 'classic-ivory'],
  },

  'natural-brush': {
    id: 'natural-brush',
    name: 'Natural Brush',
    nameKo: '내추럴 브러쉬',
    description: 'Alex Brush와 나눔펜스크립트의 붓글씨 조합',
    category: 'natural',
    fontStacks: {
      heading: FONT_STACKS.alexBrush,
      body: FONT_STACKS.nanumPen,
    },
    weights: {
      heading: 400,
      body: 400,
    },
    scale: COMPACT_SCALE,
    recommendedThemes: ['romantic-garden', 'romantic-blush'],
  },

  'natural-warm': {
    id: 'natural-warm',
    name: 'Natural Warm',
    nameKo: '내추럴 웜',
    description: 'Dancing Script와 고운돋움의 따뜻한 조합',
    category: 'natural',
    fontStacks: {
      heading: FONT_STACKS.dancingScript,
      body: FONT_STACKS.gowunDodum,
    },
    weights: {
      heading: 500,
      body: 400,
    },
    scale: DEFAULT_SCALE,
    recommendedThemes: ['romantic-garden', 'classic-ivory'],
  },
}

// ============================================
// Helper Functions
// ============================================

/**
 * 프리셋 ID로 타이포그래피 가져오기
 */
export function getTypographyPreset(presetId: TypographyPresetId): TypographyPreset {
  return TYPOGRAPHY_PRESETS[presetId]
}

/**
 * 카테고리별 프리셋 목록
 */
export function getTypographyPresetsByCategory(
  category: TypographyPreset['category']
): TypographyPreset[] {
  return Object.values(TYPOGRAPHY_PRESETS).filter(preset => preset.category === category)
}

/**
 * 모든 프리셋 목록 (카테고리 순서대로)
 */
export function getAllTypographyPresets(): TypographyPreset[] {
  const categoryOrder: TypographyPreset['category'][] = [
    'classic',
    'modern',
    'romantic',
    'natural',
  ]

  return categoryOrder.flatMap(category => getTypographyPresetsByCategory(category))
}

/**
 * 프리셋에서 필요한 Google Fonts URL 생성
 */
export function getGoogleFontsUrl(presetId: TypographyPresetId): string {
  const preset = TYPOGRAPHY_PRESETS[presetId]
  const fonts: string[] = []

  // heading
  if (preset.fontStacks.heading.googleFonts?.length) {
    fonts.push(...preset.fontStacks.heading.googleFonts)
  }

  // body
  if (preset.fontStacks.body.googleFonts?.length) {
    fonts.push(...preset.fontStacks.body.googleFonts)
  }

  // accent
  if (preset.fontStacks.accent?.googleFonts?.length) {
    fonts.push(...preset.fontStacks.accent.googleFonts)
  }

  if (fonts.length === 0) return ''

  const families = fonts.map(f => f.replace(/ /g, '+')).join('&family=')
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`
}

/**
 * CSS font-family 문자열 생성
 */
export function getFontFamilyString(fontStack: FontStack): string {
  return [...fontStack.family, fontStack.fallback]
    .map(f => (f.includes(' ') ? `"${f}"` : f))
    .join(', ')
}
