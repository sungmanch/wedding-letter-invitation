/**
 * Intro Style Presets
 * 인트로 타입별 추천 스타일 데이터 (StyleEditor용)
 */

import type { LegacyIntroType } from './legacy/types'
import type { StyleSchema } from '../schema/style'

// ============================================
// Types
// ============================================

export interface IntroStylePreset {
  introType: LegacyIntroType
  label: string
  description: string
  colors: {
    primary: string
    background: string
    titleText: string    // 제목 색상
    bodyText: string     // 본문 색상
    accent: string
  }
  fonts: {
    title: { family: string; weight: number }
    body: { family: string; weight: number }
  }
}

// ============================================
// Preset Data
// ============================================

export const INTRO_STYLE_PRESETS: Record<LegacyIntroType, IntroStylePreset> = {
  cinematic: {
    introType: 'cinematic',
    label: '시네마틱 무드',
    description: '화양연화 스타일의 감성적인 분위기',
    colors: {
      primary: '#C9A962',
      background: '#1A1A1A',
      titleText: '#F5F5DC',
      bodyText: '#A0A0A0',
      accent: '#E6C068',
    },
    fonts: {
      title: { family: 'Nanum Myeongjo', weight: 400 },
      body: { family: 'Noto Sans KR', weight: 300 },
    },
  },

  exhibition: {
    introType: 'exhibition',
    label: '버추얼 갤러리',
    description: '예술적이고 정적인 우아함',
    colors: {
      primary: '#2C2C2C',
      background: '#FAFAFA',
      titleText: '#1A1A1A',
      bodyText: '#4A4A4A',
      accent: '#000000',
    },
    fonts: {
      title: { family: 'Cormorant Garamond', weight: 300 },
      body: { family: 'Pretendard', weight: 300 },
    },
  },

  magazine: {
    introType: 'magazine',
    label: '매거진',
    description: '보그/킨포크 스타일의 에디토리얼',
    colors: {
      primary: '#000000',
      background: '#F8F6F3',
      titleText: '#1A1A1A',
      bodyText: '#6B6B6B',
      accent: '#C4A77D',
    },
    fonts: {
      title: { family: 'Playfair Display', weight: 700 },
      body: { family: 'Pretendard', weight: 300 },
    },
  },

  'gothic-romance': {
    introType: 'gothic-romance',
    label: '고딕 로맨스',
    description: '버건디와 에메랄드의 드라마틱한 분위기',
    colors: {
      primary: '#722F37',
      background: '#0D0D0D',
      titleText: '#F5E6D3',
      bodyText: '#A89F91',
      accent: '#C9A962',
    },
    fonts: {
      title: { family: 'Cormorant Garamond', weight: 500 },
      body: { family: 'Noto Sans KR', weight: 300 },
    },
  },

  'old-money': {
    introType: 'old-money',
    label: '올드 머니',
    description: '레터프레스 질감의 Quiet Luxury',
    colors: {
      primary: '#D4AF37',
      background: '#FFFEF5',
      titleText: '#36454F',
      bodyText: '#6B7280',
      accent: '#D4AF37',
    },
    fonts: {
      title: { family: 'Cormorant Garamond', weight: 500 },
      body: { family: 'Noto Sans KR', weight: 300 },
    },
  },

  monogram: {
    introType: 'monogram',
    label: '모노그램 크레스트',
    description: '네이비와 골드의 로열 프리미엄',
    colors: {
      primary: '#1E3A5F',
      background: '#F5E6D3',
      titleText: '#1E3A5F',
      bodyText: '#4A5568',
      accent: '#C9A962',
    },
    fonts: {
      title: { family: 'Playfair Display', weight: 600 },
      body: { family: 'Noto Sans KR', weight: 300 },
    },
  },

  'jewel-velvet': {
    introType: 'jewel-velvet',
    label: '주얼 벨벳',
    description: '에메랄드와 버건디의 깊은 주얼톤',
    colors: {
      primary: '#2F4538',
      background: '#0D0D0D',
      titleText: '#F5E6D3',
      bodyText: '#A89F91',
      accent: '#C9A962',
    },
    fonts: {
      title: { family: 'Nanum Myeongjo', weight: 400 },
      body: { family: 'Noto Sans KR', weight: 300 },
    },
  },
}

// ============================================
// Utility Functions
// ============================================

/**
 * 인트로 타입에 맞는 추천 스타일 프리셋 가져오기
 */
export function getIntroStylePreset(introType: LegacyIntroType): IntroStylePreset | undefined {
  return INTRO_STYLE_PRESETS[introType]
}

/**
 * IntroStylePreset을 StyleSchema에 적용
 * 기존 StyleSchema를 복사하고 색상/폰트만 교체
 */
export function applyIntroStyleToSchema(
  currentStyle: StyleSchema,
  preset: IntroStylePreset
): StyleSchema {
  const newStyle = JSON.parse(JSON.stringify(currentStyle)) as StyleSchema
  const { colors, fonts } = preset

  // Primary color scale (500 기준, 400/600 자동 계산)
  if (newStyle.theme.colors.primary) {
    newStyle.theme.colors.primary[500] = colors.primary
    newStyle.theme.colors.primary[400] = lightenColor(colors.primary, 0.15)
    newStyle.theme.colors.primary[600] = darkenColor(colors.primary, 0.15)
  }

  // Accent color
  if (newStyle.theme.colors.accent) {
    newStyle.theme.colors.accent[500] = colors.accent
  } else if (newStyle.theme.colors.secondary) {
    newStyle.theme.colors.secondary[500] = colors.accent
  }

  // Background + Surface (Alpha Blend)
  newStyle.theme.colors.background.default = colors.background
  newStyle.theme.colors.background.paper = deriveSurfaceColor(colors.background)

  // Text - 제목/본문 분리
  newStyle.theme.colors.text.primary = colors.titleText
  newStyle.theme.colors.text.secondary = colors.bodyText

  // Fonts
  if (newStyle.theme.typography?.fonts) {
    newStyle.theme.typography.fonts.heading.family = fonts.title.family
    newStyle.theme.typography.fonts.body.family = fonts.body.family
  }

  // Font weights
  if (newStyle.theme.typography?.weights) {
    newStyle.theme.typography.weights.bold = fonts.title.weight
    newStyle.theme.typography.weights.semibold = Math.max(400, fonts.title.weight - 100)
    newStyle.theme.typography.weights.regular = fonts.body.weight
  }

  return newStyle
}

// ============================================
// Color Utilities
// ============================================

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(255 * percent)
  const R = Math.min(255, (num >> 16) + amt)
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
  const B = Math.min(255, (num & 0x0000ff) + amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(255 * percent)
  const R = Math.max(0, (num >> 16) - amt)
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt)
  const B = Math.max(0, (num & 0x0000ff) - amt)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * HEX 색상을 RGB 배열로 변환
 */
function hexToRgb(hex: string): [number, number, number] {
  const num = parseInt(hex.replace('#', ''), 16)
  return [
    (num >> 16) & 0xff,
    (num >> 8) & 0xff,
    num & 0xff,
  ]
}

/**
 * RGB 배열을 HEX로 변환
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`
}

/**
 * 배경색이 어두운지 판단 (Relative Luminance 기준)
 * WCAG 2.0 공식 사용
 */
export function isDark(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex)
  // sRGB to linear RGB
  const toLinear = (c: number) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  // Relative luminance
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  return luminance < 0.5
}

/**
 * Alpha Blend로 Surface 색상 계산
 * - Dark 배경: 흰색 12% 블렌딩
 * - Light 배경: 검정 5% 블렌딩
 */
export function deriveSurfaceColor(background: string): string {
  const [bgR, bgG, bgB] = hexToRgb(background)

  if (isDark(background)) {
    // Dark 배경: 흰색(255,255,255)과 12% 블렌딩
    const alpha = 0.12
    const r = Math.round(bgR + (255 - bgR) * alpha)
    const g = Math.round(bgG + (255 - bgG) * alpha)
    const b = Math.round(bgB + (255 - bgB) * alpha)
    return rgbToHex(r, g, b)
  } else {
    // Light 배경: 검정(0,0,0)과 5% 블렌딩
    const alpha = 0.05
    const r = Math.round(bgR * (1 - alpha))
    const g = Math.round(bgG * (1 - alpha))
    const b = Math.round(bgB * (1 - alpha))
    return rgbToHex(r, g, b)
  }
}
