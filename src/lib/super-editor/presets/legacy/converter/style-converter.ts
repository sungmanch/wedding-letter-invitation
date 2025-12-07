/**
 * Style Schema Converter
 * 레거시 프리셋의 스타일을 StyleSchema로 변환
 */

import type { StyleSchema, ColorScale, FontFamily } from '../../../schema/style'
import type { LegacyTemplatePreset, LegacyColorPalette, LegacyFontConfig } from '../types'
import type { StyleOverrides } from './types'

// ============================================
// Color Helpers
// ============================================

/**
 * 단일 색상을 ColorScale로 확장
 */
function createColorScale(baseColor: string): ColorScale {
  // 간단한 구현: 기본 색상만 설정
  // 실제 구현에서는 색상 조작 라이브러리 사용 가능
  return {
    50: lighten(baseColor, 0.9),
    100: lighten(baseColor, 0.8),
    200: lighten(baseColor, 0.6),
    300: lighten(baseColor, 0.4),
    400: lighten(baseColor, 0.2),
    500: baseColor,
    600: darken(baseColor, 0.1),
    700: darken(baseColor, 0.2),
    800: darken(baseColor, 0.3),
    900: darken(baseColor, 0.4),
  }
}

function lighten(hex: string, amount: number): string {
  // rgba 처리
  if (hex.startsWith('rgba')) return hex

  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount))
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount))
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount))

  return rgbToHex(r, g, b)
}

function darken(hex: string, amount: number): string {
  if (hex.startsWith('rgba')) return hex

  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = Math.max(0, Math.round(rgb.r * (1 - amount)))
  const g = Math.max(0, Math.round(rgb.g * (1 - amount)))
  const b = Math.max(0, Math.round(rgb.b * (1 - amount)))

  return rgbToHex(r, g, b)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// ============================================
// Font Helpers
// ============================================

function createFontFamily(config: LegacyFontConfig): FontFamily {
  const parts = config.family.split(',').map(f => f.trim())
  const primary = parts[0]
  const fallback = parts.slice(1).join(', ') || 'sans-serif'

  return {
    family: primary,
    fallback,
    googleFont: isGoogleFont(primary),
  }
}

function isGoogleFont(fontName: string): boolean {
  const googleFonts = [
    'Nanum Myeongjo',
    'Noto Sans KR',
    'Pretendard',
    'Playfair Display',
    'Cormorant Garamond',
    'Space Grotesk',
    'IBM Plex Mono',
    'Press Start 2P',
    'VT323',
    'Outfit',
    'Inter',
    'Courier Prime',
    'Special Elite',
    'Bebas Neue',
    'Space Mono',
  ]
  return googleFonts.some(gf => fontName.includes(gf))
}

// ============================================
// Main Converter
// ============================================

/**
 * 레거시 프리셋을 StyleSchema로 변환
 */
export function convertToStyleSchema(
  preset: LegacyTemplatePreset,
  overrides?: StyleOverrides
): StyleSchema {
  const colors = { ...preset.defaultColors, ...overrides?.colors }
  const now = new Date().toISOString()

  return {
    version: '1.0',
    meta: {
      id: `style_${preset.id}`,
      name: `${preset.name} Style`,
      description: preset.descriptionKo,
      mood: mapMoodsToStyleMood(preset.preview.mood),
      createdAt: now,
      updatedAt: now,
    },
    theme: {
      colors: {
        primary: createColorScale(colors.primary),
        secondary: createColorScale(colors.secondary),
        accent: createColorScale(colors.accent),
        neutral: createColorScale('#6B7280'),
        background: {
          default: colors.background,
          paper: colors.surface,
          subtle: colors.surface,
        },
        text: {
          primary: colors.text,
          secondary: colors.textMuted,
          muted: colors.textMuted,
        },
      },
      typography: {
        fonts: {
          heading: createFontFamily(preset.defaultFonts.title),
          body: createFontFamily(preset.defaultFonts.body),
          accent: preset.defaultFonts.accent
            ? createFontFamily(preset.defaultFonts.accent)
            : undefined,
        },
        sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
        },
        weights: {
          light: 300,
          regular: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        lineHeights: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
        letterSpacing: {
          tight: '-0.025em',
          normal: '0',
          wide: '0.05em',
        },
      },
      spacing: {
        unit: 4,
        scale: {
          0: '0',
          1: '0.25rem',
          2: '0.5rem',
          3: '0.75rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          8: '2rem',
          10: '2.5rem',
          12: '3rem',
          16: '4rem',
        },
      },
      borders: {
        radius: {
          none: '0',
          sm: '0.25rem',
          md: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px',
        },
        width: {
          thin: '1px',
          default: '2px',
          thick: '4px',
        },
        style: 'solid',
        color: colors.textMuted,
      },
      shadows: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
          slower: 700,
        },
        easing: {
          default: 'cubic-bezier(0.4, 0, 0.2, 1)',
          in: 'cubic-bezier(0.4, 0, 1, 1)',
          out: 'cubic-bezier(0, 0, 0.2, 1)',
          inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        stagger: {
          delay: 100,
          from: 'start',
        },
      },
    },
    tokens: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: colors.background,
        surface: colors.surface,
        text: colors.text,
        textMuted: colors.textMuted,
      },
    },
    components: {
      text: {
        heading: {
          h1: {
            fontFamily: preset.defaultFonts.title.family,
            fontWeight: preset.defaultFonts.title.weight,
            letterSpacing: preset.defaultFonts.title.letterSpacing ?? 'normal',
          },
          h2: {
            fontFamily: preset.defaultFonts.title.family,
            fontWeight: preset.defaultFonts.title.weight,
          },
        },
        paragraph: {
          fontFamily: preset.defaultFonts.body.family,
          fontWeight: preset.defaultFonts.body.weight,
          lineHeight: 1.7,
        },
      },
      button: {
        base: {
          borderRadius: '0.5rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
        variants: {
          primary: {
            backgroundColor: colors.primary,
            color: colors.background,
          },
          secondary: {
            backgroundColor: colors.secondary,
            color: colors.text,
          },
          outline: {
            border: `1px solid ${colors.primary}`,
            color: colors.primary,
            backgroundColor: 'transparent',
          },
        },
      },
    },
  }
}

function mapMoodsToStyleMood(moods: string[]): ('romantic' | 'elegant' | 'playful' | 'minimal' | 'luxury' | 'vintage' | 'modern' | 'natural' | 'cozy' | 'formal')[] {
  const moodMap: Record<string, 'romantic' | 'elegant' | 'playful' | 'minimal' | 'luxury' | 'vintage' | 'modern' | 'natural' | 'cozy' | 'formal'> = {
    '세련된': 'elegant',
    '프리미엄': 'luxury',
    '다이나믹': 'modern',
    '감성적인': 'romantic',
    '빈티지': 'vintage',
    '영화같은': 'romantic',
    '예술적인': 'elegant',
    '정적인': 'minimal',
    '우아한': 'elegant',
    '트렌디한': 'modern',
    '감각적인': 'modern',
    '에디토리얼': 'modern',
    '힙한': 'modern',
    '레트로': 'vintage',
    '음악적인': 'playful',
    '친근한': 'cozy',
    '유쾌한': 'playful',
    '인터랙티브': 'playful',
    '몽환적인': 'romantic',
    '미래적인': 'modern',
    '여행': 'natural',
    '모험적인': 'playful',
    '클래식': 'formal',
    '귀여운': 'playful',
    '게임같은': 'playful',
    '시크한': 'elegant',
    '미니멀': 'minimal',
    '아티스틱': 'elegant',
  }

  return moods
    .map(m => moodMap[m])
    .filter((m): m is NonNullable<typeof m> => m !== undefined)
}
