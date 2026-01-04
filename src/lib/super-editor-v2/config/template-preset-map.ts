/**
 * Template → Preset Mapping
 *
 * 템플릿 ID와 프리셋 ID 간의 매핑 정의
 * - 템플릿 선택 시 기본 프리셋 조합 결정
 * - 중복 코드 제거를 위한 Single Source of Truth
 */

import type { HeroPresetId } from '../presets/blocks/hero'
import type { GreetingParentsPresetId } from '../presets/blocks/greeting-parents'
import type { CalendarPresetId } from '../presets/blocks/calendar'
import type { GalleryPresetId } from '../presets/blocks/gallery'
import type { LocationPresetId } from '../presets/blocks/location'

// ============================================
// Types
// ============================================

export type TemplateId = 'unique1' | 'unique2' | 'unique3' | 'unique4' | 'unique5' | 'unique6'

export interface TemplatePresetConfig {
  hero: HeroPresetId
  'greeting-parents': GreetingParentsPresetId
  calendar: CalendarPresetId
  gallery: GalleryPresetId
  location: LocationPresetId
}

// ============================================
// Mapping: Template ID → Hero Preset ID
// ============================================

export const TEMPLATE_TO_HERO_PRESET: Record<TemplateId, HeroPresetId> = {
  unique1: 'hero-classic-elegant',
  unique2: 'hero-casual-playful',
  unique3: 'hero-minimal-overlay',
  unique4: 'hero-dark-romantic',
  unique5: 'hero-bright-casual',
  unique6: 'hero-monochrome-bold',
}

// ============================================
// Mapping: Template ID → Default Presets
// ============================================

export const TEMPLATE_DEFAULT_PRESETS: Record<TemplateId, TemplatePresetConfig> = {
  unique1: {
    hero: 'hero-classic-elegant',
    'greeting-parents': 'greeting-parents-minimal',
    calendar: 'calendar-korean-countdown-box',
    gallery: 'gallery-square-3col',
    location: 'location-minimal',
  },
  unique2: {
    hero: 'hero-casual-playful',
    'greeting-parents': 'greeting-parents-with-divider',
    calendar: 'calendar-heart-strip-countdown',
    gallery: 'gallery-square-3col',
    location: 'location-minimal',
  },
  unique3: {
    hero: 'hero-minimal-overlay',
    'greeting-parents': 'greeting-parents-minimal',
    calendar: 'calendar-korean-countdown-box',
    gallery: 'gallery-square-3col',
    location: 'location-minimal',
  },
  unique4: {
    hero: 'hero-dark-romantic',
    'greeting-parents': 'greeting-parents-minimal',
    calendar: 'calendar-korean-countdown-box',
    gallery: 'gallery-square-3col',
    location: 'location-minimal',
  },
  unique5: {
    hero: 'hero-bright-casual',
    'greeting-parents': 'greeting-parents-with-divider',
    calendar: 'calendar-heart-strip-countdown',
    gallery: 'gallery-square-3col',
    location: 'location-with-transport',
  },
  unique6: {
    hero: 'hero-monochrome-bold',
    'greeting-parents': 'greeting-parents-minimal',
    calendar: 'calendar-korean-countdown-box',
    gallery: 'gallery-square-3col',
    location: 'location-minimal',
  },
}

// ============================================
// Helper Functions
// ============================================

/**
 * 템플릿 ID로 Hero 프리셋 ID 조회
 */
export function getHeroPresetIdForTemplate(templateId: string): HeroPresetId | undefined {
  return TEMPLATE_TO_HERO_PRESET[templateId as TemplateId]
}

/**
 * 템플릿 ID로 기본 프리셋 조합 조회
 */
export function getDefaultPresetsForTemplate(templateId: string): TemplatePresetConfig | undefined {
  return TEMPLATE_DEFAULT_PRESETS[templateId as TemplateId]
}

/**
 * Hero 프리셋 ID로 템플릿 ID 역조회
 */
export function getTemplateIdForHeroPreset(heroPresetId: HeroPresetId): TemplateId | undefined {
  const entry = Object.entries(TEMPLATE_TO_HERO_PRESET).find(
    ([, presetId]) => presetId === heroPresetId
  )
  return entry ? (entry[0] as TemplateId) : undefined
}

/**
 * 템플릿 ID 유효성 검사
 */
export function isValidTemplateId(id: string): id is TemplateId {
  return id in TEMPLATE_TO_HERO_PRESET
}

/**
 * 모든 템플릿 ID 목록
 */
export const TEMPLATE_IDS: TemplateId[] = ['unique1', 'unique2', 'unique3', 'unique4', 'unique5', 'unique6']
