/**
 * Template Applier Service
 *
 * 선택된 템플릿의 디자인 패턴을 새 문서에 적용합니다.
 * - 인트로 블록을 템플릿 패턴으로 재구성
 * - 전역 스타일 시스템 생성
 * - 다른 섹션들에 일관된 색상 적용
 */

import { getTemplateById } from '../config/template-catalog'
import { getTemplateV2ById, isTemplateV2Available } from '../config/template-catalog-v2'
import type { TemplateMetadata } from '../schema/template-metadata'
import type { EditorDocument, Block, StyleSystem, WeddingData, DocumentMeta, ThemePresetId } from '../schema/types'
import { buildBlocksFromTemplate } from './template-block-builder'

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
): { style: StyleSystem; blocks: Block[]; meta: DocumentMeta } {
  // ✅ v2 템플릿이 있으면 우선 사용
  if (isTemplateV2Available(templateId)) {
    return applyTemplateV2ToDocument(templateId, document)
  }

  // ✅ v1 템플릿 (기존 색상만 적용)
  const template = getTemplateById(templateId)

  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }

  console.log(`[Template Applier] 🎨 Applying template v1 "${template.name}" (${templateId})`)
  console.log('[Template Applier] Template details:', {
    mood: template.mood.join(', '),
    colorTheme: template.designPattern.colorTheme,
    stylePreset: template.designPattern.stylePreset,
    primary: template.designPattern.colorPalette.primary,
    secondary: template.designPattern.colorPalette.secondary,
    tertiary: template.designPattern.colorPalette.tertiary,
  })

  // 1. 전역 스타일 시스템 생성
  const style = buildStyleSystemFromTemplate(template, document.style)

  console.log('[Template Applier] Style system created:', {
    preset: style.preset,
    dominantColor: style.quick?.dominantColor,
    accentColor: style.quick?.accentColor,
    mood: style.quick?.mood,
  })

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

  // 3. ✅ 메타데이터 업데이트
  const meta: DocumentMeta = {
    ...document.meta,
    templateId,
    templateVersion: 1,
  }

  console.log(`[Template Applier] ✅ Applied colors to ${blocks.length} blocks`)

  return { style, blocks, meta }
}

/**
 * ✅ 템플릿 v2를 문서에 적용 (Block 구조 전체 교체)
 *
 * @param templateId 템플릿 ID (unique1~6)
 * @param document 적용할 문서
 * @returns 수정된 스타일 시스템과 블록들
 */
function applyTemplateV2ToDocument(
  templateId: string,
  document: EditorDocument
): { style: StyleSystem; blocks: Block[]; meta: DocumentMeta } {
  const template = getTemplateV2ById(templateId)

  if (!template) {
    throw new Error(`Template v2 not found: ${templateId}`)
  }

  console.log(`[Template Applier] 🎨 Applying template v2 "${template.name}" (${templateId})`)
  console.log('[Template Applier] Template v2 details:', {
    presets: Object.keys(template.defaultPresets).length,
    editableFields: Object.keys(template.editableFields).length,
    colorTheme: template.designPattern.colorTheme,
    stylePreset: template.designPattern.stylePreset,
  })

  // 1. 전역 스타일 시스템 생성
  const style = buildStyleSystemFromTemplate(template, document.style)

  console.log('[Template Applier] Style system created:', {
    preset: style.preset,
    dominantColor: style.quick?.dominantColor,
    accentColor: style.quick?.accentColor,
    mood: style.quick?.mood,
  })

  // 2. ✅ 템플릿 Block 구조로 전체 교체
  const blocks = buildBlocksFromTemplate(template, document.data)

  console.log(`[Template Applier] ✅ Built ${blocks.length} blocks from template v2`)
  console.log('[Template Applier] Block types:', blocks.map((b) => b.type).join(', '))

  // 3. ✅ 메타데이터 업데이트
  const meta: DocumentMeta = {
    ...document.meta,
    templateId,
    templateVersion: 2,
  }

  return { style, blocks, meta }
}

// ============================================
// Style System Builder
// ============================================

/**
 * 템플릿으로부터 전역 스타일 시스템 생성
 */
export function buildStyleSystemFromTemplate(
  template: TemplateMetadata,
  currentStyle: StyleSystem
): StyleSystem {
  const { designPattern } = template

  // 스타일 프리셋 추론 (레거시 프리셋 → 새 프리셋 매핑)
  const preset = mapToThemePresetId(designPattern.stylePreset) || inferStylePreset(template)

  // Quick 스타일 (Primary/Secondary/Tertiary 컬러 적용)
  // - dominantColor: 배경색 (secondary - 밝은 색)
  // - accentColor: 강조색 (tertiary)
  const quick = {
    dominantColor: designPattern.colorPalette.secondary[0],
    accentColor: designPattern.colorPalette.tertiary[0],
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
 * 레거시 stylePreset을 ThemePresetId로 매핑
 */
function mapToThemePresetId(
  stylePreset?: string
): ThemePresetId | undefined {
  if (!stylePreset) return undefined

  const mapping: Record<string, ThemePresetId> = {
    'minimal-light': 'minimal-light',
    'minimal-dark': 'modern-mono', // minimal-dark가 제거되어 modern-mono로 대체
    'classic-serif': 'classic-ivory',
    'modern-sans': 'modern-mono',
    'romantic-script': 'romantic-blush',
    'nature-organic': 'romantic-garden',
  }

  return mapping[stylePreset]
}

/**
 * 템플릿으로부터 스타일 프리셋 추론
 */
function inferStylePreset(
  template: TemplateMetadata
): NonNullable<StyleSystem['preset']> {
  const { mood, designPattern } = template

  // Dark theme (minimal-dark가 제거되어 modern-mono로 대체)
  if (designPattern.colorTheme === 'dark') {
    if (mood.includes('romantic')) return 'romantic-blush'
    return 'modern-mono'
  }

  // Light theme
  if (mood.includes('minimal') || mood.includes('modern')) {
    return 'minimal-light'
  }

  if (mood.includes('elegant') || mood.includes('classic')) {
    return 'classic-ivory'
  }

  if (mood.includes('romantic')) {
    return 'romantic-blush'
  }

  if (mood.includes('nature') || mood.includes('warm')) {
    return 'romantic-garden' // cinematic-warm이 제거되어 romantic-garden으로 대체
  }

  // Default
  return 'minimal-light'
}

/**
 * 템플릿으로부터 mood 추론
 * QuickStyleConfig.mood는 'warm' | 'cool' | 'neutral' 만 허용
 */
function inferMoodFromTemplate(
  template: TemplateMetadata
): NonNullable<StyleSystem['quick']>['mood'] {
  const { mood } = template

  // warm 계열
  if (mood.includes('warm') || mood.includes('romantic') || mood.includes('nature')) {
    return 'warm'
  }

  // cool 계열
  if (mood.includes('minimal') || mood.includes('modern') || mood.includes('cool')) {
    return 'cool'
  }

  // neutral (default)
  return 'neutral'
}

// ============================================
// Block Color Application
// ============================================

/**
 * 블록에 템플릿 색상 적용 (개선 버전)
 *
 * Primary/Secondary/Tertiary 컬러 시스템 적용:
 * - Primary: 메인 텍스트, 강조 요소
 * - Secondary: 배경, 카드 surface
 * - Tertiary: 하이라이트, 버튼, 링크
 *
 * ✅ 변경: 모든 블록에 일관된 색상 적용 (hero 포함)
 */
function applyTemplateColorsToBlock(
  block: Block,
  template: TemplateMetadata
): Block {
  const { colorPalette } = template.designPattern

  // ✅ 모든 블록에 Secondary 배경 적용 (일관성 강화)
  const backgroundColor = colorPalette.secondary[0] // 가장 밝은 색상

  // 텍스트 색상: Primary (진한 톤) 사용
  const textColor = colorPalette.primary[0] // 가장 진한 색상

  // 강조 색상: Tertiary (중간 톤) 사용
  const accentColor = colorPalette.tertiary[0]

  // 블록 스타일 오버라이드 (background는 { color } 형태로 설정)
  const blockStyle = {
    ...block.style,
    background: { color: backgroundColor },
  }

  // 요소별 색상 적용
  const elements: typeof block.elements = block.elements.map((element) => {
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
          background: colorPalette.tertiary[1], // 버튼 배경은 Tertiary 2번째 색상
        },
      }
    }

    if (element.type === 'divider') {
      const existingBorder = element.style?.border
      return {
        ...element,
        style: {
          ...element.style,
          border: {
            width: existingBorder?.width ?? 1,
            style: existingBorder?.style ?? 'solid',
            radius: existingBorder?.radius ?? 0,
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
