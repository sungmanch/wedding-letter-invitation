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
