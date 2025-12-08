/**
 * Legacy Preset Converter
 * 레거시 프리셋을 LayoutSchema + StyleSchema로 변환
 *
 * NOTE: 프로덕션 번들링(Webpack/Turbopack)에서 클로저/호이스팅 문제를 방지하기 위해
 * 1. 모든 헬퍼 함수는 사용되기 전에 정의
 * 2. .map() 대신 for 루프 사용하여 클로저 의존성 제거
 */

import type { LayoutSchema, Screen, LayoutCategory } from '../../../schema/layout'
import type { StyleSchema } from '../../../schema/style'
import type { SectionType } from '../../../schema/section-types'
import type { PredefinedTemplatePreset, LegacySectionDefinition } from '../types'
import type { ConvertOptions, ConvertResult } from './types'
import { LEGACY_TO_SE_SECTION_TYPE } from './types'
import { buildSection } from './section-builders'
import { convertToStyleSchema } from './style-converter'
import { getPredefinedPreset } from '../index'

// ============================================
// Helpers (반드시 사용하는 함수보다 먼저 정의)
// ============================================

/**
 * 레거시 섹션 타입을 Super Editor 섹션 타입으로 매핑
 */
function mapToSectionType(legacyType: string): SectionType | undefined {
  return LEGACY_TO_SE_SECTION_TYPE[legacyType] as SectionType | undefined
}

/**
 * 카테고리 매핑 헬퍼
 */
function mapToLayoutCategory(category: string): LayoutCategory {
  const mapping: Record<string, LayoutCategory> = {
    'modern': 'minimal',
    'cinematic': 'story',
    'artistic': 'album',
    'retro': 'album',
    'playful': 'chat',
    'classic': 'letter',
  }
  return mapping[category] ?? 'scroll'
}

/**
 * 섹션을 Screen으로 변환하는 헬퍼 함수
 * 클로저 문제 방지를 위해 모든 의존성을 명시적 인자로 전달
 */
function buildScreenFromSection(
  thePreset: PredefinedTemplatePreset,
  section: LegacySectionDefinition,
  sectionIndex: number,
  options: ConvertOptions,
  warnings: string[]
): Screen {
  const sectionType = mapToSectionType(section.type)

  if (!sectionType) {
    warnings.push(`Unknown section type mapping: ${section.type}`)
  }

  return {
    id: `screen_${section.id}`,
    name: section.id,
    type: section.type === 'hero' ? 'intro' : 'content',
    sectionType: sectionType ?? 'intro',
    root: buildSection({
      preset: thePreset,
      section,
      sectionIndex,
      options,
    }),
  }
}

/**
 * 섹션 배열을 Screen 배열로 변환 (for 루프 사용)
 * 클로저 의존성을 완전히 제거하기 위해 .map() 대신 for 루프 사용
 */
function buildScreensFromSections(
  thePreset: PredefinedTemplatePreset,
  sections: LegacySectionDefinition[],
  options: ConvertOptions,
  warnings: string[]
): Screen[] {
  const screens: Screen[] = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const screen = buildScreenFromSection(thePreset, section, i, options, warnings)
    screens.push(screen)
  }

  return screens
}

// Re-export types
export * from './types'
export { convertToStyleSchema } from './style-converter'
export { buildSection, getSectionBuilder, sectionBuilders } from './section-builders'

// ============================================
// Main Converter
// ============================================

/**
 * 레거시 프리셋을 LayoutSchema + StyleSchema로 변환
 *
 * @example
 * ```typescript
 * import { convertLegacyPreset } from '@/lib/super-editor/presets/legacy/converter'
 *
 * const result = convertLegacyPreset({ presetId: 'keynote' })
 * // result.layout -> LayoutSchema
 * // result.style -> StyleSchema
 * ```
 */
export function convertLegacyPreset(options: ConvertOptions): ConvertResult {
  const preset = getPredefinedPreset(options.presetId)

  if (!preset) {
    throw new Error(`Legacy preset not found: ${options.presetId}`)
  }

  const warnings: string[] = []
  const now = new Date().toISOString()

  // 섹션 필터링
  let sections = preset.sections.filter(s => s.enabled)

  if (options.includeSections?.length) {
    sections = sections.filter(s => options.includeSections!.includes(s.type))
  }

  if (options.excludeSections?.length) {
    sections = sections.filter(s => !options.excludeSections!.includes(s.type))
  }

  // Screen 빌드 (for 루프로 클로저 문제 방지)
  const screens = buildScreensFromSections(preset, sections, options, warnings)

  // LayoutSchema 생성
  const layout: LayoutSchema = {
    version: '1.0',
    meta: {
      id: `layout_${preset.id}`,
      name: preset.name,
      description: preset.descriptionKo,
      category: mapToLayoutCategory(preset.category),
      tags: preset.matchKeywords,
      createdAt: now,
      updatedAt: now,
    },
    screens,
    globals: {
      fonts: {
        heading: {
          family: preset.defaultFonts.title.family,
          weight: preset.defaultFonts.title.weight,
          letterSpacing: preset.defaultFonts.title.letterSpacing,
        },
        body: {
          family: preset.defaultFonts.body.family,
          weight: preset.defaultFonts.body.weight,
        },
      },
      colors: {
        primary: preset.defaultColors.primary,
        secondary: preset.defaultColors.secondary,
        accent: preset.defaultColors.accent,
        background: preset.defaultColors.background,
        text: preset.defaultColors.text,
        muted: preset.defaultColors.textMuted,
      },
      scroll: {
        smoothScroll: preset.effects.scrollBehavior.smooth,
        snapType: preset.effects.scrollBehavior.snapToSection ? 'mandatory' : undefined,
      },
      background: preset.effects.background ? {
        type: preset.effects.background.type as 'color' | 'gradient' | 'image' | 'pattern',
        value: preset.effects.background.value,
      } : undefined,
    },
  }

  // StyleSchema 생성
  const style = convertToStyleSchema(preset, options.styleOverrides)

  return {
    layout,
    style,
    meta: {
      presetId: preset.id,
      presetName: preset.name,
      convertedAt: now,
      sectionsCount: screens.length,
      warnings,
    },
  }
}

/**
 * 프리셋 ID로 바로 스키마 변환
 */
export function convertPresetById(
  presetId: string,
  options?: Omit<ConvertOptions, 'presetId'>
): ConvertResult {
  return convertLegacyPreset({ presetId, ...options })
}

/**
 * 프리셋 객체를 직접 변환
 */
export function convertPresetDirect(
  preset: PredefinedTemplatePreset,
  options?: Omit<ConvertOptions, 'presetId'>
): ConvertResult {
  const fullOptions: ConvertOptions = {
    presetId: preset.id,
    ...options,
  }

  const warnings: string[] = []
  const now = new Date().toISOString()

  let sections = preset.sections.filter(s => s.enabled)

  if (fullOptions.includeSections?.length) {
    sections = sections.filter(s => fullOptions.includeSections!.includes(s.type))
  }

  if (fullOptions.excludeSections?.length) {
    sections = sections.filter(s => !fullOptions.excludeSections!.includes(s.type))
  }

  // Screen 빌드 (for 루프로 클로저 문제 방지)
  const screens = buildScreensFromSections(preset, sections, fullOptions, warnings)

  const layout: LayoutSchema = {
    version: '1.0',
    meta: {
      id: `layout_${preset.id}`,
      name: preset.name,
      description: preset.descriptionKo,
      category: mapToLayoutCategory(preset.category),
      tags: preset.matchKeywords,
      createdAt: now,
      updatedAt: now,
    },
    screens,
    globals: {
      fonts: {
        heading: {
          family: preset.defaultFonts.title.family,
          weight: preset.defaultFonts.title.weight,
          letterSpacing: preset.defaultFonts.title.letterSpacing,
        },
        body: {
          family: preset.defaultFonts.body.family,
          weight: preset.defaultFonts.body.weight,
        },
      },
      colors: {
        primary: preset.defaultColors.primary,
        secondary: preset.defaultColors.secondary,
        accent: preset.defaultColors.accent,
        background: preset.defaultColors.background,
        text: preset.defaultColors.text,
        muted: preset.defaultColors.textMuted,
      },
      scroll: {
        smoothScroll: preset.effects.scrollBehavior.smooth,
        snapType: preset.effects.scrollBehavior.snapToSection ? 'mandatory' : undefined,
      },
    },
  }

  const style = convertToStyleSchema(preset, fullOptions.styleOverrides)

  return {
    layout,
    style,
    meta: {
      presetId: preset.id,
      presetName: preset.name,
      convertedAt: now,
      sectionsCount: screens.length,
      warnings,
    },
  }
}

// ============================================
// Convenience Functions
// ============================================

/**
 * 모든 레거시 프리셋을 변환
 */
export function convertAllPresets(): Record<string, ConvertResult> {
  const presetIds = [
    'keynote', 'cinematic', 'exhibition', 'magazine', 'vinyl',
    'chat', 'glassmorphism', 'passport', 'pixel', 'typography',
    'gothic-romance', 'old-money', 'monogram', 'jewel-velvet',
  ]

  const results: Record<string, ConvertResult> = {}

  for (const id of presetIds) {
    try {
      results[id] = convertLegacyPreset({ presetId: id })
    } catch (e) {
      console.error(`Failed to convert preset: ${id}`, e)
    }
  }

  return results
}

/**
 * 프리셋 ID 목록에서 Layout/Style 쌍 배열 생성
 */
export function getConvertedPresets(ids: string[]): Array<{ id: string; layout: LayoutSchema; style: StyleSchema }> {
  const results: Array<{ id: string; layout: LayoutSchema; style: StyleSchema }> = []

  for (const id of ids) {
    const result = convertLegacyPreset({ presetId: id })
    results.push({
      id,
      layout: result.layout,
      style: result.style,
    })
  }

  return results
}
