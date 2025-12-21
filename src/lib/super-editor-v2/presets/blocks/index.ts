/**
 * Super Editor v2 - Block Presets Index
 *
 * 모든 블록 타입의 프리셋 통합 export
 */

import type { BlockType } from '../../schema/types'
import type { BlockPreset } from './types'

// Types
export type { BlockPreset, PresetElement } from './types'

// Calendar Presets (date skeleton → calendar block)
export {
  CALENDAR_PRESETS,
  getCalendarPreset,
  getCalendarPresetIds,
  getCalendarPresetsByComplexity,
  type CalendarPresetId,
} from './calendar-presets'

// Profile Presets (profile skeleton → profile block)
export {
  PROFILE_PRESETS,
  getProfilePreset,
  getProfilePresetIds,
  getProfilePresetsByComplexity,
  type ProfilePresetId,
} from './profile-presets'

// Greeting Parents Presets (greeting + parents info)
export {
  GREETING_PARENTS_PRESETS,
  getGreetingParentsPreset,
  getGreetingParentsPresetIds,
  getGreetingParentsPresetsByComplexity,
  type GreetingParentsPresetId,
} from './greeting-parents-presets'

// Future block presets will be added here:
// export { HERO_PRESETS, ... } from './hero-presets'
// export { GALLERY_PRESETS, ... } from './gallery-presets'
// export { RSVP_PRESETS, ... } from './rsvp-presets'
// export { LOCATION_PRESETS, ... } from './location-presets'
// export { NOTICE_PRESETS, ... } from './notice-presets'
// export { ACCOUNT_PRESETS, ... } from './account-presets'
// export { MESSAGE_PRESETS, ... } from './message-presets'
// export { ENDING_PRESETS, ... } from './ending-presets'
// export { MUSIC_PRESETS, ... } from './music-presets'

// ============================================
// Imports for aggregation
// ============================================

import { CALENDAR_PRESETS, type CalendarPresetId } from './calendar-presets'
import { PROFILE_PRESETS, type ProfilePresetId } from './profile-presets'
import { GREETING_PARENTS_PRESETS, type GreetingParentsPresetId } from './greeting-parents-presets'

// ============================================
// Combined Types
// ============================================

export type BlockPresetId = CalendarPresetId | ProfilePresetId | GreetingParentsPresetId
// Future: | HeroPresetId | GalleryPresetId | ...

// ============================================
// Combined Registry
// ============================================

export const BLOCK_PRESETS: Record<string, BlockPreset> = {
  ...CALENDAR_PRESETS,
  ...PROFILE_PRESETS,
  ...GREETING_PARENTS_PRESETS,
  // Future: ...HERO_PRESETS,
  // Future: ...GALLERY_PRESETS,
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get a block preset by ID
 */
export function getBlockPreset(id: string): BlockPreset | undefined {
  return BLOCK_PRESETS[id]
}

/**
 * Get all presets for a specific block type
 */
export function getBlockPresetsByType(blockType: BlockType): BlockPreset[] {
  return Object.values(BLOCK_PRESETS).filter(p => p.blockType === blockType)
}

/**
 * Get presets matching a specific tag
 */
export function getBlockPresetsByTag(tag: string): BlockPreset[] {
  return Object.values(BLOCK_PRESETS).filter(p => p.tags.includes(tag))
}

/**
 * Get presets matching a mood (from aiHints)
 */
export function getBlockPresetsByMood(mood: string): BlockPreset[] {
  return Object.values(BLOCK_PRESETS).filter(
    p => p.aiHints?.mood.includes(mood) || p.tags.includes(mood)
  )
}

/**
 * Get presets by complexity level
 */
export function getBlockPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(BLOCK_PRESETS).filter(p => p.complexity === complexity)
}

/**
 * Get all block preset IDs
 */
export function getAllBlockPresetIds(): string[] {
  return Object.keys(BLOCK_PRESETS)
}

/**
 * Find presets suitable for AI prompt matching
 */
export function findPresetsForPrompt(
  blockType: BlockType,
  keywords: string[]
): BlockPreset[] {
  const typePresets = getBlockPresetsByType(blockType)

  return typePresets.filter(preset => {
    const allKeywords = [
      ...preset.tags,
      ...(preset.aiHints?.mood ?? []),
      ...(preset.aiHints?.style ?? []),
      ...(preset.aiHints?.useCase ?? []),
    ]

    return keywords.some(kw =>
      allKeywords.some(
        pk =>
          pk.toLowerCase().includes(kw.toLowerCase()) ||
          kw.toLowerCase().includes(pk.toLowerCase())
      )
    )
  })
}
