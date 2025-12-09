/**
 * Super Editor - Font Loader
 * 폰트 로드 유틸리티 (Google Fonts URL 생성, 동적 로드)
 */

import type { FontPreset } from './presets'
import { getFontByFamily, FONT_PRESETS } from './presets'

// ============================================
// Google Fonts URL 생성
// ============================================

interface GoogleFontsRequest {
  family: string
  weights?: number[]
  italic?: boolean
}

/**
 * Google Fonts URL 생성
 * @example
 * buildGoogleFontsUrl([
 *   { family: 'Noto Serif KR', weights: [400, 700] },
 *   { family: 'Playfair Display', weights: [400, 600] }
 * ])
 * // => 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Playfair+Display:wght@400;600&display=swap'
 */
export function buildGoogleFontsUrl(requests: GoogleFontsRequest[]): string {
  if (requests.length === 0) return ''

  const families = requests.map(({ family, weights, italic }) => {
    const encodedFamily = family.replace(/ /g, '+')

    if (!weights || weights.length === 0) {
      return `family=${encodedFamily}`
    }

    const weightStr = weights.sort((a, b) => a - b).join(';')

    if (italic) {
      // ital,wght@0,400;0,700;1,400;1,700 형식
      const combinations = weights.flatMap(w => [`0,${w}`, `1,${w}`])
      return `family=${encodedFamily}:ital,wght@${combinations.join(';')}`
    }

    return `family=${encodedFamily}:wght@${weightStr}`
  })

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

/**
 * 프리셋 목록에서 Google Fonts URL 생성
 */
export function buildGoogleFontsUrlFromPresets(presets: FontPreset[]): string {
  const googleFonts = presets.filter(p => p.source === 'google' && p.googleFontsId)

  const requests: GoogleFontsRequest[] = googleFonts.map(p => ({
    family: p.family,
    weights: p.weights.map(w => w.value),
    italic: p.italic,
  }))

  return buildGoogleFontsUrl(requests)
}

/**
 * @font-face CSS 생성
 */
export function buildFontFaceCss(preset: FontPreset): string {
  if (!preset.fontFace) return ''

  return `@font-face {
  font-family: '${preset.family}';
  src: url('${preset.fontFace.src}') format('${preset.fontFace.format}');
  font-weight: ${preset.defaultWeight};
  font-display: swap;
}`
}

/**
 * font-family 문자열에서 사용된 폰트 추출 및 로드 정보 생성
 */
export function extractAndBuildFontUrls(fontFamilies: string[]): {
  googleFontsUrl: string
  cdnUrls: string[]
  fontFaceCss: string[]
} {
  const googleFonts: GoogleFontsRequest[] = []
  const cdnUrls: string[] = []
  const fontFaceCss: string[] = []

  // 각 fontFamily 문자열에서 첫 번째 폰트 추출
  for (const fontFamily of fontFamilies) {
    // "Noto Serif KR", serif -> Noto Serif KR
    const firstFont = fontFamily.split(',')[0].replace(/["']/g, '').trim()
    const preset = getFontByFamily(firstFont)

    if (!preset) continue

    if (preset.source === 'google' && preset.googleFontsId) {
      // 이미 추가된 폰트인지 확인
      if (!googleFonts.some(f => f.family === preset.family)) {
        googleFonts.push({
          family: preset.family,
          weights: preset.weights.map(w => w.value),
          italic: preset.italic,
        })
      }
    } else if (preset.source === 'cdn' && preset.cdnUrl) {
      if (!cdnUrls.includes(preset.cdnUrl)) {
        cdnUrls.push(preset.cdnUrl)
      }
    } else if (preset.source === 'fontface' && preset.fontFace) {
      const css = buildFontFaceCss(preset)
      if (css && !fontFaceCss.includes(css)) {
        fontFaceCss.push(css)
      }
    }
  }

  return {
    googleFontsUrl: buildGoogleFontsUrl(googleFonts),
    cdnUrls,
    fontFaceCss,
  }
}

// ============================================
// HTML <link> 태그 생성
// ============================================

/**
 * 폰트 로드용 HTML <link> 태그 + <style> 태그 생성
 */
export function buildFontLinkTags(fontFamilies: string[]): string {
  const { googleFontsUrl, cdnUrls, fontFaceCss } = extractAndBuildFontUrls(fontFamilies)
  const lines: string[] = []

  // Google Fonts preconnect
  if (googleFontsUrl) {
    lines.push('<link rel="preconnect" href="https://fonts.googleapis.com">')
    lines.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    lines.push(`<link href="${googleFontsUrl}" rel="stylesheet">`)
  }

  // CDN URLs
  for (const url of cdnUrls) {
    lines.push(`<link href="${url}" rel="stylesheet">`)
  }

  // @font-face CSS (inline style)
  if (fontFaceCss.length > 0) {
    lines.push(`<style>\n${fontFaceCss.join('\n\n')}\n</style>`)
  }

  return lines.join('\n  ')
}

// ============================================
// 동적 폰트 로드 (클라이언트)
// ============================================

// 이미 로드된 폰트 추적
const loadedFonts = new Set<string>()

/**
 * 폰트 동적 로드 (브라우저)
 * StyleEditor에서 폰트 변경 시 호출
 */
export async function loadFontDynamically(fontFamily: string): Promise<boolean> {
  // 첫 번째 폰트 이름 추출
  const firstFont = fontFamily.split(',')[0].replace(/["']/g, '').trim()

  // 이미 로드되었으면 스킵
  if (loadedFonts.has(firstFont)) {
    return true
  }

  const preset = getFontByFamily(firstFont)
  if (!preset) {
    console.warn(`Font preset not found: ${firstFont}`)
    return false
  }

  try {
    if (preset.source === 'google' && preset.googleFontsId) {
      const url = buildGoogleFontsUrl([{
        family: preset.family,
        weights: preset.weights.map(w => w.value),
        italic: preset.italic,
      }])
      await loadStylesheet(url)
    } else if (preset.source === 'cdn' && preset.cdnUrl) {
      await loadStylesheet(preset.cdnUrl)
    } else if (preset.source === 'fontface' && preset.fontFace) {
      // @font-face CSS를 동적으로 주입
      await injectFontFaceCss(preset)
    }

    loadedFonts.add(firstFont)
    return true
  } catch (error) {
    console.error(`Failed to load font: ${firstFont}`, error)
    return false
  }
}

/**
 * @font-face CSS를 동적으로 주입
 */
function injectFontFaceCss(preset: FontPreset): Promise<void> {
  return new Promise((resolve) => {
    const styleId = `font-face-${preset.id}`

    // 이미 주입된 스타일인지 확인
    if (document.getElementById(styleId)) {
      resolve()
      return
    }

    const css = buildFontFaceCss(preset)
    if (!css) {
      resolve()
      return
    }

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = css
    document.head.appendChild(style)

    // 폰트 로드 완료 대기 (선택적)
    if ('fonts' in document) {
      document.fonts.load(`${preset.defaultWeight} 16px "${preset.family}"`).then(() => resolve())
    } else {
      // 폰트 로드 API가 없으면 즉시 resolve
      resolve()
    }
  })
}

/**
 * 여러 폰트 동적 로드
 */
export async function loadFontsDynamically(fontFamilies: string[]): Promise<void> {
  await Promise.all(fontFamilies.map(loadFontDynamically))
}

/**
 * 스타일시트 동적 로드
 */
function loadStylesheet(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드된 스타일시트인지 확인
    const existing = document.querySelector(`link[href="${url}"]`)
    if (existing) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load: ${url}`))
    document.head.appendChild(link)
  })
}

// ============================================
// StyleSchema에서 폰트 추출
// ============================================

interface StyleSchema {
  theme?: {
    typography?: {
      fonts?: {
        heading?: { family?: string }
        body?: { family?: string }
        accent?: { family?: string }
      }
    }
  }
}

/**
 * StyleSchema에서 사용된 모든 폰트 패밀리 추출
 */
export function extractFontsFromStyle(style: StyleSchema): string[] {
  const fonts: string[] = []
  const typography = style.theme?.typography?.fonts

  if (typography?.heading?.family) {
    fonts.push(typography.heading.family)
  }
  if (typography?.body?.family) {
    fonts.push(typography.body.family)
  }
  if (typography?.accent?.family) {
    fonts.push(typography.accent.family)
  }

  // 중복 제거
  return [...new Set(fonts)]
}

/**
 * StyleSchema에서 폰트 로드 태그 생성
 */
export function buildFontLinksFromStyle(style: StyleSchema): string {
  const fonts = extractFontsFromStyle(style)
  return buildFontLinkTags(fonts)
}

// ============================================
// 초기 로드용 (모든 폰트)
// ============================================

/**
 * 모든 프리셋 폰트 로드 URL 생성 (개발용)
 */
export function buildAllFontsUrl(): string {
  return buildGoogleFontsUrlFromPresets(FONT_PRESETS.filter(p => p.source === 'google'))
}

/**
 * 자주 사용되는 폰트만 로드 (최적화)
 */
export function buildCommonFontsUrl(): string {
  const commonFontIds = [
    'pretendard',
    'noto-serif-kr',
    'noto-sans-kr',
    'nanum-myeongjo',
    'playfair-display',
    'cormorant-garamond',
    'great-vibes',
  ]

  const presets = commonFontIds
    .map(id => FONT_PRESETS.find(p => p.id === id))
    .filter((p): p is FontPreset => p !== undefined && p.source === 'google')

  return buildGoogleFontsUrlFromPresets(presets)
}
