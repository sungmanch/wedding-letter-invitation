/**
 * Template Applier Service
 *
 * 선택된 템플릿의 디자인 패턴을 새 문서에 적용합니다.
 * - 인트로 블록을 템플릿 패턴으로 재구성
 * - 전역 스타일 시스템 생성
 * - 다른 섹션들에 일관된 색상 적용
 */

import { getTemplateById } from '../config/template-catalog'
import type { TemplateMetadata } from '../schema/template-metadata'
import type { EditorDocument, Block, StyleSystem, WeddingData } from '../schema/types'

// ============================================
// Main Application Function
// ============================================

/**
 * 템플릿을 문서에 적용
 *
 * @param templateId 템플릿 ID (unique1~6)
 * @param document 적용할 문서
 * @returns 수정된 스타일 시스템과 블록들
 */
export function applyTemplateToDocument(
  templateId: string,
  document: EditorDocument
): { style: StyleSystem; blocks: Block[] } {
  const template = getTemplateById(templateId)

  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }

  // 1. 전역 스타일 시스템 생성
  const style = buildStyleSystemFromTemplate(template, document.style)

  // 2. 블록별 색상 적용
  const blocks = document.blocks.map((block) => {
    if (block.type === 'hero') {
      // 히어로 블록은 템플릿 패턴 그대로 유지 (추후 intro-block-builder 통합 시)
      return applyTemplateColorsToBlock(block, template)
    } else {
      // 다른 섹션은 색상만 적용
      return applyTemplateColorsToBlock(block, template)
    }
  })

  return { style, blocks }
}

// ============================================
// Style System Builder
// ============================================

/**
 * 템플릿으로부터 전역 스타일 시스템 생성
 */
function buildStyleSystemFromTemplate(
  template: TemplateMetadata,
  currentStyle: StyleSystem
): StyleSystem {
  const { designPattern } = template

  // 스타일 프리셋 추론
  const preset = designPattern.stylePreset || inferStylePreset(template)

  // Quick 스타일 (Primary/Secondary/Tertiary 컬러 적용)
  const quick = {
    dominantColor: designPattern.colorPalette.primary[0],
    accentColor: designPattern.colorPalette.primary[1] || designPattern.colorPalette.tertiary[0],
    mood: inferMoodFromTemplate(template),
  }

  // 기존 스타일을 기반으로 오버라이드
  return {
    ...currentStyle,
    preset,
    quick,
    // typography, effects는 기존 설정 유지 (또는 프리셋에서 자동 적용)
  }
}

/**
 * 템플릿으로부터 스타일 프리셋 추론
 */
function inferStylePreset(
  template: TemplateMetadata
): NonNullable<StyleSystem['preset']> {
  const { mood, designPattern } = template

  // Dark theme
  if (designPattern.colorTheme === 'dark') {
    if (mood.includes('romantic')) return 'romantic-blush'
    return 'minimal-dark'
  }

  // Light theme
  if (mood.includes('minimal') || mood.includes('modern')) {
    return 'minimal-light'
  }

  if (mood.includes('elegant') || mood.includes('classic')) {
    return 'classic-serif'
  }

  if (mood.includes('romantic')) {
    return 'romantic-script'
  }

  if (mood.includes('nature') || mood.includes('warm')) {
    return 'nature-organic'
  }

  // Default
  return 'minimal-light'
}

/**
 * 템플릿으로부터 mood 추론
 */
function inferMoodFromTemplate(
  template: TemplateMetadata
): NonNullable<StyleSystem['quick']>['mood'] {
  const { mood } = template

  if (mood.includes('minimal') || mood.includes('modern')) return 'minimal'
  if (mood.includes('romantic')) return 'romantic'
  if (mood.includes('elegant') || mood.includes('classic')) return 'elegant'
  if (mood.includes('warm') || mood.includes('nature')) return 'warm'
  if (mood.includes('playful') || mood.includes('casual')) return 'playful'

  return 'elegant' // Default
}

// ============================================
// Block Color Application
// ============================================

/**
 * 블록에 템플릿 색상 적용
 *
 * Primary/Secondary/Tertiary 컬러 시스템 적용:
 * - Primary: 메인 텍스트, 강조 요소
 * - Secondary: 배경, 카드 surface
 * - Tertiary: 하이라이트, 버튼, 링크
 */
function applyTemplateColorsToBlock(
  block: Block,
  template: TemplateMetadata
): Block {
  const { colorPalette } = template.designPattern

  // 블록 타입에 따라 배경색 선택
  const shouldUseSurface = [
    'greeting',
    'gallery',
    'location',
    'venue',
    'account',
    'parents',
    'contact',
    'guestbook',
    'message',
  ].includes(block.type)

  // 배경색: Secondary (밝은 톤) 사용
  const backgroundColor = shouldUseSurface
    ? colorPalette.secondary[0] // 가장 밝은 색상
    : '#FFFFFF' // 기본 흰색

  // 텍스트 색상: Primary (진한 톤) 사용
  const textColor = colorPalette.primary[0] // 가장 진한 색상

  // 강조 색상: Tertiary (중간 톤) 사용
  const accentColor = colorPalette.tertiary[0]

  // 블록 스타일 오버라이드
  const blockStyle = {
    ...block.style,
    background: {
      ...block.style?.background,
      color: backgroundColor,
    },
  }

  // 요소별 색상 적용
  const elements = block.elements.map((element) => {
    if (element.type === 'text') {
      return {
        ...element,
        style: {
          ...element.style,
          text: {
            ...element.style?.text,
            color: textColor,
          },
        },
      }
    }

    if (element.type === 'button' || element.type === 'icon') {
      return {
        ...element,
        style: {
          ...element.style,
          text: {
            ...element.style?.text,
            color: accentColor,
          },
          background: {
            ...element.style?.background,
            color: colorPalette.tertiary[1], // 버튼 배경은 Tertiary 2번째 색상
          },
        },
      }
    }

    if (element.type === 'divider') {
      return {
        ...element,
        style: {
          ...element.style,
          border: {
            ...element.style?.border,
            color: colorPalette.tertiary[2], // Divider는 Tertiary 3번째 색상
          },
        },
      }
    }

    if (element.type === 'shape') {
      return {
        ...element,
        props: {
          ...element.props,
          fill: accentColor,
        },
      }
    }

    return element
  })

  return {
    ...block,
    style: blockStyle,
    elements,
  }
}

// ============================================
// Intro Block Builder (Future Integration)
// ============================================

/**
 * 템플릿으로부터 인트로 블록 생성
 *
 * TODO: intro-block-builder와 통합 필요
 * 현재는 색상만 적용, 추후 레이아웃/구조도 템플릿 패턴 적용
 */
export function buildIntroFromTemplate(
  template: TemplateMetadata,
  data: WeddingData
): Block {
  // 임시 구현: 기본 히어로 블록 반환
  // TODO: intro-block-builder.ts의 buildIntroFromComposition 활용
  const { designPattern } = template

  return {
    id: 'hero',
    type: 'hero',
    enabled: true,
    height: 100, // vh
    elements: [
      // TODO: 템플릿 패턴에 따라 요소 배치
      // - imageLayout: 'centered' → 중앙 이미지
      // - textLayout: 'below-image' → 이미지 아래 텍스트
      // - colorTheme: 'light' → 밝은 배경
    ],
    style: {
      background: {
        color: designPattern.colorPalette.secondary[0],
      },
    },
  }
}

/**
 * Typography 스타일 추론
 */
function inferTextStyle(typography: string): 'elegant' | 'modern' | 'editorial' {
  if (['script', 'handwritten'].includes(typography)) return 'elegant'
  if (typography === 'display') return 'editorial'
  return 'modern'
}

/**
 * Decorations 추론
 */
function inferDecorations(template: TemplateMetadata): string[] {
  if (template.designPattern.colorTheme === 'overlay') {
    return ['label-text', 'divider-line']
  }
  if (template.mood.includes('elegant')) {
    return ['divider-line']
  }
  return ['none']
}
