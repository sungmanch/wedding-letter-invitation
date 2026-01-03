/**
 * Profile Block Presets Index
 *
 * About Us / 커플 소개 섹션 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { PROFILE_CIRCLE_PORTRAIT } from './circle-portrait'
import { PROFILE_DUAL_CARD } from './dual-card'
import { PROFILE_DUAL_CARD_INTERVIEW } from './dual-card-interview'
import { PROFILE_SPLIT_PHOTO } from './split-photo'

// ============================================
// Type Exports
// ============================================

export type ProfilePresetId =
  | 'profile-circle-portrait'
  | 'profile-dual-card'
  | 'profile-dual-card-interview'
  | 'profile-split-photo'

// ============================================
// Preset Registry
// ============================================

export const PROFILE_PRESETS: Record<ProfilePresetId, BlockPreset> = {
  'profile-circle-portrait': PROFILE_CIRCLE_PORTRAIT,
  'profile-dual-card': PROFILE_DUAL_CARD,
  'profile-dual-card-interview': PROFILE_DUAL_CARD_INTERVIEW,
  'profile-split-photo': PROFILE_SPLIT_PHOTO,
}

// ============================================
// Helper Functions
// ============================================

export function getProfilePreset(id: ProfilePresetId): BlockPreset {
  return PROFILE_PRESETS[id]
}

export function getProfilePresetIds(): ProfilePresetId[] {
  return Object.keys(PROFILE_PRESETS) as ProfilePresetId[]
}

export function getProfilePresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(PROFILE_PRESETS).filter((p) => p.complexity === complexity)
}
