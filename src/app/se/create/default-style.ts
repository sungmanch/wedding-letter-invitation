/**
 * Super Editor - Default Style Factory
 * 테스트용 기본 StyleSchema 생성
 */

import type { StyleSchema } from '@/lib/super-editor/schema/style'

/**
 * 기본 StyleSchema 생성
 */
export function createDefaultStyle(options?: {
  name?: string
  primaryColor?: string
  accentColor?: string
  headingFont?: string
  bodyFont?: string
  mood?: string[]
}): StyleSchema {
  const {
    name = 'default',
    primaryColor = '#E91E63',
    headingFont = '"Noto Serif KR", serif',
    bodyFont = '"Pretendard", sans-serif',
    mood = ['romantic'],
  } = options ?? {}

  return {
    version: '1.0',
    meta: {
      id: `style-${Date.now()}`,
      name,
      mood: mood as StyleSchema['meta']['mood'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    theme: {
      colors: {
        primary: {
          50: lighten(primaryColor, 0.9),
          100: lighten(primaryColor, 0.8),
          200: lighten(primaryColor, 0.6),
          300: lighten(primaryColor, 0.4),
          400: lighten(primaryColor, 0.2),
          500: primaryColor,
          600: darken(primaryColor, 0.1),
          700: darken(primaryColor, 0.2),
          800: darken(primaryColor, 0.3),
          900: darken(primaryColor, 0.4),
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        background: {
          default: '#FFFBFC',
          paper: '#FFFFFF',
          subtle: '#F9FAFB',
          inverse: '#1F2937',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      typography: {
        fonts: {
          heading: { family: headingFont },
          body: { family: bodyFont },
          accent: { family: headingFont },
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
          relaxed: 1.625,
          loose: 2,
        },
        letterSpacing: {
          tight: '-0.025em',
          normal: '0',
          wide: '0.025em',
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
          20: '5rem',
          24: '6rem',
        },
      },
      borders: {
        radius: {
          none: '0',
          sm: '0.25rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          full: '9999px',
        },
        width: {
          thin: '1px',
          default: '2px',
          thick: '4px',
        },
        style: 'solid',
        color: '#E5E7EB',
      },
      shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
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
      colors: {},
      spacing: {},
      typography: {},
    },
    components: {
      button: {
        base: {},
        variants: {},
      },
      text: {
        heading: {
          h1: {},
          h2: {},
          h3: {},
        },
        paragraph: {},
        caption: {},
      },
    },
  }
}

/**
 * 색상 밝게
 */
function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = Math.round(rgb.r + (255 - rgb.r) * amount)
  const g = Math.round(rgb.g + (255 - rgb.g) * amount)
  const b = Math.round(rgb.b + (255 - rgb.b) * amount)

  return rgbToHex(r, g, b)
}

/**
 * 색상 어둡게
 */
function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const r = Math.round(rgb.r * (1 - amount))
  const g = Math.round(rgb.g * (1 - amount))
  const b = Math.round(rgb.b * (1 - amount))

  return rgbToHex(r, g, b)
}

/**
 * HEX to RGB
 */
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

/**
 * RGB to HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

/**
 * 기본 UserData
 */
export const DEFAULT_USER_DATA = {
  version: '1.0' as const,
  meta: {
    id: 'preview',
    templateId: 'default',
    layoutId: 'default',
    styleId: 'default',
    editorId: 'default',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  data: {
    couple: {
      groom: { name: '김신랑', englishName: 'Groom' },
      bride: { name: '이신부', englishName: 'Bride' },
    },
    wedding: {
      date: '2025년 3월 15일',
      time: '오후 2시',
      venue: {
        name: '더채플앳청담',
        address: '서울특별시 강남구 청담동 123-45',
        hall: '루체홀',
      },
    },
    message: {
      title: '저희 결혼합니다',
      content: '서로의 마음을 확인하고\n평생을 함께 하고자 합니다.\n\n귀한 걸음 하시어\n축복해 주시면 감사하겠습니다.',
    },
    photos: {
      main: '/samples/couple-1.jpg',
      gallery: ['/samples/couple-1.jpg', '/samples/couple-2.jpg'],
    },
  },
}
