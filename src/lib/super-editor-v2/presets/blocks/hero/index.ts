/**
 * Hero Block Presets Index
 *
 * 메인 히어로 섹션 프리셋 통합 export
 * template-catalog-v2.ts의 unique1~6 기반 6개 프리셋
 */

import type { BlockPreset } from '../types'

// Individual Preset Imports
import { HERO_CLASSIC_ELEGANT } from './classic-elegant'
import { HERO_CASUAL_PLAYFUL } from './casual-playful'
import { HERO_MINIMAL_OVERLAY } from './minimal-overlay'
import { HERO_DARK_ROMANTIC } from './dark-romantic'
import { HERO_BRIGHT_CASUAL } from './bright-casual'
import { HERO_MONOCHROME_BOLD } from './monochrome-bold'
import { HERO_MINIMAL_CLASSIC } from './minimal-classic'
import { HERO_CURTAIN_BACKDROP } from './curtain-backdrop'
import { HERO_HIPSTER } from './hipster'

// ============================================
// Type Exports
// ============================================

export type HeroPresetId =
  | 'hero-classic-elegant'
  | 'hero-casual-playful'
  | 'hero-minimal-overlay'
  | 'hero-dark-romantic'
  | 'hero-bright-casual'
  | 'hero-monochrome-bold'
  | 'hero-minimal-classic'
  | 'hero-curtain-backdrop'
  | 'hero-hipster'

// ============================================
// Preset Registry
// ============================================

export const HERO_PRESETS: Record<HeroPresetId, BlockPreset> = {
  'hero-classic-elegant': HERO_CLASSIC_ELEGANT,
  'hero-casual-playful': HERO_CASUAL_PLAYFUL,
  'hero-minimal-overlay': HERO_MINIMAL_OVERLAY,
  'hero-dark-romantic': HERO_DARK_ROMANTIC,
  'hero-bright-casual': HERO_BRIGHT_CASUAL,
  'hero-monochrome-bold': HERO_MONOCHROME_BOLD,
  'hero-minimal-classic': HERO_MINIMAL_CLASSIC,
  'hero-curtain-backdrop': HERO_CURTAIN_BACKDROP,
  'hero-hipster': HERO_HIPSTER,
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

/**
 * 히어로 프리셋 ID인지 확인
 */
export function isHeroPresetId(id: string): id is HeroPresetId {
  return id in HERO_PRESETS
}

/**
 * 히어로 프리셋 ID → 추천 테마 프리셋 ID
 * 히어로 선택 시 다른 블록들에 적용할 테마 반환
 */
export function getThemeForHeroPreset(heroPresetId: HeroPresetId): string | undefined {
  const preset = HERO_PRESETS[heroPresetId]
  return preset?.recommendedThemes?.[0]
}
