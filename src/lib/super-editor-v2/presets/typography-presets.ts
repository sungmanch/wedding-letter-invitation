/**
 * Super Editor v2 - Typography Presets
 *
 * 7개 최적화 타이포그래피 프리셋
 * - 핵심 4종: modern-minimal, classic-elegant, natural-warm, classic-modern
 * - 옵션 3종: korean-brush, dual-script, high-contrast
 */

import type { TypographyPresetId, TypeScale } from '../schema/types'

// ============================================
// Typography Preset 정의
// ============================================

export interface FontStack {
  readonly family: readonly string[]
  readonly fallback: string
  readonly googleFonts?: readonly string[] // Google Fonts 로드용 이름
  readonly sizeScale?: number // 폰트 크기 보정 계수 (기본 1.0)
}

export interface TypographyPreset {
  id: TypographyPresetId
  name: string
  nameKo: string
  description: string
  category: 'sans-serif' | 'serif' | 'handwritten' | 'hybrid'
  fontStacks: {
    display: FontStack  // 히어로/인트로용 (예술적) - 참조용, 실제 hero는 하드코딩
    heading: FontStack  // 섹션 제목용
    body: FontStack     // 섹션 본문용
    accent: FontStack   // 섹션 라벨/태그용 (12-14px)
  }
  weights: {
    display: number
    heading: number
    body: number
    accent: number
  }
  scale: TypeScale
  // 추천 사이즈 가이드 (px)
  recommendedSizes: {
    display: { min: number; max: number }
    heading: { min: number; max: number }
    body: { min: number; max: number }
    accent: { min: number; max: number }
  }
  // 추천 테마 프리셋
  recommendedThemes?: string[]
}

// ============================================
// Font Stacks (크기 보정 계수 포함)
// ============================================

const FONT_STACKS = {
  // ─── 영문 세리프 ───
  playfair: {
    family: ['Playfair Display', 'Georgia', 'serif'],
    fallback: 'serif',
    googleFonts: ['Playfair Display:400,500,600,700'],
    sizeScale: 0.95, // 약간 크게 렌더링됨
  },
  cormorant: {
    family: ['Cormorant Garamond', 'Garamond', 'serif'],
    fallback: 'serif',
    googleFonts: ['Cormorant Garamond:400,500,600,700'],
    sizeScale: 1.05,
  },
  cinzel: {
    family: ['Cinzel', 'Times New Roman', 'serif'],
    fallback: 'serif',
    googleFonts: ['Cinzel:400,500,600,700'],
    sizeScale: 0.90, // 대문자만, 크게 렌더링됨
  },

  // ─── 영문 산세리프 ───
  montserrat: {
    family: ['Montserrat', 'Helvetica Neue', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Montserrat:300,400,500,600,700'],
    sizeScale: 1.0,
  },
  inter: {
    family: ['Inter', 'system-ui', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Inter:400,500,600,700'],
    sizeScale: 1.0,
  },

  // ─── 영문 스크립트 ───
  greatVibes: {
    family: ['Great Vibes', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Great Vibes:400'],
    sizeScale: 1.25, // 작게 렌더링됨 → 크게 설정
  },
  dancingScript: {
    family: ['Dancing Script', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Dancing Script:400,500,600,700'],
    sizeScale: 1.0,
  },
  alexBrush: {
    family: ['Alex Brush', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Alex Brush:400'],
    sizeScale: 1.15,
  },

  // ─── 한글 명조 ───
  notoSerifKr: {
    family: ['Noto Serif KR', 'Batang', 'serif'],
    fallback: 'serif',
    googleFonts: ['Noto Serif KR:400,500,600,700'],
    sizeScale: 1.0,
  },
  gowunBatang: {
    family: ['Gowun Batang', 'Batang', 'serif'],
    fallback: 'serif',
    googleFonts: ['Gowun Batang:400,700'],
    sizeScale: 1.0,
  },

  // ─── 한글 고딕 ───
  pretendard: {
    family: ['Pretendard', 'Apple SD Gothic Neo', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: [], // CDN 별도 로드
    sizeScale: 1.0,
  },
  notoSansKr: {
    family: ['Noto Sans KR', 'Apple SD Gothic Neo', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Noto Sans KR:400,500,600,700'],
    sizeScale: 1.0,
  },
  gowunDodum: {
    family: ['Gowun Dodum', 'Apple SD Gothic Neo', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: ['Gowun Dodum:400'],
    sizeScale: 1.0,
  },

  // ─── 한글 손글씨/붓글씨 ───
  nanumSquare: {
    family: ['NanumSquare', 'Apple SD Gothic Neo', 'sans-serif'],
    fallback: 'sans-serif',
    googleFonts: [], // CDN @import
    sizeScale: 0.95, // 약간 크게
  },
  nanumBrushScript: {
    family: ['Nanum Brush Script', 'cursive'],
    fallback: 'cursive',
    googleFonts: ['Nanum Brush Script:400'],
    sizeScale: 1.1,
  },
} as const

// ============================================
// Type Scales
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
// 7개 Typography Presets
// ============================================

export const TYPOGRAPHY_PRESETS: Record<TypographyPresetId, TypographyPreset> = {
  // ─────────────────────────────────────────
  // 1. Sans-serif (모던 미니멀)
  // ─────────────────────────────────────────
  'modern-minimal': {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    nameKo: '모던 미니멀',
    description: 'Montserrat과 Pretendard의 깔끔한 조합. 심플하고 현대적, 가독성 최고.',
    category: 'sans-serif',
    fontStacks: {
      display: FONT_STACKS.montserrat,
      heading: FONT_STACKS.montserrat,
      body: FONT_STACKS.pretendard,
      accent: FONT_STACKS.montserrat,
    },
    weights: {
      display: 300, // Light
      heading: 600, // Semi-bold
      body: 400,    // Regular
      accent: 500,  // Medium
    },
    scale: DEFAULT_SCALE,
    recommendedSizes: {
      display: { min: 48, max: 64 },
      heading: { min: 20, max: 24 },
      body: { min: 14, max: 16 },
      accent: { min: 11, max: 13 },
    },
    recommendedThemes: ['hero-minimal-overlay', 'hero-monochrome-bold'],
  },

  // ─────────────────────────────────────────
  // 2. Serif (클래식 엘레강스)
  // ─────────────────────────────────────────
  'classic-elegant': {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    nameKo: '클래식 엘레강스',
    description: 'Great Vibes와 Playfair Display, Noto Serif KR의 우아한 조합. 격조 있고 전통적.',
    category: 'serif',
    fontStacks: {
      display: FONT_STACKS.greatVibes,
      heading: FONT_STACKS.playfair,
      body: FONT_STACKS.notoSerifKr,
      accent: FONT_STACKS.playfair,
    },
    weights: {
      display: 400,
      heading: 600, // Semi-bold
      body: 400,
      accent: 400,
    },
    scale: ELEGANT_SCALE,
    recommendedSizes: {
      display: { min: 60, max: 80 }, // Great Vibes는 작게 렌더링되므로 크게 설정
      heading: { min: 22, max: 26 },
      body: { min: 14, max: 16 },
      accent: { min: 11, max: 13 },
    },
    recommendedThemes: ['hero-classic-elegant', 'hero-monochrome-bold'],
  },

  // ─────────────────────────────────────────
  // 3. Handwritten (내추럴 웜)
  // ─────────────────────────────────────────
  'natural-warm': {
    id: 'natural-warm',
    name: 'Natural Warm',
    nameKo: '내추럴 웜',
    description: 'Dancing Script와 Nanum Square, Gowun Dodum의 따뜻한 조합. 손글씨 감성 + 가독성.',
    category: 'handwritten',
    fontStacks: {
      display: FONT_STACKS.dancingScript,
      heading: FONT_STACKS.nanumSquare,
      body: FONT_STACKS.gowunDodum,
      accent: FONT_STACKS.nanumSquare,
    },
    weights: {
      display: 500, // Medium
      heading: 700, // Bold
      body: 400,
      accent: 400,
    },
    scale: DEFAULT_SCALE,
    recommendedSizes: {
      display: { min: 48, max: 56 },
      heading: { min: 18, max: 22 },
      body: { min: 14, max: 16 },
      accent: { min: 11, max: 13 },
    },
    recommendedThemes: ['hero-casual-playful', 'hero-classic-elegant'],
  },

  // ─────────────────────────────────────────
  // 4. Hybrid - Serif 제목 + Sans 본문 (클래식 모던)
  // ─────────────────────────────────────────
  'classic-modern': {
    id: 'classic-modern',
    name: 'Classic Modern',
    nameKo: '클래식 모던',
    description: 'Cormorant Garamond와 Pretendard의 하이브리드. 제목의 우아함 + 본문의 현대적 가독성.',
    category: 'hybrid',
    fontStacks: {
      display: FONT_STACKS.cormorant,
      heading: FONT_STACKS.cormorant,
      body: FONT_STACKS.pretendard,
      accent: FONT_STACKS.pretendard,
    },
    weights: {
      display: 500, // Medium
      heading: 600, // Semi-bold
      body: 400,
      accent: 500,
    },
    scale: ELEGANT_SCALE,
    recommendedSizes: {
      display: { min: 52, max: 64 },
      heading: { min: 22, max: 26 },
      body: { min: 14, max: 16 },
      accent: { min: 11, max: 13 },
    },
    recommendedThemes: ['hero-classic-elegant', 'hero-minimal-overlay', 'hero-casual-playful'],
  },

  // ─────────────────────────────────────────
  // 5. 한글 중심 (한글 손글씨 강조)
  // ─────────────────────────────────────────
  'korean-brush': {
    id: 'korean-brush',
    name: 'Korean Brush',
    nameKo: '한글 붓글씨',
    description: '나눔 붓글씨와 Noto Serif KR, Gowun Batang의 한국적 조합. 전통 감성 극대화.',
    category: 'handwritten',
    fontStacks: {
      display: FONT_STACKS.nanumBrushScript,
      heading: FONT_STACKS.notoSerifKr,
      body: FONT_STACKS.gowunBatang,
      accent: FONT_STACKS.notoSerifKr,
    },
    weights: {
      display: 400,
      heading: 600,
      body: 400,
      accent: 400,
    },
    scale: ELEGANT_SCALE,
    recommendedSizes: {
      display: { min: 44, max: 56 }, // 붓글씨는 크기 주의
      heading: { min: 20, max: 24 },
      body: { min: 14, max: 16 },
      accent: { min: 11, max: 13 },
    },
    recommendedThemes: ['hero-classic-elegant', 'hero-casual-playful'],
  },

  // ─────────────────────────────────────────
  // 6. 듀얼 스크립트 (영문+한글 손글씨)
  // ─────────────────────────────────────────
  'dual-script': {
    id: 'dual-script',
    name: 'Dual Script',
    nameKo: '듀얼 스크립트',
    description: 'Alex Brush와 나눔 붓글씨, Noto Sans KR의 이중언어 조합. 영문+한글 손글씨.',
    category: 'handwritten',
    fontStacks: {
      display: FONT_STACKS.alexBrush,
      heading: FONT_STACKS.nanumBrushScript,
      body: FONT_STACKS.notoSansKr,
      accent: FONT_STACKS.notoSansKr,
    },
    weights: {
      display: 400,
      heading: 400,
      body: 400,
      accent: 500,
    },
    scale: COMPACT_SCALE,
    recommendedSizes: {
      display: { min: 52, max: 68 }, // Alex Brush 작게 렌더링
      heading: { min: 22, max: 28 }, // 붓글씨 크게
      body: { min: 14, max: 16 },
      accent: { min: 11, max: 13 },
    },
    recommendedThemes: ['hero-dark-romantic', 'hero-classic-elegant'],
  },

  // ─────────────────────────────────────────
  // 7. 하이 콘트라스트 (강한 대비)
  // ─────────────────────────────────────────
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast',
    nameKo: '하이 콘트라스트',
    description: 'Cinzel과 Inter의 강한 대비. 시각적 계층이 명확, 포멀한 분위기.',
    category: 'hybrid',
    fontStacks: {
      display: FONT_STACKS.cinzel,
      heading: FONT_STACKS.inter,
      body: FONT_STACKS.inter,
      accent: FONT_STACKS.inter,
    },
    weights: {
      display: 700, // Bold
      heading: 600, // Semi-bold
      body: 400,
      accent: 500,
    },
    scale: DEFAULT_SCALE,
    recommendedSizes: {
      display: { min: 40, max: 52 }, // Cinzel 대문자만, 크게 렌더링
      heading: { min: 18, max: 22 },
      body: { min: 14, max: 16 },
      accent: { min: 11, max: 13 },
    },
    recommendedThemes: ['hero-monochrome-bold'],
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
    'sans-serif',
    'serif',
    'handwritten',
    'hybrid',
  ]

  return categoryOrder.flatMap(category => getTypographyPresetsByCategory(category))
}

/**
 * 프리셋에서 필요한 Google Fonts URL 생성
 */
export function getGoogleFontsUrl(presetId: TypographyPresetId): string {
  const preset = TYPOGRAPHY_PRESETS[presetId]
  const fonts: string[] = []

  // display (히어로용)
  if (preset.fontStacks.display.googleFonts?.length) {
    fonts.push(...preset.fontStacks.display.googleFonts)
  }

  // heading (섹션 제목용)
  if (preset.fontStacks.heading.googleFonts?.length) {
    fonts.push(...preset.fontStacks.heading.googleFonts)
  }

  // body (섹션 본문용)
  if (preset.fontStacks.body.googleFonts?.length) {
    fonts.push(...preset.fontStacks.body.googleFonts)
  }

  // accent (섹션 라벨용)
  if (preset.fontStacks.accent.googleFonts?.length) {
    fonts.push(...preset.fontStacks.accent.googleFonts)
  }

  if (fonts.length === 0) return ''

  // 중복 제거
  const uniqueFonts = [...new Set(fonts)]
  const families = uniqueFonts.map(f => f.replace(/ /g, '+')).join('&family=')
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

/**
 * 폰트 크기 보정 적용
 * @param baseSizePx 기본 폰트 크기 (px)
 * @param fontStack 폰트 스택
 * @returns 보정된 폰트 크기 (px)
 */
export function getAdjustedFontSize(baseSizePx: number, fontStack: FontStack): number {
  const scale = fontStack.sizeScale ?? 1.0
  return Math.round(baseSizePx * scale)
}

/**
 * 폰트 크기 보정 계수 조회표
 */
export const FONT_SIZE_SCALE_TABLE: Record<string, number> = {
  // 영문 스크립트 (작게 렌더링)
  'Great Vibes': 1.25,
  'Italianno': 1.30,
  'Pinyon Script': 1.25,
  'Alex Brush': 1.15,
  'The Nautigal': 1.20,
  // 영문 표준
  'Dancing Script': 1.0,
  'Montserrat': 1.0,
  'Inter': 1.0,
  // 영문 크게 렌더링
  'Playfair Display': 0.95,
  'Poppins': 0.95,
  'Cinzel': 0.90,
  'Cormorant Garamond': 1.05,
  // 한글 표준
  'Pretendard': 1.0,
  'Noto Serif KR': 1.0,
  'Noto Sans KR': 1.0,
  'Gowun Batang': 1.0,
  'Gowun Dodum': 1.0,
  // 한글 약간 크게
  'NanumSquare': 0.95,
  'Nanum Brush Script': 1.1,
}
