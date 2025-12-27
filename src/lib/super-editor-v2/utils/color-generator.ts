/**
 * Super Editor v2 - Color Generator
 *
 * 1컬러 시스템: Primary 색상에서 Secondary, Tertiary 자동 계산
 *
 * 매핑:
 * - Primary: 제목, 아이콘, 강조 문구, 활성 탭/버튼 (fg-emphasis, accent-default)
 * - Secondary: 카드 배경, 비활성 탭 배경 (bg-card) - H 유지, S*0.5, L=97%
 * - Tertiary: hover/보조 상태 (accent-hover, accent-secondary) - H 유지, S*0.9, L=85%
 * - 배경: #FFFFFF 통일
 */

// ============================================
// Types
// ============================================

export interface SimpleColorSet {
  primary: string
  secondary: string
  tertiary: string
  fgEmphasis: string
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
