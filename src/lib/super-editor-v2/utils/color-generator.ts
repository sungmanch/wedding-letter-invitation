/**
 * Super Editor v2 - Color Generator
 *
 * 세 가지 컬러 시스템 지원:
 *
 * 1. 1컬러 시스템 (P-S-T): Primary 1개 → Secondary, Tertiary 자동 계산
 *    - 배경: #FFFFFF 고정
 *    - Primary: 제목, 아이콘, 강조, 버튼
 *
 * 2. 2컬러 시스템 (P-S-T+A): Primary + Accent 2개
 *    - 배경: #FFFFFF 고정
 *    - Primary: 제목, 강조 텍스트
 *    - Accent: 아이콘, 버튼
 *
 * 3. 톤온톤 시스템: Base Hue 1개 → 동일 Hue의 명도 변화
 *    - 배경부터 전경까지 같은 Hue로 조화
 *    - 클래식, 로맨틱 테마에 적합
 */

import type { SemanticTokens } from '../schema/types'

// ============================================
// Types
// ============================================

export type ColorSystemType = 'one-color' | 'two-color' | 'tone-on-tone'

export interface SimpleColorSet {
  primary: string
  secondary: string
  tertiary: string
  fgEmphasis: string
}

export interface TwoColorSet extends SimpleColorSet {
  accent: string
  accentHover: string
}

export interface ToneOnToneColorSet {
  baseHue: number
  bgPage: string
  bgSection: string
  bgSectionAlt: string
  bgCard: string
  fgDefault: string
  fgMuted: string
  fgEmphasis: string
  accentDefault: string
  accentHover: string
  borderDefault: string
  borderEmphasis: string
}

export interface HSL {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

// ============================================
// Color Conversion
// ============================================

/**
 * HEX to HSL 변환
 */
export function hexToHSL(hex: string): HSL {
  // # 제거
  const cleanHex = hex.replace('#', '')

  // RGB로 변환
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * HSL to HEX 변환
 */
export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  const toHex = (v: number) => {
    const hex = Math.round((v + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

// ============================================
// Color Generation
// ============================================

/**
 * Primary 색상에서 전체 컬러셋 생성
 *
 * @param primary - 메인 컬러 (HEX)
 * @returns SimpleColorSet
 */
export function generateColorSet(primary: string): SimpleColorSet {
  const { h, s } = hexToHSL(primary)

  return {
    primary,
    secondary: hslToHex(h, s * 0.5, 97), // 연한 배경
    tertiary: hslToHex(h, s * 0.9, 85), // 중간톤
    fgEmphasis: deriveFgEmphasis(primary), // 제목용 어두운 톤
  }
}

/**
 * Primary에서 제목용 어두운 톤 계산
 * - fg-emphasis에 사용
 * - WCAG 4.5:1 대비 충족을 위해 L=25% 이하로 설정
 */
export function deriveFgEmphasis(primary: string): string {
  const { h, s } = hexToHSL(primary)

  // 채도가 낮은 색상은 검정에 가깝게
  if (s < 20) {
    return '#1A1A1A'
  }

  // 채도 유지하면서 어둡게
  return hslToHex(h, Math.min(s * 0.8, 60), 25)
}

// ============================================
// Preset Color Sets (디자이너 확정)
// ============================================

export const SIMPLE_COLOR_PRESETS: Record<string, SimpleColorSet> = {
  pink: {
    primary: '#EF90CB',
    secondary: '#FCF5F9',
    tertiary: '#F4BDDF',
    fgEmphasis: deriveFgEmphasis('#EF90CB'),
  },
  coral: {
    primary: '#EC8A87',
    secondary: '#FFF4F1',
    tertiary: '#F7BCBA',
    fgEmphasis: deriveFgEmphasis('#EC8A87'),
  },
  blue: {
    primary: '#002BFF',
    secondary: '#F3F5FF',
    tertiary: '#BEC9FC',
    fgEmphasis: deriveFgEmphasis('#002BFF'),
  },
}

// ============================================
// 2컬러 시스템 (P-S-T + Accent)
// ============================================

/**
 * Primary + Accent 2개 색상에서 전체 컬러셋 생성
 *
 * @param primary - 제목/강조용 컬러 (HEX)
 * @param accent - 버튼/아이콘용 컬러 (HEX)
 * @returns TwoColorSet
 */
export function generateTwoColorSet(primary: string, accent: string): TwoColorSet {
  const baseSet = generateColorSet(primary)
  const accentHsl = hexToHSL(accent)

  return {
    ...baseSet,
    accent,
    accentHover: hslToHex(accentHsl.h, accentHsl.s, Math.min(accentHsl.l + 10, 90)),
  }
}

/**
 * 2컬러 시스템을 SemanticTokens로 변환
 */
export function twoColorToTokens(primary: string, accent: string): SemanticTokens {
  const colorSet = generateTwoColorSet(primary, accent)

  return {
    'bg-page': '#FFFFFF',
    'bg-section': '#FFFFFF',
    'bg-section-alt': '#FFFFFF',
    'bg-card': colorSet.secondary,
    'bg-overlay': 'rgba(0, 0, 0, 0.4)',
    'fg-default': '#1A1A1A',
    'fg-muted': '#6B7280',
    'fg-emphasis': colorSet.primary, // P: 제목
    'fg-inverse': '#FFFFFF',
    'fg-on-accent': '#FFFFFF',
    'accent-default': colorSet.accent, // A: 버튼/아이콘
    'accent-hover': colorSet.accentHover,
    'accent-active': colorSet.accent,
    'accent-secondary': colorSet.tertiary,
    'border-default': '#E5E7EB',
    'border-emphasis': colorSet.accent, // A: 강조 테두리
    'border-muted': '#F3F4F6',
  }
}

// ============================================
// 톤온톤 시스템 (Hue 기반)
// ============================================

/**
 * Base Hue에서 톤온톤 컬러셋 생성
 * 동일 Hue의 명도/채도 변화로 조화로운 팔레트 생성
 *
 * @param baseHue - 기준 Hue (0-360)
 * @returns ToneOnToneColorSet
 */
export function generateToneOnToneSet(baseHue: number): ToneOnToneColorSet {
  const h = baseHue

  return {
    baseHue: h,
    bgPage: hslToHex(h, 10, 98),      // 가장 밝은 배경
    bgSection: hslToHex(h, 15, 95),   // 섹션 배경
    bgSectionAlt: hslToHex(h, 20, 92), // 대체 섹션 배경
    bgCard: hslToHex(h, 5, 100),      // 카드 배경 (거의 흰색)
    fgDefault: hslToHex(h, 30, 25),   // 기본 텍스트 (진한)
    fgMuted: hslToHex(h, 20, 50),     // 보조 텍스트
    fgEmphasis: hslToHex(h, 35, 15),  // 강조 텍스트 (가장 진함)
    accentDefault: hslToHex(h, 40, 45), // 강조색
    accentHover: hslToHex(h, 35, 55),  // 호버 상태
    borderDefault: hslToHex(h, 15, 85), // 기본 테두리
    borderEmphasis: hslToHex(h, 25, 75), // 강조 테두리
  }
}

/**
 * Primary 색상에서 Hue를 추출하여 톤온톤 생성
 *
 * @param primary - 기준 컬러 (HEX)
 * @returns ToneOnToneColorSet
 */
export function generateToneOnToneFromColor(primary: string): ToneOnToneColorSet {
  const { h } = hexToHSL(primary)
  return generateToneOnToneSet(h)
}

/**
 * 톤온톤 시스템을 SemanticTokens로 변환
 */
export function toneOnToneToTokens(baseHue: number): SemanticTokens {
  const colorSet = generateToneOnToneSet(baseHue)

  return {
    'bg-page': colorSet.bgPage,
    'bg-section': colorSet.bgSection,
    'bg-section-alt': colorSet.bgSectionAlt,
    'bg-card': colorSet.bgCard,
    'bg-overlay': `hsla(${baseHue}, 50%, 20%, 0.4)`,
    'fg-default': colorSet.fgDefault,
    'fg-muted': colorSet.fgMuted,
    'fg-emphasis': colorSet.fgEmphasis,
    'fg-inverse': colorSet.bgPage,
    'fg-on-accent': '#FFFFFF',
    'accent-default': colorSet.accentDefault,
    'accent-hover': colorSet.accentHover,
    'accent-active': hslToHex(baseHue, 45, 40),
    'accent-secondary': hslToHex(baseHue, 30, 60),
    'border-default': colorSet.borderDefault,
    'border-emphasis': colorSet.borderEmphasis,
    'border-muted': hslToHex(baseHue, 10, 92),
  }
}

// ============================================
// 1컬러 시스템 → SemanticTokens
// ============================================

/**
 * 1컬러 시스템을 SemanticTokens로 변환
 */
export function oneColorToTokens(primary: string): SemanticTokens {
  const colorSet = generateColorSet(primary)

  return {
    'bg-page': '#FFFFFF',
    'bg-section': '#FFFFFF',
    'bg-section-alt': '#FFFFFF',
    'bg-card': colorSet.secondary,
    'bg-overlay': 'rgba(0, 0, 0, 0.4)',
    'fg-default': '#1A1A1A',
    'fg-muted': '#6B7280',
    'fg-emphasis': colorSet.primary,
    'fg-inverse': '#FFFFFF',
    'fg-on-accent': '#FFFFFF',
    'accent-default': colorSet.primary,
    'accent-hover': colorSet.tertiary,
    'accent-active': colorSet.primary,
    'accent-secondary': colorSet.tertiary,
    'border-default': '#E5E7EB',
    'border-emphasis': colorSet.primary,
    'border-muted': '#F3F4F6',
  }
}

// ============================================
// 통합 API (AI 프롬프트용)
// ============================================

export interface ColorSystemInput {
  type: ColorSystemType
  primary: string        // 필수: 메인 색상
  accent?: string        // 2컬러 시스템에서만 사용
}

/**
 * AI가 분석한 색상을 SemanticTokens로 변환
 *
 * @example
 * // 1컬러 시스템
 * generateSemanticTokens({ type: 'one-color', primary: '#EF90CB' })
 *
 * // 2컬러 시스템
 * generateSemanticTokens({ type: 'two-color', primary: '#1A365D', accent: '#C9A962' })
 *
 * // 톤온톤 시스템 (primary에서 Hue 추출)
 * generateSemanticTokens({ type: 'tone-on-tone', primary: '#8B7355' })
 */
export function generateSemanticTokens(input: ColorSystemInput): SemanticTokens {
  switch (input.type) {
    case 'one-color':
      return oneColorToTokens(input.primary)

    case 'two-color':
      if (!input.accent) {
        throw new Error('2컬러 시스템은 accent 색상이 필요합니다')
      }
      return twoColorToTokens(input.primary, input.accent)

    case 'tone-on-tone':
      const { h } = hexToHSL(input.primary)
      return toneOnToneToTokens(h)

    default:
      return oneColorToTokens(input.primary)
  }
}

/**
 * 색상에서 적합한 컬러 시스템 추천
 * - 채도가 높은 단일 색상 → 1컬러
 * - 보색/대비색 2개 → 2컬러
 * - 저채도/자연스러운 색상 → 톤온톤
 */
export function recommendColorSystem(primary: string, accent?: string): ColorSystemType {
  const primaryHsl = hexToHSL(primary)

  // 2개 색상이 제공된 경우
  if (accent) {
    return 'two-color'
  }

  // 저채도 (S < 30%) → 톤온톤 추천
  if (primaryHsl.s < 30) {
    return 'tone-on-tone'
  }

  // 자연스러운 Hue (브라운/베이지 계열: 20-50°) → 톤온톤 추천
  if (primaryHsl.h >= 20 && primaryHsl.h <= 50 && primaryHsl.s < 50) {
    return 'tone-on-tone'
  }

  // 기본: 1컬러
  return 'one-color'
}
