/**
 * Super Editor - Token Resolver
 * StyleSchema의 theme 값을 SemanticDesignTokens로 변환
 */

import type { StyleSchema, ColorScale, TypographyConfig, ThemeConfig } from '../schema/style'
import type { SemanticDesignTokens, TypoToken } from './schema'
import { DEFAULT_TOKENS } from './schema'

// ============================================
// Color Utilities
// ============================================

/**
 * ColorScale에서 특정 shade 값을 가져오거나 기본값 반환
 */
function getColorFromScale(scale: ColorScale | undefined, shade: keyof ColorScale, fallback: string): string {
  if (!scale) return fallback
  return scale[shade] ?? scale[500] ?? fallback
}

/**
 * 색상의 투명도 버전 생성
 */
function withOpacity(color: string, opacity: number): string {
  // hex to rgba 변환
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}

/**
 * 대비되는 텍스트 색상 결정 (밝은 배경 → 어두운 텍스트)
 */
function getContrastingTextColor(backgroundColor: string): string {
  if (!backgroundColor.startsWith('#')) return '#FFFFFF'

  const hex = backgroundColor.slice(1)
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  // 밝기 계산 (perceived brightness)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#1A1A1A' : '#FFFFFF'
}

// ============================================
// Typography Utilities
// ============================================

/**
 * TypographyConfig에서 TypoToken 생성
 */
function createTypoToken(
  typography: TypographyConfig,
  fontType: 'heading' | 'body',
  size: string,
  weight: 'bold' | 'regular' | 'medium' | 'semibold',
  lineHeight: 'tight' | 'normal' | 'relaxed'
): TypoToken {
  const fontConfig = fontType === 'heading' ? typography.fonts.heading : typography.fonts.body
  const fontFamily = fontConfig.fallback
    ? `'${fontConfig.family}', ${fontConfig.fallback}`
    : `'${fontConfig.family}'`

  return {
    fontFamily,
    fontSize: typography.sizes[size as keyof typeof typography.sizes] ?? size,
    fontWeight: typography.weights[weight] ?? 400,
    lineHeight:
      typeof typography.lineHeights[lineHeight] === 'number'
        ? (typography.lineHeights[lineHeight] as number)
        : parseFloat(typography.lineHeights[lineHeight] as string) || 1.5,
    letterSpacing: typography.letterSpacing?.tight,
  }
}

// ============================================
// Main Resolver
// ============================================

/**
 * StyleSchema를 SemanticDesignTokens로 변환
 */
export function resolveTokens(style: StyleSchema): SemanticDesignTokens {
  const { theme } = style

  if (!theme) {
    return DEFAULT_TOKENS
  }

  return {
    colors: resolveColors(theme),
    typography: resolveTypography(theme.typography),
    spacing: resolveSpacing(theme),
    borders: resolveBorders(theme),
    shadows: resolveShadows(theme),
    animation: resolveAnimation(theme),
  }
}

/**
 * 색상 토큰 해석
 */
function resolveColors(theme: ThemeConfig): SemanticDesignTokens['colors'] {
  const { colors } = theme

  const brandColor = getColorFromScale(colors.primary, 500, DEFAULT_TOKENS.colors.brand)
  const accentColor = colors.accent
    ? getColorFromScale(colors.accent, 500, DEFAULT_TOKENS.colors.accent)
    : colors.secondary
      ? getColorFromScale(colors.secondary, 500, DEFAULT_TOKENS.colors.accent)
      : DEFAULT_TOKENS.colors.accent

  return {
    brand: brandColor,
    accent: accentColor,
    background: colors.background?.default ?? DEFAULT_TOKENS.colors.background,
    surface: colors.background?.paper ?? colors.background?.subtle ?? DEFAULT_TOKENS.colors.surface,
    text: {
      primary: colors.text?.primary ?? DEFAULT_TOKENS.colors.text.primary,
      secondary: colors.text?.secondary ?? withOpacity(colors.text?.primary ?? '#1A1A1A', 0.7),
      muted: colors.text?.muted ?? withOpacity(colors.text?.primary ?? '#1A1A1A', 0.5),
      onBrand: getContrastingTextColor(brandColor),
    },
    border: theme.borders?.color ?? getColorFromScale(colors.neutral, 200, DEFAULT_TOKENS.colors.border),
    divider: getColorFromScale(colors.neutral, 100, DEFAULT_TOKENS.colors.divider),
  }
}

/**
 * 타이포그래피 토큰 해석
 */
function resolveTypography(typography: TypographyConfig | undefined): SemanticDesignTokens['typography'] {
  if (!typography) {
    return DEFAULT_TOKENS.typography
  }

  return {
    displayLg: createTypoToken(typography, 'heading', '4xl', 'bold', 'tight'),
    displayMd: createTypoToken(typography, 'heading', '3xl', 'semibold', 'tight'),
    sectionTitle: {
      ...createTypoToken(typography, 'heading', 'sm', 'medium', 'normal'),
      letterSpacing: '0.25em',
    },
    headingLg: createTypoToken(typography, 'heading', '2xl', 'semibold', 'normal'),
    headingMd: createTypoToken(typography, 'heading', 'lg', 'semibold', 'normal'),
    headingSm: createTypoToken(typography, 'heading', 'base', 'semibold', 'normal'),
    bodyLg: createTypoToken(typography, 'body', 'base', 'regular', 'relaxed'),
    bodyMd: createTypoToken(typography, 'body', 'sm', 'regular', 'relaxed'),
    bodySm: createTypoToken(typography, 'body', 'xs', 'regular', 'normal'),
    caption: createTypoToken(typography, 'body', 'xs', 'regular', 'normal'),
  }
}

/**
 * 간격 토큰 해석
 */
function resolveSpacing(theme: ThemeConfig): SemanticDesignTokens['spacing'] {
  const spacing = theme.spacing

  if (!spacing) {
    return DEFAULT_TOKENS.spacing
  }

  return {
    xs: spacing.scale?.[1] ?? DEFAULT_TOKENS.spacing.xs,
    sm: spacing.scale?.[2] ?? DEFAULT_TOKENS.spacing.sm,
    md: spacing.scale?.[4] ?? DEFAULT_TOKENS.spacing.md,
    lg: spacing.scale?.[6] ?? DEFAULT_TOKENS.spacing.lg,
    xl: spacing.scale?.[8] ?? DEFAULT_TOKENS.spacing.xl,
    xxl: spacing.scale?.[12] ?? DEFAULT_TOKENS.spacing.xxl,
    section: spacing.scale?.[6] ?? DEFAULT_TOKENS.spacing.section,
    component: spacing.scale?.[4] ?? DEFAULT_TOKENS.spacing.component,
  }
}

/**
 * 테두리 토큰 해석
 */
function resolveBorders(theme: ThemeConfig): SemanticDesignTokens['borders'] {
  const borders = theme.borders

  if (!borders) {
    return DEFAULT_TOKENS.borders
  }

  return {
    radiusSm: borders.radius?.sm ?? DEFAULT_TOKENS.borders.radiusSm,
    radiusMd: borders.radius?.md ?? DEFAULT_TOKENS.borders.radiusMd,
    radiusLg: borders.radius?.lg ?? DEFAULT_TOKENS.borders.radiusLg,
    radiusFull: borders.radius?.full ?? DEFAULT_TOKENS.borders.radiusFull,
  }
}

/**
 * 그림자 토큰 해석
 */
function resolveShadows(theme: ThemeConfig): SemanticDesignTokens['shadows'] {
  const shadows = theme.shadows

  if (!shadows) {
    return DEFAULT_TOKENS.shadows
  }

  return {
    sm: shadows.sm ?? DEFAULT_TOKENS.shadows.sm,
    md: shadows.md ?? DEFAULT_TOKENS.shadows.md,
    lg: shadows.lg ?? DEFAULT_TOKENS.shadows.lg,
  }
}

/**
 * 애니메이션 토큰 해석
 */
function resolveAnimation(theme: ThemeConfig): SemanticDesignTokens['animation'] {
  const animation = theme.animation

  if (!animation) {
    return DEFAULT_TOKENS.animation
  }

  return {
    durationFast: animation.duration?.fast ?? DEFAULT_TOKENS.animation.durationFast,
    durationNormal: animation.duration?.normal ?? DEFAULT_TOKENS.animation.durationNormal,
    durationSlow: animation.duration?.slow ?? DEFAULT_TOKENS.animation.durationSlow,
    easing: animation.easing?.default ?? DEFAULT_TOKENS.animation.easing,
    staggerDelay: animation.stagger?.delay ?? DEFAULT_TOKENS.animation.staggerDelay,
  }
}

// ============================================
// Token Value Getter
// ============================================

/**
 * 토큰 경로에서 값 가져오기
 * @example getTokenValue(tokens, 'colors.brand') => '#EC4899'
 */
export function getTokenValue(tokens: SemanticDesignTokens, path: string): string | number | undefined {
  const parts = path.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = tokens

  for (const part of parts) {
    if (current === undefined || current === null) return undefined
    current = current[part]
  }

  return current
}

/**
 * 토큰 참조($token.xxx)를 실제 값으로 해석
 */
export function resolveTokenRef(tokens: SemanticDesignTokens, ref: string): string | number | undefined {
  if (!ref.startsWith('$token.')) {
    return ref
  }

  const path = ref.replace('$token.', '')
  return getTokenValue(tokens, path)
}
