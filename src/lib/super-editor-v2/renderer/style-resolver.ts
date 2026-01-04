/**
 * Style Resolver - StyleSystem → ResolvedStyle 변환
 *
 * 3-Level 하이브리드 스타일 시스템을 최종 CSS 변수로 해석
 * 우선순위: advanced > quick > preset
 */

import type {
  StyleSystem,
  SemanticTokens,
  GradientValue,
  TypeScale,
  ThemePresetId,
  TypographyPresetId,
  EffectsPresetId,
} from '../schema/types'
import { THEME_PRESETS } from '../presets/theme-presets'
import { TYPOGRAPHY_PRESETS, type FontStack } from '../presets/typography-presets'

// ============================================
// Types
// ============================================

export interface ResolvedStyle {
  // 시맨틱 토큰 (최종 해석된 색상)
  tokens: ResolvedTokens

  // 타이포그래피
  typography: ResolvedTypography

  // 이펙트
  effects: ResolvedEffects

  // 블록별 오버라이드
  blockOverrides: Map<string, ResolvedTokens>
}

export interface ResolvedTokens {
  // 배경
  bgPage: string
  bgSection: string
  bgSectionAlt: string
  bgCard: string
  bgOverlay: string

  // 전경
  fgDefault: string
  fgMuted: string
  fgEmphasis: string
  fgInverse: string
  fgOnAccent: string

  // 강조
  accentDefault: string
  accentHover: string
  accentActive: string
  accentSecondary: string

  // 보더
  borderDefault: string
  borderEmphasis: string
  borderMuted: string

  // 그라데이션
  gradientHero?: string
  gradientAccent?: string
  gradientOverlay?: string
}

export interface ResolvedTypography {
  fontFamilyDisplay: string  // 히어로/인트로용 (참조용)
  fontFamilyHeading: string  // 섹션 제목용
  fontFamilyBody: string     // 섹션 본문용
  fontFamilyAccent: string   // 섹션 라벨/태그용

  fontWeightDisplay: number
  fontWeightHeading: number
  fontWeightBody: number
  fontWeightAccent: number

  // 폰트 크기 보정 계수 (폰트별 시각적 크기 차이 보정)
  fontScaleDisplay: number
  fontScaleHeading: number
  fontScaleBody: number
  fontScaleAccent: number

  scale: TypeScale
}

export interface ResolvedEffects {
  radiusSm: number
  radiusMd: number
  radiusLg: number
  radiusFull: number

  shadowSm: string
  shadowMd: string
  shadowLg: string

  blurSm: number
  blurMd: number
  blurLg: number
}

// ============================================
// Default Values
// ============================================

const DEFAULT_TOKENS: ResolvedTokens = {
  bgPage: '#ffffff',
  bgSection: '#ffffff',
  bgSectionAlt: '#f8f8f8',
  bgCard: '#ffffff',
  bgOverlay: 'rgba(0, 0, 0, 0.5)',

  fgDefault: '#1a1a1a',
  fgMuted: '#6b6b6b',
  fgEmphasis: '#000000',
  fgInverse: '#ffffff',
  fgOnAccent: '#ffffff',

  accentDefault: '#c9a86c',
  accentHover: '#b8975b',
  accentActive: '#a7864a',
  accentSecondary: '#e8d4b8',

  borderDefault: '#e5e5e5',
  borderEmphasis: '#1a1a1a',
  borderMuted: '#f0f0f0',
}

const DEFAULT_TYPOGRAPHY: ResolvedTypography = {
  fontFamilyDisplay: '"Great Vibes", cursive',  // 히어로/인트로용 (참조용)
  fontFamilyHeading: '"Playfair Display", serif',  // 섹션 제목용
  fontFamilyBody: '"Noto Serif KR", serif',  // 섹션 본문용
  fontFamilyAccent: '"Playfair Display", serif',  // 섹션 라벨/태그용

  fontWeightDisplay: 400,
  fontWeightHeading: 600,
  fontWeightBody: 400,
  fontWeightAccent: 400,

  fontScaleDisplay: 1.25,  // Great Vibes 보정
  fontScaleHeading: 0.95,  // Playfair Display 보정
  fontScaleBody: 1.0,      // Noto Serif KR
  fontScaleAccent: 0.95,   // Playfair Display 보정

  scale: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
}

const DEFAULT_EFFECTS: ResolvedEffects = {
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 16,
  radiusFull: 9999,

  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.07)',
  shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',

  blurSm: 4,
  blurMd: 8,
  blurLg: 16,
}

// ============================================
// Resolver Functions
// ============================================

/**
 * StyleSystem을 ResolvedStyle로 변환
 */
export function resolveStyle(style: StyleSystem): ResolvedStyle {
  // 1. 프리셋 기본값 가져오기
  let tokens = { ...DEFAULT_TOKENS }
  let typography = { ...DEFAULT_TYPOGRAPHY }
  let effects = { ...DEFAULT_EFFECTS }

  // 2. Level 1: 프리셋 적용
  if (style.preset) {
    const preset = THEME_PRESETS[style.preset]
    if (preset) {
      tokens = resolveSemanticTokens(preset.tokens)
    }
  }

  // 3. Level 2: 빠른 설정 적용
  if (style.quick) {
    tokens = applyQuickConfig(tokens, style.quick)
  }

  // 4. Level 3: 고급 설정 적용
  if (style.advanced?.tokens) {
    tokens = resolveSemanticTokens(style.advanced.tokens)
  }

  // 5. 타이포그래피 해석
  if (style.typography) {
    typography = resolveTypography(style.typography)
  }

  // 6. 이펙트 해석
  if (style.effects) {
    effects = resolveEffects(style.effects)
  }

  // 7. 블록별 오버라이드
  const blockOverrides = new Map<string, ResolvedTokens>()
  if (style.advanced?.blockOverrides) {
    for (const [blockId, config] of Object.entries(style.advanced.blockOverrides)) {
      if (config.tokens) {
        blockOverrides.set(blockId, {
          ...tokens,
          ...resolvePartialTokens(config.tokens),
        })
      } else if (config.mode === 'invert') {
        blockOverrides.set(blockId, invertTokens(tokens))
      }
    }
  }

  return {
    tokens,
    typography,
    effects,
    blockOverrides,
  }
}

/**
 * SemanticTokens → ResolvedTokens
 */
function resolveSemanticTokens(tokens: SemanticTokens): ResolvedTokens {
  return {
    bgPage: tokens['bg-page'],
    bgSection: tokens['bg-section'],
    bgSectionAlt: tokens['bg-section-alt'],
    bgCard: tokens['bg-card'],
    bgOverlay: tokens['bg-overlay'],

    fgDefault: tokens['fg-default'],
    fgMuted: tokens['fg-muted'],
    fgEmphasis: tokens['fg-emphasis'],
    fgInverse: tokens['fg-inverse'],
    fgOnAccent: tokens['fg-on-accent'],

    accentDefault: tokens['accent-default'],
    accentHover: tokens['accent-hover'],
    accentActive: tokens['accent-active'],
    accentSecondary: tokens['accent-secondary'],

    borderDefault: tokens['border-default'],
    borderEmphasis: tokens['border-emphasis'],
    borderMuted: tokens['border-muted'],

    gradientHero: tokens['gradient-hero'] ? gradientToString(tokens['gradient-hero']) : undefined,
    gradientAccent: tokens['gradient-accent'] ? gradientToString(tokens['gradient-accent']) : undefined,
    gradientOverlay: tokens['gradient-overlay'] ? gradientToString(tokens['gradient-overlay']) : undefined,
  }
}

function resolvePartialTokens(tokens: Partial<SemanticTokens>): Partial<ResolvedTokens> {
  const result: Partial<ResolvedTokens> = {}

  if (tokens['bg-page']) result.bgPage = tokens['bg-page']
  if (tokens['bg-section']) result.bgSection = tokens['bg-section']
  if (tokens['bg-section-alt']) result.bgSectionAlt = tokens['bg-section-alt']
  if (tokens['bg-card']) result.bgCard = tokens['bg-card']
  if (tokens['bg-overlay']) result.bgOverlay = tokens['bg-overlay']

  if (tokens['fg-default']) result.fgDefault = tokens['fg-default']
  if (tokens['fg-muted']) result.fgMuted = tokens['fg-muted']
  if (tokens['fg-emphasis']) result.fgEmphasis = tokens['fg-emphasis']
  if (tokens['fg-inverse']) result.fgInverse = tokens['fg-inverse']
  if (tokens['fg-on-accent']) result.fgOnAccent = tokens['fg-on-accent']

  if (tokens['accent-default']) result.accentDefault = tokens['accent-default']
  if (tokens['accent-hover']) result.accentHover = tokens['accent-hover']
  if (tokens['accent-active']) result.accentActive = tokens['accent-active']
  if (tokens['accent-secondary']) result.accentSecondary = tokens['accent-secondary']

  if (tokens['border-default']) result.borderDefault = tokens['border-default']
  if (tokens['border-emphasis']) result.borderEmphasis = tokens['border-emphasis']
  if (tokens['border-muted']) result.borderMuted = tokens['border-muted']

  return result
}

/**
 * 토큰 색상 반전
 */
function invertTokens(tokens: ResolvedTokens): ResolvedTokens {
  return {
    ...tokens,
    bgPage: tokens.fgDefault,
    bgSection: tokens.fgDefault,
    bgSectionAlt: tokens.fgMuted,
    bgCard: tokens.fgMuted,

    fgDefault: tokens.bgPage,
    fgMuted: tokens.bgSectionAlt,
    fgEmphasis: tokens.bgPage,
    fgInverse: tokens.fgDefault,
  }
}

/**
 * Quick 설정 적용
 */
function applyQuickConfig(
  tokens: ResolvedTokens,
  quick: NonNullable<StyleSystem['quick']>
): ResolvedTokens {
  const result = { ...tokens }

  if (quick.dominantColor) {
    // dominantColor가 밝은 색일 때만 배경색으로 사용 (어두운 색은 무시)
    if (isLightColor(quick.dominantColor)) {
      result.bgSection = quick.dominantColor
    }
  }
  if (quick.accentColor) {
    result.accentDefault = quick.accentColor
    result.accentHover = adjustColor(quick.accentColor, -10)
    result.accentActive = adjustColor(quick.accentColor, -20)
  }
  if (quick.secondaryColor) {
    result.accentSecondary = quick.secondaryColor
  }

  return result
}

/**
 * FontStack을 CSS font-family 문자열로 변환
 */
function fontStackToCSS(stack: FontStack): string {
  return stack.family
    .map(f => (f.includes(' ') ? `"${f}"` : f))
    .join(', ')
}

/**
 * 타이포그래피 해석
 */
function resolveTypography(config: StyleSystem['typography']): ResolvedTypography {
  let result = { ...DEFAULT_TYPOGRAPHY }

  // 프리셋 적용
  if (config.preset) {
    const preset = TYPOGRAPHY_PRESETS[config.preset]
    if (preset) {
      result.fontFamilyDisplay = fontStackToCSS(preset.fontStacks.display)
      result.fontFamilyHeading = fontStackToCSS(preset.fontStacks.heading)
      result.fontFamilyBody = fontStackToCSS(preset.fontStacks.body)
      result.fontFamilyAccent = fontStackToCSS(preset.fontStacks.accent)

      result.fontWeightDisplay = preset.weights.display
      result.fontWeightHeading = preset.weights.heading
      result.fontWeightBody = preset.weights.body
      result.fontWeightAccent = preset.weights.accent

      // 폰트 크기 보정 계수 적용
      result.fontScaleDisplay = preset.fontStacks.display.sizeScale ?? 1.0
      result.fontScaleHeading = preset.fontStacks.heading.sizeScale ?? 1.0
      result.fontScaleBody = preset.fontStacks.body.sizeScale ?? 1.0
      result.fontScaleAccent = preset.fontStacks.accent.sizeScale ?? 1.0
    }
  }

  // 커스텀 오버라이드
  if (config.custom) {
    if (config.custom.fontStacks?.display) {
      result.fontFamilyDisplay = config.custom.fontStacks.display
    }
    if (config.custom.fontStacks?.heading) {
      result.fontFamilyHeading = config.custom.fontStacks.heading
    }
    if (config.custom.fontStacks?.body) {
      result.fontFamilyBody = config.custom.fontStacks.body
    }
    if (config.custom.weights?.display) {
      result.fontWeightDisplay = config.custom.weights.display
    }
    if (config.custom.weights?.heading) {
      result.fontWeightHeading = config.custom.weights.heading
    }
    if (config.custom.weights?.body) {
      result.fontWeightBody = config.custom.weights.body
    }
    if (config.custom.scale) {
      result.scale = { ...result.scale, ...config.custom.scale }
    }
  }

  return result
}

/**
 * 이펙트 해석
 */
function resolveEffects(config: StyleSystem['effects']): ResolvedEffects {
  let result = { ...DEFAULT_EFFECTS }

  // TODO: 프리셋 적용

  if (config.custom) {
    if (config.custom.radius) {
      result.radiusSm = config.custom.radius.sm ?? result.radiusSm
      result.radiusMd = config.custom.radius.md ?? result.radiusMd
      result.radiusLg = config.custom.radius.lg ?? result.radiusLg
      result.radiusFull = config.custom.radius.full ?? result.radiusFull
    }
    if (config.custom.shadows) {
      result.shadowSm = config.custom.shadows.sm ?? result.shadowSm
      result.shadowMd = config.custom.shadows.md ?? result.shadowMd
      result.shadowLg = config.custom.shadows.lg ?? result.shadowLg
    }
    if (config.custom.blurs) {
      result.blurSm = config.custom.blurs.sm ?? result.blurSm
      result.blurMd = config.custom.blurs.md ?? result.blurMd
      result.blurLg = config.custom.blurs.lg ?? result.blurLg
    }
  }

  return result
}

// ============================================
// Utility Functions
// ============================================

/**
 * GradientValue → CSS 문자열
 */
function gradientToString(gradient: GradientValue): string {
  const stops = gradient.stops
    .map(s => {
      const opacity = s.opacity !== undefined ? `, ${s.opacity}` : ''
      return `${s.color}${opacity} ${s.position}%`
    })
    .join(', ')

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle ?? 180}deg, ${stops})`
  } else if (gradient.type === 'radial') {
    const shape = gradient.shape ?? 'circle'
    const position = gradient.position ?? 'center'
    return `radial-gradient(${shape} at ${position}, ${stops})`
  } else {
    return `conic-gradient(from ${gradient.angle ?? 0}deg, ${stops})`
  }
}

/**
 * 색상이 밝은지 판단 (luminance > 0.5)
 */
function isLightColor(color: string): boolean {
  if (!color.startsWith('#')) return true // 기본값은 밝은 색 취급
  const hex = color.slice(1)
  const num = parseInt(hex, 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  // 상대 밝기 계산 (ITU-R BT.709)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

/**
 * 색상 밝기 조정 (간단한 구현)
 */
function adjustColor(color: string, amount: number): string {
  // 간단한 hex 색상 조정
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const num = parseInt(hex, 16)
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount))
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount))
    const b = Math.max(0, Math.min(255, (num & 0xff) + amount))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }
  return color
}

/**
 * ResolvedStyle → CSS Variables 객체
 */
export function styleToCSSVariables(style: ResolvedStyle): Record<string, string> {
  const vars: Record<string, string> = {}

  // 토큰
  vars['--bg-page'] = style.tokens.bgPage
  vars['--bg-section'] = style.tokens.bgSection
  vars['--bg-section-alt'] = style.tokens.bgSectionAlt
  vars['--bg-card'] = style.tokens.bgCard
  vars['--bg-overlay'] = style.tokens.bgOverlay

  vars['--fg-default'] = style.tokens.fgDefault
  vars['--fg-muted'] = style.tokens.fgMuted
  vars['--fg-emphasis'] = style.tokens.fgEmphasis
  vars['--fg-inverse'] = style.tokens.fgInverse
  vars['--fg-on-accent'] = style.tokens.fgOnAccent

  vars['--accent-default'] = style.tokens.accentDefault
  vars['--accent-hover'] = style.tokens.accentHover
  vars['--accent-active'] = style.tokens.accentActive
  vars['--accent-secondary'] = style.tokens.accentSecondary

  vars['--border-default'] = style.tokens.borderDefault
  vars['--border-emphasis'] = style.tokens.borderEmphasis
  vars['--border-muted'] = style.tokens.borderMuted

  if (style.tokens.gradientHero) {
    vars['--gradient-hero'] = style.tokens.gradientHero
  }
  if (style.tokens.gradientAccent) {
    vars['--gradient-accent'] = style.tokens.gradientAccent
  }
  if (style.tokens.gradientOverlay) {
    vars['--gradient-overlay'] = style.tokens.gradientOverlay
  }

  // 타이포그래피
  vars['--font-display'] = style.typography.fontFamilyDisplay
  vars['--font-heading'] = style.typography.fontFamilyHeading
  vars['--font-body'] = style.typography.fontFamilyBody
  vars['--font-accent'] = style.typography.fontFamilyAccent
  vars['--font-weight-display'] = String(style.typography.fontWeightDisplay)
  vars['--font-weight-heading'] = String(style.typography.fontWeightHeading)
  vars['--font-weight-body'] = String(style.typography.fontWeightBody)
  vars['--font-weight-accent'] = String(style.typography.fontWeightAccent)

  // 폰트 크기 보정 계수
  vars['--font-scale-display'] = String(style.typography.fontScaleDisplay)
  vars['--font-scale-heading'] = String(style.typography.fontScaleHeading)
  vars['--font-scale-body'] = String(style.typography.fontScaleBody)
  vars['--font-scale-accent'] = String(style.typography.fontScaleAccent)

  vars['--text-xs'] = style.typography.scale.xs
  vars['--text-sm'] = style.typography.scale.sm
  vars['--text-base'] = style.typography.scale.base
  vars['--text-lg'] = style.typography.scale.lg
  vars['--text-xl'] = style.typography.scale.xl
  vars['--text-2xl'] = style.typography.scale['2xl']
  vars['--text-3xl'] = style.typography.scale['3xl']
  vars['--text-4xl'] = style.typography.scale['4xl']

  // 이펙트
  vars['--radius-sm'] = `${style.effects.radiusSm}px`
  vars['--radius-md'] = `${style.effects.radiusMd}px`
  vars['--radius-lg'] = `${style.effects.radiusLg}px`
  vars['--radius-full'] = `${style.effects.radiusFull}px`

  vars['--shadow-sm'] = style.effects.shadowSm
  vars['--shadow-md'] = style.effects.shadowMd
  vars['--shadow-lg'] = style.effects.shadowLg

  vars['--blur-sm'] = `${style.effects.blurSm}px`
  vars['--blur-md'] = `${style.effects.blurMd}px`
  vars['--blur-lg'] = `${style.effects.blurLg}px`

  return vars
}

/**
 * 기본 ResolvedStyle 생성
 */
export function createDefaultResolvedStyle(): ResolvedStyle {
  return {
    tokens: DEFAULT_TOKENS,
    typography: DEFAULT_TYPOGRAPHY,
    effects: DEFAULT_EFFECTS,
    blockOverrides: new Map(),
  }
}
