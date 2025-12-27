/**
 * Profile Block Presets Index
 *
 * About Us / 커플 소개 섹션 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { PROFILE_DUAL_CARD } from './dual-card'
import { PROFILE_SPLIT_PHOTO } from './split-photo'

// ============================================
// Type Exports
// ============================================

export type ProfilePresetId = 'profile-dual-card' | 'profile-split-photo'

// ============================================
// Preset Registry
// ============================================

export const PROFILE_PRESETS: Record<ProfilePresetId, BlockPreset> = {
  'profile-dual-card': PROFILE_DUAL_CARD,
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
