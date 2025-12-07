/**
 * Legacy Template Presets
 * templates.json에서 마이그레이션된 10개의 레거시 템플릿 프리셋
 */

// Types
export * from './types'

// Individual presets
export { keynotePreset } from './keynote'
export { cinematicPreset } from './cinematic'
export { exhibitionPreset } from './exhibition'
export { magazinePreset } from './magazine'
export { vinylPreset } from './vinyl'
export { chatPreset } from './chat'
export { glassmorphismPreset } from './glassmorphism'
export { passportPreset } from './passport'
export { pixelPreset } from './pixel'
export { typographyPreset } from './typography'

// Import for registry
import { keynotePreset } from './keynote'
import { cinematicPreset } from './cinematic'
import { exhibitionPreset } from './exhibition'
import { magazinePreset } from './magazine'
import { vinylPreset } from './vinyl'
import { chatPreset } from './chat'
import { glassmorphismPreset } from './glassmorphism'
import { passportPreset } from './passport'
import { pixelPreset } from './pixel'
import { typographyPreset } from './typography'

import type { LegacyTemplatePreset, LegacyTemplateCategory, LegacyIntroType } from './types'

// ============================================
// Preset Registry
// ============================================

export const legacyPresets: Record<string, LegacyTemplatePreset> = {
  keynote: keynotePreset,
  cinematic: cinematicPreset,
  exhibition: exhibitionPreset,
  magazine: magazinePreset,
  vinyl: vinylPreset,
  chat: chatPreset,
  glassmorphism: glassmorphismPreset,
  passport: passportPreset,
  pixel: pixelPreset,
  typography: typographyPreset,
}

// ============================================
// Utility Functions
// ============================================

/**
 * ID로 레거시 프리셋 가져오기
 */
export function getLegacyPreset(id: string): LegacyTemplatePreset | undefined {
  return legacyPresets[id]
}

/**
 * 모든 레거시 프리셋 목록 가져오기
 */
export function getAllLegacyPresets(): LegacyTemplatePreset[] {
  return Object.values(legacyPresets)
}

/**
 * 카테고리별 프리셋 필터링
 */
export function getLegacyPresetsByCategory(category: LegacyTemplateCategory): LegacyTemplatePreset[] {
  return Object.values(legacyPresets).filter(preset => preset.category === category)
}

/**
 * 인트로 타입별 프리셋 필터링
 */
export function getLegacyPresetsByIntroType(introType: LegacyIntroType): LegacyTemplatePreset[] {
  return Object.values(legacyPresets).filter(preset => preset.intro.type === introType)
}

/**
 * 키워드로 프리셋 검색
 */
export function searchLegacyPresets(keyword: string): LegacyTemplatePreset[] {
  const normalizedKeyword = keyword.toLowerCase()
  return Object.values(legacyPresets).filter(preset =>
    preset.matchKeywords.some(k => k.toLowerCase().includes(normalizedKeyword)) ||
    preset.name.toLowerCase().includes(normalizedKeyword) ||
    preset.nameKo.includes(keyword) ||
    preset.descriptionKo.includes(keyword)
  )
}

/**
 * 무드로 프리셋 추천
 */
export function recommendLegacyPresetsByMood(moods: string[], limit = 3): LegacyTemplatePreset[] {
  const scored = Object.values(legacyPresets).map(preset => {
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
export function getLegacyPresetMetas() {
  return Object.values(legacyPresets).map(preset => ({
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

export const categoryLabels: Record<LegacyTemplateCategory, { en: string; ko: string }> = {
  modern: { en: 'Modern', ko: '모던' },
  cinematic: { en: 'Cinematic', ko: '시네마틱' },
  artistic: { en: 'Artistic', ko: '아티스틱' },
  retro: { en: 'Retro', ko: '레트로' },
  playful: { en: 'Playful', ko: '플레이풀' },
  classic: { en: 'Classic', ko: '클래식' },
}

export const introTypeLabels: Record<LegacyIntroType, { en: string; ko: string }> = {
  keynote: { en: 'Keynote', ko: '키노트' },
  cinematic: { en: 'Cinematic', ko: '시네마틱' },
  exhibition: { en: 'Exhibition', ko: '갤러리' },
  magazine: { en: 'Magazine', ko: '매거진' },
  vinyl: { en: 'Vinyl', ko: '바이닐' },
  chat: { en: 'Chat', ko: '채팅' },
  glassmorphism: { en: 'Glassmorphism', ko: '글래스' },
  passport: { en: 'Passport', ko: '패스포트' },
  pixel: { en: 'Pixel', ko: '픽셀' },
  typography: { en: 'Typography', ko: '타이포' },
}
