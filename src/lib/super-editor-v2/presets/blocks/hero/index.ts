/**
 * Hero Block Presets Index
 *
 * 메인 히어로 섹션 프리셋 통합 export
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { HERO_FULLSCREEN_OVERLAY } from './fullscreen-overlay'
import { HERO_CENTER_TEXT } from './center-text'

// ============================================
// Type Exports
// ============================================

export type HeroPresetId = 'hero-fullscreen-overlay' | 'hero-center-text'

// ============================================
// Preset Registry
// ============================================

export const HERO_PRESETS: Record<HeroPresetId, BlockPreset> = {
  'hero-fullscreen-overlay': HERO_FULLSCREEN_OVERLAY,
  'hero-center-text': HERO_CENTER_TEXT,
}

// ============================================
// Helper Functions
// ============================================

export function getHeroPreset(id: HeroPresetId): BlockPreset {
  return HERO_PRESETS[id]
}

export function getHeroPresetIds(): HeroPresetId[] {
  return Object.keys(HERO_PRESETS) as HeroPresetId[]
}

export function getHeroPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(HERO_PRESETS).filter((p) => p.complexity === complexity)
}
