/**
 * Super Editor - Generation Service
 * 2단계 AI 생성 파이프라인
 */

import type { StyleSchema } from '../schema/style'
import type { LayoutSchema, LayoutCategory } from '../schema/layout'
import type { SemanticDesignTokens } from '../tokens/schema'
import type { SectionType, SectionFillResult, SectionScreen } from '../skeletons/types'
import type { FillerResponse } from '../prompts/filler-prompt'
import type { DesignPatterns } from '../utils/design-pattern-extractor'
import type { VariableDeclaration, VariablesSchema } from '../schema/variables'

import { resolveTokens } from '../tokens/resolver'
import { generateCssVariables } from '../tokens/css-generator'
import {
  getSkeleton,
  getDefaultVariant,
  getAllSectionTypes,
  DEFAULT_SECTION_ORDER,
} from '../skeletons/registry'
import { resolveSkeletonToScreen, resolveAllSections } from '../builder/skeleton-resolver'
import { extractPatternsFromSkeleton, patternsToPromptContext } from '../utils/design-pattern-extractor'
import { buildFillerPrompt, variantToSummary } from '../prompts/filler-prompt'
import { getMoodVariantHints } from '../prompts/prompt-hints'

// ============================================
// Generation Result
// ============================================

export interface GenerationResult {
  style: StyleSchema
  tokens: SemanticDesignTokens
  cssVariables: string
  layout: LayoutSchema
  screens: SectionScreen[]
  /** 변수 선언 (커스텀 변수 포함) */
  variables?: VariablesSchema
}

// ============================================
// Generation Options
// ============================================

export interface GenerationOptions {
  // 사용자 스타일 요청
  prompt: string
  // 분위기 키워드
  mood?: string[]
  // 활성화할 섹션 (기본: 모두)
  enabledSections?: SectionType[]
  // 섹션 순서 (intro 제외)
  sectionOrder?: SectionType[]
  // 기존 스타일 (수정 모드)
  existingStyle?: StyleSchema
}

// ============================================
// AI Call Interface (외부 주입)
// ============================================

export interface AIProvider {
  generateStyle(prompt: string, mood?: string[]): Promise<StyleSchema>
  selectVariants(prompt: string, systemPrompt: string): Promise<FillerResponse>
}

// ============================================
// Generation Pipeline
// ============================================

/**
 * 전체 템플릿 생성 파이프라인
 */
export async function generateFullTemplate(
  options: GenerationOptions,
  aiProvider: AIProvider
): Promise<GenerationResult> {
  const { prompt, mood, enabledSections, sectionOrder } = options

  // ========================================
  // Stage 1: StyleSchema + Tokens 생성
  // ========================================
  const style = options.existingStyle ?? (await aiProvider.generateStyle(prompt, mood))
  const tokens = resolveTokens(style)
  const cssVariables = generateCssVariables(tokens)

  // ========================================
  // Stage 2: Intro 섹션 생성 (순차)
  // ========================================
  const introResult = await generateIntroSection(prompt, mood, tokens, aiProvider)
  const introScreen = resolveSkeletonToScreen('intro', tokens, introResult)

  // 디자인 패턴 추출
  let patterns: DesignPatterns | undefined
  if (introScreen) {
    const introSkeleton = getSkeleton('intro')
    const variant = introSkeleton?.variants.find((v) => v.id === introResult.variantId)
    if (variant) {
      const extractedPatterns = extractPatternsFromSkeleton(variant.structure)
      extractedPatterns.mood = mood ?? []
      patterns = extractedPatterns
    }
  }

  // ========================================
  // Stage 3: 나머지 섹션 병렬 생성
  // ========================================
  const sectionsToGenerate = (sectionOrder ?? DEFAULT_SECTION_ORDER).filter(
    (type) => !enabledSections || enabledSections.includes(type)
  )

  const sectionResults = await generateSectionsInParallel(
    sectionsToGenerate,
    prompt,
    mood,
    patterns,
    aiProvider
  )

  // ========================================
  // Stage 4: Screen 해석 및 병합
  // ========================================
  const sectionScreens = resolveAllSections(sectionResults, tokens)

  const allScreens: SectionScreen[] = []
  if (introScreen) {
    allScreens.push(introScreen)
  }
  allScreens.push(...sectionScreens)

  // Music 섹션 추가 (활성화된 경우)
  if (!enabledSections || enabledSections.includes('music')) {
    const musicResult = await generateMusicSection(prompt, mood, aiProvider)
    const musicScreen = resolveSkeletonToScreen('music', tokens, musicResult)
    if (musicScreen) {
      allScreens.push(musicScreen)
    }
  }

  // ========================================
  // Stage 5: LayoutSchema 구성
  // ========================================
  const layout: LayoutSchema = {
    version: '1.0',
    meta: {
      id: `layout-${Date.now()}`,
      name: '생성된 청첩장',
      category: 'scroll' as LayoutCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    screens: allScreens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      type: screen.type,
      sectionType: screen.sectionType,
      root: screen.root,
    })),
  }

  return {
    style,
    tokens,
    cssVariables,
    layout,
    screens: allScreens,
    // TODO: AI 응답에서 customVariables 수집 시 채우기
    variables: { declarations: [] },
  }
}

// ============================================
// Stage Functions
// ============================================

/**
 * Intro 섹션 생성
 */
async function generateIntroSection(
  prompt: string,
  mood: string[] | undefined,
  tokens: SemanticDesignTokens,
  aiProvider: AIProvider
): Promise<SectionFillResult> {
  const introSkeleton = getSkeleton('intro')
  if (!introSkeleton) {
    return { sectionType: 'intro', variantId: 'elegant' }
  }

  // AI에 variant 선택 요청
  const variantHints = getMoodVariantHints(mood ?? [])
  const fillerPrompt = buildFillerPrompt({
    prompt,
    mood,
    sections: [
      {
        sectionType: 'intro',
        variants: introSkeleton.variants.map(variantToSummary),
      },
    ],
    tokens,
    variantHints,
  })

  try {
    const response = await aiProvider.selectVariants(prompt, fillerPrompt)
    const introSelection = response.sections.find((s) => s.sectionType === 'intro')

    return (
      introSelection ?? {
        sectionType: 'intro',
        variantId: introSkeleton.defaultVariant,
      }
    )
  } catch {
    // 폴백: 기본 variant 사용
    return {
      sectionType: 'intro',
      variantId: introSkeleton.defaultVariant,
    }
  }
}

/**
 * 여러 섹션 병렬 생성
 */
async function generateSectionsInParallel(
  sectionTypes: SectionType[],
  prompt: string,
  mood: string[] | undefined,
  patterns: DesignPatterns | undefined,
  aiProvider: AIProvider
): Promise<SectionFillResult[]> {
  // 섹션 정보 수집
  const sectionsInfo = sectionTypes
    .map((type) => {
      const skeleton = getSkeleton(type)
      if (!skeleton) return null
      return {
        sectionType: type,
        variants: skeleton.variants.map(variantToSummary),
      }
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)

  if (sectionsInfo.length === 0) {
    return []
  }

  // 전체 섹션에 대해 한 번의 AI 호출
  const variantHints = getMoodVariantHints(mood ?? [])
  const fillerPrompt = buildFillerPrompt({
    prompt,
    mood,
    sections: sectionsInfo,
    referencePatterns: patterns,
    variantHints,
  })

  try {
    const response = await aiProvider.selectVariants(prompt, fillerPrompt)
    return response.sections
  } catch {
    // 폴백: 기본 variant 사용
    return sectionTypes.map((type) => ({
      sectionType: type,
      variantId: getDefaultVariant(type)?.id ?? 'default',
    }))
  }
}

/**
 * Music 섹션 생성 (별도 처리)
 */
async function generateMusicSection(
  prompt: string,
  mood: string[] | undefined,
  aiProvider: AIProvider
): Promise<SectionFillResult> {
  const musicSkeleton = getSkeleton('music')
  if (!musicSkeleton) {
    return { sectionType: 'music', variantId: 'fab' }
  }

  // 간단히 기본 variant 사용 (music은 구조가 단순)
  return {
    sectionType: 'music',
    variantId: musicSkeleton.defaultVariant,
    selectedOptions: {
      layout: 'bottom-right',
    },
  }
}

// ============================================
// Intro-Only Generation (Stage 1)
// ============================================

/**
 * Stage 1 결과: Style + Intro만 포함
 */
export interface IntroGenerationResult {
  style: StyleSchema
  tokens: SemanticDesignTokens
  cssVariables: string
  introScreen: SectionScreen
}

/**
 * Stage 1: Style + Intro만 생성
 * 채팅을 통해 인트로를 완성한 후 나머지 섹션은 기본값으로 채움
 */
export async function generateIntroOnly(
  options: GenerationOptions,
  aiProvider: AIProvider
): Promise<IntroGenerationResult> {
  const { prompt, mood } = options

  // Style 생성
  const style = options.existingStyle ?? (await aiProvider.generateStyle(prompt, mood))
  const tokens = resolveTokens(style)
  const cssVariables = generateCssVariables(tokens)

  // Intro 섹션만 생성
  const introResult = await generateIntroSection(prompt, mood, tokens, aiProvider)
  const introScreen = resolveSkeletonToScreen('intro', tokens, introResult)

  if (!introScreen) {
    throw new Error('Intro 섹션 생성에 실패했습니다')
  }

  return {
    style,
    tokens,
    cssVariables,
    introScreen,
  }
}

/**
 * Stage 2: Intro 결과에 기본 섹션들을 추가하여 전체 템플릿 완성
 */
export function completeTemplateWithDefaults(
  introResult: IntroGenerationResult,
  enabledSections?: SectionType[]
): GenerationResult {
  const { style, tokens, cssVariables, introScreen } = introResult

  // 기본 섹션들 생성 (intro 제외)
  const sectionTypes = (enabledSections ?? DEFAULT_SECTION_ORDER).filter(
    (type) => type !== 'intro'
  )

  const screens: SectionScreen[] = [introScreen]

  for (const type of sectionTypes) {
    const defaultVariant = getDefaultVariant(type)
    if (!defaultVariant) continue

    const screen = resolveSkeletonToScreen(type, tokens, {
      sectionType: type,
      variantId: defaultVariant.id,
    })

    if (screen) {
      screens.push(screen)
    }
  }

  // Music 섹션 추가
  const musicVariant = getDefaultVariant('music')
  if (musicVariant) {
    const musicScreen = resolveSkeletonToScreen('music', tokens, {
      sectionType: 'music',
      variantId: musicVariant.id,
    })
    if (musicScreen) {
      screens.push(musicScreen)
    }
  }

  const layout: LayoutSchema = {
    version: '1.0',
    meta: {
      id: `layout-${Date.now()}`,
      name: '생성된 청첩장',
      category: 'scroll' as LayoutCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    screens: screens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      type: screen.type,
      sectionType: screen.sectionType,
      root: screen.root,
    })),
  }

  return {
    style,
    tokens,
    cssVariables,
    layout,
    screens,
  }
}

// ============================================
// Quick Generation (폴백용)
// ============================================

/**
 * AI 없이 기본 스켈레톤으로 빠른 생성
 */
export function generateQuickTemplate(
  style: StyleSchema,
  enabledSections?: SectionType[]
): GenerationResult {
  const tokens = resolveTokens(style)
  const cssVariables = generateCssVariables(tokens)

  const sectionTypes = enabledSections ?? getAllSectionTypes()
  const screens: SectionScreen[] = []

  for (const type of sectionTypes) {
    const defaultVariant = getDefaultVariant(type)
    if (!defaultVariant) continue

    const screen = resolveSkeletonToScreen(type, tokens, {
      sectionType: type,
      variantId: defaultVariant.id,
    })

    if (screen) {
      screens.push(screen)
    }
  }

  const layout: LayoutSchema = {
    version: '1.0',
    meta: {
      id: `layout-${Date.now()}`,
      name: '기본 청첩장',
      category: 'scroll' as LayoutCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    screens: screens.map((screen) => ({
      id: screen.id,
      name: screen.name,
      type: screen.type,
      sectionType: screen.sectionType,
      root: screen.root,
    })),
  }

  return {
    style,
    tokens,
    cssVariables,
    layout,
    screens,
  }
}
