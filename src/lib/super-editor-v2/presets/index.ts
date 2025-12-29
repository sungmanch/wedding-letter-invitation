/**
 * Super Editor v2 - Presets
 */

// Theme Presets
export {
  THEME_PRESETS,
  getThemePreset,
  getPresetsByCategory,
  getAllThemePresets,
  getTokensFromPreset,
  isDarkBackground,
  type ThemePreset,
} from './theme-presets'

// Typography Presets
export {
  TYPOGRAPHY_PRESETS,
  getTypographyPreset,
  getTypographyPresetsByCategory,
  getAllTypographyPresets,
  getGoogleFontsUrl,
  getFontFamilyString,
  type TypographyPreset,
  type FontStack,
} from './typography-presets'

// Animation Presets
export {
  ENTRANCE_PRESETS,
  SCROLL_PRESETS,
  HOVER_PRESETS,
  getEntrancePreset,
  getScrollPreset,
  getHoverPreset,
  getEntrancePresetsByMood,
  getEntrancePresetsForBlock,
  getEntrancePresetsByIntensity,
  type AnimationPreset,
  type ScrollPreset,
  type HoverPreset,
} from './animation-presets'

// Block Presets (skeleton → block migration)
export {
  // Types
  type BlockPreset,
  type BlockPresetId,
  type CalendarPresetId,
  // Registries
  BLOCK_PRESETS,
  CALENDAR_PRESETS,
  // Generic helpers
  getBlockPreset,
  getBlockPresetsByType,
  getBlockPresetsByTag,
  getBlockPresetsByMood,
  getBlockPresetsByComplexity,
  getAllBlockPresetIds,
  findPresetsForPrompt,
  // Calendar-specific helpers
  getCalendarPreset,
  getCalendarPresetIds,
  getCalendarPresetsByComplexity,
} from './blocks'

// Block Bindings (data requirements)
export {
  type BlockDataBinding,
  BLOCK_BINDINGS,
  getBlockBindings,
  getRequiredPaths,
  getAllPaths,
  getBindingInfo,
  validateBindings,
  getDefaultValues,
} from './block-bindings'
