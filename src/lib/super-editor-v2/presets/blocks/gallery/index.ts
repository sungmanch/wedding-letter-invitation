/**
 * Gallery Block Presets Index
 *
 * 갤러리 블록 프리셋 통합 export
 * - 5가지 레이아웃 variant: square-3col, square-2col, rect-3col, rect-2col, mixed
 * - Lightbox 지원 (클릭 확대, 스와이프 loop)
 */

import type { BlockPreset } from '../types'

// Preset imports
import { GALLERY_SQUARE_3COL } from './square-3col'
import { GALLERY_SQUARE_2COL } from './square-2col'
import { GALLERY_RECT_3COL } from './rect-3col'
import { GALLERY_RECT_2COL } from './rect-2col'
import { GALLERY_MIXED } from './mixed'

// ============================================
// Type Definition
// ============================================

export type GalleryPresetId =
  | 'gallery-square-3col'
  | 'gallery-square-2col'
  | 'gallery-rect-3col'
  | 'gallery-rect-2col'
  | 'gallery-mixed'

// ============================================
// Registry
// ============================================

export const GALLERY_PRESETS: Record<GalleryPresetId, BlockPreset> = {
  'gallery-square-3col': GALLERY_SQUARE_3COL,
  'gallery-square-2col': GALLERY_SQUARE_2COL,
  'gallery-rect-3col': GALLERY_RECT_3COL,
  'gallery-rect-2col': GALLERY_RECT_2COL,
  'gallery-mixed': GALLERY_MIXED,
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get a gallery preset by ID
 */
export function getGalleryPreset(id: GalleryPresetId): BlockPreset {
  return GALLERY_PRESETS[id]
}

/**
 * Get all gallery preset IDs
 */
export function getGalleryPresetIds(): GalleryPresetId[] {
  return Object.keys(GALLERY_PRESETS) as GalleryPresetId[]
}

/**
 * Get gallery presets by complexity
 */
export function getGalleryPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(GALLERY_PRESETS).filter(p => p.complexity === complexity)
}

/**
 * Get gallery presets by column count
 */
export function getGalleryPresetsByColumns(columns: 2 | 3): BlockPreset[] {
  const columnMap: Record<GalleryPresetId, 2 | 3> = {
    'gallery-square-3col': 3,
    'gallery-square-2col': 2,
    'gallery-rect-3col': 3,
    'gallery-rect-2col': 2,
    'gallery-mixed': 3,
  }
  return Object.entries(GALLERY_PRESETS)
    .filter(([id]) => columnMap[id as GalleryPresetId] === columns)
    .map(([, preset]) => preset)
}

/**
 * Get gallery presets by aspect ratio
 */
export function getGalleryPresetsByAspectRatio(
  aspectRatio: 'square' | 'rectangle' | 'mixed'
): BlockPreset[] {
  const ratioMap: Record<GalleryPresetId, 'square' | 'rectangle' | 'mixed'> = {
    'gallery-square-3col': 'square',
    'gallery-square-2col': 'square',
    'gallery-rect-3col': 'rectangle',
    'gallery-rect-2col': 'rectangle',
    'gallery-mixed': 'mixed',
  }
  return Object.entries(GALLERY_PRESETS)
    .filter(([id]) => ratioMap[id as GalleryPresetId] === aspectRatio)
    .map(([, preset]) => preset)
}

// Re-export individual presets for direct imports
export { GALLERY_SQUARE_3COL } from './square-3col'
export { GALLERY_SQUARE_2COL } from './square-2col'
export { GALLERY_RECT_3COL } from './rect-3col'
export { GALLERY_RECT_2COL } from './rect-2col'
export { GALLERY_MIXED } from './mixed'

// Re-export shared utilities
export {
  GALLERY_COMMON_BINDINGS,
  GALLERY_TEXT_STYLES,
  GALLERY_AI_HINTS,
  GALLERY_SPECIAL_COMPONENTS,
  GALLERY_RECOMMENDED_THEMES,
  createGalleryHeaderElements,
  createGalleryGridElement,
  createMoreButtonElement,
  type GalleryGridConfig,
} from './_shared'
