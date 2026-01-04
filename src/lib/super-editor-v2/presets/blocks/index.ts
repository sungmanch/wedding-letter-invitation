/**
 * Super Editor v2 - Block Presets Index
 *
 * 모든 블록 타입의 프리셋 통합 export
 */

import type { BlockType } from '../../schema/types'
import type { BlockPreset } from './types'

// Types
export type {
  BlockPreset,
  PresetElement,
  ModalPreset,
  ModalSection,
  ToggleSectionConfig,
  TabSectionConfig,
  TextInputSectionConfig,
  RadioSectionConfig,
  CheckboxSectionConfig,
} from './types'

// Calendar Presets (date skeleton → calendar block)
export {
  CALENDAR_PRESETS,
  getCalendarPreset,
  getCalendarPresetIds,
  getCalendarPresetsByComplexity,
  type CalendarPresetId,
} from './calendar'

// Profile Presets (profile skeleton → profile block)
export {
  PROFILE_PRESETS,
  getProfilePreset,
  getProfilePresetIds,
  getProfilePresetsByComplexity,
  type ProfilePresetId,
} from './profile'

// Greeting Parents Presets (greeting + parents info)
export {
  GREETING_PARENTS_PRESETS,
  getGreetingParentsPreset,
  getGreetingParentsPresetIds,
  getGreetingParentsPresetsByComplexity,
  type GreetingParentsPresetId,
} from './greeting-parents'

// RSVP Presets (attendance confirmation with modal)
export {
  RSVP_PRESETS,
  getRsvpPreset,
  getRsvpPresetIds,
  getRsvpPresetsByComplexity,
  type RsvpPresetId,
} from './rsvp'

// Notice Presets (공지사항/안내)
export {
  NOTICE_PRESETS,
  getNoticePreset,
  getNoticePresetIds,
  getNoticePresetsByComplexity,
  type NoticePresetId,
} from './notice'

// Contact Presets (연락처 오버레이)
export {
  CONTACT_PRESETS,
  getContactPreset,
  getContactPresetIds,
  getContactPresetsByComplexity,
  type ContactPresetId,
} from './contact'

// Gallery Presets (갤러리/사진)
export {
  GALLERY_PRESETS,
  getGalleryPreset,
  getGalleryPresetIds,
  getGalleryPresetsByComplexity,
  getGalleryPresetsByColumns,
  getGalleryPresetsByAspectRatio,
  type GalleryPresetId,
} from './gallery'

// Location Presets (오시는길)
export {
  LOCATION_PRESETS,
  getLocationPreset,
  getLocationPresetIds,
  getLocationPresetsByComplexity,
  type LocationPresetId,
} from './location'

// Account Presets (축의금 계좌)
export {
  ACCOUNT_PRESETS,
  getAccountPreset,
  getAccountPresetIds,
  getAccountPresetsByComplexity,
  type AccountPresetId,
} from './account'

// Message Presets (방명록/축하 메시지)
export {
  MESSAGE_PRESETS,
  getMessagePreset,
  getMessagePresetIds,
  getMessagePresetsByComplexity,
  type MessagePresetId,
} from './message'

// Wreath Presets (화환 안내)
export { WREATH_DECLINE } from './wreath'

// Ending Presets (엔딩/공유)
export {
  ENDING_PRESETS,
  getEndingPreset,
  getEndingPresetIds,
  getEndingPresetsByComplexity,
  type EndingPresetId,
} from './ending'

// Hero Presets (메인 히어로)
export {
  HERO_PRESETS,
  getHeroPreset,
  getHeroPresetIds,
  getHeroPresetsByComplexity,
  type HeroPresetId,
} from './hero'

// Interview Presets (인터뷰 Q&A)
export {
  INTERVIEW_PRESETS,
  getInterviewPreset,
  getInterviewPresetIds,
  type InterviewPresetId,
} from './interview'

// Future block presets will be added here:
// export { GALLERY_PRESETS, ... } from './gallery-presets'
// export { LOCATION_PRESETS, ... } from './location-presets'
// export { ACCOUNT_PRESETS, ... } from './account-presets'
// export { MESSAGE_PRESETS, ... } from './message-presets'
// export { ENDING_PRESETS, ... } from './ending-presets'
// export { MUSIC_PRESETS, ... } from './music-presets'

// ============================================
// Imports for aggregation
// ============================================

import { CALENDAR_PRESETS, type CalendarPresetId } from './calendar'
import { PROFILE_PRESETS, type ProfilePresetId } from './profile'
import { GREETING_PARENTS_PRESETS, type GreetingParentsPresetId } from './greeting-parents'
import { RSVP_PRESETS, type RsvpPresetId } from './rsvp'
import { NOTICE_PRESETS, type NoticePresetId } from './notice'
import { CONTACT_PRESETS, type ContactPresetId } from './contact'
import { GALLERY_PRESETS, type GalleryPresetId } from './gallery'
import { LOCATION_PRESETS, type LocationPresetId } from './location'
import { ACCOUNT_PRESETS, type AccountPresetId } from './account'
import { MESSAGE_PRESETS, type MessagePresetId } from './message'
import { WREATH_DECLINE } from './wreath'
import { ENDING_PRESETS, type EndingPresetId } from './ending'
import { HERO_PRESETS, type HeroPresetId } from './hero'
import { INTERVIEW_PRESETS, type InterviewPresetId } from './interview'

// Wreath presets aggregation
const WREATH_PRESETS: Record<string, BlockPreset> = {
  'wreath-decline': WREATH_DECLINE,
}
export type WreathPresetId = 'wreath-decline'

// ============================================
// Combined Types
// ============================================

export type BlockPresetId = CalendarPresetId | ProfilePresetId | GreetingParentsPresetId | RsvpPresetId | NoticePresetId | ContactPresetId | GalleryPresetId | LocationPresetId | AccountPresetId | MessagePresetId | WreathPresetId | EndingPresetId | HeroPresetId | InterviewPresetId

// ============================================
// Combined Registry
// ============================================

export const BLOCK_PRESETS: Record<string, BlockPreset> = {
  ...CALENDAR_PRESETS,
  ...PROFILE_PRESETS,
  ...GREETING_PARENTS_PRESETS,
  ...RSVP_PRESETS,
  ...NOTICE_PRESETS,
  ...CONTACT_PRESETS,
  ...GALLERY_PRESETS,
  ...LOCATION_PRESETS,
  ...ACCOUNT_PRESETS,
  ...MESSAGE_PRESETS,
  ...WREATH_PRESETS,
  ...ENDING_PRESETS,
  ...HERO_PRESETS,
  ...INTERVIEW_PRESETS,
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
