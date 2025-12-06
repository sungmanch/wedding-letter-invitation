/**
 * Super Editor - Design Pattern Extractor
 * Intro 섹션에서 디자인 패턴을 추출하여 다른 섹션에 참조로 제공
 */

import type { PrimitiveNode, AnimationPreset } from '../schema/primitives'
import type { SkeletonNode, SectionScreen } from '../skeletons/types'

// ============================================
// Design Patterns Type
// ============================================

export interface DesignPatterns {
  // 분위기
  mood: string[]

  // 타이포그래피 패턴
  typography: {
    heading: TypographyPattern
    subheading: TypographyPattern
    body: TypographyPattern
  }

  // 간격 패턴
  spacing: {
    sectionPadding: string
    elementGap: string
    containerMargin: string
  }

  // 애니메이션 패턴
  animation: {
    preferredPreset: AnimationPreset | 'none'
    duration: number
    easing: string
    usesStagger: boolean
  }

  // 컴포넌트 스타일 패턴
  components: {
    imageStyle: ComponentPattern
    buttonStyle: ComponentPattern
    containerStyle: ComponentPattern
  }

  // 색상 사용 패턴
  colorUsage: {
    hasBrandAccent: boolean
    usesGradient: boolean
    hasOverlay: boolean
  }
}

interface TypographyPattern {
  fontFamily?: string
  fontSize?: string
  fontWeight?: number
  lineHeight?: number
  textAlign?: string
}

interface ComponentPattern {
  borderRadius?: string
  boxShadow?: string
  backgroundColor?: string
}

// ============================================
// Pattern Extraction
// ============================================

/**
 * Screen에서 디자인 패턴 추출
 */
export function extractDesignPatterns(screen: SectionScreen): DesignPatterns {
  const patterns: DesignPatterns = {
    mood: [],
    typography: {
      heading: {},
      subheading: {},
      body: {},
    },
    spacing: {
      sectionPadding: '24px',
      elementGap: '16px',
      containerMargin: '0',
    },
    animation: {
      preferredPreset: 'fade-in',
      duration: 500,
      easing: 'ease-out',
      usesStagger: false,
    },
    components: {
      imageStyle: {},
      buttonStyle: {},
      containerStyle: {},
    },
    colorUsage: {
      hasBrandAccent: false,
      usesGradient: false,
      hasOverlay: false,
    },
  }

  // 노드 트리 순회하며 패턴 추출
  traverseNode(screen.root, patterns)

  return patterns
}

/**
 * SkeletonNode에서 디자인 패턴 추출
 */
export function extractPatternsFromSkeleton(node: SkeletonNode): DesignPatterns {
  const patterns: DesignPatterns = {
    mood: [],
    typography: {
      heading: {},
      subheading: {},
      body: {},
    },
    spacing: {
      sectionPadding: '24px',
      elementGap: '16px',
      containerMargin: '0',
    },
    animation: {
      preferredPreset: 'fade-in',
      duration: 500,
      easing: 'ease-out',
      usesStagger: false,
    },
    components: {
      imageStyle: {},
      buttonStyle: {},
      containerStyle: {},
    },
    colorUsage: {
      hasBrandAccent: false,
      usesGradient: false,
      hasOverlay: false,
    },
  }

  traverseSkeletonNode(node, patterns)

  return patterns
}

/**
 * 노드 트리 순회
 */
function traverseNode(node: PrimitiveNode | SkeletonNode, patterns: DesignPatterns): void {
  const style = node.style ?? {}
  const tokenStyle = 'tokenStyle' in node ? node.tokenStyle ?? {} : {}

  // 타이포그래피 패턴 추출
  if (node.type === 'text') {
    const props = node.props as { as?: string; content?: string } | undefined
    const as = props?.as ?? 'p'

    if (as === 'h1' || as === 'h2') {
      patterns.typography.heading = extractTypographyFromStyle(style, tokenStyle)
    } else if (as === 'h3' || as === 'h4') {
      patterns.typography.subheading = extractTypographyFromStyle(style, tokenStyle)
    } else {
      patterns.typography.body = extractTypographyFromStyle(style, tokenStyle)
    }
  }

  // 간격 패턴 추출
  if (node.type === 'container' || node.type === 'column' || node.type === 'row') {
    if (style.padding || tokenStyle.padding) {
      patterns.spacing.sectionPadding = String(style.padding ?? tokenStyle.padding ?? '24px')
    }
    if (style.gap || tokenStyle.gap) {
      patterns.spacing.elementGap = String(style.gap ?? tokenStyle.gap ?? '16px')
    }
  }

  // 이미지 스타일 패턴 추출
  if (node.type === 'image') {
    patterns.components.imageStyle = {
      borderRadius: String(style.borderRadius ?? tokenStyle.borderRadius ?? ''),
      boxShadow: String(style.boxShadow ?? tokenStyle.boxShadow ?? ''),
    }
  }

  // 버튼 스타일 패턴 추출
  if (node.type === 'button') {
    patterns.components.buttonStyle = {
      borderRadius: String(style.borderRadius ?? tokenStyle.borderRadius ?? ''),
      backgroundColor: String(style.backgroundColor ?? tokenStyle.backgroundColor ?? ''),
    }
  }

  // 애니메이션 패턴 추출
  if (node.type === 'animated' || node.type === 'scroll-trigger') {
    const props = node.props as { animation?: { preset?: AnimationPreset; duration?: number } } | undefined
    if (props?.animation?.preset) {
      patterns.animation.preferredPreset = props.animation.preset
    }
    if (props?.animation?.duration) {
      patterns.animation.duration = props.animation.duration
    }
  }

  // 색상 사용 패턴
  const bgColor = String(style.backgroundColor ?? tokenStyle.backgroundColor ?? '')
  if (bgColor.includes('$token.colors.brand') || bgColor.includes('var(--color-brand)')) {
    patterns.colorUsage.hasBrandAccent = true
  }
  if (bgColor.includes('gradient')) {
    patterns.colorUsage.usesGradient = true
  }

  // 오버레이 감지
  if (node.type === 'overlay') {
    patterns.colorUsage.hasOverlay = true
  }

  // 자식 노드 순회
  if (node.children) {
    for (const child of node.children) {
      traverseNode(child as PrimitiveNode, patterns)
    }
  }
}

/**
 * SkeletonNode 트리 순회
 */
function traverseSkeletonNode(node: SkeletonNode, patterns: DesignPatterns): void {
  traverseNode(node as unknown as PrimitiveNode, patterns)
}

/**
 * 스타일에서 타이포그래피 패턴 추출
 */
function extractTypographyFromStyle(
  style: Record<string, string | number>,
  tokenStyle: Record<string, unknown>
): TypographyPattern {
  return {
    fontFamily: String(style.fontFamily ?? tokenStyle.fontFamily ?? ''),
    fontSize: String(style.fontSize ?? tokenStyle.fontSize ?? ''),
    fontWeight: Number(style.fontWeight ?? tokenStyle.fontWeight ?? 400),
    lineHeight: Number(style.lineHeight ?? tokenStyle.lineHeight ?? 1.5),
    textAlign: String(style.textAlign ?? ''),
  }
}

// ============================================
// Pattern Serialization
// ============================================

/**
 * 디자인 패턴을 AI 프롬프트용 문자열로 변환
 */
export function patternsToPromptContext(patterns: DesignPatterns): string {
  const lines: string[] = []

  lines.push('# 참조 디자인 패턴')
  lines.push('')

  // 분위기
  if (patterns.mood.length > 0) {
    lines.push(`분위기: ${patterns.mood.join(', ')}`)
  }

  // 애니메이션
  lines.push(`선호 애니메이션: ${patterns.animation.preferredPreset}`)
  lines.push(`애니메이션 지속시간: ${patterns.animation.duration}ms`)

  // 색상 사용
  if (patterns.colorUsage.hasBrandAccent) {
    lines.push('브랜드 색상 강조 사용')
  }
  if (patterns.colorUsage.usesGradient) {
    lines.push('그라데이션 사용')
  }
  if (patterns.colorUsage.hasOverlay) {
    lines.push('오버레이 사용')
  }

  return lines.join('\n')
}

/**
 * 두 패턴의 일관성 점수 계산 (0-100)
 */
export function calculatePatternConsistency(pattern1: DesignPatterns, pattern2: DesignPatterns): number {
  let score = 0
  let total = 0

  // 애니메이션 일관성
  total += 30
  if (pattern1.animation.preferredPreset === pattern2.animation.preferredPreset) {
    score += 30
  } else if (
    pattern1.animation.preferredPreset.includes('fade') &&
    pattern2.animation.preferredPreset.includes('fade')
  ) {
    score += 20
  }

  // 색상 사용 일관성
  total += 30
  if (pattern1.colorUsage.hasBrandAccent === pattern2.colorUsage.hasBrandAccent) {
    score += 15
  }
  if (pattern1.colorUsage.usesGradient === pattern2.colorUsage.usesGradient) {
    score += 15
  }

  // 간격 일관성 (대략적 비교)
  total += 40
  const padding1 = parseInt(pattern1.spacing.sectionPadding)
  const padding2 = parseInt(pattern2.spacing.sectionPadding)
  if (!isNaN(padding1) && !isNaN(padding2)) {
    const diff = Math.abs(padding1 - padding2)
    if (diff <= 4) score += 20
    else if (diff <= 8) score += 10
  }

  const gap1 = parseInt(pattern1.spacing.elementGap)
  const gap2 = parseInt(pattern2.spacing.elementGap)
  if (!isNaN(gap1) && !isNaN(gap2)) {
    const diff = Math.abs(gap1 - gap2)
    if (diff <= 4) score += 20
    else if (diff <= 8) score += 10
  }

  return Math.round((score / total) * 100)
}
