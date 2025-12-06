/**
 * Super Editor - Skeleton Resolver
 * SkeletonNode를 PrimitiveNode/Screen으로 변환
 */

import type { PrimitiveNode, CSSProperties } from '../schema/primitives'
import type { SemanticDesignTokens } from '../tokens/schema'
import type { SkeletonNode, SectionFillResult, SectionScreen, SectionType } from '../skeletons/types'
import { getVariant, getDefaultVariant } from '../skeletons/registry'
import { resolveTokenRef, getTokenValue } from '../tokens/resolver'

// ============================================
// Skeleton to Screen Resolver
// ============================================

/**
 * AI Fill 결과를 적용하여 Screen 생성
 */
export function resolveSkeletonToScreen(
  sectionType: SectionType,
  tokens: SemanticDesignTokens,
  fillResult: SectionFillResult
): SectionScreen | null {
  // Variant 조회
  const variant = getVariant(sectionType, fillResult.variantId) ?? getDefaultVariant(sectionType)

  if (!variant) {
    console.error(`No variant found for ${sectionType}:${fillResult.variantId}`)
    return null
  }

  // 옵션 적용
  const structure = applyOptions(variant.structure, fillResult, variant)

  // SkeletonNode를 PrimitiveNode로 변환
  const root = resolveNode(structure, tokens)

  return {
    id: `${sectionType}-screen`,
    name: variant.name,
    type: sectionType === 'intro' ? 'intro' : 'content',
    sectionType,
    root: structure, // SkeletonNode 유지 (빌드 시점에 변환)
  }
}

/**
 * 옵션 적용 (애니메이션, 레이아웃)
 */
function applyOptions(
  structure: SkeletonNode,
  fillResult: SectionFillResult,
  variant: { options?: { animations?: { id: string; preset: string; duration?: number }[]; layouts?: { id: string; props: Record<string, unknown> }[] } }
): SkeletonNode {
  const cloned = deepClone(structure)

  // 애니메이션 옵션 적용
  if (fillResult.selectedOptions?.animation && variant.options?.animations) {
    const animOption = variant.options.animations.find((a) => a.id === fillResult.selectedOptions?.animation)
    if (animOption && animOption.preset !== 'none') {
      // 루트 노드를 animated로 감싸기
      return {
        id: `${cloned.id}-animated`,
        type: 'animated',
        props: {
          animation: {
            preset: animOption.preset,
            duration: animOption.duration ?? 500,
          },
          trigger: 'inView',
        },
        children: [cloned],
      }
    }
  }

  // 레이아웃 옵션 적용
  if (fillResult.selectedOptions?.layout && variant.options?.layouts) {
    const layoutOption = variant.options.layouts.find((l) => l.id === fillResult.selectedOptions?.layout)
    if (layoutOption) {
      applyLayoutProps(cloned, layoutOption.props)
    }
  }

  return cloned
}

/**
 * 레이아웃 props 적용 (재귀적으로 관련 노드 찾아서 적용)
 */
function applyLayoutProps(node: SkeletonNode, props: Record<string, unknown>): void {
  // 현재 노드의 props 병합
  if (node.props) {
    Object.assign(node.props, props)
  }

  // 자식 노드에도 적용 (특정 타입에만)
  if (node.children) {
    for (const child of node.children) {
      if (['gallery', 'carousel', 'masonry', 'grid'].includes(child.type)) {
        if (child.props) {
          Object.assign(child.props, props)
        } else {
          child.props = { ...props }
        }
      }
      applyLayoutProps(child, props)
    }
  }
}

/**
 * SkeletonNode를 PrimitiveNode로 변환 (토큰 해석)
 */
export function resolveNode(node: SkeletonNode, tokens: SemanticDesignTokens): PrimitiveNode {
  // tokenStyle을 실제 CSS로 변환
  const resolvedStyle: CSSProperties = {}

  // tokenStyle 처리
  if (node.tokenStyle) {
    for (const [key, value] of Object.entries(node.tokenStyle)) {
      if (typeof value === 'string' && value.startsWith('$token.')) {
        const resolved = resolveTokenRef(tokens, value)
        if (resolved !== undefined) {
          resolvedStyle[key] = resolved
        }
      } else if (value !== undefined) {
        resolvedStyle[key] = value as string | number
      }
    }
  }

  // 직접 style 병합
  if (node.style) {
    Object.assign(resolvedStyle, node.style)
  }

  // 자식 노드 재귀 처리
  const children = node.children?.map((child) => resolveNode(child, tokens))

  return {
    id: node.id,
    type: node.type,
    style: Object.keys(resolvedStyle).length > 0 ? resolvedStyle : undefined,
    props: node.props,
    children,
  }
}

/**
 * 토큰 참조를 CSS Variable로 변환 (빌드용)
 */
export function tokenRefToCssVar(value: string): string {
  if (!value.startsWith('$token.')) {
    return value
  }

  const path = value.replace('$token.', '')
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
    const propMap: Record<string, string> = {
      fontFamily: 'font-family',
      fontSize: 'font-size',
      fontWeight: 'font-weight',
      lineHeight: 'line-height',
      letterSpacing: 'letter-spacing',
    }
    return `var(--typo-${typoName}-${propMap[prop] ?? prop})`
  }

  if (parts[0] === 'spacing') {
    return `var(--spacing-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'borders') {
    const borderProp = parts[1]
    if (borderProp.startsWith('radius')) {
      const size = borderProp.replace('radius', '')
      return `var(--radius-${toKebabCase(size)})`
    }
  }

  if (parts[0] === 'shadows') {
    return `var(--shadow-${toKebabCase(parts[1])})`
  }

  if (parts[0] === 'animation') {
    const propMap: Record<string, string> = {
      durationFast: 'duration-fast',
      durationNormal: 'duration-normal',
      durationSlow: 'duration-slow',
      easing: 'easing-default',
      staggerDelay: 'stagger-delay',
    }
    return `var(--${propMap[parts[1]] ?? parts[1]})`
  }

  return value
}

/**
 * camelCase를 kebab-case로 변환
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 깊은 복사
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// ============================================
// Batch Resolver
// ============================================

/**
 * 여러 섹션을 한번에 해석
 */
export function resolveAllSections(
  fillResults: SectionFillResult[],
  tokens: SemanticDesignTokens
): SectionScreen[] {
  const screens: SectionScreen[] = []

  for (const result of fillResults) {
    const screen = resolveSkeletonToScreen(result.sectionType, tokens, result)
    if (screen) {
      screens.push(screen)
    }
  }

  return screens
}
