/**
 * Greeting Parents Block Presets Index
 *
 * 인사말 + 혼주정보 블록 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { GREETING_PARENTS_MINIMAL } from './minimal'
import { GREETING_PARENTS_WITH_DIVIDER } from './with-divider'
import { GREETING_PARENTS_NATURAL_SPARKLE } from './natural-sparkle'
import { GREETING_PARENTS_BAPTISMAL } from './baptismal'
import { GREETING_PARENTS_BALLOON_HEART } from './balloon-heart'
import { GREETING_PARENTS_BOX_STYLE } from './box-style'
import { GREETING_PARENTS_RIBBON } from './ribbon'
import { GREETING_PARENTS_CARD_DUAL_HEART } from './card-dual-heart'

// ============================================
// Type Exports
// ============================================

export type GreetingParentsPresetId =
  | 'greeting-parents-minimal'
  | 'greeting-parents-with-divider'
  | 'greeting-parents-natural-sparkle'
  | 'greeting-parents-baptismal'
  | 'greeting-parents-balloon-heart'
  | 'greeting-parents-box-style'
  | 'greeting-parents-ribbon'
  | 'greeting-parents-card-dual-heart'

// ============================================
// Preset Registry
// ============================================

export const GREETING_PARENTS_PRESETS: Record<GreetingParentsPresetId, BlockPreset> = {
  'greeting-parents-minimal': GREETING_PARENTS_MINIMAL,
  'greeting-parents-with-divider': GREETING_PARENTS_WITH_DIVIDER,
  'greeting-parents-natural-sparkle': GREETING_PARENTS_NATURAL_SPARKLE,
  'greeting-parents-baptismal': GREETING_PARENTS_BAPTISMAL,
  'greeting-parents-balloon-heart': GREETING_PARENTS_BALLOON_HEART,
  'greeting-parents-box-style': GREETING_PARENTS_BOX_STYLE,
  'greeting-parents-ribbon': GREETING_PARENTS_RIBBON,
  'greeting-parents-card-dual-heart': GREETING_PARENTS_CARD_DUAL_HEART,
}

// ============================================
// Helper Functions
// ============================================

export function getGreetingParentsPreset(id: GreetingParentsPresetId): BlockPreset {
  return GREETING_PARENTS_PRESETS[id]
}

export function getGreetingParentsPresetIds(): GreetingParentsPresetId[] {
  return Object.keys(GREETING_PARENTS_PRESETS) as GreetingParentsPresetId[]
}

export function getGreetingParentsPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(GREETING_PARENTS_PRESETS).filter((p) => p.complexity === complexity)
}
