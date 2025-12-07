/**
 * Predefined Template Presets
 * 사전 정의된 청첩장 템플릿 프리셋
 */

// Types
export * from './types'

// Individual presets
export { cinematicPreset } from './cinematic'
export { exhibitionPreset } from './exhibition'
export { magazinePreset } from './magazine'
export { gothicRomancePreset } from './gothic-romance'
export { oldMoneyPreset } from './old-money'
export { monogramPreset } from './monogram'
export { jewelVelvetPreset } from './jewel-velvet'

// Import for registry
import { cinematicPreset } from './cinematic'
import { exhibitionPreset } from './exhibition'
import { magazinePreset } from './magazine'
import { gothicRomancePreset } from './gothic-romance'
import { oldMoneyPreset } from './old-money'
import { monogramPreset } from './monogram'
import { jewelVelvetPreset } from './jewel-velvet'

import type { PredefinedTemplatePreset, PredefinedTemplateCategory, LegacyIntroType } from './types'

// ============================================
// Preset Registry
// ============================================

export const predefinedPresets: Record<string, PredefinedTemplatePreset> = {
  cinematic: cinematicPreset,
  exhibition: exhibitionPreset,
  magazine: magazinePreset,
  'gothic-romance': gothicRomancePreset,
  'old-money': oldMoneyPreset,
  monogram: monogramPreset,
  'jewel-velvet': jewelVelvetPreset,
}

// ============================================
// Utility Functions
// ============================================

/**
 * ID로 프리셋 가져오기
 */
export function getPredefinedPreset(id: string): PredefinedTemplatePreset | undefined {
  return predefinedPresets[id]
}

/**
 * 모든 프리셋 목록 가져오기
 */
export function getAllPredefinedPresets(): PredefinedTemplatePreset[] {
  return Object.values(predefinedPresets)
}

/**
 * 카테고리별 프리셋 필터링
 */
export function getPredefinedPresetsByCategory(category: PredefinedTemplateCategory): PredefinedTemplatePreset[] {
  return Object.values(predefinedPresets).filter(preset => preset.category === category)
}

/**
 * 인트로 타입별 프리셋 필터링
 */
export function getPredefinedPresetsByIntroType(introType: LegacyIntroType): PredefinedTemplatePreset[] {
  return Object.values(predefinedPresets).filter(preset => preset.intro.type === introType)
}

/**
 * 키워드로 프리셋 검색
 */
export function searchPredefinedPresets(keyword: string): PredefinedTemplatePreset[] {
  const normalizedKeyword = keyword.toLowerCase()
  return Object.values(predefinedPresets).filter(preset =>
    preset.matchKeywords.some(k => k.toLowerCase().includes(normalizedKeyword)) ||
    preset.name.toLowerCase().includes(normalizedKeyword) ||
    preset.nameKo.includes(keyword) ||
    preset.descriptionKo.includes(keyword)
  )
}

/**
 * 무드로 프리셋 추천
 */
export function recommendPredefinedPresetsByMood(moods: string[], limit = 3): PredefinedTemplatePreset[] {
  const scored = Object.values(predefinedPresets).map(preset => {
    const score = moods.reduce((acc, mood) => {
      if (preset.preview.mood.includes(mood)) return acc + 2
      if (preset.matchKeywords.includes(mood)) return acc + 1
      return acc
    }, 0)
    return { preset, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.preset)
}

/**
 * 프리셋 메타 정보만 가져오기 (리스트 표시용)
 */
export function getPredefinedPresetMetas() {
  return Object.values(predefinedPresets).map(preset => ({
    id: preset.id,
    name: preset.name,
    nameKo: preset.nameKo,
    category: preset.category,
    description: preset.description,
    descriptionKo: preset.descriptionKo,
    mood: preset.preview.mood,
    colors: preset.preview.colors,
    interaction: preset.interaction,
    introType: preset.intro.type,
  }))
}

// ============================================
// Category Labels
// ============================================

export const categoryLabels: Record<PredefinedTemplateCategory, { en: string; ko: string }> = {
  modern: { en: 'Modern', ko: '모던' },
  cinematic: { en: 'Cinematic', ko: '시네마틱' },
  artistic: { en: 'Artistic', ko: '아티스틱' },
  retro: { en: 'Retro', ko: '레트로' },
  playful: { en: 'Playful', ko: '플레이풀' },
  classic: { en: 'Classic', ko: '클래식' },
}

export const introTypeLabels: Record<LegacyIntroType, { en: string; ko: string }> = {
  cinematic: { en: 'Cinematic', ko: '시네마틱' },
  exhibition: { en: 'Exhibition', ko: '갤러리' },
  magazine: { en: 'Magazine', ko: '매거진' },
}
