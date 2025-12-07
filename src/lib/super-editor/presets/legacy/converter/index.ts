/**
 * Legacy Preset Converter
 * 레거시 프리셋을 LayoutSchema + StyleSchema로 변환
 */

import type { LayoutSchema, Screen, LayoutCategory } from '../../../schema/layout'
import type { StyleSchema } from '../../../schema/style'
import type { SectionType } from '../../../schema/section-types'
import type { LegacyTemplatePreset } from '../types'
import type { ConvertOptions, ConvertResult } from './types'
import { LEGACY_TO_SE_SECTION_TYPE } from './types'
import { buildSection } from './section-builders'
import { convertToStyleSchema } from './style-converter'
import { getLegacyPreset } from '../index'

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
  const preset = getLegacyPreset(options.presetId)

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

  // Screen 빌드
  const screens: Screen[] = sections.map((section, index) => {
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
        preset,
        section,
        sectionIndex: index,
        options,
      }),
    }
  })

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
  preset: LegacyTemplatePreset,
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

  const screens: Screen[] = sections.map((section, index) => {
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
        preset,
        section,
        sectionIndex: index,
        options: fullOptions,
      }),
    }
  })

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
// Helpers
// ============================================

function mapToSectionType(legacyType: string): SectionType | undefined {
  return LEGACY_TO_SE_SECTION_TYPE[legacyType] as SectionType | undefined
}

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
  return ids.map(id => {
    const result = convertLegacyPreset({ presetId: id })
    return {
      id,
      layout: result.layout,
      style: result.style,
    }
  })
}
