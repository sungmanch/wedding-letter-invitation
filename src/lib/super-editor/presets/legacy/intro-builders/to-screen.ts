/**
 * Legacy Intro Builder to Screen Adapter
 * PrimitiveNode 기반 인트로 빌더를 렌더링 가능한 형태로 변환
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { LegacyTemplatePreset } from '../types'
import type { IntroBuilderData, IntroBuilderResult } from './types'
import type { StyleSchema, StyleMood } from '../../../schema/style'
import type { SectionScreen, SkeletonNode } from '../../../skeletons/types'
import type { SemanticDesignTokens } from '../../../tokens/schema'
import type { IntroGenerationResult } from '../../../services/generation-service'

import { buildIntroFromPreset } from './index'
import { mapLegacyMood } from '../types'
import { resolveTokens } from '../../../tokens/resolver'
import { generateCssVariables } from '../../../tokens/css-generator'

/**
 * 레거시 인트로 빌드 결과
 */
export interface LegacyIntroResult {
  presetId: string
  presetName: string
  presetNameKo: string
  root: PrimitiveNode
  additionalStyles?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

/**
 * 레거시 프리셋을 인트로 결과로 변환
 */
export function buildLegacyIntro(
  preset: LegacyTemplatePreset,
  data: IntroBuilderData
): LegacyIntroResult {
  const result = buildIntroFromPreset(preset, data)

  return {
    presetId: preset.id,
    presetName: preset.name,
    presetNameKo: preset.nameKo,
    root: result.root,
    additionalStyles: result.additionalStyles,
    colors: {
      primary: preset.defaultColors.primary,
      secondary: preset.defaultColors.secondary,
      accent: preset.defaultColors.accent,
      background: preset.defaultColors.background,
      text: preset.defaultColors.text,
    },
  }
}

/**
 * 모든 레거시 프리셋의 미리보기 정보
 */
export interface LegacyPresetPreview {
  id: string
  name: string
  nameKo: string
  category: string
  description: string
  descriptionKo: string
  mood: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  introType: string
}

/**
 * 템플릿 선택용 프리셋 목록 가져오기
 */
export function getLegacyPresetPreviews(
  presets: Record<string, LegacyTemplatePreset>
): LegacyPresetPreview[] {
  return Object.values(presets).map((preset) => ({
    id: preset.id,
    name: preset.name,
    nameKo: preset.nameKo,
    category: preset.category,
    description: preset.description,
    descriptionKo: preset.descriptionKo,
    mood: preset.preview.mood,
    colors: {
      primary: preset.defaultColors.primary,
      secondary: preset.defaultColors.secondary,
      accent: preset.defaultColors.accent,
      background: preset.defaultColors.background,
    },
    introType: preset.intro.type,
  }))
}

// ============================================
// Legacy → IntroGenerationResult 변환
// ============================================

/**
 * PrimitiveNode를 SkeletonNode로 변환
 * PrimitiveNode는 이미 스타일이 resolve된 상태이므로 tokenStyle 없이 style만 사용
 */
function primitiveToSkeleton(node: PrimitiveNode): SkeletonNode {
  return {
    id: node.id,
    type: node.type,
    style: node.style as Record<string, string | number>,
    props: node.props,
    children: node.children?.map(primitiveToSkeleton),
  }
}

/**
 * 레거시 프리셋에서 StyleSchema 생성
 */
function createStyleSchemaFromPreset(preset: LegacyTemplatePreset): StyleSchema {
  const { defaultColors, defaultFonts } = preset
  const mood = mapLegacyMood(preset.preview.mood)

  return {
    version: '1.0',
    meta: {
      id: `legacy-${preset.id}`,
      name: preset.name,
      description: preset.description,
      mood: mood.length > 0 ? mood : ['elegant'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    theme: {
      colors: {
        primary: { 500: defaultColors.primary },
        neutral: { 500: defaultColors.textMuted || '#666666' },
        background: {
          default: defaultColors.background,
          paper: defaultColors.surface,
        },
        text: {
          primary: defaultColors.text,
          secondary: defaultColors.textMuted,
          muted: defaultColors.textMuted,
        },
        accent: { 500: defaultColors.accent },
        secondary: { 500: defaultColors.secondary },
      },
      typography: {
        fonts: {
          heading: {
            family: defaultFonts.title.family,
            googleFont: true,
          },
          body: {
            family: defaultFonts.body.family,
            googleFont: true,
          },
          accent: defaultFonts.accent
            ? { family: defaultFonts.accent.family, googleFont: true }
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
        },
        weights: {
          regular: defaultFonts.body.weight,
          bold: defaultFonts.title.weight,
        },
        lineHeights: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
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
        },
      },
      borders: {
        radius: {
          none: '0',
          sm: '0.125rem',
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
        color: defaultColors.textMuted || '#e5e5e5',
      },
      shadows: {
        none: 'none',
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)',
      },
      animation: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
          slower: 700,
        },
        easing: {
          default: 'ease',
          in: 'ease-in',
          out: 'ease-out',
          inOut: 'ease-in-out',
        },
        stagger: {
          delay: 100,
          from: 'start',
        },
      },
    },
    tokens: {},
    components: {},
  }
}

/**
 * LegacyIntroResult를 IntroGenerationResult로 변환
 * 이를 통해 레거시 템플릿도 AI 생성 결과와 동일한 방식으로 처리 가능
 */
export function convertLegacyToIntroResult(
  legacyResult: LegacyIntroResult,
  preset: LegacyTemplatePreset
): IntroGenerationResult {
  // StyleSchema 생성
  const style = createStyleSchemaFromPreset(preset)

  // 토큰 resolve
  const tokens = resolveTokens(style)
  const cssVariables = generateCssVariables(tokens)

  // PrimitiveNode → SkeletonNode 변환
  const skeletonRoot = primitiveToSkeleton(legacyResult.root)

  // SectionScreen 생성
  const introScreen: SectionScreen = {
    id: `intro-${preset.id}`,
    name: preset.nameKo,
    type: 'intro',
    sectionType: 'intro',
    root: skeletonRoot,
  }

  return {
    style,
    tokens,
    cssVariables,
    introScreen,
  }
}
