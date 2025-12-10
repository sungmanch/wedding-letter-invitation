/**
 * Super Editor - CSS Variables Generator
 * SemanticDesignTokens를 CSS Variables로 변환
 */

import type { SemanticDesignTokens, TypoToken } from './schema'

/**
 * camelCase를 kebab-case로 변환
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 타이포그래피 토큰을 CSS Variables로 변환
 */
function generateTypoVariables(prefix: string, typo: TypoToken): string[] {
  const lines: string[] = []
  const baseVar = `--typo-${toKebabCase(prefix)}`

  lines.push(`  ${baseVar}-font-family: ${typo.fontFamily};`)
  lines.push(`  ${baseVar}-font-size: ${typo.fontSize};`)
  lines.push(`  ${baseVar}-font-weight: ${typo.fontWeight};`)
  lines.push(`  ${baseVar}-line-height: ${typo.lineHeight};`)

  if (typo.letterSpacing) {
    lines.push(`  ${baseVar}-letter-spacing: ${typo.letterSpacing};`)
  }

  return lines
}

/**
 * SemanticDesignTokens를 CSS Variables 문자열로 변환
 */
export function generateCssVariables(tokens: SemanticDesignTokens): string {
  const lines: string[] = [':root {']

  // Colors
  lines.push('  /* Colors */')
  lines.push(`  --color-brand: ${tokens.colors.brand};`)
  lines.push(`  --color-accent: ${tokens.colors.accent};`)
  lines.push(`  --color-background: ${tokens.colors.background};`)
  lines.push(`  --color-surface: ${tokens.colors.surface};`)
  lines.push(`  --color-text-primary: ${tokens.colors.text.primary};`)
  lines.push(`  --color-text-secondary: ${tokens.colors.text.secondary};`)
  lines.push(`  --color-text-muted: ${tokens.colors.text.muted};`)
  lines.push(`  --color-text-on-brand: ${tokens.colors.text.onBrand};`)
  lines.push(`  --color-border: ${tokens.colors.border};`)
  lines.push(`  --color-divider: ${tokens.colors.divider};`)
  lines.push('')

  // Typography
  lines.push('  /* Typography */')
  lines.push(...generateTypoVariables('display-lg', tokens.typography.displayLg))
  lines.push(...generateTypoVariables('display-md', tokens.typography.displayMd))
  lines.push(...generateTypoVariables('section-title', tokens.typography.sectionTitle))
  lines.push(...generateTypoVariables('heading-lg', tokens.typography.headingLg))
  lines.push(...generateTypoVariables('heading-md', tokens.typography.headingMd))
  lines.push(...generateTypoVariables('heading-sm', tokens.typography.headingSm))
  lines.push(...generateTypoVariables('body-lg', tokens.typography.bodyLg))
  lines.push(...generateTypoVariables('body-md', tokens.typography.bodyMd))
  lines.push(...generateTypoVariables('body-sm', tokens.typography.bodySm))
  lines.push(...generateTypoVariables('caption', tokens.typography.caption))
  lines.push('')

  // Spacing
  lines.push('  /* Spacing */')
  lines.push(`  --spacing-xs: ${tokens.spacing.xs};`)
  lines.push(`  --spacing-sm: ${tokens.spacing.sm};`)
  lines.push(`  --spacing-md: ${tokens.spacing.md};`)
  lines.push(`  --spacing-lg: ${tokens.spacing.lg};`)
  lines.push(`  --spacing-xl: ${tokens.spacing.xl};`)
  lines.push(`  --spacing-xxl: ${tokens.spacing.xxl};`)
  lines.push(`  --spacing-section: ${tokens.spacing.section};`)
  lines.push(`  --spacing-component: ${tokens.spacing.component};`)
  lines.push('')

  // Borders
  lines.push('  /* Borders */')
  lines.push(`  --radius-sm: ${tokens.borders.radiusSm};`)
  lines.push(`  --radius-md: ${tokens.borders.radiusMd};`)
  lines.push(`  --radius-lg: ${tokens.borders.radiusLg};`)
  lines.push(`  --radius-full: ${tokens.borders.radiusFull};`)
  lines.push('')

  // Shadows
  lines.push('  /* Shadows */')
  lines.push(`  --shadow-sm: ${tokens.shadows.sm};`)
  lines.push(`  --shadow-md: ${tokens.shadows.md};`)
  lines.push(`  --shadow-lg: ${tokens.shadows.lg};`)
  lines.push('')

  // Animation
  lines.push('  /* Animation */')
  lines.push(`  --duration-fast: ${tokens.animation.durationFast}ms;`)
  lines.push(`  --duration-normal: ${tokens.animation.durationNormal}ms;`)
  lines.push(`  --duration-slow: ${tokens.animation.durationSlow}ms;`)
  lines.push(`  --easing-default: ${tokens.animation.easing};`)
  lines.push(`  --stagger-delay: ${tokens.animation.staggerDelay}ms;`)

  // Drop Cap (첫 글자 강조)
  if (tokens.typography.dropCap?.enabled) {
    lines.push('')
    lines.push('  /* Drop Cap */')
    lines.push(`  --drop-cap-scale: ${tokens.typography.dropCap.scale};`)
    lines.push(`  --drop-cap-italic: ${tokens.typography.dropCap.italic ? 'italic' : 'normal'};`)
    if (tokens.typography.dropCap.fontFamily) {
      lines.push(`  --drop-cap-font-family: ${tokens.typography.dropCap.fontFamily};`)
    }
  }

  lines.push('}')

  // Drop Cap CSS 클래스 추가
  if (tokens.typography.dropCap?.enabled) {
    lines.push('')
    lines.push('/* Drop Cap - 첫 글자 강조 */')
    lines.push('.drop-cap::first-letter {')
    lines.push(`  font-size: ${tokens.typography.dropCap.scale}em;`)
    lines.push(`  font-style: ${tokens.typography.dropCap.italic ? 'italic' : 'normal'};`)
    if (tokens.typography.dropCap.fontFamily) {
      lines.push(`  font-family: ${tokens.typography.dropCap.fontFamily};`)
    }
    lines.push('  float: left;')
    lines.push('  line-height: 0.8;')
    lines.push('  margin-right: 0.05em;')
    lines.push('  margin-top: 0.1em;')
    lines.push('}')
  }

  return lines.join('\n')
}

/**
 * 토큰 참조($token.xxx)를 CSS Variable 참조(var(--xxx))로 변환
 */
export function tokenRefToCssVar(ref: string): string {
  if (!ref.startsWith('$token.')) {
    return ref
  }

  const path = ref.replace('$token.', '')
  const parts = path.split('.')

  // 경로별 변환 규칙
  if (parts[0] === 'colors') {
    if (parts[1] === 'text') {
      return `var(--color-text-${toKebabCase(parts[2])})`
    }
    return `var(--color-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'typography') {
    const typoName = toKebabCase(parts[1])
    const prop = parts[2]

    switch (prop) {
      case 'fontFamily':
        return `var(--typo-${typoName}-font-family)`
      case 'fontSize':
        return `var(--typo-${typoName}-font-size)`
      case 'fontWeight':
        return `var(--typo-${typoName}-font-weight)`
      case 'lineHeight':
        return `var(--typo-${typoName}-line-height)`
      case 'letterSpacing':
        return `var(--typo-${typoName}-letter-spacing)`
      default:
        return ref
    }
  }

  if (parts[0] === 'spacing') {
    return `var(--spacing-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'borders') {
    const borderProp = parts[1]
    if (borderProp.startsWith('radius')) {
      return `var(--radius-${toKebabCase(borderProp.replace('radius', ''))})`
    }
    return ref
  }

  if (parts[0] === 'shadows') {
    return `var(--shadow-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'animation') {
    switch (parts[1]) {
      case 'durationFast':
        return 'var(--duration-fast)'
      case 'durationNormal':
        return 'var(--duration-normal)'
      case 'durationSlow':
        return 'var(--duration-slow)'
      case 'easing':
        return 'var(--easing-default)'
      case 'staggerDelay':
        return 'var(--stagger-delay)'
      default:
        return ref
    }
  }

  return ref
}

/**
 * 스타일 객체 내의 모든 토큰 참조를 CSS Variable로 변환
 */
export function resolveTokenStyle(style: Record<string, unknown>): Record<string, unknown> {
  const resolved: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'string' && value.startsWith('$token.')) {
      resolved[key] = tokenRefToCssVar(value)
    } else if (typeof value === 'object' && value !== null) {
      resolved[key] = resolveTokenStyle(value as Record<string, unknown>)
    } else {
      resolved[key] = value
    }
  }

  return resolved
}

/**
 * 타이포그래피 토큰을 CSS 스타일 객체로 변환
 */
export function typoTokenToCss(tokenName: string): Record<string, string> {
  const baseName = toKebabCase(tokenName)

  return {
    fontFamily: `var(--typo-${baseName}-font-family)`,
    fontSize: `var(--typo-${baseName}-font-size)`,
    fontWeight: `var(--typo-${baseName}-font-weight)`,
    lineHeight: `var(--typo-${baseName}-line-height)`,
  }
}
