/**
 * Super Editor v2 - Fonts Module
 */

export {
  // URL 빌더
  buildGoogleFontsUrl,
  buildUrlFromFontStack,
  buildUrlFromPreset,
  buildUrlFromStyle,
  // 동적 로딩
  loadPresetFonts,
  loadStyleFonts,
  loadAllPresetFonts,
  // SSR용
  getFontLinkHrefs,
  buildFontLinkTags,
  // 상태 확인
  isFontLoaded,
  getLoadedFonts,
  resetFontLoader,
} from './loader'
